const { SlashCommandBuilder } = require('discord.js');

const axios = require('axios');
const config = require('../../config.json');
const url = `${config.deadlock_api_baseURL}/v2/heroes`;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deadlock')
        .setDescription('Fetches and displays heroes from the Deadlock API.'),
    async execute(interaction) {
        try {
            const response = await axios.get(url);
            const heroes = response.data.map(hero => hero.name).join('\n');
            await interaction.reply(`Heroes:\n${heroes}`);
        } catch (error) {
            console.error('Error fetching data:', error);
            await interaction.reply('There was an error fetching the heroes.');
        }
    },
};