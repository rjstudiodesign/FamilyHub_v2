import os
# Optional: python-dotenv, nur wenn verfügbar
# Use a dynamic import to avoid static analyzers complaining about unresolved imports.
try:
    import importlib
    dotenv = importlib.import_module("dotenv")
    if hasattr(dotenv, "load_dotenv"):
        dotenv.load_dotenv()
except ModuleNotFoundError:
    # Wenn python-dotenv nicht installiert ist, können die Umgebungsvariablen trotzdem von der Umgebung bereitgestellt werden.
    pass

from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

endpoint = "https://models.github.ai/inference"
model_name = "gpt-4"

# Token aus der Umgebung lesen; wenn nicht vorhanden, wird eine aussagekräftige Fehlermeldung erzeugt
token = os.environ.get("GITHUB_TOKEN")
if not token:
    raise RuntimeError(
        "GITHUB_TOKEN environment variable is required.\n"
        "Set it using 'export GITHUB_TOKEN=<your-token>' in your shell, "
        "or create a .env file with GITHUB_TOKEN=<your-token> if using python-dotenv."
    )

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
    model=model_name,
)

print(response.choices[0].message.content)

