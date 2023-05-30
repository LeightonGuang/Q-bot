console.log(`
   ____    _           _   
  / __ \\  | |         | |  
 | |  | | | |__   ___ | |_ 
 | |  | | | '_ \\ / _ \\| __|
 | |__| | | |_) | (_) | |_ 
 \\ ___\\_\\ |_.__/ \\___/ \\__|
`);

const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { config } = require("dotenv");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates],
});
console.log("LOG: \t" + "new client created");

config();

const TOKEN = process.env.TOKEN;
console.log("LOG: \t" + ".env loaded");

//===========================================================
//dynamically import all commands from commands folder
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);

  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

let eventHandler = require("./handlers/eventHandler");
eventHandler(client);
client.login(TOKEN);

let messageHandler = require("./handlers/messageHandler");
messageHandler(client);

let commandHandler = require("./handlers/commandHandler");
commandHandler(client);

let vcStateHandler = require("./handlers/vcStateHandler");
vcStateHandler(client);

let vcInviteHandler = require("./handlers/vcInviteHandler");
vcInviteHandler(client);

let buttonHandler = require("./handlers/buttonHandler");
buttonHandler(client);

let autoDeleteVcHandler = require("./handlers/autoDeleteVcHandler");
autoDeleteVcHandler(client);
