import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';

const url = `${process.env.DEADLOCK_API_BASEURL}/v2/heroes`;

export const data = new SlashCommandBuilder()
    .setName('deadlock')
    .setDescription('Fetches and displays heroes from the Deadlock API.');

export async function execute(interaction) {
    try {
        const response = await axios.get(url);
        const heroes = response.data.map(hero => hero.name).join('\n');
        await interaction.reply(`Heroes:\n${heroes}`);
    } catch (error) {
        console.error('Error fetching data:', error);
        await interaction.reply('There was an error fetching the heroes.');
    }
}