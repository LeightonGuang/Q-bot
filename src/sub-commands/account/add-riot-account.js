const fs = require("fs");
const writeToFile = require("../../utils/writeToFile");

module.exports = async (interaction) => {
  let riotId = interaction.options.get("riot-id").value;
  let playerId = interaction.member.id;
  let playerTag = interaction.member.user.tag;

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);
  let playerList = dataObj.playerList;

  let playerObj = playerList.find((obj) => obj.id === playerId);

  const [name, tag] = riotId.split("#");

  if (!tag) {
    interaction.reply({
      content: "Please include a tag in the riot Id",
      ephemeral: true,
    });
    return;
  }

  if (name.length < 3 || name.length > 16 || tag.length < 3 || tag.length > 5) {
    interaction.reply({
      content:
        "Keep your riot id between 3-16 characters\n#tag between 3-5 characters",
      ephemeral: true,
    });
    return;
  }

  let region = interaction.options.get("region").value;
  let rank = interaction.options.get("rank").value;

  let riotAccountList = playerObj.riotAccountList;
  let riotIdDuplicate = riotAccountList.find((obj) => obj.riotId === riotId);

  if (riotIdDuplicate) {
    //if the riot account is already added
    await interaction.reply({
      content: "You've already added this account.",
      ephemeral: true,
    });
    console.log("LOG: \t" + "riot id already added");
    return;
  }

  if (riotAccountList) {
    //if there are not riot account in player object
    for (let riotAccount of riotAccountList) {
      riotAccount.active = false;
    }
  }

  let riotAccountObj = {
    riotId: riotId,
    region: region,
    rank: rank,
    active: true,
  };

  playerObj.riotAccountList.push(riotAccountObj);

  //the line below might not be needed
  playerList.push(playerObj);
  writeToFile(dataObj, "data.json");

  await interaction.reply({
    content:
      "new riot account added\n" +
      `tag:\t${playerTag}\n` +
      `riot-id:\t${riotId}\n` +
      `region:\t${region}\n` +
      `rank:\t${rank}`,
    ephemeral: true,
  });

  console.log(
    "new riot account added\n" +
      `tag:\t${playerTag}\n` +
      `riot-id:\t${riotId}\n` +
      `region:\t${region}\n` +
      `rank:\t${rank}`
  );
};
