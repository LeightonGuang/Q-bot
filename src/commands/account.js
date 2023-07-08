const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const writeToFile = require('../utils/writeToFile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("account")
    .setDescription("setup and manage accounts")
    //add a riot account
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
    //select which account to play with
    .addSubcommand(addSubcommand =>
      addSubcommand
        .setName("select")
        .setDescription("select which account to play with")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("the type of account")
            .setRequired(true)
            .setChoices(
              { name: "riot", value: "riot" },
              { name: "steam", value: "steam" }
            )
        )
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

    let riotId = interaction.options.get("riot-id").value;
    let region = interaction.options.get("region").value;
    let rank = interaction.options.get("rank").value;

    let playerObj = playerList.find(obj => obj.id === playerId);

    //add discord id and tag if player is not found in playerList

    if (!playerObj) {
      //if no player info in playerList create a new obj
      console.log("LOG: \t" + "player is not in playerList");

      playerObj = {
        "id": playerId,
        "tag": playerTag,
        "riotAccountList": [],
        "steamAccountList": []
      }
    }

    let subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "add-riot-account":
        console.log(JSON.stringify(playerObj));

        let duplicate = playerObj.riotAccountList.find(obj => obj.riotId === riotId);
        if (duplicate) {
          //if the riot account is already added
          interaction.reply({ content: "You've already added this account.", ephemeral: true });
          console.log("LOG: \t" + "riot id already added");
          return;
        }

        let riotAccountObj = {
          "riotId": riotId,
          "region": region,
          "rank": rank,
          "active": false
        }

        playerObj.riotAccountList.push(riotAccountObj);
        playerList.push(playerObj);
        writeToFile(dataObj, "data.json");

        await interaction.reply({
          content: `new riot account added
          tag:\t ${playerTag}
          riot-id:\t ${riotId}
          region:\t ${region}
          rank:\t ${rank}`,
          ephemeral: true
        })

        interaction.user.send(`new riot account added
        tag:\t ${playerTag}
        riot-id:\t ${riotId}
        region:\t ${region}
        rank:\t ${rank}`
        );

        console.log(`new riot account added
        tag:\t ${playerTag}
        riot-id:\t ${riotId}
        region:\t ${region}
        rank:\t ${rank}`
        );
        break;

      case "add-steam-account":

        break;

      case "edit-riot-account":

        break;

      case "edit-steam-account":

        break;

      case "delete-account":

        break;

      case "select":

        break;
    }
  },
};
