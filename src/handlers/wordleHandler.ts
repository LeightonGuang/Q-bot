export const wordleHandler: any = (client) => {
  client.on("messageCreate", async (message) => {
    if (!message.content.includes("Wordle")) return;

    const [wordle, number, result]: string[] = message.content.split(" ");
    const tries: string = result.split("\n\n")[0].split("/")[0];

    if (wordle === "Wordle" && tries !== "X") {
      await message.react(`<:noice:1079060983449923686>`);
    } else if (wordle === "Wordle" && tries === "X") {
      await message.react(`<:Tbag:1080242887788343366>`);
    }
  });
};
