import axios from "axios";

export async function registered(interaction: any, discordId: string) {
  const playerRegistered: boolean = await axios.get(
    "http://localhost:8080/" + discordId
  );
  if (playerRegistered) {
    return true;
  } else if (!playerRegistered) {
    interaction.reply({
      content:
        "Please use the command ***/account add-riot-account*** to add a riot account",
      ephemeral: true,
    });
    return false;
  }
}
