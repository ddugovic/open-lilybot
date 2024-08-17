// Import different modules.
const {Client, Intents} = require("discord.js");
const Collection = require("@discordjs/collection");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
// To access command files.
const fs = require("fs");
// Load the configuration.
const config = require("./config.example.json");
// Load any commands.
client.commands = new Collection.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
// To publish user and server counts.
const publisher = require('discord-lister');

console.log(client.commands.get('compile').usage(config));
