const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const writeToFile = require('../utils/writeToFile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("account")
    .setDescription("setup and manage accounts")
    //add a steam account
    .addSubcommand(addSubcommand =>
      addSubcommand
        .setName("add-riot-account")
        .setDescription("add a new riot account to Qs")
        .addStringOption((option) =>
          option
            .setName("region")
            .setDescription("Choose your region")
            .setRequired(true)
            .setChoices(
              { name: "NA", value: "na" },
              { name: "LATAM", value: "latam" },
              { name: "BR", value: "br" },
              { name: "EU", value: "eu" },
              { name: "KR", value: "kr" },
              { name: "APAC", value: "apac" }
            ))
        .addStringOption((option) =>
          option
            .setName("riot-id")
            .setDescription("Add your Riot ID")
            .setRequired(true)
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
    )
    //add a steam account
    .addSubcommand(addSubcommand =>
      addSubcommand
        .setName("add-steam-account")
        .setDescription("add a new steam account to Qs")
        .addStringOption((option) =>
          option
            .setName("friend-code")
            .setDescription("Add your steam friend code")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("steam-profile-url")
            .setDescription("Add your Riot ID")
            .setRequired(true)
        )
    )
    //edit an existing riot account
    .addSubcommand(addSubcommand =>
      addSubcommand
        .setName("edit-riot-account")
        .setDescription("edit an existing riot account in Qs")
    )
    //edit an existing steam account
    .addSubcommand(addSubcommand =>
      addSubcommand
        .setName("edit-steam-account")
        .setDescription("edit an existing steam account in Qs")
    )
    //delete an existing account
    .addSubcommand(addSubcommand =>
      addSubcommand
        .setName("delete-an-account")
        .setDescription("delete an existing account in Qs")
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

    //if list is empty just add player profile to data.json
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
      if (playerObj.tag !== playerTag) {
        playerObj.tag === playerTag;
        writeToFile(dataObj, 'data.json');
        interaction.user.send("Tag updated to -> " + playerTag);
        console.log("LOG: \tTag updated to -> " + playerTag);
        propertyChange = true;
      }

      if (playerObj.region !== region) {
        playerObj.region = region;
        writeToFile(dataObj, 'data.json');
        interaction.user.send("Region updated to -> " + region);
        console.log("LOG: \tRegion updated to -> " + region);
        propertyChange = true;
      }

      //if new rank is different
      if (playerObj.rank !== rank) {
        playerObj.rank = rank;
        writeToFile(dataObj, 'data.json');
        interaction.user.send("Rank updated to -> " + rank);
        console.log("LOG: \tRank updated to -> " + rank);
        propertyChange = true;
      }

      //if riot id is different
      if (playerObj.riotId !== riotId) {
        playerObj.riotId = riotId;
        writeToFile(dataObj, 'data.json');
        interaction.user.send("Riot ID updated to -> " + riotId);
        console.log("LOG: \tRiot ID updated to -> " + riotId);
        propertyChange = true;
      }

      //if player is in playerList but property is changed
      if (propertyChange) {
        await interaction.reply({
          content:
            "player profile updated\n" +
            `${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`,
          ephemeral: true
        });
        console.log("LOG: \t" +
          "player profile updated\n" +
          `${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`
        );

        //if player is in playerList and no property is changed
      } else {
        await interaction.reply({
          content:
            `No changes have been made\n` +
            `${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`,
          ephemeral: true
        });
        console.log("LOG: \t" +
          "No changes have been made\n" +
          `${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`
        );
      }

      //if player does not exist in playerList
    } else if (!player_is_in_list) {
      await interaction.reply({
        content:
          `new player profile added\n` +
          `${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`,
        ephemeral: true
      });
      console.log("LOG: \t" + "new player profile added");
      console.log("LOG: \t" + `${playerTag} \t Region: ${region} \t Rank: ${rank} \t Riot ID: ${riotId}`);

      let player = {
        id: playerId,
        tag: playerTag,
        region: region,
        rank: rank,
        riotId: riotId
      }

      playerList.push(player);
      writeToFile(dataObj, 'data.json');
    }
  },
};
