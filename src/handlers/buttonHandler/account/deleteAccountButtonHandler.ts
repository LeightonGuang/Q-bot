import { EmbedBuilder } from "discord.js";
import axios from "axios";

export const handler = async (interaction) => {
  console.log("FILE: \t" + "deleteAccountHandler.js");
  if (!interaction.isButton()) return;

  const splittedArray: string[] = interaction.customId.split("-");

  if (splittedArray[0] !== "delete") return;

  const accountType: string = splittedArray[1];
  const userId: string = splittedArray[2];
  const selectedRiotOrSteamId: string = splittedArray[3];
  const replyMsgId: string = splittedArray[4];

  const playerId: number = interaction.member.id;

  //only the account owner can select their account
  if (interaction.member.id !== userId) {
    await interaction.reply({
      content: "This is not your account",
      ephemeral: true,
    });
    console.log("LOG: \t" + "This is not your account");
    return;
  }

  switch (accountType) {
    case "riot": {
      await axios.delete("http://localhost:8080/api/account/riot/delete", {
        data: {
          discord_id: playerId,
          riot_id: selectedRiotOrSteamId,
        },
      });

      interaction.message.delete(replyMsgId);
      const deleteEmbed = new EmbedBuilder()
        .setColor(0xffff00)
        .setTitle("Valorant Account")
        .setDescription(
          `Account **${selectedRiotOrSteamId}** has been deleted.`
        );
      interaction.channel.send({ embeds: [deleteEmbed] });
      break;
    }

    case "steam": {
      interaction.message.delete(replyMsgId);
      const deleteEmbed = new EmbedBuilder()
        .setColor(0xffff00)
        .setTitle("Steam Account")
        .setDescription(
          `Account **${selectedRiotOrSteamId}** has been deleted.`
        );
      interaction.channel.send({ embeds: [deleteEmbed] });
      break;
    }
  }
};
