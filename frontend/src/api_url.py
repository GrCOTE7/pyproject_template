import os
from pathlib import Path

from dotenv import load_dotenv

frontend_dir = Path(__file__).resolve().parent.parent

# Python ne charge pas automatiquement les fichiers .env, on les charge ici.
load_dotenv(frontend_dir / ".env.local")
load_dotenv(frontend_dir / ".env")

api_url = os.getenv("API_URL")
vite_auth_base_url = os.getenv("VITE_AUTH_BASE_URL")

print(api_url or vite_auth_base_url or "Undefined")
