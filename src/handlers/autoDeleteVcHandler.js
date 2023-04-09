const fs = require("node:fs");
const writeToFile = require("../utils/writeToFile");

module.exports = (client) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    const { guild } = newState;
    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);
    let customVoiceChannel = dataObj.customVoiceChannel;

    //if there are custom voice channel
    if (customVoiceChannel.length !== 0) {
      for (let name of customVoiceChannel) {
        const channel = guild.channels.cache.find((c) => c.name === name);

        //if all member left vc that is in custom vc
        if (channel && channel.members.size === 0) {
          //delete vc name in customVoiceChannel
          dataObj.customVoiceChannel = customVoiceChannel.filter(
            (item) => item !== oldState.channel.name
          );
          writeToFile(dataObj, "data.json");
          //delete vc
          oldState.channel.delete();
          console.log(`${oldState.channel.name} deleted`);
          break;
        }
      }
    }
  });
};
