import os
import importlib
try:
    # optional: python-dotenv, nur wenn verfügbar — importlib vermeidet statische Linter-Warnungen
    dotenv = importlib.import_module("dotenv")
    load_dotenv = getattr(dotenv, "load_dotenv", None)
    if callable(load_dotenv):
        load_dotenv()
except Exception:
    # Wenn python-dotenv nicht installiert ist, ist das kein kritischer Fehler hier,
    # die Umgebungsvariablen können trotzdem von der Umgebung bereitgestellt werden.
    pass

from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4.1"

# Token aus der Umgebung lesen; wenn nicht vorhanden, wird eine aussagekräftige Fehlermeldung erzeugt
token = os.environ.get("GITHUB_TOKEN")
if not token:
    raise RuntimeError("GITHUB_TOKEN is not set in the environment. Set it or install python-dotenv and provide a .env file.")

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)

response = client.complete(
    messages=[
        SystemMessage("You are a helpful assistant."),
        UserMessage("What is the capital of France?"),
    ],
    temperature=1.0,
    top_p=1.0,
    model=model,
)

print(response.choices[0].message.content)
