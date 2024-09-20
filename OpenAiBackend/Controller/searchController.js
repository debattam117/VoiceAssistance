import OpenAI from 'openai';

export const search = async (req, res, next) => {
  try {
    // Extract the user input and chat history from the request body
    const { input, chatHistory } = req.body;

    console.log('Request body:', req.body);

    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API, // Ensure you use the correct environment variable
    });

    // Create messages array and add the chat history (if any) and user's message
    const messages = chatHistory || []; // Use the previous chat history if provided
    messages.push({ role: 'user', content: input });

    console.log('Messages:', messages);

    // Request completion from OpenAI
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: messages,
    });

    // Extract the AI's response
    const aiMessage = chatCompletion.choices[0]?.message?.content;

    // Add AI's response to the chat history
    messages.push({ role: 'assistant', content: aiMessage });

    // Send the AI's response and updated chat history back to the client
    res.json({ 
      message: aiMessage,
      chatHistory: messages, // Send updated chat history
      success: true,
    });
  } catch (error) {
    console.error('Error creating chat completion:', error); // Log error for debugging
    res.status(500).json({ error: 'Internal server error' }); // Send a 500 error response
  }
};
