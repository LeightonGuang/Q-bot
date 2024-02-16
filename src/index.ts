console.log(`
   ____    _           _   
  / __ \\  | |         | |  
 | |  | | | |__   ___ | |_ 
 | |  | | | '_ \\ / _ \\| __|
 | |__| | | |_) | (_) | |_ 
 \\ ___\\_\\ |_.__/ \\___/ \\__|
`);

import fs from "fs";
import path from "node:path";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";

const client: any = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
console.log("LOG: \t" + "new client created");

config();

const TOKEN = process.env.TOKEN;
console.log("LOG: \t" + ".env loaded");

//===========================================================
//dynamically import all commands from commands folder
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

let commandHandler = require("./handlers/commandHandler");
commandHandler(client);

//announce the bot is going offline
process.on("SIGINT", async () => {
  const annoucmentChannel = await client.channels.fetch("1077779475175059506");

  await annoucmentChannel.send("Bot is offline");
  console.log("\nLOG: \t" + "Bot is offline");

  client.destroy();
  process.exit();
});
