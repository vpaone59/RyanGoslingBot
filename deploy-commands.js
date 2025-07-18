import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

/**
 * This script deploys slash commands to a Discord application.
 * It removes all old slash commands (both guild-specific and global) before syncing the new ones.
 */

// Array to hold the command data
const commands = [];

// Path to the commands folder
const foldersPath = path.join(__dirname, 'commands');

// Read all command folders
const commandFolders = fs.readdirSync(foldersPath);

// Loop through each command folder and read command files
for (const folder of commandFolders) {
    // Grab all the command files from the commands directory
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // Deploy commands globally
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        // Guild specific commands can be deployed like this:
        // The put method is used to fully refresh all commands in the guild with the current set
        // const data = await rest.put(
        //     Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        //     { body: commands },
        // );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();