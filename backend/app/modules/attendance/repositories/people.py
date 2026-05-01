from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.attendance.people import Person
from app.modules.attendance.schemes.people import PersonCreate, PersonUpdate


class PeopleRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_person(self, data: PersonCreate) -> Person:
        try:
            new_person = Person(**data.model_dump())
            self.session.add(new_person)
            await self.session.commit()
            await self.session.refresh(new_person)
            return new_person
        except Exception:
            await self.session.rollback()
            raise

    async def get_all_people(self) -> list[Person]:
        result = await self.session.execute(select(Person))
        return result.scalars().all()

    async def get_person_by_id(self, person_id: int) -> Person | None:
        result = await self.session.execute(
            select(Person).where(Person.id == person_id)
        )
        return result.scalar_one_or_none()

    async def update_person(self, person_id: int, data: PersonUpdate) -> Person | None:
        person = await self.get_person_by_id(person_id)
        if not person:
            return None
        try:
            for key, value in data.model_dump(exclude_unset=True).items():
                setattr(person, key, value)
            await self.session.commit()
            await self.session.refresh(person)
            return person
        except Exception:
            await self.session.rollback()
            raise

    async def delete_person(self, person_id: int) -> bool:
        person = await self.get_person_by_id(person_id)
        if not person:
            return False
        try:
            await self.session.delete(person)
            await self.session.commit()
            return True
        except Exception:
            await self.session.rollback()
            raise
