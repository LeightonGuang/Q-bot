const fs = require("fs");
const writeToFile = require("../../utils/writeToFile");

module.exports = async (interaction) => {
  const riotId = interaction.options.get("riot-id").value;
  const playerId = interaction.member.id;
  const playerTag = interaction.member.user.tag;

  const dataFile = fs.readFileSync("data.json");
  const dataObj = JSON.parse(dataFile);
  const playerList = dataObj.playerList;

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
    // check for duplicate riot id
    await interaction.reply({
      content: "You've already added this account.",
      ephemeral: true,
    });
    console.log("LOG: \t" + "riot id already added");
    return;
  }

  if (riotAccountList) {
    // make all old riot accounts inactive
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
