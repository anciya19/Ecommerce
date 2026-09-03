import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import API from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";


function Chatbot() {

  const {
    user,
    loading: authLoading,
  } = useAuth();


  const [
    isOpen,
    setIsOpen
  ] = useState(false);


  const [
    message,
    setMessage
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    messages,
    setMessages
  ] = useState([
    {
      role: "assistant",
      text:
        "Hi! I am your ShopNow assistant. How can I help you today?",
    },
  ]);


  const messagesEndRef =
    useRef(null);



  // =========================================
  // AUTO SCROLL
  // =========================================

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [
    messages,
    loading
  ]);



  // =========================================
  // SEND MESSAGE
  // =========================================

  const sendMessage =
    async (event) => {

      event.preventDefault();


      const question =
        message.trim();


      if (
        question === ""
        ||
        loading
      ) {

        return;

      }


      const userMessage = {
        role: "user",
        text: question,
      };


      setMessages(
        (previousMessages) => [

          ...previousMessages,

          userMessage,

        ]
      );


      setMessage("");

      setLoading(true);


      try {

        const response =
          await API.post(
            "/chatbot/ask",
            {
              question: question,
            }
          );


        const assistantMessage = {

          role: "assistant",

          text:
            response.data.answer,

        };


        setMessages(
          (previousMessages) => [

            ...previousMessages,

            assistantMessage,

          ]
        );

      }

      catch (error) {

        console.error(
          "CHATBOT ERROR:",
          error
        );


        let errorMessage =
          "Sorry, I am unable to answer right now.";


        if (
          error.response?.status
          === 401
        ) {

          errorMessage =
            "Your login session has expired. Please login again.";

        }

        else if (
          error.response
            ?.data
            ?.detail
        ) {

          errorMessage =
            error.response
              .data
              .detail;

        }


        setMessages(
          (previousMessages) => [

            ...previousMessages,

            {
              role: "assistant",
              text: errorMessage,
            },

          ]
        );

      }

      finally {

        setLoading(false);

      }

    };



  // =========================================
  // QUICK QUESTION
  // =========================================

  const selectQuickQuestion =
    (question) => {

      setMessage(
        question
      );

    };



  // =========================================
  // CLEAR CHAT
  // =========================================

  const clearChat = () => {

    setMessages([
      {
        role: "assistant",

        text:
          "Hi! I am your ShopNow assistant. How can I help you today?",
      },
    ]);


    setMessage("");

  };



  // =========================================
  // HIDE CHATBOT BEFORE LOGIN
  // =========================================

  if (
    authLoading
    ||
    !user
  ) {

    return null;

  }



  return (

    <div className=
      "chatbot-container"
    >


      {/* =================================
          CHAT WINDOW
      ================================= */}

      {
        isOpen
        &&
        (

          <div className=
            "chatbot-window"
          >


            {/* HEADER */}

            <div className=
              "chatbot-header"
            >


              <div className=
                "chatbot-header-info"
              >


                <div className=
                  "chatbot-avatar"
                >

                  S

                </div>


                <div>

                  <h3>

                    ShopNow Assistant

                  </h3>


                  <span>

                    ● Online

                  </span>

                </div>


              </div>



              <div className=
                "chatbot-header-buttons"
              >


                <button
                  type="button"
                  title="Clear chat"
                  onClick={
                    clearChat
                  }
                >

                  ↻

                </button>


                <button
                  type="button"
                  title="Close"
                  onClick={() =>
                    setIsOpen(
                      false
                    )
                  }
                >

                  ×

                </button>


              </div>


            </div>



            {/* =================================
                MESSAGES
            ================================= */}

            <div className=
              "chatbot-messages"
            >


              {
                messages.map(
                  (
                    chatMessage,
                    index
                  ) => (

                    <div
                      key={
                        index
                      }
                      className={

                        chatMessage.role
                        === "user"

                          ? "chat-message user-chat-message"

                          : "chat-message assistant-chat-message"

                      }
                    >

                      {
                        chatMessage.text
                      }

                    </div>

                  )
                )
              }



              {/* THINKING */}

              {
                loading
                &&
                (

                  <div
                    className="
                      chat-message
                      assistant-chat-message
                      chatbot-thinking
                    "
                  >

                    <span>.</span>
                    <span>.</span>
                    <span>.</span>

                  </div>

                )
              }


              <div
                ref={
                  messagesEndRef
                }
              />


            </div>



            {/* =================================
                QUICK QUESTIONS
            ================================= */}

            <div className=
              "chatbot-quick-section"
            >


              <button
                type="button"
                onClick={() =>
                  selectQuickQuestion(
                    "How do I place an order?"
                  )
                }
              >

                Place an order

              </button>


              <button
                type="button"
                onClick={() =>
                  selectQuickQuestion(
                    "How can I become a seller?"
                  )
                }
              >

                Become a seller

              </button>


              <button
                type="button"
                onClick={() =>
                  selectQuickQuestion(
                    "What payment methods are available?"
                  )
                }
              >

                Payment methods

              </button>


              <button
                type="button"
                onClick={() =>
                  selectQuickQuestion(
                    "How do I view my previous orders?"
                  )
                }
              >

                Order history

              </button>


            </div>



            {/* =================================
                INPUT AREA
            ================================= */}

            <form
              className=
                "chatbot-input-area"
              onSubmit={
                sendMessage
              }
            >


              <input
                type="text"
                placeholder=
                  "Ask about ShopNow..."
                value={
                  message
                }
                onChange={
                  (event) =>
                    setMessage(
                      event.target.value
                    )
                }
                disabled={
                  loading
                }
              />


              <button
                type="submit"
                disabled={
                  loading
                  ||
                  message.trim()
                  === ""
                }
              >

                ➤

              </button>


            </form>


          </div>

        )
      }



      {/* =================================
          FLOATING BUTTON
      ================================= */}

      <button
        type="button"
        className=
          "chatbot-floating-button"
        onClick={() =>
          setIsOpen(
            !isOpen
          )
        }
      >

        {
          isOpen
            ? "×"
            : "💬"
        }

      </button>


    </div>

  );

}


export default Chatbot;