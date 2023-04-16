const fs = require("node:fs");
const writeToFile = require("../utils/writeToFile");
const updateQueueEmbed = require("../utils/updateQueueEmbed");

/**
 * when any queue button is used
 * 
 * add the member the the corresponding queue
 * update the embed
 * check if any member matched
 * region
 * rank
 * if they match start a game
 * 
 * when dequeue is pressed
 * check if member is in any queue
 * if member is in queue (check queue by check if they have role)
 * remove them from their role and their id in the list
 * 
 * if not in queue then reply member not in queue
 */

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    let queueButtonHandler = require("./queueButtonHandler");
    queueButtonHandler(interaction);

    let pollButton = require("../event/pollButtons");
    pollButton(interaction);

  });
};
