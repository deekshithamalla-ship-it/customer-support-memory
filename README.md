# Customer Support That Remembers

A customer support AI agent project built with Flask, Groq, and Hindsight Cloud for long-term customer memory.

## Project Structure

```text
.
├── backend/
│   ├── agent.py            # AI agent logic using Groq
│   ├── app.py              # Flask backend server API entry point
│   └── hindsight_memory.py # Hindsight Cloud memory management
├── data/
│   └── customers.json      # Sample customer data
├── frontend/
│   ├── index.html          # Web chat UI layout
│   ├── script.js           # Client-side chat logic
│   └── style.css           # UI styles
├── .env.example            # Template for environment variables
├── .gitignore              # Files ignored by git
├── README.md               # Project documentation
└── requirements.txt        # Python package dependencies
```

## Getting Started

1. Clone the repository.
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and fill in your API keys:
   ```bash
   cp .env.example .env
   ```
4. Run the backend server:
   ```bash
   python backend/app.py
   ```
