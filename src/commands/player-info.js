const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("player-info")
    .setDescription("setup player profile")
    .addStringOption((option) =>
      option
        .setName("region")
        .setDescription("Choose your region")
        .setRequired(true)
        .setChoices(
          { name: "SEA", value: "sea" },
          { name: "NA", value: "na" },
          { name: "EU", value: "eu" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("rank")
        .setDescription("Choose your rank")
        .setRequired(true)
        .setChoices(
          { name: "Iron 1", value: "I1" },
          { name: "Iron 2", value: "I2" },
          { name: "Iron 3", value: "I3" },
          { name: "Bronze 1", value: "B1" },
          { name: "Bronze 2", value: "B2" },
          { name: "Bronze 3", value: "B3" },
          { name: "Silver 1", value: "S1" },
          { name: "Silver 2", value: "S2" },
          { name: "Silver 3", value: "S3" },
          { name: "Gold 1", value: "G1" },
          { name: "Gold 2", value: "G2" },
          { name: "Gold 3", value: "G3" },
          { name: "Platinum 1", value: "P1" },
          { name: "Platinum 2", value: "P2" },
          { name: "Platinum 3", value: "P3" },
          { name: "Diamond 1", value: "D1" },
          { name: "Diamond 2", value: "D2" },
          { name: "Diamond 3", value: "D3" },
          { name: "Ascendant 1", value: "A1" },
          { name: "Ascendant 2", value: "A2" },
          { name: "Ascendant 3", value: "A3" },
          { name: "Immortal 1", value: "Im1" },
          { name: "Immortal 2", value: "Im2" },
          { name: "Immortal 3", value: "Im3" },
          { name: "Radiant", value: "R" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("riot-id")
        .setDescription("Add your Riot ID")
        .setRequired(true)
    ),
  async execute(interaction) {
    function writeToFile(data, file) {
      fs.writeFileSync(file, data);
    }

    let dataFile = fs.readFileSync('data.json');
    let jsonData = JSON.parse(dataFile);

    let playerList = jsonData.playerList;
    let playerId = interaction.member.id;
    let playerTag = interaction.member.user.tag;
    let region = interaction.options.get("region").value;
    let rank = interaction.options.get("rank").value;
    let riotId = interaction.options.get("riot-id").value;

    let player = {
      id: playerId,
      tag: playerTag,
      region: region,
      rank: rank,
      riotId: riotId
    }

    //if list is empty just add player info to data.json
    if (playerList.length === 0) {
      playerList.push(player);
      let data = JSON.stringify(jsonData, null, 2);
      writeToFile(data, 'data.json');

    } else {
      for (let i = 0; i < playerList.length; i++) {
        let noDuplicate = true;
        //if player already exist
        if (playerId == playerList[i].id) {
          let noUpdate = true;

          //if new region is different
          if (playerList[i].region !== region) {
            playerList[i].region = region;
            let dataString = JSON.stringify(jsonData, null, 2);
            writeToFile(dataString, 'data.json');
            interaction.channel.send("Region updated to -> " + region);
            console.log("LOG: \tRegion updated to -> " + region);
            noUpdate = false;
          }

          //if new rank is different
          if (playerList[i].rank !== rank) {
            playerList[i].rank = rank;
            let dataString = JSON.stringify(jsonData, null, 2);
            writeToFile(dataString, 'data.json');
            interaction.channel.send("Rank updated to -> " + rank);
            console.log("LOG: \tRank updated to -> " + rank);
            noUpdate = false;
          }

          //if riot id is different
          if (playerList[i].riotId !== riotId) {
            playerList[i].riotId = riotId;
            let dataString = JSON.stringify(jsonData, null, 2);
            writeToFile(dataString, 'data.json');
            interaction.channel.send("Riot ID updated to -> " + riotId);
            console.log("LOG: \tRiot ID updated to -> " + riotId);
            noUpdate = false;
          }

          if (noUpdate) {
            await interaction.reply("Nothing to update");
            console.log("LOG: \t Nothing to update");
            interaction.channel.send(`${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`);
            console.log("LOG: \t" + `${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`);

          } else {
            await interaction.reply("player info updated");
            console.log("LOG: \t" + "player info updated");
            interaction.channel.send(`${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`);
            console.log("LOG: \t" + `${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`);
          }
          noDuplicate = false;
          break;
        }

        if (noDuplicate) {
          playerList.push(player);
          let data = JSON.stringify(jsonData, null, 2);
          writeToFile(data, 'data.json');
          console.log(`playerId: ${playerId}  property value: ${playerId[i].id} i: ${i}`);
        }
      }
    }
  },
};
