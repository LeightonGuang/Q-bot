/* This is a JavaScript code that checks for a match in a 10-man game or a 1v1 game in a Discord
server. It uses the Discord.js library and the fs module to read and write data to a JSON file. */
const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const fs = require("node:fs");
const updateQueueEmbed = require("../../utils/updateQueueEmbed");
const writeToFile = require('../../utils/writeToFile');

/** check for match
   * 
   * 10 mans
   * if there are more than 10 people
   * check their region
   * 
   * go through the whole tenMansList and see if there are 10 people
   * with the same region
   * 
   * if the region match
   * 
   * get the 10 players with the same region in a new list
   * 
   * remove the 10 players' id from tenManslist
   * 
   * create private vc
   * move all 10 players to private vc and create a private text channel
   * 
   * create a private text channel
   * send all the user info to that channel
   *
   * pick 2 random person as captain
   * 
   * each captain takes turns to pick their teammates
   * 1 2 2 1
   * 
   * ban maps 
   * 
   * split the teams into 2
   *  
   * remove their names from queue embed
   * 
*/

module.exports = async (interaction) => {

  //=============================Start=========================

  const { guild } = interaction;

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);

  let tenMansList = dataObj.tenMansList;
  let playerList = dataObj.playerList;

  /* `const uniqueId = new Set(tenMansList);` is creating a new Set object called `uniqueId` that
  contains all the unique elements from the `tenMansList` array. This is done by passing the
  `tenMansList` array as an argument to the `Set` constructor, which automatically removes any
  duplicate elements and only keeps the unique ones. The resulting `uniqueId` set can be used to
  check the number of unique players in the `tenMansList` array. */
  const uniqueId = new Set(tenMansList);

  //if there are less than 10 people end
  if (uniqueId.size >= 10) return;
  //check if all members are in the same region

  //list of players object that is in the tenMansList
  const tenMansListObj = playerList.filter(item => tenMansList.includes(item.id));
  //console.log("tenMansListObj: \t" + JSON.stringify(tenMansListObj));

  let objListOfTenPlayers = [];
  const regions = ["sea", "na", "eu"];

  //loop through all the regions
  outerloop:
  for (let region of regions) {
    objListOfTenPlayers = [];


    //loop through all the playerObj that is in tenMansList
    for (let playerObj of tenMansListObj) {

      if (playerObj.region === region) {
        //if player match the region
        objListOfTenPlayers.push(playerObj);
      }

      if (objListOfTenPlayers.length === 1) {
        //need this because the list could have more than 10 players
        break outerloop;
      }
    }
  }

  //get their id object

  /* This code block is looping through the `objListOfTenPlayers` array and replacing each element with
  the corresponding object from the `playerList` array that has the same `id` value. This is done to
  convert the array of player IDs into an array of player objects, which will be used later in the
  code. The `console.log` statement is used to print the updated `objListOfTenPlayers` array to the
  console for debugging purposes. */

  console.log("length: \t" + JSON.stringify(objListOfTenPlayers));
  console.log("length: \t" + objListOfTenPlayers.length);

  for (let i = 0; i < objListOfTenPlayers.length; i++) {
    objListOfTenPlayers[i] = playerList.find(obj => obj.id === objListOfTenPlayers[i].id);
  }
  console.log("objListOfTenPlayers: \t" + JSON.stringify(objListOfTenPlayers));

  let queueNotificationChannel = guild.channels.cache.get("1082124963793866843");

  //move players straight into a private vc

  queueNotificationChannel.send("you got a 10 mans game");
  console.log("LOG: \t" + "A match for 10 mans");

  let queuesId = "1102167519583817728";
  textChannelName = "10 mans Lobby";
  voiceChannelName = "10 mans Lobby vc";

  let privateTextChannel = await guild.channels.create({
    name: textChannelName,
    type: 0,
    parent: queuesId,
  });

  let privateVc = await guild.channels.create({
    name: voiceChannelName,
    type: 2,
    userLimit: 10,
    parent: queuesId,
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [Discord.PermissionsBitField.Flags.Connect]
      }
    ]
  });

  //loop through the list of member to let them connect to the private vc
  for (let member of objListOfTenPlayers) {
    member = await guild.members.fetch(member.id);
    privateVc.permissionOverwrites.edit(member, { [Discord.PermissionsBitField.Flags.Connect]: true })

    //move the list of member to the private vc
    member.voice.setChannel(privateVc);


    let tenMansRole = guild.roles.cache.find((role) => role.name === "10 mans");

    //remove 10 mans role
    await member.roles.remove(tenMansRole);
  }

  /* This code block is creating an object called `customVcObj` that contains information about the
  custom voice channel that will be created for the 10-man game. The object has the following
  properties: */
  let customVcObj = {
    type: "10 mans",
    region: objListOfTenPlayers[0].region,
    textChannelId: privateTextChannel.id,
    voiceChannelId: privateVc.id,
    playersList: objListOfTenPlayers
  }

  let customLobby = dataObj.customLobby;

  customLobby.push(customVcObj);
  writeToFile(dataObj, "data.json");

  //send players riot id to private text Channel
  let infoEmbed = new EmbedBuilder()
    .setColor(0xFFFFFF)
    .setAuthor({ name: "Q bot" })
    .setTitle("Player Info")
    .setTimestamp()

  for (let i = 0; i < objListOfTenPlayers.length; i++) {
    infoEmbed.addFields(
      { name: "Member", value: objListOfTenPlayers[i].tag, inline: true },
      { name: "Riot Id", value: objListOfTenPlayers[i].riotId, inline: true },
      { name: "\u200B", value: "\u200B" },
    )
  }

  privateTextChannel.send({ embeds: [infoEmbed] });

  let updatedTenMansList = tenMansList.filter(id => !Array.from(uniqueId).includes(id));
  console.log(updatedTenMansList);
  dataObj.tenMansList = updatedTenMansList;
  writeToFile(dataObj, "data.json");

  updateQueueEmbed(interaction);
}