module.exports = {
    name: "ping",
    description: "Ping!",
    execute(config, message, args) {
        message.channel.send("Pong.");
    },
};
