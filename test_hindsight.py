print("TEST FILE STARTED")
import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

api_key = os.getenv("HINDSIGHT_API_KEY")

if not api_key:
    print("ERROR: HINDSIGHT_API_KEY not found.")
    exit()

print("API key loaded successfully.")

client = Hindsight(
    base_url="https://api.hindsight.vectorize.io",
    api_key=api_key,
)

print("Connected to Hindsight client.")

client.retain(
    bank_id="test-customer",
    content="Customer C001 is using Windows 11 and previously had an account disconnection issue.",
    context="customer support interaction",
)

print("Memory stored successfully.")

response = client.recall(
    bank_id="test-customer",
    query="What problem did this customer have before?",
)

print("\nRecalled memories:")

for result in response.results:
    print("-", result.text)