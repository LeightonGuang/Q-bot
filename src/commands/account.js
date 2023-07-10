const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
        .setDescription("Add a new riot account to Qs")
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
        .setDescription("Add a new steam account to Qs")
        .addStringOption((option) =>
          option
            .setName("account-name")
            .setDescription("Add your steam friend code")
            .setRequired(true)
        )
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
        .setDescription("Edit your existing riot account in Qs")
    )
    //edit an existing steam account
    .addSubcommand(addSubcommand =>
      addSubcommand
        .setName("edit-steam-account")
        .setDescription("Edit your existing steam account in Qs")
    )
    //list all accounts that the member ownd
    .addSubcommand(addSubcommand =>
      addSubcommand
        .setName("list-all")
        .setDescription("List all accounts that you ownd")
    )
    //select which account to play with
    .addSubcommand(addSubcommand =>
      addSubcommand
        .setName("select")
        .setDescription("Select which account to play with")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("the type of account")
            .setRequired(true)
            .setChoices(
              { name: "Riot", value: "riot" },
              { name: "Steam", value: "steam" }
            )
        )
    )
    //delete an existing account
    .addSubcommand(addSubcommand =>
      addSubcommand
        .setName("delete")
        .setDescription("delete an existing account in Qs")
    ),

  async execute(interaction) {
    let dataFile = fs.readFileSync('data.json');
    let dataObj = JSON.parse(dataFile);
    let playerList = dataObj.playerList;

    let playerId = interaction.member.id;
    let playerTag = interaction.member.user.tag;

    let playerObj = playerList.find(obj => obj.id === playerId);
    //console.log(JSON.stringify(playerObj));

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
        let riotId = interaction.options.get("riot-id").value;
        let region = interaction.options.get("region").value;
        let rank = interaction.options.get("rank").value;

        let riotIdDuplicate = playerObj.riotAccountList.find(obj => obj.riotId === riotId);
        if (riotIdDuplicate) {
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
        };

        playerObj.riotAccountList.push(riotAccountObj);
        playerList.push(playerObj);
        writeToFile(dataObj, "data.json");

        await interaction.reply({
          content: "new riot account added\n" +
            `tag:\t${playerTag}\n` +
            `riot-id:\t${riotId}\n` +
            `region:\t${region}\n` +
            `rank:\t${rank}`,
          ephemeral: true
        })

        console.log("new riot account added\n" +
          `tag:\t${playerTag}\n` +
          `riot-id:\t${riotId}\n` +
          `region:\t${region}\n` +
          `rank:\t${rank}`);
        break;

      case "add-steam-account":
        let steamAccountName = interaction.options.get("account-name").value;
        let steamFriendCode = interaction.options.get("friend-code").value;
        let steamProfileUrl = interaction.options.get("steam-profile-url").value;

        let steamFriendCodeDuplicate = playerObj.steamAccountList.find(obj => obj.friendCode === steamFriendCode);
        if (steamFriendCodeDuplicate) {
          //if the riot account is already added
          interaction.reply({ content: "You've already added this account.", ephemeral: true });
          console.log("LOG: \t" + "riot id already added");
          return;
        }

        let steamAccountObj = {
          "accountName": steamAccountName,
          "friendCode": steamFriendCode,
          "steamProfileUrl": steamProfileUrl,
          "active": false
        };

        playerObj.steamAccountList.push(steamAccountObj);
        playerList.push(playerObj);
        writeToFile(dataObj, "data.json");

        await interaction.reply({
          content: "new steam account added\n" +
            `Account Name: \t${steamAccountName}\n` +
            `Friend Code: \t${steamFriendCode}\n` +
            `Steam Profile URL: \t${steamProfileUrl}`,
          ephemeral: true
        });

        console.log("new steam account added\n" +
          `Account Name: \t${steamAccountName}\n` +
          `Friend Code: \t${steamFriendCode}\n` +
          `Steam Profile URL: \t${steamProfileUrl}`);

        break;

      case "edit-riot-account":

        break;

      case "edit-steam-account":

        break;

      case "list-all":
        let accountEmbedList = [];
        console.log("LENGTH: " + playerObj.riotAccountList.length);
        for (let riotAccountObj of playerObj.riotAccountList) {
          let riotAccountEmbed = new EmbedBuilder()
            .setColor(0xFF4553)
            .setTitle(riotAccountObj.riotId)
            .addFields([
              { name: "Region:", value: riotAccountObj.region, inline: true },
              { name: "Rank:", value: riotAccountObj.rank, inline: true },
              { name: "Active:", value: riotAccountObj.active.toString(), inline: true }
            ])

          //console.log(JSON.stringify(riotAccountEmbed));
          accountEmbedList.push(riotAccountEmbed);
        }

        for (let steamAccountObj of playerObj.steamAccountList) {
          let steamAccountEmbed = new EmbedBuilder()
            .setColor(0x2a475e)
            .setTitle(steamAccountObj.accountName)
            .setFields({ name: "LINK:", value: `[profile](${steamAccountObj.steamProfileUrl})` })

          accountEmbedList.push(steamAccountEmbed);
        }

        interaction.reply({ embeds: accountEmbedList, ephemeral: true });
        break;

      case "delete":

        break;

      case "select":

        break;
    }
  },
};
