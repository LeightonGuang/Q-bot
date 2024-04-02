import axios from "axios";

export const subCommand: any = async (interaction) => {
  try {
    const { data: isRegistered }: { data: boolean } = await axios.get(
      "http://localhost:8080/api/account/isRegistered/" + interaction.member.id
    );

    console.log("LOG: \t" + "isRegistered: " + isRegistered);

    if (isRegistered) {
      await interaction.reply({
        content: "You already have an account",
        ephemeral: true,
      });
    } else if (!isRegistered) {
      const discordId: string = interaction.member.id;
      const userTag: string = interaction.member.user.tag;

      await axios.post("http://localhost:8080/api/account", {
        discord_id: discordId,
        tag: userTag,
      });

      await interaction.reply({
        content: "Account created",
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
