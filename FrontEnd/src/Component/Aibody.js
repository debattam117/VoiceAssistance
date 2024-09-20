import './Aibody.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Aibody = () => {
    const [messages, setMessages] = useState([]); // State to store chat messages
    const [loading, setLoading] = useState(false); // State to show loading
    const [inputText, setInputText] = useState(""); // State to handle text input
    const { transcript, listening, resetTranscript } = useSpeechRecognition(); // Voice recognition hooks

    // Load chat history from localStorage on component mount
    useEffect(() => {
        const savedChatHistory = JSON.parse(localStorage.getItem('chatHistory'));
        if (savedChatHistory) {
            setMessages(savedChatHistory);
        }
    }, []);

    // Save chat history to localStorage whenever it updates
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        }
    }, [messages]);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <div>Your browser does not support speech recognition. Please use a modern browser.</div>;
    }

    // Handle start listening for voice input
    const handleStartListening = () => {
        if (!listening) {
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    // Handle stop listening and process the voice input
    const handleStopListening = async () => {
        if (listening) {
            SpeechRecognition.stopListening();
            const combinedInput = inputText || transcript; // Use either text input or transcript

            if (!combinedInput.trim()) {
                alert("Please say or type something before sending.");
                return;
            } else {
                await fetchApiResponse(combinedInput);
            }

            resetTranscript(); // Reset the transcript after stopping listening
        }
    };

    // Make an API call with the input (text or voice)
    const fetchApiResponse = async (input) => {
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/search/QueryAnything`, {
                input,
                chatHistory: messages // Send previous chat history to the backend
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            // Ensure chatHistory is an array before setting it
            if (Array.isArray(response.data.chatHistory)) {
                setMessages(response.data.chatHistory);
            } else {
                console.error('chatHistory is not an array:', response.data.chatHistory);
                alert("Unexpected response format. Please try again.");
            }
        } catch (error) {
            console.error('Error fetching response from API:', error);
            alert("Failed to fetch response. Please check your network connection.");
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'user', content: input },
                { role: 'assistant', content: 'Error fetching response. Please try again.' }
            ]);
        }

        setLoading(false);
        setInputText(""); // Clear text input after submission
    };

    // Handle text input submission
    const handleTextSubmit = async (e) => {
        e.preventDefault();
        const combinedInput = inputText || transcript; // Use either text input or transcript

        if (combinedInput.trim()) {
            await fetchApiResponse(combinedInput);
        } else {
            alert("Please enter or say something before submitting.");
        }

        resetTranscript(); // Clear the transcript after text submission
    };

    // Clear the chat and localStorage history
    const handleResetResponses = () => {
        setMessages([]);
        resetTranscript();
        setInputText("");
        localStorage.removeItem('chatHistory'); // Clear chat history from localStorage
    };

    return (
        <div className='Contain'>
            <h1>Chat AI: Your Personal Voice & Text Assistance</h1>

            {/* Buttons for listening and resetting */}
            <div className='butn' style={{ marginBottom: '20px' }}>
                <button
                    className='startbutn'
                    onClick={handleStartListening}
                    disabled={listening || inputText.trim().length > 0} // Disable when listening or typing
                >
                    Start Listening
                </button>
                <button
                    className='stopbutn'
                    onClick={handleStopListening}
                    disabled={!listening}
                >
                    Stop Listening
                </button>
                <button
                    className='resetbutn'
                    onClick={handleResetResponses}
                    style={{ padding: '10px', fontSize: '16px' }}
                >
                    Reset Responses
                </button>
                {listening && <p>Listening... Please speak now.</p>}
            </div>

            {/* Text Input Form */}
            <form onSubmit={handleTextSubmit}>
                <div className='txtrequest'>
                    <textarea
                        value={inputText || transcript} // Show text input or transcript in the same box
                        onChange={(e) => setInputText(e.target.value)} // Update text input state
                        rows="4"
                        cols="50"
                        placeholder="Type or speak your query here..."
                        disabled={listening} // Disable typing when listening
                    />
                </div>
                <button type='submit' className='startbutn' disabled={!inputText.trim()}>
                    Submit Text
                </button>
            </form>

            {/* Display responses or loading state */}
            {loading ? <p>Loading response...</p> : (
                <div className='txtresponse'>
                    <textarea
                        value={Array.isArray(messages) ? messages.map((msg) => `Role: ${msg.role}:\nMessage: ${msg.content}\n\n`).join('') : ''}
                        rows="10"
                        cols="50"
                        readOnly
                        placeholder="AI responses will appear here..."
                    />
                </div>
            )}
        </div>
    );
};

export default Aibody;
