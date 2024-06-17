import { table } from "table";
import axios from "axios";
import { convertCountryToEmoji } from "../../utils/football/convertCountryToEmoji.js";

export const subCommand = async (interaction, footballDataApiUrl, headers) => {
  const leagueValue: string = interaction.options.get("league").value;

  try {
    const {
      data: { competition, standings },
    }: { data: any; competitions: any; standings: any[] } = await axios.get(
      footballDataApiUrl + "/competitions/" + leagueValue + "/standings",
      { headers }
    );

    const tableConfig: any = {
      border: {
        topBody: `─`,
        topJoin: `┬`,
        topLeft: `┌`,
        topRight: `┐`,

        bottomBody: `─`,
        bottomJoin: `┴`,
        bottomLeft: `└`,
        bottomRight: `┘`,

        bodyLeft: `│`,
        bodyRight: `│`,
        bodyJoin: `│`,

        joinBody: `─`,
        joinLeft: `├`,
        joinRight: `┤`,
        joinJoin: `┼`,
      },

      singleLine: true,
    };

    let allGroupsTable: string;

    standings.forEach((group) => {
      const groupName: string = group.group;

      allGroupsTable += "```" + groupName + "\n";

      const groupTable: any[] = group.table;
      const teamStatsList: string[][] = groupTable.map((teamObj) => {
        return [
          convertCountryToEmoji(teamObj.team.name) + teamObj.team.tla,
          teamObj.won,
          teamObj.draw,
          teamObj.lost,
          teamObj.goalDifference,
          teamObj.points,
        ];
      });

      teamStatsList.unshift(["Team", "W", "D", "L", "GD", "Pts"]);

      allGroupsTable += table(teamStatsList, tableConfig) + "```\n";
    });

    try {
      console.log(allGroupsTable);
      await interaction.reply({
        content: allGroupsTable,
      });
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};
