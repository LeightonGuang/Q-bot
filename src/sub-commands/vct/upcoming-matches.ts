import {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { fetchEvents } from "../../utils/vct/fetchEvents.js";

export const subCommand = async (interaction) => {
  const year: number = new Date().getFullYear();
  const vlrUrl: string = "https://vlr.gg";

  const upcomingMatchEmbedList: EmbedBuilder[] = [];

  const upcomingMatchEmbedHeader = new EmbedBuilder()
    .setColor(0x9464f5)
    .setTitle("Upcoming Valorant Champions Tour matches")
    .setURL(vlrUrl + "/vct-" + year)
    .setDescription("Riot's official " + year + " Valorant tournament circuit");

  upcomingMatchEmbedList.push(upcomingMatchEmbedHeader);

  const replyObj = await interaction.reply({
    embeds: upcomingMatchEmbedList,
    fetchReply: true,
  });

  type EventObject = {
    eventName: string;
    eventLogoUrl: string;
    eventPageUrl: string;
    startDate: string;
    endDate: string;
  };

  const upcomingEventList: EventObject[] = await fetchEvents(
    interaction,
    "ongoing"
  );

  const upcomingEventOptions = upcomingEventList.map((event) => {
    return new StringSelectMenuOptionBuilder()
      .setLabel(event.eventName)
      .setValue(event.eventPageUrl);
  });

  const eventSelectMenu = new ActionRowBuilder().setComponents(
    new StringSelectMenuBuilder()
      .setPlaceholder("Select an event")
      .setCustomId(`upcomingEventSelect-${replyObj.id}`)
      .addOptions(upcomingEventOptions)
  );

  interaction.editReply({
    embeds: upcomingMatchEmbedList,
    components: [eventSelectMenu],
  });
};
