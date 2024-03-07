import axios from "axios";
import { RiotAccount } from "../../types/RiotAccount.js";

export async function registered(interaction: any, discordId: string) {
  try {
    const playerRegistered: boolean = await axios.get(
      "http://localhost:8080/api/accounts/registered/" + discordId
    );
    if (playerRegistered) {
      try {
        const riotAccountList: RiotAccount[] = await axios.get(
          "http://localhost:8080/api/accounts/riot/get/" + discordId
        );

        if (riotAccountList.length === 0) {
          interaction.reply({
            content:
              "Please use the command ***/account add-riot-account*** to add a riot account",
            ephemeral: true,
          });
          return false;
        } else if (riotAccountList.length > 0) {
          return true;
        }
      } catch (error) {
        console.error(error);
      }
    } else if (!playerRegistered) {
      interaction.reply({
        content:
          "Please use the command ***/account add-riot-account*** to add a riot account",
        ephemeral: true,
      });
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
