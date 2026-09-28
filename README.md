Customer Support That Remembers 

An AI-powered customer support system that uses Hindsight for
persistent long-term memory to provide personalized responses based on
a customer's previous interactions.

Instead of treating every conversation as a new conversation, the system
remembers previous issues, solutions, preferences, customer environment,
and relevant conversations associated with each customer.

Customer support should remember the customer, not just the
ticket.

✨ Features

1)AI-powered customer support responses

2) Persistent long-term memory with Hindsight

3) Customer profiles and preferences

4) Previous support ticket history

5) Known issues and previously successful solutions

6) Personalized conversations using customer history

7) Automatic memory retention after each interaction

8) Web-based customer support interface

9) Multiple customer profiles

10) Customer-focused support workspace

11) Human escalation support for issues requiring additional
assistance

12) Customer environment and context awareness

13) Structured customer-support data combined with conversational
memory

🧠 How It Works

The system combines structured customer information with long-term
conversational memory.

Customer Message
       ↓
Flask Backend
       ↓
Load Customer Information
       ↓
Recall Relevant Memories from Hindsight
       ↓
Combine Customer Data + Memories
       ↓
Groq AI Agent
       ↓
Personalized Response
       ↓
Store New Interaction in Hindsight

Memory Cycle

Recall → Understand → Respond → Retain

This allows the system to build context across multiple conversations.

🧠 Hindsight Memory

Hindsight is the central memory layer of the application.

Each customer has a dedicated memory space:

customer-cust_101
customer-cust_102
...

When a customer sends a message, the system uses the message as a query
to recall relevant historical interactions from that customer's memory.

After generating a response, the new interaction is stored back in
Hindsight.

This allows future conversations to use information from previous
interactions instead of starting from zero.

Example:

A customer previously experienced an order delay.

The system can remember:

The previous issue

How the issue was resolved?

The customer's communication preference

Relevant previous conversation details

Customer environment when relevant

Previous support context

When the customer reports another delay, the AI can use that historical
context to provide a more personalized response.

🔄 Memory Flow

1. Customer sends a message

The frontend sends the customer ID and message to the Flask backend.

2. Customer information is loaded

The backend retrieves the customer's:

Profile

Communication preferences

Environment

Previous tickets

Known issues

Previous solutions

3. Hindsight recalls memories

The customer's message is used as a recall query.

Hindsight searches the customer's persistent memory and returns relevant
previous interactions.

4. AI generates a response

The structured customer information and recalled memories are provided
to the Groq-powered AI agent.

The agent uses this context to generate a personalized response.

5. Interaction is retained

The customer's message and generated response are stored in Hindsight.

Future conversations can then recall this interaction.

🏗️ Architecture

                         ┌──────────────────────┐
                         │      CUSTOMER        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      FRONTEND        │
                         │    HTML / CSS / JS   │
                         └──────────┬───────────┘
                                    │
                                  HTTP
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     FLASK API        │
                         │      BACKEND         │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
                    ▼                                ▼
          ┌──────────────────┐             ┌──────────────────┐
          │  Customer Data   │             │    Hindsight     │
          │    JSON Files    │             │   Long-Term      │
          │                  │             │     Memory       │
          └────────┬─────────┘             └────────┬─────────┘
                   │                                │
                   └──────────────┬─────────────────┘
                                  │
                                  ▼
                         ┌──────────────────────┐
                         │      Groq / LLM      │
                         │   Response Engine    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Personalized      │
                         │       Response       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         Store Interaction
                           in Hindsight

🖥️ Product Interface

The application provides a support workspace designed around the
customer.

┌─────────────────────────────────────────────────────────────┐
│                    HINDSIGHT SUPPORT                        │
├──────────────┬──────────────────────────┬───────────────────┤
│              │                          │                   │
│  Customers   │      Conversation        │ Customer Memory   │
│              │                          │                   │
│  Alice       │  Customer messages       │ 🧠 Memory Recall  │
│  Bob         │  AI responses            │                   │
│              │                          │ Previous Issues   │
│              │                          │                   │
│              │                          │ Known Issues      │
│              │                          │                   │
│              │                          │ Solutions Worked  │
│              │                          │                   │
│              │                          │ Customer Profile  │
└──────────────┴──────────────────────────┴───────────────────┘

The right-side memory panel is designed to make the core value of
Hindsight visible to the support agent.

