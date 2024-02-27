import { EmbedBuilder } from "discord.js";
import axios from "axios";

export const subCommand = async (interaction) => {
  // let playerList = dataObj.playerList;
  const apiUrl: string = "http://localhost:8080/api/accounts/";
  const playerId: number = interaction.member.id;

  try {
    const { data } = await axios.get(apiUrl + playerId);
    const accountEmbedList: EmbedBuilder[] = [];

    //embed indicating riot accounts
    const riotHeaderEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor(0xff4553)
      .setTitle("Your riot account(s)");

    accountEmbedList.push(riotHeaderEmbed);

    if (data.riotAccountList.length === 0) {
      const noRiotAccountEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0xff4553)
        .setTitle("No riot accounts found");
      accountEmbedList.push(noRiotAccountEmbed);
    } else if (data.riotAccountList.length !== 0) {
      for (let riotAccountObj of data.riotAccountList) {
        const riotAccountEmbed: EmbedBuilder = new EmbedBuilder()
          .setTitle(riotAccountObj.riot_id)
          .addFields([
            { name: "Region:", value: riotAccountObj.region, inline: true },
            { name: "Rank:", value: riotAccountObj.rank, inline: true },
            {
              name: "Active:",
              value: riotAccountObj.active.toString(),
              inline: true,
            },
          ]);

        if (riotAccountObj.active) {
          riotAccountEmbed.setColor(0x3ba55b);
        } else if (!riotAccountObj.active) {
          riotAccountEmbed.setColor(0xec4245);
        }
        accountEmbedList.push(riotAccountEmbed);
      }
    }

    //embed indicating steam accounts
    const steamHeaderEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor(0x2a475e)
      .setTitle("Your steam account(s)");

    accountEmbedList.push(steamHeaderEmbed);

    if (data.steamAccountList.length === 0) {
      const noSteamAccountEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0x2a475e)
        .setTitle("No steam accounts found");
      accountEmbedList.push(noSteamAccountEmbed);
    } else if (data.steamAccountList.length > 0) {
      for (let steamAccountObj of data.steamAccountList) {
        const steamAccountEmbed: EmbedBuilder = new EmbedBuilder()
          .setTitle(steamAccountObj.account_name)
          .setFields({
            name: "LINK:",
            value: `[profile](${steamAccountObj.steam_profile_url})`,
          });

        if (steamAccountObj.active) {
          steamAccountEmbed.setColor(0x3ba55b);
        } else if (!steamAccountObj.active) {
          steamAccountEmbed.setColor(0x2a475e);
        }

        accountEmbedList.push(steamAccountEmbed);
      }
    }

    await interaction.reply({
      embeds: accountEmbedList,
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
    const alertEmbed = new EmbedBuilder()
      .setColor(0xff4553)
      .setTitle("Error")
      .setDescription(
        "You don't have any accounts linked to your discord account"
      );

    await interaction.reply({ embeds: [alertEmbed], ephemeral: true });
    return;
  }
};
