const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("player-info")
    .setDescription("setup player profile")
    .addStringOption((option) =>
      option
        .setName("region")
        .setDescription("Choose your region")
        .setRequired(true)
        .setChoices(
          { name: "SEA", value: "sea" },
          { name: "NA", value: "na" },
          { name: "EU", value: "eu" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("rank")
        .setDescription("Choose your rank")
        .setRequired(true)
        .setChoices(
          { name: "Iron 1", value: "I1" },
          { name: "Iron 2", value: "I2" },
          { name: "Iron 3", value: "I3" },
          { name: "Bronze 1", value: "B1" },
          { name: "Bronze 2", value: "B2" },
          { name: "Bronze 3", value: "B3" },
          { name: "Silver 1", value: "S1" },
          { name: "Silver 2", value: "S2" },
          { name: "Silver 3", value: "S3" },
          { name: "Gold 1", value: "G1" },
          { name: "Gold 2", value: "G2" },
          { name: "Gold 3", value: "G3" },
          { name: "Platinum 1", value: "P1" },
          { name: "Platinum 2", value: "P2" },
          { name: "Platinum 3", value: "P3" },
          { name: "Diamond 1", value: "D1" },
          { name: "Diamond 2", value: "D2" },
          { name: "Diamond 3", value: "D3" },
          { name: "Ascendant 1", value: "A1" },
          { name: "Ascendant 2", value: "A2" },
          { name: "Ascendant 3", value: "A3" },
          { name: "Immortal 1", value: "Im1" },
          { name: "Immortal 2", value: "Im2" },
          { name: "Immortal 3", value: "Im3" },
          { name: "Radiant", value: "R" }
        )
    ),
  async execute(interaction) {
    let dataFile = fs.readFileSync('data.json');
    let jsonData = JSON.parse(dataFile);

    let list = jsonData.list;
    let playerId = interaction.member.id;
    let playerTag = interaction.member.user.tag;
    let region = interaction.options.get("region").value;
    let rank = interaction.options.get("rank").value;

    let player = {
      id: playerId,
      tag: playerTag,
      region: region,
      rank: rank
    }

    //if list is empty just add player info to data.json
    if (list.length === 0) {
      list.push(player);
      jsonData.list = list;
      let data = JSON.stringify(jsonData, null, 2);
      fs.writeFileSync('data.json', data);

    } else {
      for (let i = 0; i < list.length; i++) {
        let noDuplicate = true;
        console.log(`playerId: ${playerId}  property value: ${list[i].id} i: ${i}`);
        //if player already exist
        if (playerId == list[i].id) {
          interaction.channel.send("duplicate");
          console.log("duplicate");
          noDuplicate = false;
          break;
        }
        if (noDuplicate) {
          list.push(player);
          jsonData.list = list;
          let data = JSON.stringify(jsonData, null, 2);
          fs.writeFileSync('data.json', data);
        }
      }
    }



    //else then ignore
    await interaction.reply(`${playerTag} \t region: ${region} \t rank: ${rank}`);
    console.log("LOG: \t" + `${playerTag} \t region: ${region} \t rank: ${rank}`);
  },
};
