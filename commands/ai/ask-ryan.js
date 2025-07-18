import { SlashCommandBuilder } from 'discord.js';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL;
const AI_MODEL = process.env.AI_MODEL || 'llama2:7b-chat'; // Default model if not specified
const AI_SYSTEM_PROMPT = process.env.AI_SYSTEM_PROMPT;

export const data = new SlashCommandBuilder()
    .setName('ask-ryan')
    .setDescription('Ask Ryan Gosling a question using AI.')
    .addStringOption(option =>
        option.setName('question')
            .setDescription('The question you want to ask Ryan Gosling')
            .setRequired(true));

export async function execute(interaction) {
    const question = interaction.options.getString('question');

    try {
        // Defer the reply since AI responses might take time
        await interaction.deferReply();

        // Send the question to the Ollama API
        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: AI_MODEL,
                prompt: question,
                system: AI_SYSTEM_PROMPT,
                stream: false
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Discord has a 2000 character limit for messages
        const truncatedResponse = data.response.length > 1900
            ? data.response.substring(0, 1900) + '...'
            : data.response;

        await interaction.editReply({ content: truncatedResponse });
    } catch (error) {
        console.error('Error fetching AI response:', error);
        await interaction.editReply({ content: 'Something went wrong while I was thinking about that. Try asking me again later.' });
    }
}