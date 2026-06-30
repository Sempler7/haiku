import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI

from backend.models import GenerateRequest, GenerateResponse, LANGUAGES
from backend.prompter import build_system_prompt, build_user_prompt

load_dotenv()

client: AsyncOpenAI | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global client
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("WARNING: OPENAI_API_KEY not set. Check .env file.")
        client = None
    else:
        client = AsyncOpenAI(api_key=api_key)
    yield
    client = None


app = FastAPI(
    title="Haiku Generator",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    """Health check — confirms the server and API key are ready."""
    if client is None:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY not configured")
    return {"status": "ok"}


@app.post("/api/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    """Generate a haiku from keywords, language, and spice level."""
    if client is None:
        raise HTTPException(
            status_code=503,
            detail="OpenAI API ключ не налаштовано. Зверніться до адміністратора.",
        )

    language_name = LANGUAGES.get(req.language, "English")
    system_prompt = build_system_prompt(language_name, req.spice_level)
    user_prompt = build_user_prompt(req.keywords, language_name)

    try:
        response = await client.chat.completions.create(
            model="gpt-5-nano-2025-08-07",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Помилка генерації. Спробуйте ще раз. ({type(e).__name__})",
        )

    haiku = response.choices[0].message.content.strip()
    return GenerateResponse(haiku=haiku)
