const { EmbedBuilder } = require("discord.js");
module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    const splittedArray = interaction.customId.split('-');

    //if it is not a help select menu then end this code file
    if (splittedArray[0] !== "help") return;

    let menuSubCommand = interaction.values[0];

    switch (menuSubCommand) {
      case "help":
        const helpEmbed = new EmbedBuilder()
          .setColor(0xffffff)
          .setAuthor({ name: "Q bot" })
          .setTitle("/help")
          .setDescription("All the commands that are available to use in the server")
          .addFields(
            { name: "/ping", value: "Ping the bot to check online status" },
            { name: "/setup", value: "Create roles for queue" },
            { name: "/duo, /trio, /quad, /stack ", value: "Creates a private vc for you and the people you want" }
          )
          .setTimestamp()

        interaction.message.edit({ embeds: [helpEmbed] });
        await interaction.deferUpdate();
        break;

      case "account":
        const accountEmbed = new EmbedBuilder()
          .setColor(0xFFFF00)
          .setAuthor({ name: "Q bot" })
          .setTitle("/account ***sub-command***")
          .setDescription("List of all sub commands available for /account")
          .addFields(
            { name: "***add-riot-account***", value: "Add a riot account with riot id, rank and region." },
            { name: "***add-steam-account***", value: "Add a steam account with account name, friend code and profile url." },
            { name: "***edit-riot-account***", value: "Edit your riot id, rank, region." },
            { name: "***edit-steam-account***", value: "Edit your account name, friend code and profile url." },
            { name: "***list-all***", value: "List al the accounts you have added to Qs" },
            { name: "***select***", value: "If you have multiple accounts, you can select which account to queue with." }
          )
          .setTimestamp()

        interaction.message.edit({ embeds: [accountEmbed] });
        await interaction.deferUpdate();
        break;

      case "valorant":
        const valorantEmbed = new EmbedBuilder()
          .setColor(0xFF4553)
          .setAuthor({ name: "Q bot" })
          .setTitle("/valorant ***sub-command***")
          .setDescription("List of all sub commands availble for /valorant")
          .addFields(
            { name: "***check-rank***", value: "Check current rank and peak rank" },
            { name: "***last-game-stats***", value: "Check a player's last game stats" },
            { name: "***win-percentage***", value: "Check your current act rank win percentage" },
            { name: "***upcoming-events***", value: "Upcoming Valorant Champions Tour events" },
            { name: "***ongoing-events***", value: "Ongoing Valorant Champions Tour events" }
          )
          .setTimestamp()

        interaction.message.edit({ embeds: [valorantEmbed] });
        await interaction.deferUpdate();
        break;
    }
  })
}
