import fs from "fs";
import { writeToFile } from "../../utils/writeToFile.js";
import { fileURLToPath } from "url";
import path from "path";

export const subCommand = async (interaction) => {
  const riotId: string = interaction.options.get("riot-id").value;
  const playerId: number = interaction.member.id;
  const playerTag: string = interaction.member.user.tag;

  const currentFilePath: string = fileURLToPath(import.meta.url);
  const dataFilePath: string = path.resolve(
    path.dirname(currentFilePath),
    "../../../public/data.json"
  );
  const dataFile: string = fs.readFileSync(dataFilePath, "utf-8");
  type RiotAccountObj = {
    riotId: string;
    region: string;
    rank: string;
    active: boolean;
  };

  type SteamAccountObj = {
    accountName: string;
    friendCode: number;
    steamProfileUrl: string;
    active: boolean;
  };

  type PlayerObj = {
    id: number;
    tag: string;
    riotAccountList: RiotAccountObj[];
    steamAccountList: SteamAccountObj[];
  };

  type DataObject = {
    playerList: PlayerObj[];
  };

  const dataObj: DataObject = JSON.parse(dataFile);
  const playerList: PlayerObj[] = dataObj.playerList;
  let playerObj: PlayerObj = playerList.find((obj) => obj.id === playerId);
  const [name, tag]: string[] = riotId.split("#");

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

  // create player object if not exist
  if (!playerObj) {
    playerObj = {
      id: playerId,
      tag: playerTag,
      riotAccountList: [],
      steamAccountList: [],
    };

    playerList.push(playerObj);
    writeToFile(dataObj);
  }

  const region: string = interaction.options.get("region").value;
  const rank: string = interaction.options.get("rank").value;

  const riotAccountList: RiotAccountObj[] = playerObj.riotAccountList;
  const riotIdDuplicate: RiotAccountObj = riotAccountList.find(
    (obj) => obj.riotId === riotId
  );

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
