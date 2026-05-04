const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const config = require('./config.js');
const { commands, handleInteraction } = require('./commands.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

async function registerCommands() {
    const rest = new REST({ version: '10' }).setToken(config.TOKEN);
    try {
        await rest.put(
            Routes.applicationCommands(config.CLIENT_ID),
            { body: commands }
        );
        console.log('[SYSTEM] Commands registered');
    } catch (error) {
        console.error('[ERROR] Command registration failed:', error);
    }
}

client.once('ready', () => {
    console.log(`[READY] Logged in as ${client.user.tag}`);
    registerCommands();

    const statusTypeMap = {
        'Playing': 0, 'Streaming': 1, 'Listening': 2, 'Watching': 3, 'Competing': 5
    };

    client.user.setPresence({
        activities: [{ 
            name: config.BOT_STATUS.TEXT, 
            type: statusTypeMap[config.BOT_STATUS.TYPE] || 0 
        }],
        status: config.BOT_STATUS.STATE.toLowerCase()
    });
});

client.on('interactionCreate', async interaction => {
    await handleInteraction(interaction);
});

client.login(config.TOKEN).catch(err => {
    console.error('[ERROR] Login failed:', err.message);
});
