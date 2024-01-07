const fs = require("fs");

module.exports = (interaction, userId) => {
  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);

  const isPlayerRegistered = dataObj.playerList.find(
    (obj) => obj.id === userId
  );

  if (isPlayerRegistered) {
    return true;
  } else if (!isPlayerRegistered) {
    if (interaction.user.id !== userId) {
      interaction.reply({
        content:
          "The account you are looking for does not exist. Please search for a registered account.",
        ephemeral: true,
      });
      return false;
    } else if (interaction.user.id === userId) {
      interaction.reply({
        content:
          "Please use the command ***/account add-riot-account*** to add a riot account",
        ephemeral: true,
      });
      return false;
    }
  }
};
