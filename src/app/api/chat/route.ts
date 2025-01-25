import { groq } from '@ai-sdk/groq'; // Ensure this package is installed
import { generateText, streamText, smoothStream } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone';
import { getEmbedding } from '~/utils/embeddings';
import { type ConvertibleMessage } from '~/utils/types';

// Define a type for the expected request body structure
interface RequestBody {
  messages: ConvertibleMessage[];
}

export async function POST(req: Request): Promise<Response> {
  try {
    console.log('Welcome to AI');

    // Parse the request JSON with explicit typing
    const body = await req.json() as RequestBody;

    // Validate the request body
    if (!body.messages || body.messages.length === 0) {
      throw new Error('No messages provided');
    }

    const lastMessage = body.messages[body.messages.length - 1];
    if (!lastMessage?.content) {
      throw new Error('No valid last message found');
    }

    const query = lastMessage.content;
    console.log('Query:', query);

    // Initialize Pinecone
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY ?? '',
    });

    // Get embeddings for the query
    const queryEmbedding = await getEmbedding(query);
    console.log('Query Embedding:', queryEmbedding);

    // Query Pinecone for relevant context
    const index = pinecone.index('dwm');
    const queryResponse = await index.namespace('').query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    console.log('Pinecone Query Response:', JSON.stringify(queryResponse, null, 2));

    // Validate Pinecone response
    if (!queryResponse.matches || queryResponse.matches.length === 0) {
      throw new Error('No relevant context found in Pinecone');
    }

    // Construct context from Pinecone results
    const context = queryResponse.matches
      .map((match) => `Book: ${String(match.metadata?.book ?? 'Unknown')}\nPage: ${String(match.metadata?.page_number ?? 'Unknown')}\nText: ${String(match.metadata?.text ?? '')}`)
      .join('\n\n');

    console.log('Context:', context);

    // Construct the final prompt for Groq
    const finalPrompt = `
Context: ${context}
Question: ${query}
Please provide a comprehensive and detailed answer to the user's query and cite the book name at the end of the response.
`;

    console.log('Final Prompt:', finalPrompt);

    // Generate the response using Groq
    try {
      const result =  streamText({
        model: groq('gemma2-9b-it'), // Ensure this model name is valid
        system: `
          You are an expert assistant named SphereAI designed to provide accurate, detailed, and structured answers to user queries. Your task is to answer questions based on the provided context. Follow these guidelines:
      
          1. **Role**: Act as a knowledgeable and helpful assistant.
          2. **Task**: Answer user questions clearly and concisely.
          3. **Output Format**:
             - Start with a brief summary of the answer.
             - Use headings and bullet points for clarity.
             - Provide step-by-step explanations where applicable.
             - Keep paragraphs short and easy to read.
          4. **Context Handling**:
             - Use the provided context to generate answers.
             - If the context is insufficient, state that you don't have enough information.
          5. **Tone and Style**:
             - Use a professional and friendly tone.
             - Avoid overly technical jargon unless requested.
          6. **Error Handling**:
             - If the query is unclear, ask for clarification before answering.
          7. **Citations**:
             - Always cite the source of your information at the end of your response, if applicable.
      
          Your goal is to ensure the user receives accurate, well-structured, and helpful answers.
        `,
        prompt: finalPrompt,
        experimental_transform: smoothStream(),
      });

      // Return the response as JSON
      return result.toDataStreamResponse(); // Ensure this is called correctly
    } catch (error) {
      console.error('Error during streamText:', error);
      return new Response(
        JSON.stringify({ error: 'An error occurred while generating the response', details: error instanceof Error ? error.message : 'Unknown error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error: unknown) {
    console.error('Error in chat route:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request', details: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
