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
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config({ path: "../public/.env" });

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

const TOKEN: string = process.env.TOKEN;
console.log("LOG: \t" + ".env loaded");

//===========================================================
//dynamically import all commands from commands folder
client.commands = new Collection();

const commandsPath = dirname(fileURLToPath(import.meta.url)) + "/commands";
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  let command: any = await import(filePath);
  command = command.data;
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// ==========================import handlers======================

let eventHandler: any = await import("./handlers/eventHandler.js");
eventHandler = eventHandler.data(client);

client.login(TOKEN);

let commandHandler: any = await import("./handlers/commandHandler.js");
commandHandler = commandHandler.data(client);

let buttonHandler: any = await import(
  "./handlers/buttonHandler/buttonHandler.js"
);
buttonHandler = buttonHandler.handler(client);

let stringSelectMenuHandler: any = await import(
  "./handlers/stringSelectMenuHandler/stringSelectMenuHandler.js"
);
stringSelectMenuHandler =
  stringSelectMenuHandler.stringSelectMenuHandler(client);

let wordleHandler: any = await import("./handlers/wordleHandler.js");
wordleHandler = wordleHandler.wordleHandler(client);

//announce the bot is going offline
process.on("SIGINT", async () => {
  const annoucmentChannel = await client.channels.fetch("1210495684575498271");

  await annoucmentChannel.messages.edit(
    "1210496026918789130",
    "Bot is offline"
  );
  console.log("\nLOG: \t" + "Bot is offline");

  client.destroy();
  process.exit();
});
