import './Aibody.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Aibody = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputText, setInputText] = useState("");
    const { transcript, listening, resetTranscript } = useSpeechRecognition();
    const textareaRef = useRef(null);
    const containerRef = useRef(null);
    const [isSpeechRecognitionSupported] = useState(SpeechRecognition.browserSupportsSpeechRecognition());

    useEffect(() => {
        const savedChatHistory = JSON.parse(localStorage.getItem('chatHistory'));
        if (savedChatHistory) {
            setMessages(savedChatHistory);
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        }
    }, [messages]);

    // Handle toggle listening for voice input
    const handleToggleListening = async (e) => {
        e.preventDefault();
        if (!listening) {
            SpeechRecognition.startListening({ continuous: true });
        } else {
            SpeechRecognition.stopListening();
            const combinedInput = inputText || transcript;
            if (!combinedInput.trim()) {
                alert("Please say or type something before sending.");
                return;
            }
            await fetchApiResponse(combinedInput);
            resetTranscript();
            setInputText(''); // Clear the textarea
            if (textareaRef.current) {
                const bt=document.querySelector(".startbutn1");
                const mic=document.querySelector(".toggle-listen-btn");
                textareaRef.current.style.height = '48px'; // Reset to original height
                containerRef.current.style.height = '3rem'; // Reset container height
                mic.style.marginTop = "0.2rem";
                bt.style.marginTop = "0.4rem";
            }
        }
    };

    const fetchApiResponse = async (input) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/search/QueryAnything`, {
                input,
                chatHistory: messages
            }, { headers: { 'Content-Type': 'application/json' } });
    
            if (response.data && response.data.chatHistory) {
                setMessages(response.data.chatHistory);
            } else {
                console.error('Unexpected response structure:', response.data);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { role: 'user', content: input },
                    { role: 'assistant', content: 'Unexpected response format. Please try again.' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching response from API:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'user', content: input },
                { role: 'assistant', content: 'Error fetching response. Please try again.' }
            ]);
        } finally {
            setLoading(false);
            setInputText("");
            resetTranscript();
        }
    };

    const handleTextSubmit = async (e) => {
        e.preventDefault();
        const combinedInput = inputText || transcript;
        if (combinedInput.trim()) {
            await fetchApiResponse(combinedInput);
            setInputText(''); // Clear the textarea
            if (textareaRef.current) {
                const bt=document.querySelector(".startbutn1");
                const mic=document.querySelector(".toggle-listen-btn");
                textareaRef.current.style.height = '48px'; // Reset to original height
                containerRef.current.style.height = '3rem'; // Reset container height
                mic.style.marginTop = "0.2rem";
                bt.style.marginTop = "0.4rem";
            }
        } else {
            alert("Please enter or say something before submitting.");
        }
        resetTranscript();
    };

    const handleResetResponses = () => {
        setMessages([]);
        resetTranscript();
        setInputText("");
        localStorage.removeItem('chatHistory');
        setInputText(''); // Clear the textarea
            if (textareaRef.current) {
                const bt=document.querySelector(".startbutn1");
                const mic=document.querySelector(".toggle-listen-btn");
                textareaRef.current.style.height = '48px'; // Reset to original height
                containerRef.current.style.height = '3rem'; // Reset container height
                mic.style.marginTop = "0.2rem";
                bt.style.marginTop = "0.4rem";
            }
    };
   
    useEffect(() => {
        const textarea = textareaRef.current;
        const container = containerRef.current;
        const bt=document.querySelector(".startbutn1");
        const mic=document.querySelector(".toggle-listen-btn");
        if (textarea && container) {
            const adjustContainerHeight = () => {
                if (textarea.value.trim() === "") {
                    // Reset to initial heights if the textarea is empty
                    textarea.style.height = '48px';
                    container.style.height = '3rem';
                    mic.style.marginTop = "0.2rem";
                    bt.style.marginTop = "0.3rem";
                } else if (textarea.scrollHeight > 48) {
                    textarea.style.height = 'auto'; // Reset height to let it grow
                    textarea.style.height = `${Math.min(textarea.scrollHeight, 4)}rem`; // Grow up to 90px
                    container.style.height = `${Math.min(textarea.scrollHeight, 4.3)}rem`;
                    mic.style.marginTop = "0.9rem";
                    bt.style.marginTop = "1.2rem";
                } else {
                    // Reset height to calculate the new height based on content
                    textarea.style.height = 'auto'; 
                    const newHeight = Math.min(textarea.scrollHeight, 48);
                    textarea.style.height = `${newHeight}px`;
                    container.style.height = `${newHeight}px`;
                }
            };
    
            textarea.addEventListener('input', adjustContainerHeight);
            return () => textarea.removeEventListener('input', adjustContainerHeight);
        }
    }, []);
    

    return (
      <div className="Contain">
        {!isSpeechRecognitionSupported ? (
                <div>Your browser does not support speech recognition. Please use a modern browser.</div>
            ) : (
                <>
        <div className="nav">
          <div className="nav3">
            <button
              className="resetbutn"
              onClick={handleResetResponses}
              style={{ padding: "0.5rem", fontSize: "0.9rem"}}
            >
              <i className="fa-solid fa-rotate" ></i>
            </button>
          </div>
          <div className="nav2">
            <h1>Chat AI</h1>
          </div>
          <div className="nav1">
            <img src="voice1.png" alt="" />
          </div>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <i className="fa-solid fa-microchip"></i>
            <p className="typewriter">
               Hello, How Can I Assist You 
            </p>
          </div>
        ) : (
          <div className="txtresponse">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.role === "user" ? "user-message" : "assistant-message"
                }
              >
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleTextSubmit}>
          <div className="respcontainer" ref={containerRef}>
            <div className="lis-butn">
              <button
                className="toggle-listen-btn"
                onClick={handleToggleListening}
                style={{ padding: "10px", fontSize: "16px" }}
                disabled={inputText.trim().length > 0}
              >
                {listening ? (
                  <i
                    className="fa-solid fa-microphone-slash"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-microphone"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                )}
              </button>
            </div>
            <div className="txtrequest" >
              <textarea
                ref={textareaRef}
                value={inputText || (transcript ? transcript.trim().slice(-20) : "")}
                onChange={(e) => setInputText(e.target.value)}
                rows="4"
                cols="50"
                placeholder="Message.."
                disabled={listening}
              />
            </div>

            <div className="buttnn">
              <button
                type="submit"
                className="startbutn1"
                disabled={listening || !inputText.trim()}
              >
                <i className="fa-solid fa-play"></i>
              </button>
            </div>
          </div>
        </form>
        </>
    )}
      </div>
    );
};

export default Aibody;
