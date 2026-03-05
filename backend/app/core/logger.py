import logging
import os

def setup_logging():
    # Ensure the log file is in the backend directory
    log_file = os.path.join(os.path.dirname(__file__), "..", "..", "smarttutor.log")
    
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        force=True,
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()
        ]
    )
    # Reduce noise from third-party libraries
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)

logger = logging.getLogger("smarttutor")
