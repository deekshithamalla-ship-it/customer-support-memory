import asyncio

from hindsight_client import Hindsight


class HindsightMemory:

    def __init__(self):
        self.base_url = "http://localhost:8888"

    def _bank_id(self, customer_id: str) -> str:
        return f"customer-{customer_id}"

    def recall_memories(self, customer_id: str, query: str):

        async def _recall():
            client = Hindsight(base_url=self.base_url)

            try:
                response = await client.arecall(
                    bank_id=self._bank_id(customer_id),
                    query=query,
                )

                memories = []

                for result in response.results:
                    memories.append({
                        "text": result.text
                    })

                return memories

            finally:
                await client.aclose()

        return asyncio.run(_recall())

    def store_memory(
        self,
        customer_id: str,
        user_message: str,
        agent_response: str,
        ticket_id: str = None
    ):

        content = (
            f"Customer ID: {customer_id}\n"
            f"Ticket ID: {ticket_id or 'N/A'}\n"
            f"Customer message: {user_message}\n"
            f"Agent response: {agent_response}"
        )

        async def _retain():
            client = Hindsight(base_url=self.base_url)

            try:
                return await client.aretain(
                    bank_id=self._bank_id(customer_id),
                    content=content,
                )

            finally:
                await client.aclose()

        return asyncio.run(_retain())