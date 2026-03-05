from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from .groq import llm


class QuizQuestion(BaseModel):
    id: int = Field(..., description="Numerically increasing id for the question")
    question: str = Field(..., description="The quiz question text")
    options: list[str] = Field(..., description="List of exactly 4 strings representing options")
    correctAnswer: int = Field(..., description="Index of correct option (0-3)")


class Quiz(BaseModel):
    questions: list[QuizQuestion] = Field(
        ..., description="List of quiz questions with options and correctAnswer"
    )


prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are an expert tutor. Create a 5-question multiple choice quiz."),
        ("user", "Create a 5-question multiple choice quiz for the subject: {subject} on the topic: {topic}."),
    ]
)

chain = prompt | llm.with_structured_output(Quiz)


def get_quiz_questions(subject: str, topic: str) -> Quiz:
    try:
        structured_quiz = chain.invoke(
            {"subject": subject, "topic": topic}
        )
        if not isinstance(structured_quiz, Quiz):
            raise ValueError(
                f"Unexpected response type: {type(structured_quiz)}"
            )

        return structured_quiz
    except ValueError:
        return Quiz(questions=[])
