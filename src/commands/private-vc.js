const { SlashCommandBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("private-vc")
    .setDescription("create a private vc")
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("duo")
        .setDescription("Select a duo to private vc with")
        .addUserOption((option) =>
          option
            .setName("duo")
            .setDescription("duo partner")
            .setRequired(true))
    )
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("trio")
        .setDescription("Select 2 trios to private vc with")
        .addUserOption((option) =>
          option
            .setName("trio1")
            .setDescription("trio1")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("trio2")
            .setDescription("trio2")
            .setRequired(true)
        ),

    )
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("quad")
        .setDescription("Select 3 people to private vc with")
        .addUserOption((option) =>
          option
            .setName("quad1")
            .setDescription("quad1")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("quad2")
            .setDescription("quad2")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("quad3")
            .setDescription("quad3")
            .setRequired(true)
        )
    )
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("stack")
        .setDescription("Select 4 people to private vc with")
        .addUserOption((option) =>
          option
            .setName("stack1")
            .setDescription("stack1")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("stack2")
            .setDescription("stack2")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("stack3")
            .setDescription("stack3")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("stack4")
            .setDescription("stack4")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const { member, guild } = interaction;

    let subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "duo":

        let member1 = member;
        let member2 = interaction.options.getMember("duo");

        let duo = require("../utils/private-vc/duo");
        duo(interaction, member1, member2);

        break;

      case "trio":

        break;

      case "quad":

        break;

      case "stack":

        break;
    }
  }
}