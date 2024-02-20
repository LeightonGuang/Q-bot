import { EmbedBuilder } from "discord.js";
import { fetchEvents } from "../../utils/vct/fetchEvents.js";
import { sendEmbed } from "../../utils/vct/sendEmbed.js";

export const subCommand = async (interaction) => {
  const year: number = new Date().getFullYear();
  const vlrUrl: string = "https://vlr.gg";

  const valorantEventEmbedList: EmbedBuilder[] = [];

  const upcomingEventEmbedHeader = new EmbedBuilder()
    .setColor(0xffffff)
    .setTitle("Upcoming Valorant Champions Tour " + year)
    .setURL(vlrUrl + "/vct-" + year)
    .setDescription("Riot's official " + year + " Valorant tournament circuit");

  valorantEventEmbedList.push(upcomingEventEmbedHeader);

  await interaction.reply({
    embeds: valorantEventEmbedList,
    fetchReply: true,
  });

  const upcomingEventList: object[] = await fetchEvents(interaction);

  if (upcomingEventList.length === 0) {
    const errorEmbed = new EmbedBuilder()
      .setColor(0xff4553)
      .setTitle("There are no upcoming events");

    await interaction.editReply({
      embeds: [errorEmbed],
      components: [],
    });
    return;
  }

  await sendEmbed(interaction, upcomingEventList);
};
