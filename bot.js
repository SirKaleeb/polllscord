if (process.env.NODE_VER !== "production") require("dotenv").config();

// require packages
const Discord = require("discord.js");
const fs = require("fs");

// initialise are bot
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

// import bot setting (data)
let prefix = "p!";
const token = process.env.BOT_TOKEN;

// initialize databsae
const firebase = require("firebase/app");
const FieldValue = require("firebase-admin").firestore.FieldValue;
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

let db = admin.firestore();

//read commands files
fs.readdir("./cmds", (err, files) => {
  if (err) {
    console.log(err);
  }

  let cmdFiles = files.filter((f) => f.split(".").pop() === "js");

  if (cmdFiles.length === 0) {
    console.log("No files found");
    return;
  }

  cmdFiles.forEach((f, i) => {
    let props = require(`./cmds/${f}`);
    console.log(`${i + 1}: ${f} loaded`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {
  console.log("Bot is running!");
});

bot.on("message", (msg) => {
  db.collection("guilds")
    .doc(msg.guild.id)
    .get()
    .then((q) => {
      if (q.exists) prefix = q.data().prefix;
    })
    .then(() => {
      if (msg.channel.type === "dm") return;
      if (msg.author.bot) return;

      let msg_array = msg.content.split(" ");
      let command = msg_array[0];
      let args = msg_array.slice(1);

      if (!command.startsWith(prefix)) return;

      if (bot.commands.get(command.slice(prefix.length))) {
        let cmd = bot.commands.get(command.slice(prefix.length));
        if (cmd) {
          cmd.run(bot, msg, args, db);
        }
      }
    });
});

bot.on("guildCreate", async (data) => {
  db.collection("guilds").doc(data.id).set({
    guild_id: data.id,
    prefix: "p!",
    polls: []
  });
});

// Bot login
bot.login(token);
