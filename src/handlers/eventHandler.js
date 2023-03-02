const { ActivityType } = require("discord.js");

module.exports = (client) => {
  //exmaples of events are user joining the server while interaciton are triggered when user interacts with message/component
  client.on("ready", () => {
    console.log(`
  =================================
    Q bot is ONLINE as ${client.user.tag}
  =================================
    `);

    client.user.setActivity({
      name: "Valorant | /help",
      type: ActivityType.Streaming,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });
  });
};
