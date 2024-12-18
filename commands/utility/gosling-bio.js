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
        const urlPerson = `${TMDBBaseURL}/search/person?api_key=${TMDBAPIToken}&query=Ryan%20Gosling`;

        // Search for Ryan Gosling
        const searchResponse = await fetch(urlPerson, options);
        const searchData = await searchResponse.json();
        const ryanGosling = searchData.results.find(person => person.name === 'Ryan Gosling');

        if (!ryanGosling) {
            await interaction.reply('Could not find Ryan Gosling. That\'s like, a problem.');
            return;
        }

        // Set biography information
        const ryanBio = {
            name: ryanGosling.name,
            popularity: ryanGosling.popularity,
        }
        console.log(ryanBio);

        await interaction.reply(`${ryanBio.name} has a popularity rating of ${ryanBio.popularity}.`);
    } catch (error) {
        console.error('Error fetching data:', error);
        await interaction.reply('There was an error fetching the biography information.');
    }
}