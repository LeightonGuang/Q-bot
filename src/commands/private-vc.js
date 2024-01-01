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

        let duo1 = member;
        let duo2 = interaction.options.getMember("duo");

        let duoCommand = require("../utils/private-vc/duo");
        duoCommand(interaction, duo1, duo2);

        break;

      case "trio":

        let trio1 = member;
        let trio2 = interaction.options.getMember("trio1");
        let trio3 = interaction.options.getMember("trio2");

        let trioCommand = require("../utils/private-vc/trio");
        trioCommand(interaction, trio1, trio2, trio3);

        break;

      case "quad":

        break;

      case "stack":

        break;
    }
  }
}