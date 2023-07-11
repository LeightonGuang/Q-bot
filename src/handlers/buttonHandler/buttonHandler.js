/**
 * if a button is clicked
 * 
 * run the functions
 */

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    console.log("FILE: \t" + "buttonHandler.js");
    if (interaction.isButton()) {

      let pollButton = require("../../event/pollButtons");
      pollButton(interaction);

      let selectAccountButtonHandler = require("./account/selectAccountButtonHandler");
      selectAccountButtonHandler(interaction);

      //always keep this last
      let queueButtonHandler = require("./queueButtonHandler");
      queueButtonHandler(interaction);
    }//not a button press
  });
};
