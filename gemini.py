from google import genai
# from google.genai.types import Tool, GenerateContentConfig, GoogleSearch, Schema
import google.generativeai as genai

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

SYS_INSTRUCT = """
    You are the AI browser extension 'Wingman'. You are friendly, encouraging, and 
    """
DRAFT_INSTRUCT = """
    Given the user's chat history, the user's relationship to the recipient (optional), and the 
    user's draft message. Provide suggestions for improving the message, taking into account 
    the user's relationship with the recipient.
    """
NO_DRAFT_INSTRUCT = """
    You are the AI browser extension 'Wingman' that is given the user's chat history, and the user's
    relationship to the recipient (optional). Generate a message that continues the conversation
    in a way that is appropriate for the user's relationship with the recipient.
    """

def generate_rizz() -> str:
    try:
        # Set up the Gemini client with Google search tool
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        return str(e)

def add_rizz() -> str:
    try:
        # Set up the Gemini client with Google search tool
        client = genai.Client(api_key=GEMINI_API_KEY)
        model_id = "gemini-2.0-flash-exp"
        # google_search_tool = Tool(
        #     google_search = GoogleSearch()
        # )
    except Exception as e:
        return str(e)

def test_something():
    pass


if __name__ == "__main__":
    ret = test_something()
    pass
