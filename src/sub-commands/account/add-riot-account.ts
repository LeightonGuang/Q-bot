import fs from "fs";
import { writeToFile } from "../../utils/writeToFile.js";
import { fileURLToPath } from "url";
import path from "path";

export const subCommand = async (interaction) => {
  const riotId: string = interaction.options.get("riot-id").value;
  const playerId: number = interaction.member.id;
  const playerTag: string = interaction.member.user.tag;

  const currentFilePath = fileURLToPath(import.meta.url);
  const dataFilePath = path.resolve(
    path.dirname(currentFilePath),
    "../../../public/data.json"
  );
  const dataFile = fs.readFileSync(dataFilePath, "utf-8");
  type RiotAccountObj = {
    riotId: string;
    region: string;
    rank: string;
    active: boolean;
  };

  type PlayerObj = {
    id: number;
    tag: string;
    riotAccountList: RiotAccountObj[];
  };

  type DataObject = {
    playerList: PlayerObj[];
  };

  const dataObj: DataObject = JSON.parse(dataFile);
  const playerList: PlayerObj[] = dataObj.playerList;
  const playerObj: PlayerObj = playerList.find((obj) => obj.id === playerId);
  const [name, tag] = riotId.split("#");

  if (!tag) {
    interaction.reply({
      content: "Please include a tag in the riot Id",
      ephemeral: true,
    });
    return;
  }

  if (name.length < 3 || name.length > 16 || tag.length < 3 || tag.length > 5) {
    interaction.reply({
      content:
        "Keep your riot id between 3-16 characters\n#tag between 3-5 characters",
      ephemeral: true,
    });
    return;
  }

  let region = interaction.options.get("region").value;
  let rank = interaction.options.get("rank").value;

  let riotAccountList = playerObj.riotAccountList;
  let riotIdDuplicate = riotAccountList.find((obj) => obj.riotId === riotId);

  if (riotIdDuplicate) {
    // check for duplicate riot id
    await interaction.reply({
      content: "You've already added this account.",
      ephemeral: true,
    });
    console.log("LOG: \t" + "riot id already added");
    return;
  }

  if (riotAccountList) {
    // make all old riot accounts inactive
    for (let riotAccount of riotAccountList) {
      riotAccount.active = false;
    }
  }

  let riotAccountObj = {
    riotId: riotId,
    region: region,
    rank: rank,
    active: true,
  };

  playerObj.riotAccountList.push(riotAccountObj);
  writeToFile(dataObj);

  await interaction.reply({
    content:
      "new riot account added\n" +
      `tag:\t${playerTag}\n` +
      `riot-id:\t${riotId}\n` +
      `region:\t${region}\n` +
      `rank:\t${rank}`,
    ephemeral: true,
  });

  console.log(
    "new riot account added\n" +
      `tag:\t${playerTag}\n` +
      `riot-id:\t${riotId}\n` +
      `region:\t${region}\n` +
      `rank:\t${rank}`
  );
};