Instead of simply displaying an AI response, the interface can surface
the context that helped personalize the response.

📁 Project Structure

customer-support-memory/
│
├── backend/
│   ├── agent.py
│   ├── app.py
│   ├── customer_data.py
│   └── hindsight_memory.py
│
├── data/
│   ├── customers.json
│   ├── customer_environment.json
│   ├── known_issues.json
│   ├── solutions.json
│   └── tickets.json
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── .env.example
├── .gitignore
├── README.md
├── requirements.txt
└── test_hindsight.py

🛠️ Technologies Used

Python

Flask

Hindsight

Groq

Llama 3.2

Ollama

PostgreSQL

HTML5

CSS3

JavaScript

JSON

Technology Roles

Technology            Role

Python                Backend and AI-agent logic
Flask                 REST API and frontend/backend communication
Hindsight             Persistent long-term customer memory
Groq                  AI response generation
Llama 3.2             Local model used with Ollama for Hindsight setup
Ollama                Local model serving
PostgreSQL            Persistent data/storage layer where configured
HTML/CSS/JavaScript   Customer support web interface
JSON                  Structured prototype customer data

🗄️ Customer Data

The application uses synthetic customer-support data.

The data includes:

Customer profiles

Customer IDs

Communication preferences

Customer environments

Previous support tickets

Known issues

Previously successful solutions

Example customer information:

Customer
──────────────
Name: Alice Smith
Email: alice@example.com
Device: Windows Laptop
Browser: Chrome
Location: India

Example previous support history:

TICK-1001
Order delayed
Status: Resolved
Frustration: High

TICK-1002
Unable to update delivery address
Status: Resolved
Frustration: Medium

This structured information is combined with Hindsight's conversational
memory before generating a response.

🎫 Support History

Previous tickets provide additional context for the AI agent.

A ticket can contain information such as:

Ticket ID
Customer ID
Issue
Status
Date
Frustration level
Resolution

This allows the system to distinguish between a first-time issue and a
recurring customer problem.

🔧 Known Issues & Successful Solutions

The system can maintain information about recurring problems and
solutions that previously worked.

Example:

Known Issue
Delivery delays
2 previous tickets

Previously successful solutions:

✓ Delivery was rescheduled
✓ Address was manually updated

When relevant, this information can be supplied to the AI along with
recalled Hindsight memories.

🔌 API

The backend exposes a chat endpoint for communication with the frontend.

POST /chat

Example request:

{
  "customer_id": "cust_101",
  "message": "My order is delayed again.",
  "ticket_id": "TICK-1003"
}

Example response structure:

{
  "response": "I can see that you've experienced a delivery delay before. Let me help you with the current order.",
  "memories_used": []
}

The exact response fields can evolve as the Hindsight and frontend
integration develops.

⚙️ Running Locally

1. Clone the repository

git clone https://github.com/deekshithamalla-ship-it/customer-support-memory.git
cd customer-support-memory

2. Create a virtual environment

On Windows:

python -m venv venv
venv\Scripts\activate

On macOS/Linux:

python3 -m venv venv
source venv/bin/activate

3. Install dependencies

pip install -r requirements.txt

4. Configure environment variables

Create a .env file from .env.example.

Add your Groq configuration:

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b

Never commit your .env file or API keys to GitHub.

🧠 Start Hindsight

The application uses a local Hindsight server.

Configure Hindsight to use Ollama:

$env:HINDSIGHT_API_LLM_PROVIDER="ollama"
$env:HINDSIGHT_API_LLM_BASE_URL="http://localhost:11434/v1"
$env:HINDSIGHT_API_LLM_MODEL="llama3.2:3b"
$env:HINDSIGHT_API_LLM_MAX_CONCURRENT="1"
$env:HINDSIGHT_API_ENABLE_OBSERVATIONS="false"

Start the Hindsight API:

& "$env:APPDATA\Python\Python314\Scripts\hindsight-api.exe"

Hindsight runs locally at:

http://localhost:8888

🤖 Ollama

Ollama is used by the local Hindsight setup for memory processing.

Make sure the required model is available:

ollama pull llama3.2:3b

▶️ Start the Application

Open another terminal:

cd "customer-support-memory"
venv\Scripts\activate
python backend/app.py

The Flask application runs at:

http://localhost:5000

Open the address in your browser to use the application.

🧪 Testing

The repository includes:

test_hindsight.py

