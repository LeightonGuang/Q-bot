export const handler = async (client) => {
  client.on("interactionCreate", async (interaction) => {
    console.log("FILE: \t" + "buttonHandler.js");
    if (interaction.isButton()) {
      // let pollButton = require("../../event/pollButtons");
      // pollButton(interaction);

      let selectAccountButtonHandler: any = await import(
        "./account/selectAccountButtonHandler.js"
      );
      selectAccountButtonHandler.handler(interaction);

      //always keep this last
      // let queueButtonHandler = require("./queueButtonHandler");
      // queueButtonHandler(interaction);
    } //no button press
  });
};
