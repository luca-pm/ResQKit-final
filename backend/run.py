"""Local launcher: loads backend/.env into the environment (core.config reads
env vars, not the file), then starts uvicorn on HOST:PORT from that file.

    .venv\\Scripts\\python run.py
"""
import os
from pathlib import Path

import uvicorn
from dotenv import load_dotenv

HERE = Path(__file__).resolve().parent
os.chdir(HERE)  # relative SQLite path (./resqkit.db) and module imports
load_dotenv(HERE / ".env")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.environ.get("HOST", "0.0.0.0"),
        port=int(os.environ.get("PORT", "8001")),
    )
