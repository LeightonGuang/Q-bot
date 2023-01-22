//command to make new roles or if roles are already made
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("setup roles for queue"),
  async execute(interaction) {
    let QueueRoleExist = interaction.guild.roles.cache.some(role => ["duo queue", "trio queue", "5 stack", "1v1", "10 mans"].includes(role.name));
    if (!QueueRoleExist) {
      await interaction.reply("Roles created");
      interaction.guild.roles.create({ name: "duo queue" });
      interaction.guild.roles.create({ name: "trio queue" });
      interaction.guild.roles.create({ name: "5 stack" });
      interaction.guild.roles.create({ name: "1v1" });
      interaction.guild.roles.create({ name: "10 mans" });

    } else {
      await interaction.reply("Roles already exist");
      console.log("LOG: \t Roles already exist");
    }
  },
};
