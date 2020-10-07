module.exports.run = async (bot, message, args, db) => {
  return message.channel.send("This command is being worked on.");
}

module.exports.help = {
  name: "help"
}