from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from app.core.exceptions import AIGenerationError
from app.core.logger import logger

from .groq import llm


class Explanation(BaseModel):
    title: str = Field(..., description="A short title for the explanation")
    steps: list[str] = Field(
        ..., description="Step-by-step explanation of the question"
    )
    summary: str = Field(..., description="A brief summary of the concept")


prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a tutor. Explain the following:"),
        ("user", "Explain the following {subject} question: Question: {question}"),
    ]
)

chain = prompt | llm.with_structured_output(Explanation)


async def get_structured_explanation(subject: str, question: str) -> Explanation:
    try:
        structured_explanation = chain.invoke(
            {"subject": subject, "question": question}
        )
        if not isinstance(structured_explanation, Explanation):
            raise ValueError(
                f"Unexpected response type: {type(structured_explanation)}"
            )

        return structured_explanation
    except ValueError as e:
        logger.error(f"AI Generation failed for ask_api: {e}", exc_info=True)
        raise AIGenerationError("Failed to generate valid explanation from AI.") from e
