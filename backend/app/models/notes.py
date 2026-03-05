from typing import List

import sqlalchemy.types as types
from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column

from app.db.db import Base


# This class converts list to delimitted string to be stored in DB
class TextList(types.TypeDecorator):
    """Converts a list to a delimited string in the DB and back again."""

    impl = types.String
    cache_ok = True

    _DELIMITER = "<|>"

    def process_bind_param(self, value, dialect):
        # Edge Case: Handle None or empty lists safely
        if value is None:
            return ""
        if isinstance(value, list):
            return self._DELIMITER.join(str(v) for v in value)
        return str(value)

    def process_result_value(self, value, dialect):
        # Edge Case: Handle empty strings or None from DB
        if not value:
            return []
        return value.split(self._DELIMITER)


# Notes Table
class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, init=False
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    subject: Mapped[str] = mapped_column(String(100), nullable=False)
    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    heading: Mapped[str] = mapped_column(String(255), nullable=False)

    # WRAP TextList in MutableList.as_mutable()
    # This solves the .append() / .extend() edge case.
    bullet_points: Mapped[List[str]] = mapped_column(
        MutableList.as_mutable(TextList(1000)),
        nullable=False,
        default_factory=list,  # Best practice: use factory for mutable defaults
    )

    saved_date: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), default=func.now()
    )

    def __repr__(self):
        return f"<Note {self.id} - {self.topic}>"
