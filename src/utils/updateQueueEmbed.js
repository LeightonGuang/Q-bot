const { EmbedBuilder } = require('discord.js');
const fs = require("node:fs");

module.exports = async (interaction) => {
  const { guild } = interaction;

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);

  let duoRankList = dataObj.duoRankList;
  let trioRankList = dataObj.trioRankList;
  let fiveStackRankList = dataObj.fiveStackRankList;
  let oneVoneList = dataObj.oneVoneList;
  let tenMansList = dataObj.tenMansList;
  let unratedList = dataObj.unratedList;

  let message = await interaction.channel.messages.fetch(dataObj.queueEmbedId);

  let queueEmbed = message.embeds[0];

  //allQueueList and allQueueRoles should have the same order of the list and roles
  let allQueueList = [
    duoRankList,
    trioRankList,
    fiveStackRankList,
    oneVoneList,
    tenMansList,
    unratedList
  ];

  //loop through the list of all the queue list
  for (let i = 0; i < allQueueList.length; i++) {
    let list = allQueueList[i];
    let nameList = [];

    //if queue list is empty
    if (list.length === 0) {
      nameList = "--empty--";

      //if queue list is not empty
    } else {

      //loops through all the id in all the queue list
      for (let queuePlayerId of list) {
        let memberObj = await guild.members.fetch(queuePlayerId);

        //if member don't have nicname then add their username
        if (memberObj.nickname === null) {
          nameList.push(memberObj.user.username);

          //add the nickname of member to nameList
        } else {
          nameList.push(memberObj.nickname);
        }
      }
    }

    //change the value of the fields
    if (nameList === "--empty--") {
      queueEmbed.fields[i].value = nameList;

      //if nameList have a list of people's name
    } else {
      queueEmbed.fields[i].value = nameList.join(", ");
    }
  }

  let newEmbed = new EmbedBuilder()
    .setAuthor(message.embeds[0].author)
    .setTitle(message.embeds[0].title)
    .setDescription(message.embeds[0].description)
    .addFields(queueEmbed.fields)
    .setTimestamp()
    .setColor(0xFF0000);

  console.log("LOG: \t" + "update the field of embed");
  message.edit({ embeds: [newEmbed] });
}
