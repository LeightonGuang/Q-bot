import { EmbedBuilder } from "discord.js";
import { fetchEvents } from "../../utils/vct/fetchEvents.js";
import { sendEmbed } from "../../utils/vct/sendEmbed.js";

export const subCommand = async (interaction) => {
  const year: number = new Date().getFullYear();
  const vlrUrl: string = "https://vlr.gg";

  let valorantEventEmbedList: EmbedBuilder[] = [];

  let ongoingEventEmbedHeader = new EmbedBuilder()
    .setColor(0xffffff)
    .setTitle("Ongoing Valorant Champions Tour " + year)
    .setURL(vlrUrl + "/vct-" + year)
    .setDescription("Riot's official " + year + " Valorant tournament circuit");

  valorantEventEmbedList.push(ongoingEventEmbedHeader);

  await interaction.reply({
    embeds: valorantEventEmbedList,
    fetchReply: true,
  });

  const ongoingEventList: object[] = await fetchEvents(interaction);

  if (ongoingEventList.length === 0) {
    const errorEmbed = new EmbedBuilder()
      .setColor(0xff4553)
      .setTitle("There are no oncoming events");

    await interaction.editReply({
      embeds: [errorEmbed],
      components: [],
    });
    return;
  }

  await sendEmbed(interaction, ongoingEventList);
};
