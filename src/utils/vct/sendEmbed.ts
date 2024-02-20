import { EmbedBuilder } from "discord.js";

export const sendEmbed = (interaction, eventList) => {
  const year: number = new Date().getFullYear();
  const valorantEventEmbedList: EmbedBuilder[] = [];
  const { channel } = interaction;

  eventList.forEach((event) => {
    let startDate: any = new Date(`${event.startDate} ${year}`);
    startDate = startDate.getTime() / 1000;

    let endDate: any = new Date(`${event.endDate} ${year}`);
    endDate = endDate.getTime() / 1000;

    let eventEmbed = new EmbedBuilder()
      .setColor(0xff4553)
      .setTitle(event.eventName)
      .setURL(event.eventPageUrl)
      .setThumbnail(event.eventLogoUrl)
      .setDescription(`Date: <t:${startDate}:d> to <t:${endDate}:d>`);

    if (valorantEventEmbedList.length < 10) {
      valorantEventEmbedList.push(eventEmbed);
      interaction.editReply({ embeds: valorantEventEmbedList });
    } else {
      channel.send({ embeds: [eventEmbed] });
    }
  });
};
