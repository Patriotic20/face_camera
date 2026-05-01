from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.attendance.people import Person
from app.modules.attendance.schemes.people import PersonCreate, PersonUpdate


class PeopleRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_person(self, data: PersonCreate) -> Person:
        new_person = Person(**data.model_dump())
        self.session.add(new_person)
        self.session.commit()
        self.session.refresh(new_person)
        return new_person

    def get_all_people(self) -> list[Person]:
        return self.session.execute(select(Person)).scalars().all()

    def get_person_by_id(self, person_id: int) -> Person | None:
        return self.session.execute(
            select(Person).where(Person.id == person_id)
        ).scalar_one_or_none()

    def update_person(self, person_id: int, data: PersonUpdate) -> Person | None:
        person = self.get_person_by_id(person_id)
        if not person:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(person, key, value)
        self.session.commit()
        self.session.refresh(person)
        return person

    def delete_person(self, person_id: int) -> bool:
        person = self.get_person_by_id(person_id)
        if not person:
            return False
        self.session.delete(person)
        self.session.commit()
        return True
