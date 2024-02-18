interface PlayerList {
  id: number;
  tag: string;
  riotAccountList: object[];
  steamAccountList: object[];
}

export function registered(
  interaction: any,
  playerList: PlayerList[],
  userId: number
) {
  const playerRegistered = playerList.find((obj) => obj.id === userId);

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
