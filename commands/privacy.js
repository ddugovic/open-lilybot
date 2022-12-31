const { ownerId } = require('../config.json');

const message = `This bot does not store any data. Contact <@${ownerId}> if you have questions.`;

function process(bot, msg, username) {
    msg.channel.send(message);
}

function reply(interaction) {
    return message;
}

module.exports = { process, reply };
