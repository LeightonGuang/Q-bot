module.exports = (client) => {
  client.on("messageCreate", (message) => {
    if (!message.author.bot) {
      let today = new Date();
      let date =
        today.getDate() +
        "/" +
        (today.getMonth() + 1) +
        "/" +
        today.getFullYear();
      let time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let dateTime = date + " " + time;
      console.log(
        `${dateTime} \t Server: ${message.guild.name} \t Channel: ${message.channel.name} \t User: ${message.author.tag} \nMessage: ${message.content}`
      );
    }

    if (message.content === "/guild-id") {
      message.reply("Guild id: " + message.guild.id);
      console.log("Guild id: " + message.guild.id);
    }
  });
};
