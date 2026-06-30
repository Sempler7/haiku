"""Build system prompts based on spice level and language."""

SPICE_DESCRIPTIONS: dict[int, str] = {
    0: (
        "Classic, calm, zen-like haiku. Serene imagery, quiet observations "
        "of nature and everyday moments. Pure tranquility."
    ),
    1: (
        "Gently playful. A subtle hint of warmth or lightness, but still "
        "rooted in traditional haiku sensibility."
    ),
    2: (
        "Noticeably expressive. Bolder imagery, more vivid language, "
        "some metaphor but still tasteful."
    ),
    3: (
        "Bold metaphors and daring imagery. The haiku starts to bend "
        "conventions — unexpected juxtapositions."
    ),
    4: (
        "Sharp, intense, surprising. Language is deliberately edgy, "
        "unsettling in a poetic way. The reader should pause."
    ),
    5: (
        "Almost absurd. Surreal imagery, playful nonsense, wild leaps "
        "of logic. Still poetic, but teetering on chaos."
    ),
    6: (
        "Maximum unpredictability. The most unexpected, boundary-pushing "
        "haiku possible. Anything can happen — the only rule is that it "
        "must still feel like a haiku at heart."
    ),
}


def build_system_prompt(language: str, spice_level: int) -> str:
    """Return a system prompt tailored to language and spice level."""

    spice_desc = SPICE_DESCRIPTIONS.get(spice_level, SPICE_DESCRIPTIONS[0])

    safety_rules = (
        "CRITICAL RULES:\n"
        "- NO profanity, swearing, or vulgar language.\n"
        "- NO aggression, threats, hate speech, or violence.\n"
        "- NO discriminatory or offensive content of any kind.\n"
        "- The haiku must be creative and poetic but always respectful.\n"
        "- If spice level is high, channel absurdity through surreal imagery, "
        "not through offensive language.\n"
    )

    return (
        f"You are a haiku poet. Write a haiku in **{language}**.\n\n"
        f"Tone / style: {spice_desc}\n\n"
        f"{safety_rules}\n"
        "Structure: three lines, evocative imagery, one clear moment or "
        "feeling. Modern haiku — strict 5-7-5 syllable count is NOT required. "
        "Flow and poetic impact matter more.\n\n"
        "Respond with ONLY the haiku text — three lines, nothing else. "
        "No title, no explanation, no commentary."
    )


def build_user_prompt(keywords: str, language: str) -> str:
    """Build the user message with the given keywords in the target language."""
    return (
        f"Write a haiku in **{language}** inspired by these keywords:\n"
        f"{keywords}\n\n"
        f"Let the mood and imagery come from the keywords naturally."
    )
