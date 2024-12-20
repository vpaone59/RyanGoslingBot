import { SlashCommandBuilder } from 'discord.js';

const TMDBAPIToken = process.env.TMDB_API_TOKEN;
const TMDBBaseURL = 'https://api.themoviedb.org/3';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDBAPIToken}`
    }
};

export const data = new SlashCommandBuilder()
    .setName('gosling-bio')
    .setDescription('Provides biography information about Ryan Gosling.');

export async function execute(interaction) {
    try {
        // Fetch Ryan Gosling's biography using his TMDB ID: 30614
        const urlPerson = `${TMDBBaseURL}/person/30614`;
        const searchResponse = await fetch(urlPerson, options);
        const searchData = await searchResponse.json();
        const ryanGoslingBio = searchData.biography;

        await interaction.reply(`**This is a biography not for just me, but for all of us.**\n${ryanGoslingBio}`);
    } catch (error) {
        console.error('Error fetching data:', error);
        await interaction.reply('There was an error fetching the biography information.');
    }
}