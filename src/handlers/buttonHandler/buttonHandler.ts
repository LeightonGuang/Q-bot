export const handler = async (client) => {
  client.on("interactionCreate", async (interaction) => {
    console.log("FILE: \t" + "buttonHandler.js");
    if (interaction.isButton()) {
      const pollButtonHandler: any = await import(
        "./poll/pollButtonHandler.js"
      );
      pollButtonHandler.handler(interaction);

      const selectAccountButtonHandler: any = await import(
        "./account/selectAccountButtonHandler.js"
      );
      selectAccountButtonHandler.handler(interaction);

      const deleteAccountButtonHandler: any = await import(
        "./account/deleteAccountButtonHandler.js"
      );
      deleteAccountButtonHandler.handler(interaction);

      const liveMatchRefreshButtonhandler: any = await import(
        "./vct/liveMatchRefreshButtonhandler.js"
      );
      liveMatchRefreshButtonhandler.handler(interaction);

      //always keep this last
      // let queueButtonHandler = require("./queueButtonHandler");
      // queueButtonHandler(interaction);
    } //no button press
  });
};
