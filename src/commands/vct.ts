import { SlashCommandBuilder } from "discord.js";

export const data = {
  data: new SlashCommandBuilder()
    .setName("vct")
    .setDescription("Commands for VCT related")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ongoing-events")
        .setDescription("Ongoing Valorant Champions Tour events.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("upcoming-events")
        .setDescription("Upcoming Valorant Champions Tour events.")
    ),

  async execute(interaction) {
    console.log("FILE:\t" + "vct.js");

    const subCommand: string = interaction.options.getSubcommand();
    switch (subCommand) {
      case "ongoing-events": {
        const ongoingEvents = await import(
          "../sub-commands/vct/ongoing-events.js"
        );
        ongoingEvents.subCommand(interaction);
        break;
      }
      case "upcoming-events": {
        const upcomingEvents = await import(
          "../sub-commands/vct/upcoming-events.js"
        );
        upcomingEvents.subCommand(interaction);
        break;
      }
    }
  },
};
