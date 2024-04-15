import { replyInfos } from "../../utils/vct/replyInfos.js";
export const subCommand = async (interaction) => {
  const team: string = interaction.options.get("team").value;
  const matchStatus: string = interaction.options.get("match-status").value;

  switch (team) {
    case "DFM": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/278/detonation-focusme",
        "americas",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "DRX": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/8185/drx",
        "pacific",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "GEN": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/17/gen-g",
        "pacific",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "GE": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/918/global-esports",
        "pacific",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "PRX": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/624/paper-rex",
        "pacific",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "RRQ": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/878/rex-regum-qeon",
        "pacific",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "T1": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/14/t1",
        "pacific",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "TLN": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/8304/talon-esports",
        "pacific",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "TS": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/6199/team-secret",
        "pacific",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "ZETA": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/5448/zeta-division",
        "pacific",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "BLD": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/6387/bleed",
        "pacific",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
  }
};
