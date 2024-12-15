import { Events } from 'discord.js';

/* 
 * This event will trigger once the client is ready to start working.
 */
export const name = Events.ClientReady;
export const once = true;
export const execute = (client) => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
};