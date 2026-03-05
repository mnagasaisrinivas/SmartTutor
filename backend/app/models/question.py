from typing import List

import sqlalchemy.types as types
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column

from app.db.db import Base


class AnswerList(types.TypeDecorator):
    impl = types.String

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


# Questions Table
class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, init=False
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    subject: Mapped[str] = mapped_column(String(100), nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    answer_summary: Mapped[str] = mapped_column(Text, nullable=False)
    answer_steps: Mapped[List[str]] = mapped_column(
        MutableList.as_mutable(AnswerList(1000)),
        nullable=False,
        default_factory=list,  # Best practice: use factory for mutable defaults
    )
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), init=False
    )

    def __repr__(self):
        return f"<Question {self.id} - {self.subject}>"
