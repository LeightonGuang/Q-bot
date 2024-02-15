const fs = require("fs");
const writeToFile = require("../../utils/writeToFile");

module.exports = async (interaction) => {
  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);
  let playerList = dataObj.playerList;

  let playerId = interaction.member.id;
  let playerObj = playerList.find((obj) => obj.id === playerId);

  let steamAccountName = interaction.options.get("account-name").value;
  let steamFriendCode = interaction.options.get("friend-code").value;
  let steamProfileUrl = interaction.options.get("steam-profile-url").value;

  let steamFriendCodeDuplicate = playerObj.steamAccountList.find(
    (obj) => obj.friendCode === steamFriendCode
  );
  if (steamFriendCodeDuplicate) {
    //if the riot account is already added
    interaction.reply({
      content: "You've already added this account.",
      ephemeral: true,
    });
    console.log("LOG: \t" + "riot id already added");
    return;
  }

  let steamAccountObj = {
    accountName: steamAccountName,
    friendCode: steamFriendCode,
    steamProfileUrl: steamProfileUrl,
    active: false,
  };

  playerObj.steamAccountList.push(steamAccountObj);
  writeToFile(dataObj, "data.json");

  await interaction.reply({
    content:
      "new steam account added\n" +
      `Account Name: \t${steamAccountName}\n` +
      `Friend Code: \t${steamFriendCode}\n` +
      `Steam Profile URL: \t${steamProfileUrl}`,
    ephemeral: true,
  });

  console.log(
    "new steam account added\n" +
      `Account Name: \t${steamAccountName}\n` +
      `Friend Code: \t${steamFriendCode}\n` +
      `Steam Profile URL: \t${steamProfileUrl}`
  );
};
