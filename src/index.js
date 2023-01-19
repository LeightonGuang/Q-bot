console.log(`
  _____   ___          _______   __  ____   ___ _______
 |  __ \\ / _ \\   /\\   |  __ \\ \\ / / |  _ \\ / _ \\__   __|
 | |__) | | | | /  \\  | |  | \\ V /  | |_) | | | | | |
 |  _  /| | | |/ /\\ \\ | |  | |> <   |  _ <| | | | | |
 | | \\ \\| |_| / ____ \\| |__| / . \\  | |_) | |_| | | |
 |_|  \\_\\\\___/_/    \\_\\_____/_/ \\_\\ |____/ \\___/  |_|
`);

const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const { config } = require('dotenv');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});
console.log("LOG: \t new client created");

config();

const TOKEN = process.env.TOKEN;
console.log("LOG: \t .env loaded");

//===========================================================
//dynamically import all commands from commands folder
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);

  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}
//===========================================================
client.on("ready", () => {
  console.log(`
=========================================
  R0ADX B0T is ONLINE as ${client.user.tag}
=========================================
  `);

  client.user.setPresence({
    activities: [{ name: "you on cctv", type: ActivityType.Watching }],
    status: "Hacking",
  });
});

client.login(TOKEN);
//=====================================================================

client.on("messageCreate", (message) => {
  if (!message.author.bot) {
    let today = new Date();
    let date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + " " + time;
    console.log(`${dateTime} \t Server: ${message.guild.name} \t Channel: ${message.channel.name} \t User: ${message.author.tag} \nMessage: ${message.content}`);
  }

  if (message.content === "/guild-id") {
    message.reply("Guild id: " + message.guild.id);
    console.log("Guild id: " + message.guild.id);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  //if interaction is a command
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.log(`No ${interaction.commandName} found`);
    return;
  }

  try {
    await command.execute(interaction);
    console.log("interaction: " + interaction.commandName);
  } catch (error) {
    console.log(error);
    await interaction.reply({ content: "Error executing command", ephemeral: true });
  }
});