This test file can be used to verify communication with the local
Hindsight memory service.

A typical development test flow is:

Send customer message
       ↓
Recall memory
       ↓
Generate response
       ↓
Store interaction
       ↓
Send another related message
       ↓
Verify previous context can be recalled

🧪 Example Demo Scenario

Step 1 --- First interaction

Alice reports:

"My delivery is delayed."

The support agent helps resolve the issue.

The interaction is stored in Hindsight.

Step 2 --- Alice returns

Later, Alice says:

"My order is delayed again."

Step 3 --- Memory retrieval

Hindsight can retrieve relevant information:

✓ Previous delivery delay
✓ Previous resolution
✓ Customer preferences
✓ Relevant conversation history

Step 4 --- Personalized response

The AI uses the retrieved context to respond without unnecessarily
asking Alice to repeat information that is already available.

Step 5 --- New memory

The new interaction is stored for future conversations.

Past Interaction
       ↓
Hindsight
       ↓
New Interaction
       ↓
Updated Memory
       ↓
Future Support

🚨 Human Escalation

Not every support problem should be handled entirely by an AI agent.

The system can be extended to identify situations where human assistance
is appropriate.

Customer Request
       ↓
AI attempts resolution
       ↓
Can the issue be reliably resolved?
       │
    ┌──┴──┐
   YES    NO
    │      │
    ▼      ▼
Response  Human
          Escalation

This provides a safer support workflow and prevents the agent from
repeatedly attempting uncertain solutions.

🔐 Security

Sensitive credentials are kept outside the repository.

The .env file should be excluded using .gitignore.

Only .env.example should be included as a configuration template.

Example .gitignore entries:

.env
venv/
__pycache__/
*.pyc

Never expose or commit API keys.

🧠 Design Principles

1. Don't make customers repeat themselves

Previously known information should be available when it is relevant.

2. Retrieve relevant memory

The system should focus on memories related to the current request
instead of blindly supplying the entire customer history.

3. Don't invent customer history

The AI should not claim that an event happened unless the information is
available in the provided customer data or memory.

4. Personalize responses

Customer history, preferences, environment, and successful solutions can
help make responses more contextual.

5. Escalate when necessary

When an issue cannot be reliably resolved by the AI, human support
should remain available.

6. Make memory visible

The support interface should make relevant customer context
understandable to the support agent.

🎯 Core Idea

Traditional support systems often treat each interaction independently:

Ticket 1 → forgotten
Ticket 2 → forgotten
Ticket 3 → forgotten

Hindsight aims to create continuity:

Ticket 1
   ↓
Memory
   ↓
Ticket 2
   ↓
Updated Memory
   ↓
Ticket 3

The goal is to transform customer support from a sequence of
disconnected tickets into a more continuous customer relationship.

Customer support should remember the customer, not just the
ticket.

🚀 Future Improvements

The current prototype can be extended with:

Real-time Hindsight memory retrieval in the frontend

Dynamic customer creation

Customer search

Full customer profile view

Real-time ticket creation

Human-agent escalation workflow

Sentiment and frustration detection

Memory relevance indicators

Conversation timeline

Agent activity logs

Analytics dashboard

Authentication and role-based access

Production database

Automated testing

Cloud deployment

Mobile-responsive improvements

🏆 Hackathon Value

Hindsight focuses on a simple but important customer-support problem:

Customers should not have to repeat their story every time they
contact support.

The project combines:

AI
+
Persistent Memory
+
Customer Context
+
Support History
+
Previously Successful Solutions
+
Human Escalation

to create a support experience that can become more contextual over
time.

The key difference is not simply generating another AI response.

It is creating an AI support agent that can remember, retrieve, use,
and retain customer context across conversations.

👥 Team

A collaborative software project focused on:

Persistent customer memory + personalized AI support

Team Areas

Frontend & User Experience

Backend & REST API

AI Agent

Hindsight Memory Integration

Customer Data Integration

Testing & Demo

📌 Project Status

🚧 Active Development

Current development includes:

Customer selection

Support conversation interface

Customer memory dashboard

Structured customer-support data

Flask backend

AI agent foundation

Hindsight memory integration

Frontend/backend integration

The system is being continuously developed toward a fully dynamic
customer-support workflow.

📄 License

This project was created as a hackathon prototype.

Add an appropriate open-source license if the repository will be
publicly distributed.
