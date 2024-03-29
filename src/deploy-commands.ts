//ONLY DEPLOY WHEN COMMAND IS WORKING OR DONE

import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import fs from "node:fs";
import dotenv from "dotenv";
dotenv.config({ path: "../public/.env" });

config();

const TOKEN = process.env.TOKEN;
const GUILD_ID_LIST = process.env.GUILD_ID_LIST.split(",");
const CLIENT_ID = process.env.CLIENT_ID;
console.log("LOG: \t .env loaded");
console.log(`
TOKEN: ${TOKEN}
GUILD_ID_LIST: ${GUILD_ID_LIST}
CLIENT_ID: ${CLIENT_ID}
`);

for (let GUILD_ID of GUILD_ID_LIST) {
  const commands = [];
  // Grab all the command files from the commands directory you created earlier
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    let command: any = await import(`./commands/${file}`);
    command = command.data;
    console.log("| ✅ | " + file);
    commands.push(command.data.toJSON());
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  // and deploy your commands!
  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );

      // The put method is used to fully refresh all commands in the guild with the current set
      const data: any = await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
      );

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  })();
}
