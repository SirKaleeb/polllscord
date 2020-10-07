const Discord = require("discord.js");

module.exports.run = async (bot, message, args, db) => {
  await message.channel.send("What would you like to update?\n```- title```");

  const collector = new Discord.MessageCollector(
    message.channel,
    (m) => m.author.id === message.author.id
  );

  const Poll = {
    title: null,
    options: [],
  };

  collector.on("collect", async (message, col) => {
    let value = message.content,
      cmd = value.toLowerCase(),
      task = null,
      title_exists = exists(Poll.title);

    if (exists(task)) {
      
    } else {
      if (cmd === "title") {
        task = "title";
        return message.channel.send(
          "What would you like your poll's title to be?"
        );
      } else
        return message.channel.send(
          `That is not a valid value, please try one of these:\`\`\`${
            title_exists ? "" : `- title`
          }\n\`\`\``
        );
    }
  });
};

module.exports.help = {
  name: "create",
};

function exists(v) {
  return v !== null && v !== undefined;
}
