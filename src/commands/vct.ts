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
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("live-matches")
        .setDescription("Live Valorant Champion Tour matches.")
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("upcoming-matches")
        .setDescription("Upcoming Valorant Champions Tour matches.")
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("americas")
        .setDescription("VCT Americas teams")
        .addStringOption((option) =>
          option
            .setName("team")
            .setDescription("Select a team")
            .setChoices(
              { name: "Sentinels", value: "SEN" },
              { name: "Cloud9", value: "C9" },
              { name: "G2 Esports", value: "G2" },
              { name: "KRÜ Esports", value: "KRÜ" },
              { name: "NRG Esports", value: "NRG" },
              { name: "Leviatán", value: "LEV" },
              { name: "LOUD", value: "LOUD" },
              { name: "100 Thieves", value: "100T" },
              { name: "MIBR", value: "MIBR" },
              { name: "FUIRIA", value: "FUR" },
              { name: "Evil Geniuses", value: "EG" }
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("emea")
        .setDescription("VCT EMEA teams")
        .addStringOption((option) =>
          option
            .setName("team")
            .setDescription("Select a team")
            .setChoices(
              { name: "Karmine Corp", value: "KC" },
              { name: "FNATIC", value: "FNC" },
              { name: "Team Vitality", value: "VIT" },
              { name: "Team Liquid", value: "TL" },
              { name: "BBL Esports", value: "BBL" },
              { name: "Team Heretics", value: "TH" },
              { name: "Natus Vincere", value: "NAVI" },
              { name: "Movistar KOI", value: "KOI" },
              { name: "FUT Esports", value: "FUT" },
              { name: "Gentle Mates", value: "M8" },
              { name: "GIANTX", value: "GX" }
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("pacific")
        .setDescription("VCT Pacific teams")
        .addStringOption((option) =>
          option
            .setName("team")
            .setDescription("Select a team")
            .setChoices(
              { name: "DetonatioN FocusMe", value: "DFM" },
              { name: "DRX", value: "DRX" },
              { name: "Gen.G", value: "GEN" },
              { name: "Global Esports", value: "GE" },
              { name: "Paper Rex", value: "PRX" },
              { name: "Rex Regum Qeon", value: "RRQ" },
              { name: "T1", value: "T1" },
              { name: "Talon Esports", value: "TLN" },
              { name: "Team Secret", value: "TS" },
              { name: "ZETA DIVISION", value: "ZETA" },
              { name: "BLEED", value: "BLD" }
            )
            .setRequired(true)
        )
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
      case "live-matches": {
        const liveMatches = await import("../sub-commands/vct/live-matches.js");
        liveMatches.subCommand(interaction);
        break;
      }
      case "upcoming-matches": {
        const upcomingMatches = await import(
          "../sub-commands/vct/upcoming-matches.js"
        );
        upcomingMatches.subCommand(interaction);
        break;
      }
      case "americas": {
        const americas = await import("../sub-commands/vct/americas.js");
        americas.subCommand(interaction);
        break;
      }
      case "emea": {
        const emea = await import("../sub-commands/vct/emea.js");
        emea.subCommand(interaction);
        break;
      }
      case "pacific": {
        const pacific = await import("../sub-commands/vct/pacific.js");
        pacific.subCommand(interaction);
        break;
      }
    }
  },
};
