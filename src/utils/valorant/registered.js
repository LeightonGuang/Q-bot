const fs = require("fs");

module.exports = (userId) => {
  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);

  const playerRegistered = dataObj.playerList.find((obj) => obj.id === userId);

  if (playerRegistered) {
    return true;
  } else if (!playerRegistered) {
    interaction.reply({
      content:
        "Please use the command ***/account add-riot-account*** to add a riot account",
      ephemeral: true,
    });
    return false;
  }
};
