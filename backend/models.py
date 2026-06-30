from pydantic import BaseModel, Field, field_validator
from typing import Literal


LANGUAGES: dict[str, str] = {
    "uk": "Українська",
    "en": "English",
    "ja": "日本語",
    "de": "Deutsch",
    "fr": "Français",
    "es": "Español",
    "it": "Italiano",
    "pt": "Português",
    "zh": "中文",
    "ko": "한국어",
    "ar": "العربية",
    "pl": "Polski",
}

LanguageCode = Literal[
    "uk", "en", "ja", "de", "fr", "es",
    "it", "pt", "zh", "ko", "ar", "pl",
]


class GenerateRequest(BaseModel):
    keywords: str = Field(
        ...,
        min_length=1,
        description="Keywords or short phrases separated by commas",
    )
    language: LanguageCode
    spice_level: int = Field(default=0, ge=0, le=6)

    @field_validator("keywords")
    @classmethod
    def validate_keywords_count(cls, v: str) -> str:
        parts = [k.strip() for k in v.split(",") if k.strip()]
        if len(parts) < 3:
            raise ValueError("Будь ласка, введіть від 3 до 7 ключових слів")
        if len(parts) > 7:
            raise ValueError("Будь ласка, введіть від 3 до 7 ключових слів")
        return v


class GenerateResponse(BaseModel):
    haiku: str


class ErrorResponse(BaseModel):
    detail: str
