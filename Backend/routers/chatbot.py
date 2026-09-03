from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from pydantic import (
    BaseModel,
    Field
)

from dependencies import (
    get_current_user
)

from chatbot_service import (
    ask_chatbot
)


router = APIRouter(
    prefix="/chatbot",
    tags=["Chatbot"]
)


class ChatRequest(BaseModel):

    question: str = Field(
        min_length=1,
        max_length=1000
    )


class ChatResponse(BaseModel):

    answer: str


@router.post(
    "/ask",
    response_model=ChatResponse
)
def chatbot_question(
    data: ChatRequest,
    current_user=Depends(
        get_current_user
    )
):

    try:

        print(
            "\n=============================="
        )

        print(
            "CHATBOT QUESTION:",
            data.question
        )

        answer = ask_chatbot(
            data.question
        )

        print(
            "CHATBOT ANSWER:",
            answer
        )

        print(
            "==============================\n"
        )


        return {
            "answer": answer
        }


    except Exception as error:

        print(
            "\n=============================="
        )

        print(
            "CHATBOT ERROR TYPE:",
            type(error).__name__
        )

        print(
            "CHATBOT ERROR:",
            repr(error)
        )

        print(
            "==============================\n"
        )


        raise HTTPException(
            status_code=500,
            detail=f"Chatbot error: {str(error)}"
        )