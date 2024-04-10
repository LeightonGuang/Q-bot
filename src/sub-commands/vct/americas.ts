import { replyInfos } from "../../utils/vct/replyInfos.js";
export const subCommand = async (interaction) => {
  const team: string = interaction.options.get("team").value;

  switch (team) {
    case "SEN": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/2/sentinels"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "C9": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/188/cloud9"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "G2": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/11058/g2-esports"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "KRÜ": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/2355/kr-esports"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "NRG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/1034/nrg-esports"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "LEV": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/2359/leviat-n"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "LOUD": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/6961/loud"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "100T": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/120/100-thieves"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "MIBR": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/7386/mibr"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "FUR": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/2406/furia"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "EG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/5248/evil-geniuses"
      );
      await interaction.reply(replyObj);
      break;
    }
  }
};
