import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import dotenv from "dotenv";
dotenv.config({ path: "../public/.env" });

config();

const TOKEN = process.env.TOKEN;
const GUILD_ID_LIST = process.env.GUILD_ID_LIST.split(",");
const CLIENT_ID = process.env.CLIENT_ID;

console.log("LOG: \t .env loaded");
const rest = new REST({ version: "10" }).setToken(TOKEN);

for (let GUILD_ID of GUILD_ID_LIST) {
  // for guild-based commands
  rest
    .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] })
    .then(() =>
      console.log("Successfully deleted all commands from " + GUILD_ID)
    )
    .catch(console.error);
}

// for global commands
rest
  .put(Routes.applicationCommands(CLIENT_ID), { body: [] })
  .then(() => console.log("Successfully deleted all application commands."))
  .catch(console.error);
