module.exports.run = async (bot, message, args, db) => {
  if (args == "") db.collection("guilds").doc(message.guild.id).get().then((q) => {
    return message.channel.send(`My current prefix here is \`${q.data().prefix}\`.`);
  })
  else {
    let newPrefix = args[0];

    db.collection("guilds")
      .doc(message.guild.id)
      .update({
        prefix: newPrefix,
      })
      .then(() =>
        message.channel.send(`Set my prefix here to \`${newPrefix}\`!`)
      )
      .catch((e) => console.error(e));
  }
};

module.exports.help = {
  name: "prefix",
};
