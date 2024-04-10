import { replyInfos } from "../../utils/vct/replyInfos.js";
export const subCommand = async (interaction) => {
  const team: string = interaction.options.get("team").value;

  switch (team) {
    case "DFM": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/278/detonation-focusme",
        "americas"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "DRX": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/8185/drx",
        "pacific"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "GEN": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/17/gen-g",
        "pacific"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "GE": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/918/global-esports",
        "pacific"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "PRX": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/624/paper-rex",
        "pacific"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "RRQ": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/878/rex-regum-qeon",
        "pacific"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "T1": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/14/t1",
        "pacific"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "TLN": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/8304/talon-esports",
        "pacific"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "TS": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/6199/team-secret",
        "pacific"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "ZETA": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/5448/zeta-division",
        "pacific"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "BLD": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/6387/bleed",
        "pacific"
      );
      await interaction.reply(replyObj);
      break;
    }
  }
};
