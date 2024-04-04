import { EmbedBuilder } from "discord.js";
import axios from "axios";

export const subCommand: any = async (interaction) => {
  const discordId: string = interaction.member.id;
  const userTag: string = interaction.member.user.tag;
  const userAvatar: string = interaction.user.displayAvatarURL();

  try {
    const { data: isRegistered }: { data: boolean } = await axios.get(
      "http://localhost:8080/api/account/isRegistered/" + interaction.member.id
    );

    if (isRegistered) {
      const errorEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0xffff00)
        .setAuthor({ name: userTag, iconURL: userAvatar })
        .setTitle("You already have an account")
        .setFooter({
          text: "id: " + discordId,
        });

      await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    } else if (!isRegistered) {
      await axios.post("http://localhost:8080/api/account", {
        discord_id: discordId,
        tag: userTag,
      });

      const createAccountEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0x55ff55)
        .setAuthor({ name: userTag, iconURL: userAvatar })
        .setDescription("Account created")
        .setFooter({
          text: "id: " + discordId,
        });

      await interaction.reply({
        embeds: [createAccountEmbed],
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
