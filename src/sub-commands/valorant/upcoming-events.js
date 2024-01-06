const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction) => {
  let year = new Date().getFullYear();
  let vlr_url = "https://vlr.gg";

  let valorantEventEmbedList = [];
  let upcomingEventList = [];

  const fetchEvents = require("../../utils/valorant/fetchEvents");
  const fetchEventMatch = require("../../utils/valorant/fetchEventMatch");
  const sendEmbed = require("../../utils/valorant/sendEmbed");

  let upcomingEventEmbedHeader = new EmbedBuilder()
    .setColor(0xffffff)
    .setTitle("Upcoming Valorant Champions Tour " + year)
    .setURL(vlr_url + "/vct-" + year)
    .setDescription("Riot's official " + year + " Valorant tournament circuit");

  valorantEventEmbedList.push(upcomingEventEmbedHeader);

  await interaction.reply({
    embeds: valorantEventEmbedList,
    fetchReply: true,
  });

  const eventList = await fetchEvents(interaction);
  console.log(eventList);
  await fetchEventMatch(upcomingEventList);
  await sendEmbed(upcomingEventList);
};
