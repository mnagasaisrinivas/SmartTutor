class SmartTutorException(Exception):
    """Base exception for all custom exceptions in SmartTutor."""
    pass

class AIGenerationError(SmartTutorException):
    """Raised when the AI model fails to generate a response or returns an invalid format."""
    pass

class DatabaseError(SmartTutorException):
    """Raised when a database operation fails unexpectedly."""
    pass
