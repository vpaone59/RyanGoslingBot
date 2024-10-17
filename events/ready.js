const { Events } = require('discord.js');

/* 
 * This event will trigger once the client is ready to start working.
 */
module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
