import { EmbedBuilder } from "discord.js";

export const handler = async (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    const splittedArray: string[] = interaction.customId.split("-");

    //if it is not a help select menu then end this code file
    if (splittedArray[0] !== "help") return;

    const menuSubCommand: string = interaction.values[0];

    switch (menuSubCommand) {
      case "help": {
        const helpEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0xffffff)
          .setAuthor({ name: "Q bot" })
          .setTitle("/help")
          .setDescription(
            "All the commands that are available to use in the server"
          )
          .addFields(
            {
              name: "/account [***sub-command***]",
              value: "Set up and manage your accounts",
            },
            {
              name: "/valorant [***sub-command***]",
              value: "Commands for Valorant related stuff",
            },
            {
              name: "/vct [***sub-command***]",
              value: "Commands for VCT related stuff",
            },
            {
              name: "/cs2-event [***sub-command***]",
              value: "Get any tier 1 csgo event",
            },
            {
              name: "/gamble [***sub-command***]",
              value: "Commands for gambling",
            },
            {
              name: "/private-vc [***sub-command***]",
              value: "Creates a private vc for you and the people you want",
            },
            {
              name: "/minecraft [***sub-command***]",
              value: "Commands for minecraft",
            },
            { name: "/poll", value: "Make a poll" },
            { name: "/coin-flip", value: "Flip a coin" },
            { name: "/vro-font", value: "Convert your text to a vro font" },
            { name: "/ping", value: "Ping the bot to check online status" },
            {
              name: "/credit",
              value: "The people who contributed to this server",
            }
          )
          .setTimestamp();

        interaction.message.edit({ embeds: [helpEmbed] });
        console.log("LOG:\t" + "changed the /help command embed to helpEmbed");
        await interaction.deferUpdate();
        break;
      }

      case "account": {
        const accountEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0xffff00)
          .setAuthor({ name: "Q bot" })
          .setTitle("/account ***sub-command***")
          .setDescription("List of all sub commands available for `/account`")
          .addFields(
            {
              name: "***add-riot-account***",
              value: "Add a riot account with riot id, rank and region.",
            },
            {
              name: "***add-steam-account***",
              value:
                "Add a steam account with account name, friend code and profile url.",
            },
            {
              name: "***edit-riot-account***",
              value: "Edit your riot id, rank, region.",
            },
            {
              name: "***edit-steam-account***",
              value: "Edit your account name, friend code and profile url.",
            },
            {
              name: "***list-all***",
              value: "List al the accounts you have added to Qs",
            },
            {
              name: "***select***",
              value:
                "If you have multiple accounts, you can select which account to queue with.",
            }
          )
          .setTimestamp();

        interaction.message.edit({ embeds: [accountEmbed] });
        console.log(
          "LOG:\t" + "changed the /help command embed to accountEmbed"
        );
        await interaction.deferUpdate();
        break;
      }

      case "valorant": {
        const valorantEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0xff4553)
          .setAuthor({ name: "Q bot" })
          .setTitle("/valorant ***sub-command***")
          .setDescription("List of all sub commands availble for `/valorant`")
          .addFields(
            {
              name: "***check-rank***",
              value: "Get your current rank and peak rank",
            },
            {
              name: "***last-game-stats***",
              value: "Get your last game stats",
            },
            {
              name: "***win-percentage***",
              value: "Get your current act rank win percentage",
            },
            {
              name: "***map-win-percentage***",
              value: "Get your maps win percentage",
            }
          )
          .setTimestamp();

        interaction.message.edit({ embeds: [valorantEmbed] });
        console.log(
          "LOG:\t" + "changed the /help command embed to valorantEmbed"
        );
        await interaction.deferUpdate();
        break;
      }

      case "vct": {
        const vctEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0x9464f5)
          .setAuthor({ name: "VCT" })
          .setTitle("/vct ***sub-command***")
          .setDescription("List of all sub commands availble for `/vct`")
          .addFields(
            {
              name: "***live-matches***",
              value: "Get VCT matches that are live right now",
            },
            {
              name: "***upcoming-matches***",
              value: "Get upcoming VCT matches",
            },
            { name: "***ongoing-events***", value: "Get ongoing VCT events" },
            { name: "***upcoming-events***", value: "Get upcoming VCT events" },
            {
              name: "***americas, emea, pacific and china***",
              value: "Select any teams to get their upcoming matches",
            }
          );

        interaction.message.edit({ embeds: [vctEmbed] });
        console.log("LOG:\t" + "changed the /help command embed to vctEmbed");
        await interaction.deferUpdate();
        break;
      }

      case "gamble": {
        const gambleEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0xffd700)
          .setAuthor({ name: "Q bot" })
          .setTitle("/gamble ***sub-command***")
          .setDescription("List of all sub commands availble for `/gamble`")
          .addFields(
            {
              name: "***slots***",
              value: "Play slots",
            },
            { name: "***rules***", value: "Gamble rules" }
          )
          .setTimestamp();

        interaction.message.edit({ embeds: [gambleEmbed] });
        console.log(
          "LOG:\t" + "changed the /help command embed to gambleEmbed"
        );
        await interaction.deferUpdate();
        break;
      }

      case "cs2-event": {
        const cs2EventEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0xf6af06)
          .setAuthor({ name: "Q bot" })
          .setTitle("/cs2-event ***sub-command***")
          .setDescription("List of all sub commands availble for `/cs2-event`")
          .addFields(
            {
              name: "***ongoing-events***",
              value: "Get ongoing cs2 events",
            },
            { name: "***upcoming-events***", value: "Get upcoming cs2 events" }
          )
          .setTimestamp();
        interaction.message.edit({ embeds: [cs2EventEmbed] });
        console.log(
          "LOG:\t" + "changed the /help command embed to cs2EventEmbed"
        );
        await interaction.deferUpdate();
        break;
      }

      case "private-vc": {
        const privateVcEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0x7dd181)
          .setAuthor({ name: "Q bot" })
          .setTitle("/private-vc ***sub-command***")
          .setDescription("List of all sub commands availble for `/valorant`")
          .addFields(
            { name: "***duo***", value: "Select a duo to private vc with" },
            { name: "***trio***", value: "Select 2 trios to private vc with" },
            { name: "***quad***", value: "Select 3 people to private vc with" },
            { name: "***stack***", value: "Select 4 people to private vc with" }
          )
          .setTimestamp();

        interaction.message.edit({ embeds: [privateVcEmbed] });
        console.log(
          "LOG:\t" + "changed the /help command embed to valorantEmbed"
        );
        await interaction.deferUpdate();
        break;
      }

      case "minecraft": {
        const minecraftEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0x52a535)
          .setAuthor({ name: "Q bot" })
          .setTitle("/minecraft ***sub-command***")
          .setDescription("List of all sub commands availble for `/minecraft`")
          .addFields(
            { name: "***server-on***", value: "Turn minecraft server on" },
            { name: "***server-status***", value: "Check server status" },
            {
              name: "***players-online***",
              value: "Check who is online in the server",
            }
          )
          .setTimestamp();
        interaction.message.edit({ embeds: [minecraftEmbed] });
        console.log(
          "LOG:\t" + "changed the /help command embed to minecraftEmbed"
        );
        await interaction.deferUpdate();
        break;
      }
      case "football": {
        const footballEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0x00ffff)
          .setAuthor({ name: "Q bot" })
          .setTitle("/football ***sub-command***")
          .setDescription("List of all sub commands availble for `/football`")
          .addFields({
            name: "***league-fixtures***",
            value: "Get league fixtures",
          })
          .setTimestamp();
        interaction.message.edit({ embeds: [footballEmbed] });
        console.log(
          "LOG:\t" + "changed the /help command embed to footballEmbed"
        );
        await interaction.deferUpdate();
        break;
      }
    }
  });
};
