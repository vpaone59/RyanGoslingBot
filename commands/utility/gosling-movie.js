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
    .setName('gosling-movie')
    .setDescription('Provides information about a random Ryan Gosling movie.');

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

        // Get Ryan Gosling's movie credits
        const urlMovies = `${TMDBBaseURL}/person/${ryanGosling.id}/movie_credits?api_key=${TMDBAPIToken}`;
        const creditsResponse = await fetch(urlMovies, options);
        const creditsData = await creditsResponse.json();
        const movies = creditsData.cast;

        if (movies.length === 0) {
            await interaction.reply('Ryan Gosling has no movie credits.');
            return;
        }

        // Select a random movie and return its details
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        const movieDetails = `**${randomMovie.title}** (${randomMovie.release_date})\n${randomMovie.overview}`;

        await interaction.reply(movieDetails);
    } catch (error) {
        console.error('Error fetching data:', error);
        await interaction.reply('There was an error fetching the movie information.');
    }
}