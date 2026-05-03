class UserMessage:
    def __init__(self, text: str):
        self.text = text


class LlmChat:
    def __init__(self, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs

    def with_model(self, *args, **kwargs):
        return self

    async def send_message(self, message):
        text = getattr(message, "text", str(message))
        return f"[Mode test local] Réponse simulée pour le prompt : {text[:500]}"
