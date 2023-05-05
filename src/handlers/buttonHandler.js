const fs = require("node:fs");
const writeToFile = require("../utils/writeToFile");
const updateQueueEmbed = require("../utils/updateQueueEmbed");

/**
 * if a button is clicked
 * 
 * run the functions
 */

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    console.log("FILE: \t" + "buttonHandler.js");
    if (interaction.isButton()) {

      let queueButtonHandler = require("./queueButtonHandler");
      queueButtonHandler(interaction);

      let pollButton = require("../event/pollButtons");
      pollButton(interaction);

    }//not a button press
  });
};
