from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from .groq import llm


class StudyNotes(BaseModel):
    heading: str = Field(..., description="Main heading for the topic")
    bullet_points: list[str] = Field(
        ..., description="Key points to study"
    )


prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are an expert tutor. Create concise study notes."),
        ("user", "Create concise study notes for {subject} on the topic '{topic}'."),
    ]
)

chain = prompt | llm.with_structured_output(StudyNotes)


def get_study_notes(subject: str, topic: str) -> StudyNotes:
    try:
        structured_notes = chain.invoke(
            {"subject": subject, "topic": topic}
        )
        if not isinstance(structured_notes, StudyNotes):
            raise ValueError(
                f"Unexpected response type: {type(structured_notes)}"
            )

        return structured_notes
    except ValueError:
        return StudyNotes(heading="", bullet_points=[])
