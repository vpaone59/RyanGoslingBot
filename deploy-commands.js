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
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
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

// Create a new REST instance and set the token
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started removing old application (/) commands.');

        // Fetch all existing guild commands
        const existingGuildCommands = await rest.get(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
        );

        // Delete all existing guild commands
        for (const command of existingGuildCommands) {
            await rest.delete(
                Routes.applicationGuildCommand(process.env.CLIENT_ID, process.env.GUILD_ID, command.id)
            );
        }

        console.log('Successfully removed all old guild application (/) commands.');

        // Fetch all existing global commands
        const existingGlobalCommands = await rest.get(
            Routes.applicationCommands(process.env.CLIENT_ID)
        );

        // Delete all existing global commands
        for (const command of existingGlobalCommands) {
            await rest.delete(
                Routes.applicationCommand(process.env.CLIENT_ID, command.id)
            );
        }

        console.log('Successfully removed all old global application (/) commands.');

        // Deploy new commands
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();