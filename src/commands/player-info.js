const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const globalFunctions = require('../globalFunctions.js');

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
    let dataFile = fs.readFileSync('data.json');
    let dataObj = JSON.parse(dataFile);

    let playerList = dataObj.playerList;
    let playerId = interaction.member.id;
    let playerTag = interaction.member.user.tag;
    let region = interaction.options.get("region").value;
    let rank = interaction.options.get("rank").value;
    let riotId = interaction.options.get("riot-id").value;
    let player_is_in_list, propertyChange = false;
    let playerObj;

    let player = {
      id: playerId,
      tag: playerTag,
      region: region,
      rank: rank,
      riotId: riotId
    }

    //if list is empty just add player info to data.json
    for (let i = 0; i < playerList.length; i++) {
      player_is_in_list = (playerId == playerList[i].id);

      //if player already exist in playerList
      if (player_is_in_list) {
        playerObj = playerList[i];
        break;
      }
    }

    if (player_is_in_list) {
      //if new region is different
      if (playerObj.region !== region) {
        playerObj.region = region;
        globalFunctions.writeToFile(dataObj, 'data.json');
        interaction.channel.send("Region updated to -> " + region);
        console.log("LOG: \tRegion updated to -> " + region);
        propertyChange = true;
      }

      //if new rank is different
      if (playerObj.rank !== rank) {
        playerObj.rank = rank;
        globalFunctions.writeToFile(dataObj, 'data.json');
        interaction.channel.send("Rank updated to -> " + rank);
        console.log("LOG: \tRank updated to -> " + rank);
        propertyChange = true;
      }

      //if riot id is different
      if (playerObj.riotId !== riotId) {
        playerObj.riotId = riotId;
        globalFunctions.writeToFile(dataObj, 'data.json');
        interaction.channel.send("Riot ID updated to -> " + riotId);
        console.log("LOG: \tRiot ID updated to -> " + riotId);
        propertyChange = true;
      }

      //if player is in playerList but property is changed
      if (propertyChange) {
        await interaction.reply("player info updated");
        console.log("LOG: \t" + "player info updated");
        interaction.channel.send(`${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`);
        console.log("LOG: \t" + `${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`);

        //if player is in playerList and no property is changed
      } else {
        await interaction.reply("No changes have been made");
        console.log("LOG: \t" + "No changes have been made");
        interaction.channel.send(`${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`);
        console.log("LOG: \t" + `${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`);

      }

      //if player does not exist in playerList
    } else if (!player_is_in_list) {
      await interaction.reply("new player info added");
      console.log("LOG: \t" + "new player info added");
      interaction.channel.send(`${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`);
      console.log("LOG: \t" + `${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`);
      playerList.push(player);
      globalFunctions.writeToFile(dataObj, 'data.json');
    }
  },
};
