const fs = require("node:fs");
const writeToFile = require("../utils/writeToFile");

module.exports = (client) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    const { guild } = newState;
    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);
    let customLobby = dataObj.customLobby;

    //if there are nothing in custom lobby
    if (customLobby.length === 0) return;

    for (let lobbyObj of customLobby) {
      const textChannel = guild.channels.cache.get(lobbyObj.textChannelId);
      const voiceChannel = guild.channels.cache.get(lobbyObj.voiceChannelId);

      //if all member left vc that is in custom vc
      if (voiceChannel && voiceChannel.members.size === 0) {
        //delete text channel
        textChannel.delete();
        console.log("LOG: \t" + `${textChannel.name} text channel deleted`)

        //delete voice channel
        oldState.channel.delete();
        console.log("LOG: \t" + `${oldState.channel.name} deleted`);

        //delete vc name in customLobby
        dataObj.customLobby = customLobby.filter(
          (item) => item.voiceChannelId !== oldState.channel.id
        );
        writeToFile(dataObj, "data.json");
        break;
      }
    }
  });
};
