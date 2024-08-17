// Import different modules.
const {Client, Intents} = require("discord.js");
const Collection = require("@discordjs/collection");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
// To access command files.
const fs = require("fs");
// Load the configuration.
const config = require("./config.json");
// Load any commands.
client.commands = new Collection.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
// To publish user and server counts.
const publisher = require('discord-lister');

// Read the token and display it. The extra stuff after .toString() is to ensure that only the first line is used, the one which hopefully has the token.
client.login(config.token);

// Confirm that the bot is ready to be used.
client.once("ready", async () => {
    console.log("Ready.");
    await client.user.setActivity(`"${config.prefix} help" for help`, { type: "PLAYING", status: "idle" });
    console.log("Set activity.");
});

client.on("messageCreate", message => {
    // Do not reply to the message if it doesn't start with the prefix or if it was sent by a bot.
    if (!message.content.startsWith(config.prefix) || message.author.bot) {
        return;
    }
    
    // Remove the prefix from the message.
    const realMessage = message.content.slice(config.prefix.length+1);
    
    // Create a commandName variable that will hold the name of the command.
    let commandName = "";
    // Create array that holds the parts of the user's message.
    let args = [];

    // Do the following if there is a code block.
    if(realMessage.includes("```")) {
        // Split the message by the code block (```)
        args = realMessage.split("```");

        // If there's no command specified, assume compile.
        commandName = "compile"
    }
    // Otherwise, separate the message into the command and its arguments.
    else {
        args = realMessage.split(" ");
        commandName = args.shift();
    }

    // "command" is the command itself and the code attatched to it.
    // This line will look for that command or if that doesn't exit, and command whose aliases includes the entered command name.
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // If the command doesn't exist, inform the user and stop.
    if (!command) {
        message.channel.send("That command doesn't exist.");
        return;
    }
    
    // The command.args part checks whether arguments need to be specified. Because args is a part of command, this if is only called when needed.
    if (command.args && !args.length) {
        let reply = `Error, no arguments provided.`;

        if (command.usage) {
            reply += `\n**Usage:** ${command.usage(config)}`;
        }
        if (command.options) {
            reply += `\n**Options:** ${command.options}`;
        }

        return message.channel.send(reply);
    }

    // Otherwise, try to run the command.
    try {
        command.execute(config, message, args);
    }
    catch (error) {
        console.error(error);
        message.reply("There was an error trying to execute that command. More information has been written to the terminal.");
    }
});

function publish(config, client) {
    console.log(`${client.users.cache.size} users, in ${client.guilds.cache.size} servers connected.`);
    let settings = {
	listings: {
		// tokens for sites here
		// leave blank or remove site if not posting to that site
		topgg: config.topggtoken,
		discordbotsgg: config.discordbotsggtoken,
		discordboats: config.discordboatstoken,
		botsondiscord: config.botsondiscordtoken,
		botsfordiscord: config.botsfordiscordtoken,
		botlistspace: config.botlistspacetoken,
		topcord: config.topcordtoken,
		discordextremelist: config.discordextremelisttoken,
		discordbotlist: config.discordbotlisttoken,
		sentcord: config.sentcordtoken,
		dbotsco: config.dbotscotoken,
		discordlabs: config.discordlabstoken,
		blist: config.blisttoken
	},
	// the following is required
	clientid: client.user.id,
	servercount: client.guilds.cache.size,
	shardscount: 1,
	shardsid: 0,
	usercount: client.users.cache.size,
	output: config.debug
    }
    publisher.post(settings)
}

setInterval(publish, 1800000, config, client);

