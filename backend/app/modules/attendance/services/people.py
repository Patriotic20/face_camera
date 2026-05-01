from app.models.attendance.people import Person
from app.modules.attendance.repositories.people import PeopleRepository
from app.modules.attendance.schemes.people import PersonCreate


def _split_full_name(full_name: str) -> tuple[str, str]:
    parts = full_name.strip().split(" ", 1)
    return (parts[0], parts[1]) if len(parts) == 2 else (parts[0], parts[0])


class PeopleService:
    def __init__(self, people_repo: PeopleRepository) -> None:
        self.people_repo = people_repo

    async def get_or_create_person(
        self, external_id: str, full_name: str
    ) -> tuple[Person, bool]:
        """Return (person, was_created). was_created=True when a new record was inserted."""
        person = await self.people_repo.get_by_external_id(external_id)
        if person is not None:
            return person, False

        first_name, last_name = _split_full_name(full_name or external_id)
        created = await self.people_repo.create_person(
            PersonCreate(
                first_name=first_name,
                last_name=last_name,
                external_id=external_id,
            )
        )
        return created, True
