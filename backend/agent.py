# import os

# from groq import Groq
# from hindsight_memory import HindsightMemory


# class SupportAgent:

#     def __init__(self):

#         if not os.getenv("GROQ_API_KEY"):
#             raise ValueError("GROQ_API_KEY is missing")

#         self.client = Groq(
#             api_key=os.getenv("GROQ_API_KEY")
#         )

#         self.memory = HindsightMemory()

#         self.model = os.getenv(
#             "GROQ_MODEL",
#             "openai/gpt-oss-20b"
#         )

#     def generate_response(
#         self,
#         customer_id,
#         message,
#         ticket_id=None
#     ):

#         # 1. Recall previous customer memories
#         memories = self.memory.recall_memories(
#             customer_id,
#             message
#         )

#         # 2. Convert memories into text
#         memory_text = "\n".join(
#             [
#                 f"- {m['text']}"
#                 for m in memories
#             ]
#         )

#         if not memory_text:
#             memory_text = "No previous customer information found."

#         # 3. Give memories to Groq
#         system_prompt = f"""
# You are a helpful Customer Support AI Agent.

# You have access to memories from previous conversations.

# Use these memories to personalize your response.

# Previous customer memories:
# {memory_text}

# Rules:
# - Do not invent customer history.
# - Do not claim something happened if it is not in the memories.
# - Avoid making the customer repeat information already known.
# - Be polite and practical.
# - If the problem requires a human, clearly recommend escalation.
# """

#         # 4. Generate response with Groq
#         response = self.client.chat.completions.create(
#             model=self.model,
#             messages=[
#                 {
#                     "role": "system",
#                     "content": system_prompt
#                 },
#                 {
#                     "role": "user",
#                     "content": message
#                 }
#             ],
#             temperature=0.3
#         )

#         answer = response.choices[0].message.content

#         # 5. Store this interaction in Hindsight
#         self.memory.store_memory(
#             customer_id=customer_id,
#             user_message=message,
#             agent_response=answer,
#             ticket_id=ticket_id
#         )

#         return {
#             "response": answer,
#             "memories_used": memories
#         }
import os
import json

from groq import Groq
from hindsight_memory import HindsightMemory
from customer_data import CustomerData


class SupportAgent:

    def __init__(self):

        if not os.getenv("GROQ_API_KEY"):
            raise ValueError("GROQ_API_KEY is missing")

        self.client = Groq(
            api_key=os.getenv("GROQ_API_KEY")
        )

        self.memory = HindsightMemory()
        self.customer_data = CustomerData()

        self.model = os.getenv(
            "GROQ_MODEL",
            "openai/gpt-oss-20b"
        )

    def generate_response(
        self,
        customer_id,
        message,
        ticket_id=None
    ):

        # =========================================
        # 1. LOAD STRUCTURED CUSTOMER INFORMATION
        # =========================================

        customer_context = self.customer_data.get_customer_context(
            customer_id
        )


        # =========================================
        # 2. RECALL LONG-TERM MEMORY FROM HINDSIGHT
        # =========================================

        memories = self.memory.recall_memories(
            customer_id,
            message
        )

        memory_text = "\n".join(
            [
                f"- {m['text']}"
                for m in memories
            ]
        )

        if not memory_text:

            memory_text = (
                "No previous conversational memories found."
            )


        # =========================================
        # 3. CONVERT CUSTOMER DATA TO TEXT
        # =========================================

        customer_data_text = json.dumps(
            customer_context,
            indent=2
        )


        # =========================================
        # 4. SYSTEM PROMPT
        # =========================================

        system_prompt = f"""
You are a helpful Customer Support AI Agent.

You have two sources of customer context:

1. Structured customer information
2. Long-term conversational memories stored in Hindsight

Use these sources to personalize your response.

STRUCTURED CUSTOMER INFORMATION:
{customer_data_text}

HINDSIGHT CONVERSATIONAL MEMORIES:
{memory_text}


RULES:

- Use the information above when it is relevant.
- Do not invent customer history.
- Do not make the customer repeat information that is already known.
- Consider previous issues, previous solutions, environment, and frustration level when relevant.
- If a previous solution worked, consider suggesting it again when appropriate.
- You may summarize previous tickets, issues, resolutions, and customer preferences from the provided information.
- Clearly distinguish remembered information from actions performed in the current conversation.
- Be polite, practical, and concise.

IMPORTANT ACTION RULES:

- Never claim that you opened a ticket unless an actual tool in this application opened one.
- Never claim that you sent an email unless an actual tool in this application sent one.
- Never claim that you checked live tracking unless an actual tool in this application checked it.
- Never claim that you contacted a delivery team or support team unless an actual tool in this application performed that action.
- Never claim that you changed an order or customer information unless an actual tool performed that action.
- Never claim that you performed any other real-world action unless an actual tool in this application performed that action.

- If the customer asks for an action that this application cannot perform, clearly explain that support can perform it instead.
- If an action requires information that is not available, ask the customer for the required information.
- Do not pretend that a remembered event happened during the current conversation.

MEMORY RULES:

- Treat Hindsight memories as historical information.
- Use memories to understand the customer's previous interactions.
- If a previous ticket or solution is relevant, mention it naturally.
- Do not describe recalled information as if you just performed the action.
- Do not say "I checked" unless you actually performed a check using an available tool.
- Do not say "I sent", "I opened", "I contacted", or "I changed" unless the application actually performed that action.

If the issue requires human assistance, recommend escalation.
"""


        # =========================================
        # 5. GENERATE RESPONSE USING GROQ
        # =========================================

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            temperature=0.3
        )

        answer = response.choices[0].message.content


        # =========================================
        # 6. STORE NEW INTERACTION IN HINDSIGHT
        # =========================================

        self.memory.store_memory(
            customer_id=customer_id,
            user_message=message,
            agent_response=answer,
            ticket_id=ticket_id
        )


        # =========================================
        # 7. RETURN RESULT
        # =========================================

        return {
            "response": answer,
            "memories_used": memories
        }