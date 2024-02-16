import { ActivityType } from "discord.js";

export const data = (client) => {
  client.on("ready", async () => {
    const annoucmentChannel = await client.channels.fetch(
      "1077779475175059506"
    );
    annoucmentChannel.send("Bot is online!");

    console.log(`
  =================================
    Q bot is ONLINE as ${client.user.tag}
  =================================
    `);

    client.user.setActivity({
      name: "VALORANT | /help",
      type: ActivityType.Streaming,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });
  });
};
