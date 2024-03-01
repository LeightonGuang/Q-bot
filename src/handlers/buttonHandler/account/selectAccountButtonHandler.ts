import axios from "axios";

export const handler = async (interaction) => {
  console.log("FILE: \t" + "selectAccountButtonHandler.js");

  if (!interaction.isButton()) return;

  //select-type-[id/name]
  const splittedArray = interaction.customId.split("-");

  //if button pressed is not a select account button
  if (splittedArray[0] !== "select") return;

  /**
   * use splittedArray[1] to get the type of account that the user want to select
   * use splittedArray[2] to get the user id that can click on the button
   * use splittedArray[3] to get the riotId that is selected
   * use splittedArray[4] to get the id of the message
   * get the player's object
   * go throught the the player's object
   * make "active attribute" in the riot account object that matches the riot id true
   * and everything else false
   *
   */

  const accountType: string = splittedArray[1];
  const userId: string = splittedArray[2];
  const selectedAccountIdOrName: string = splittedArray[3];
  const replyMsgId: string = splittedArray[4];

  //only the account owner can select their account
  if (interaction.member.id !== userId) {
    await interaction.reply({
      content: "This is not your account",
      ephemeral: true,
    });
    console.log("LOG: \t" + "This is not your account");
    return;
  }

  if (accountType === "riot") {
    try {
      await axios.patch("http://localhost:8080/api/accounts/riot/select", {
        discord_id: interaction.member.id,
        selectedAccountIdOrName: selectedAccountIdOrName,
      });

      await interaction.message.delete(replyMsgId);
      await interaction.reply({
        content: `The account **${selectedAccountIdOrName}** is now selected!`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }
  } else if (accountType === "steam") {
  }
};
