import './App.css';
import React from 'react';
import Aibody from './Component/Aibody.js';

function App() {
  return (
    <>
      <Aibody />
    </>
  );
}

export default App;
























// import React, { useState } from 'react';
// import axios from 'axios';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// function App() {
//   const [messages, setMessages] = useState(''); // State to store the API response
//   const [loading, setLoading] = useState(false); // Loading state for API call
//   const { transcript, listening, resetTranscript } = useSpeechRecognition(); // Speech recognition hooks

//   if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//     return <div>Your browser does not support speech recognition. Please use a modern browser.</div>;
//   }

//   // Handle microphone click event
//   const handleMicClick = () => {
//     if (listening) {
//       SpeechRecognition.stopListening(); // Stop listening when button is clicked again
//       handleSendMessage(transcript); // Send the message to OpenAI API
//       resetTranscript(); // Reset transcript after sending
//     } else {
//       SpeechRecognition.startListening(); // Start listening when button is clicked
//     }
//   };

//   // Function to send the transcribed message to the API
//   const handleSendMessage = async (message) => {
//     if (!message.trim()) {
//       alert("Please say something before sending."); // Alert if the message is empty
//       return;
//     }

//     setLoading(true); // Start loading

//     try {
//       const response = await axios.post(
//         'http://localhost:4000/api/v1/search/QueryAnything', // API endpoint
//         {
//           input: message, // Send the transcribed message as input
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json', // Set headers
//           },
//         }
//       );

//       // Extract the response message from the API
//       const aiMessage = response.data.message;
//       setMessages(aiMessage); // Update messages state with API response
//     } catch (error) {
//       console.error('Error fetching response from API:', error); // Handle error
//       setMessages('Error fetching response. Please try again.'); // Display error message
//     }

//     setLoading(false); // End loading
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
//       <h1>Chat with AI using Voice</h1>
//       <div style={{ marginBottom: '20px' }}>
//         <button onClick={handleMicClick} style={{ padding: '10px', fontSize: '16px' }}>
//           {listening ? 'Stop Listening' : 'Start Listening'}
//         </button>
//         {listening && <p>Listening... Please speak now.</p>}
//       </div>
//       {loading && <p>Loading response...</p>}
//       <div style={{ marginTop: '20px' }}>
//         <textarea
//           value={transcript}
//           rows="4"
//           cols="50"
//           readOnly
//           placeholder="Your transcribed text will appear here..."
//           style={{ width: '100%', marginBottom: '20px' }}
//         />
//         <textarea
//           value={messages}
//           rows="4"
//           cols="50"
//           readOnly
//           placeholder="AI response will appear here..."
//           style={{ width: '100%' }}
//         />
//       </div>
//     </div>
//   );
// }

// export default App;
