//command to make new roles or if roles are already made
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("setup roles for queue"),
  async execute(interaction) {
    let QueueRoleExist = interaction.guild.roles.cache.some(role => ["duo rank", "trio rank", "5 stack rank", "1v1", "10 mans", "unrated"].includes(role.name));
    if (!QueueRoleExist) {
      await interaction.reply("Roles created");
      interaction.guild.roles.create({ name: "duo rank" });
      interaction.guild.roles.create({ name: "trio rank" });
      interaction.guild.roles.create({ name: "5 stack rank" });
      interaction.guild.roles.create({ name: "1v1" });
      interaction.guild.roles.create({ name: "10 mans" });
      interaction.guild.roles.create({ name: "unrated" });

    } else {
      await interaction.reply("Roles already exist");
      console.log("LOG: \t Roles already exist");
    }
  },
};
