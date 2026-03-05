from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from .groq import llm


class PracticeProblems(BaseModel):
    practice_problems: list[str] = Field(
        ..., description="List of practice problems"
    )
    explanations: list[str] = Field(
        ..., description="Explanations for each practice problem"
    )


prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are an expert tutor. Generate practice problems."),
        ("user", "Generate practice problems for {subject} on the topic '{topic}'."),
    ]
)

chain = prompt | llm.with_structured_output(PracticeProblems)


def get_practice_problems(subject: str, topic: str) -> PracticeProblems:
    try:
        structured_problems = chain.invoke(
            {"subject": subject, "topic": topic}
        )
        if not isinstance(structured_problems, PracticeProblems):
            raise ValueError(
                f"Unexpected response type: {type(structured_problems)}"
            )

        return structured_problems
    except ValueError:
        return PracticeProblems(practice_problems=[], explanations=[])
