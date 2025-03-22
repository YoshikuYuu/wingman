from google import genai
from google.genai import types

GEMINI_API_KEY = "AIzaSyDtiSA5fT6kdkjddNdVmuZu1RCGBY2ksX8"
RESPONSE_SCHEMA = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "bias_level": {
            "type": "integer"
        },
        "biased_statements": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "biased_quote": {"type": "string"},
                    "bias_explanation": {"type": "string"}
                },
                "required": ["biased_quote", "bias_explanation"]
            }
        },
        "fact_checked_statements": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "checked_quote": {"type": "string"},
                    "fact_check_results": {"type": "string"},
                    "source_links": {
                        "type": "array",
                        "items": {"type": "string"} 
                    }
                },
                "required": ["checked_quote", "fact_check_results", "source_links"]
            }
        },
        "alternative_perspectives": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "perspective_title": {"type": "string"},
                    "perspective_description": {"type": "string"}
                },
                "required": ["perspective_title", "perspective_description"]
            }
        },
        "alternative_sources": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "source_name": {"type": "string"},
                    "source_link": {"type": "string"}
                },
                "required": ["source_name", "source_link"]
            }
        }
    },
    "required": [
        "bias_level",
        "biased_statements",
        "fact_checked_statements",
        "alternative_perspectives",
        "alternative_sources"
    ],
    "additionalProperties": False
}

DRAFT_INSTRUCT = """
    You are the AI browser extension 'Wingman' that is given the user's chat history, the user's
    relationship to the recipient, and the user's draft message. Based on the draft message,
    generate an improved message. Your message should imitate the user's texting conventions.
    """
NO_DRAFT_INSTRUCT = """
    You are the AI browser extension 'Wingman' that is given the user's chat history, and the user's
    relationship to the recipient. Generate a message for the user that continues the conversation
    in a way that is appropriate for the user's relationship with the recipient. Your message should
    imitate the user's texting conventions.

    Example Input 1:
    Relationship: girlfriend
    Chat History:
    user: yo bb girl, wya?
    clkr: at the library lol
    clkr: why?
    user: are you coming to the party tonight?

    Example Output 1:
    i was hoping to see you there :p

    Example Input 2:
    Relationship: co-worker
    Chat History:
    user: Hi John, did you finish writing the docstrings?
    john: No, not yet
    john: Sorry, I've been really swamped lately.
    john: I'm not sure if I'll be able to work on it before Sunday

    Example Output 2:
    No worries. Take your time and don't overwork yourself!
    """

def generate_rizz(chat_history, relationship) -> str:
    """
    Generate a message that continues the conversation in a way that is appropriate for the user's
    relationship with the recipient.

    Parameters:
        chat_history (list of dictionaries):
            An ordered list of messages in the chat history. Each dictionary corresponds to a
            message and has the following keys:
            - "type": The type of message, which can be "text" or "link"
            - "sender": The sender of the message.
            - "content": The message content.
        relationship (str): The user's relationship to the recipient.
    """

    chat_history_string = process_chat_history(chat_history)
    prompt = f"Relationship: {relationship}\nChat History:\n{chat_history_string}"
    print(prompt)

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        model_id = "gemini-2.0-flash"
        response = client.models.generate_content(
            model=model_id,
            contents=types.Content(role="user", parts=[types.Part.from_text(text=prompt)]),
            config=types.GenerateContentConfig(
                system_instruction=types.Part.from_text(text=NO_DRAFT_INSTRUCT),
                temperature=1.5,
                max_output_tokens=100,
                response_mime_type="text/plain",
                top_p=0.95,
                top_k=40
            )
        )
    except Exception as e:
        return str(e)
    
    return response.text

def add_rizz() -> str:
    """
    
    """

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        return str(e)
    

def process_chat_history(chat_history):
    # Process messages in the chat history into a prompt
    processed_messages = []
    for message in chat_history:
        if message["type"] == "link":
            description = process_link(message["content"])
            if description:  # Only add the description if it is not empty, else ignore the link
                processed_messages.append(f"{message["sender"]}: {description}")
        elif message["type"] == "text":
            processed_messages.append(f"{message["sender"]}: {message["content"]}")
    return '\n'.join(processed_messages)

def process_link():
    return "description"

def test_something():
    pass

def test_generate_rizz():
    test_chat_history = [
        {"type": "text", "sender": "user", "content": "ayyy the new Avengers movie came out!"},
        {"type": "text", "sender": "clkr", "content": "omg ya I saw!"},
        {"type": "text", "sender": "clkr", "content": "I can't wait to watch it"}
    ]
    test_relationship = "crush"

    response = generate_rizz(test_chat_history, test_relationship)
    print(response)

if __name__ == "__main__":
    test_generate_rizz()
