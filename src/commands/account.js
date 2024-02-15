const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const writeToFile = require("../utils/writeToFile");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("account")
    .setDescription("Setup and manage your accounts")
    //add a riot account
    .addSubcommand((addSubcommand) =>
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
            )
        )
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
    .addSubcommand((addSubcommand) =>
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
    //edit member's riot account
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("edit-riot-account")
        .setDescription("Edit your existing riot accounts in Qs")
        .addStringOption((option) =>
          option
            .setName("rank")
            .setDescription("Edit your rank")
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
          option.setName("riot-id").setDescription("Edit your Riot id")
        )
        .addStringOption((option) =>
          option
            .setName("region")
            .setDescription("Edit your region")
            .setChoices(
              { name: "NA", value: "na" },
              { name: "LATAM", value: "latam" },
              { name: "BR", value: "br" },
              { name: "EU", value: "eu" },
              { name: "KR", value: "kr" },
              { name: "APAC", value: "apac" }
            )
        )
    )
    //edit member's steam account
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("edit-steam-account")
        .setDescription("Edit your existing steam account in Qs")
    )
    //list all accounts that the member owns
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("list-all")
        .setDescription("List all accounts that you ownd")
    )
    //select which account to play with
    .addSubcommand((addSubcommand) =>
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
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("delete")
        .setDescription("delete an existing account in Qs")
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
    ),

  async execute(interaction) {
    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);
    let playerList = dataObj.playerList;

    let playerId = interaction.member.id;
    let playerTag = interaction.member.user.tag;

    let playerObj = playerList.find((obj) => obj.id === playerId);

    //add discord id and tag if player is not found in playerList
    if (!playerObj) {
      //if no player info in playerList create a new obj
      console.log("LOG: \t" + "player is not in playerList");

      playerObj = {
        id: playerId,
        tag: playerTag,
        riotAccountList: [],
        steamAccountList: [],
      };
    }

    let subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "add-riot-account": {
        const addRiotAccount = require("../sub-commands/account/add-riot-account");
        addRiotAccount(interaction);
        break;
      }
      case "add-steam-account": {
        const addSteamAccount = require("../sub-commands/account/add-steam-account");
        addSteamAccount(interaction);
        break;
      }
      case "edit-riot-account": {
        const editRiotAccount = require("../sub-commands/account/edit-riot-account");
        editRiotAccount(interaction);
        break;
      }
      case "edit-steam-account": {
        break;
      }
      case "list-all": {
        const listAll = require("../sub-commands/account/list-all");
        listAll(interaction);
        break;
      }
      case "select": {
        let selectAcountType = interaction.options.get("type").value;

        //if player chose to select a riot account
        //list all riot accounts with a button for each account for user
        switch (selectAcountType) {
          case "riot":
            let riotAccountEmbedList = [];
            const selectRiotAccountRow = new ActionRowBuilder();

            for (let riotAccountObj of playerObj.riotAccountList) {
              let selectButtonStyle, embedColour;

              //check if if its an active account change colour of embed and button
              if (riotAccountObj.active) {
                embedColour = 0x3ba55b;
                selectButtonStyle = ButtonStyle.Success;
              } else {
                embedColour = 0xec4245;
                selectButtonStyle = ButtonStyle.Danger;
              }

              let riotAccountEmbed = new EmbedBuilder()
                .setColor(embedColour)
                .setTitle(riotAccountObj.riotId)
                .addFields([
                  {
                    name: "Region:",
                    value: riotAccountObj.region,
                    inline: true,
                  },
                  {
                    name: "Rank:",
                    value: riotAccountObj.rank,
                    inline: true,
                  },
                  {
                    name: "Active:",
                    value: riotAccountObj.active.toString(),
                    inline: true,
                  },
                ]);

              //console.log(JSON.stringify(riotAccountEmbed));

              riotAccountEmbedList.push(riotAccountEmbed);

              selectRiotAccountRow.addComponents(
                new ButtonBuilder()
                  .setLabel(riotAccountObj.riotId)
                  .setCustomId(
                    `select-riot-${interaction.member.id}-${riotAccountObj.riotId}-${interaction.id}`
                  )
                  .setStyle(selectButtonStyle)
              );
            }

            await interaction.reply({
              embeds: riotAccountEmbedList,
              fetchReply: true,
            });

            interaction.editReply({ components: [selectRiotAccountRow] });

            break;

          case "steam":
            let steamAccountEmbedList = [];
            const selectSteamAccountRow = new ActionRowBuilder();

            for (let steamAccountObj of playerObj.steamAccountList) {
              let selectButtonStyle, embedColour;
              //check if if its an active account change colour of embed and button
              if (steamAccountObj.active) {
                embedColour = 0x3ba55b;
                selectButtonStyle = ButtonStyle.Success;
              } else {
                embedColour = 0xec4245;
                selectButtonStyle = ButtonStyle.Danger;
              }

              let steamAccountEmbed = new EmbedBuilder()
                .setColor(embedColour)
                .setTitle(steamAccountObj.accountname)
                .setURL(steamAccountObj.steamProfileUrl)
                .addFields({
                  name: "Friend Code:",
                  value: steamAccountObj.friendCode,
                });

              steamAccountEmbedList.push(steamAccountEmbed);

              selectSteamAccountRow.addComponents(
                new ButtonBuilder()
                  .setLabel(steamAccountObj.accountName)
                  .setCustomId(`select-steam-${steamAccountObj.accountName}`)
                  .setStyle(selectButtonStyle)
              );
            }

            await interaction.reply({
              embeds: steamAccountEmbedList,
              components: [selectSteamAccountRow],
              fetchReply: true,
              ephemeral: false,
            });
            break;
        }
        break;
      }
      case "delete": {
        let deleteAccountType = interaction.options.get("type").value;

        switch (deleteAccountType) {
          case "riot":
            let riotAccountEmbedList = [];
            const deleteRiotAccountRow = new ActionRowBuilder();

            for (let riotAccountObj of playerObj.riotAccountList) {
              //go through each riot account to make an embed and button
              let riotAccountEmbed = new EmbedBuilder()
                .setColor(0xec4245)
                .setTitle(riotAccountObj.riotId)
                .addFields([
                  {
                    name: "Region:",
                    value: riotAccountObj.region,
                    inline: true,
                  },
                  {
                    name: "Rank:",
                    value: riotAccountObj.rank,
                    inline: true,
                  },
                  {
                    name: "Active:",
                    value: riotAccountObj.active.toString(),
                    inline: true,
                  },
                ]);

              riotAccountEmbedList.push(riotAccountEmbed);

              deleteRiotAccountRow.addComponents(
                new ButtonBuilder()
                  .setLabel(`DELETE: ${riotAccountObj.riotId}`)
                  .setCustomId(
                    `delete-riot-${riotAccountObj.riotId}-${interaction.id}`
                  )
                  .setStyle(ButtonStyle.Danger)
              );
            }

            await interaction.reply({
              embeds: riotAccountEmbedList,
              components: [deleteRiotAccountRow],
              fetchReply: true,
            });

            break;

          case "steam":
            break;
        }

        break;
      }
    }
  },
};
