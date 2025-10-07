import os
import json
import re

try:
    from PyPDF2 import PdfReader
except Exception:
    PdfReader = None

try:
    import openai
except Exception:
    openai = None

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if openai and OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY


def extract_text_from_pdf(file_path):
    """Return concatenated text from PDF file path. Requires PyPDF2."""
    if PdfReader is None:
        raise RuntimeError('PyPDF2 is not installed')
    text = []
    with open(file_path, 'rb') as f:
        reader = PdfReader(f)
        for p in reader.pages:
            try:
                # PyPDF2's extract_text may return None
                text.append(p.extract_text() or '')
            except Exception:
                continue
    return '\n'.join(text)


def generate_questions_from_text(text, n_questions=5, types=('mcq',)):
    """Call OpenAI to generate questions from text.

    Raises RuntimeError if OpenAI client or API key is missing.
    Returns parsed JSON payload from the LLM response.
    """
    if openai is None or not OPENAI_API_KEY:
        raise RuntimeError('OpenAI client or API key not configured')

    prompt = (
        f"Generate {n_questions} questions of types {types} from the following text. "
        "For each question, produce a JSON array where each item has: type, question, choices (for mcq) as an array of {text, is_correct}, and answer. "
        f"Text:\n\n{text[:4000]}"
    )
    resp = openai.ChatCompletion.create(
        model='gpt-4o-mini',
        messages=[{'role': 'user', 'content': prompt}],
        max_tokens=1500,
        temperature=0.2,
    )
    content = resp.choices[0].message.content
    # Best-effort parse: expect JSON array in the content
    try:
        payload = json.loads(content)
    except Exception:
        m = re.search(r"(\[\s*\{.*\}\s*\])", content, re.S)
        if m:
            payload = json.loads(m.group(1))
        else:
            raise
    return payload
