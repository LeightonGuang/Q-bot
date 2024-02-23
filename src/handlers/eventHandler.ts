import { ActivityType } from "discord.js";

export const data = (client) => {
  client.on("ready", async () => {
    const annoucmentChannel: any = await client.channels.fetch(
      "1210495684575498271"
    );
    await annoucmentChannel.messages.edit(
      "1210496026918789130",
      "Bot is online!"
    );

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
