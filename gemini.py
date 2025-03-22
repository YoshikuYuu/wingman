from google import genai
from google.genai import types

GEMINI_API_KEY = "AIzaSyDtiSA5fT6kdkjddNdVmuZu1RCGBY2ksX8"

DRAFT_INSTRUCT = """
    You are the AI browser extension 'Wingman' that is given the user's chat history, the user's
    relationship to the recipient, and the user's draft message. Based on the draft message,
    generate an improved message that is appropriate for the user's relationship with the 
    recipient and considers relevant information in the chat history. Your message should
    imitate the user's texting conventions.

    Example Input 1:
    Relationship: girlfriend
    Chat History
    clkr: i'm at the library lol
    user: okay, I'll see you there
    user: yo
    clkr: hiiii
    Draft Message: how was your day?

    Example Output 1:
    hey, how was your day? i can't wait to see you later <3

    Example Input 2:
    Relationship: co-worker
    Chat History:
    user: Hi John, are you done with the implementing the new feature?
    john: I finished a few minutes ago! I'll send you the code now.
    Draft Message: Okay, thanks! I'll review it. Then we can get lunch

    Example Output 2:
    Great, thanks for the quick turnaround! After I review it, do you want to grab lunch?

    Example Input 3:
    Relationship: friend
    Chat History:
    friend: dude, did you see the trailer for Arcane?
    user: YO hold up
    user: I'm watching it rn 
    friend: Fortiche went crazy on the animation fr
    Draft Message: yeah, it looks so good

    Example Output 3:
    the Fortiche artstyle is so clean! I'm hoping the story will be just as good
    """
NO_DRAFT_INSTRUCT = """
    You are the AI browser extension 'Wingman' that is given the user's chat history, and the user's
    relationship to the recipient. Generate a message for the user that continues the conversation
    in a way that is appropriate for the user's relationship with the recipient and considers relevant
    information in the chat history. Your message should imitate the user's texting conventions.

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

def generate_rizz(relationship, chat_history, draft=None) -> str:
    """
    Generate a message that continues the conversation in a way that is appropriate for the user's
    relationship with the recipient. The message should consider relevant information in the chat
    history and imitate the user's texting conventions. If a draft message is provided, the generated
    message should be an improved version of the draft message.

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

    if draft:
        prompt = f"Relationship: {relationship}\nChat History:\n{chat_history_string}\nDraft Message: {draft}"
    else:
        prompt = f"Relationship: {relationship}\nChat History:\n{chat_history_string}"
    
    print(prompt)

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        model_id = "gemini-2.0-flash"
        response = client.models.generate_content(
            model=model_id,
            contents=types.Content(role="user", parts=[types.Part.from_text(text=prompt)]),
            config=types.GenerateContentConfig(
                system_instruction=types.Part.from_text(text=DRAFT_INSTRUCT if draft else NO_DRAFT_INSTRUCT),
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
