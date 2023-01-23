const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dequeue")
    .setDescription("remove you from queue"),
  async execute(interaction) {
    let rolesToRemove = ["duo queue", "trio queue", "5 stack", "1v1", "10 mans"];
    rolesToRemove.forEach(roleName => {
      let role = interaction.guild.roles.cache.find(role => role.name === roleName);
      interaction.member.roles.remove(role);
    });
    await interaction.reply("You are removed from queue");
    console.log("LOG: \t You are removed from queue");
  },
};
