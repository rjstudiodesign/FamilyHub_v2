import os
import subprocess
from getpass import getpass
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4.1"

# Try environment variable first
token = os.environ.get("GITHUB_TOKEN")

# If not set, try to read the token from the GitHub CLI (safer than hardcoding)
if not token:
    try:
        token = subprocess.check_output(["gh", "auth", "token"], text=True).strip()
        if not token:
            token = None
    except subprocess.CalledProcessError:
        token = None

# Fallback: prompt the user securely (will not be saved)
if not token:
    try:
        token = getpass("GITHUB_TOKEN not found. Paste token (input hidden): ")
    except Exception:
        raise RuntimeError("GITHUB_TOKEN not found and secure input failed. Please set the GITHUB_TOKEN environment variable or ensure 'gh auth login' works.")

if not token:
    raise RuntimeError("No GITHUB_TOKEN available. Fallback order: environment variable → GitHub CLI → interactive prompt. Set the GITHUB_TOKEN environment variable, login with 'gh auth login', or provide a token interactively.")

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

