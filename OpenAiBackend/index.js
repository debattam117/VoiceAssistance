import express  from "express"; 
import dotenv from "dotenv";
import cors from "cors";
// import OpenAI from 'openai';
// import readline from 'node:readline';
// import { stdin as input, stdout as output } from 'node:process';
import searchRouter from './Routes/searchRouter.js'

//Loading environment variable
dotenv.config({path:'./Config/config.env'})


const app = express();

//middleware
app.use(cors({
  origin:[process.env.FRONTEND_URL],
  methods:['GET','POST','DELETE','PUT']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/v1/search',searchRouter);

//Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port :${process.env.PORT}`);
});


















// console.log(process.env['OPENAI_API'])


// app.use('/api/v1/search',searchRouter);

// const rl = readline.createInterface({ input, output });
// const messages=[]

// const openai = new OpenAI({
//   apiKey: process.env['OPENAI_API'], // This is the default and can be omitted
// });

// async function main(input) {
//   try {
//     messages.push({role: 'user', content: input})
//     const chatCompletion = await openai.chat.completions.create({
//       messages: messages,
//       model: 'gpt-3.5-turbo',
//     });
    
//     console.log(chatCompletion.choices[0]?.message?.content); // Log the response data to the console
//   } catch (error) {
//     console.error('Error creating chat completion:', error); // Log any errors
//   }
// }


// rl.on('line', (input) => {
//   console.log(`Received: ${input}`);
//   main(input);
//   if(input==='q')
//   {
//     rl.close();
//   }
// }); 






// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API // Ensure you set your API key in an environment variable
// });


// async function generateImage(prompt) {
//   try {
//     const response = await openai.images.generate({
//       model: 'dall-e-3',
//       prompt: prompt,
//       size: '1024x1024',
//       quality: 'standard',
//       n: 1
//     });

//     // Extract the URL of the generated image
//     const imageUrl = response.data[0].url;
//     console.log('Generated Image URL:', imageUrl);

//     return imageUrl;
//   } catch (error) {
//     console.error('Error generating image:', error);
//     return null;
//   }
// }

// // Example usage
// const prompt = 'human eating burger'; // Replace with your desired prompt
// generateImage(prompt);
