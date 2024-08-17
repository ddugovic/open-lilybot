module.exports = {
    name: "privacy",
    description: "View privacy policy",
    execute(config, message, args) {
        message.channel.send(`This bot does not store any data. Contact <@${config.ownerId}> if you have questions.`);
    },
};
