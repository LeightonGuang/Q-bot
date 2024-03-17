import axios from "axios";

export const subCommand = async (interaction) => {
  const discordId: string = interaction.member.id;
  const userTag: string = interaction.member.user.tag;
  const riotId: string = interaction.options.get("riot-id").value;
  const region: string = interaction.options.get("region").value;
  const rank: string = interaction.options.get("rank").value;

  const [name, tag]: string[] = riotId.split("#");

  if (!tag) {
    interaction.reply({
      content: "Please include a tag in your riot Id",
      ephemeral: true,
    });
    return;
  }

  if (name.length < 3 || name.length > 16 || tag.length < 3 || tag.length > 5) {
    interaction.reply({
      content:
        "Keep the riot id between 3-16 characters\n#tag between 3-5 characters",
      ephemeral: true,
    });
    return;
  }

  try {
    console.log("check if user exist");
    const { data: userExist } = await axios.get(
      "http://localhost:8080/api/account/registered/" + discordId
    );

    if (!userExist) {
      console.log("if user not exist");
      try {
        // create new account
        await axios.post("http://localhost:8080/api/account", {
          discord_id: discordId,
          tag: userTag,
        });
        console.log("LOG: \t" + "new account created");
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }

  // check for duplicate riot id
  try {
    console.log("check for duplicate riot id");
    const { data: isDuplicateRiotId }: { data: boolean } = await axios.get(
      "http://localhost:8080/api/account/riot/is_duplicate",
      {
        data: { discord_id: discordId, riot_id: riotId },
      }
    );

    if (isDuplicateRiotId) {
      await interaction.reply({
        content: "You've already added this account.",
        ephemeral: true,
      });
      console.log("LOG: \t" + "riot id already added");
      return;
    }
  } catch (error) {
    console.error(error);
  }

  // add new riot account
  try {
    console.log("add new riot account");
    await axios.post("http://localhost:8080/api/account/riot/add", {
      discord_id: discordId,
      riot_id: riotId,
      region: region,
      rank: rank,
      active: true,
    });

    await interaction.reply({
      content:
        "new riot account added\n" +
        `tag:\t${userTag}\n` +
        `riot-id:\t${riotId}\n` +
        `region:\t${region}\n` +
        `rank:\t${rank}`,
      ephemeral: true,
    });

    console.log(
      "new riot account added\n" +
        `tag:\t${userTag}\n` +
        `riot-id:\t${riotId}\n` +
        `region:\t${region}\n` +
        `rank:\t${rank}`
    );
  } catch (error) {
    console.error(error);
  }
};
