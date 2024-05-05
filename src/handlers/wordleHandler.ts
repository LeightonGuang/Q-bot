export const wordleHandler: any = (client) => {
  client.on("messageCreate", async (message) => {
    if (!message.content.includes("Wordle")) return;

    const [wordle, number, result]: string[] = message.content.split(" ");
    const tries: string = result.split("\n\n")[0].split("/")[0];

    try {
      if (wordle === "Wordle") {
        switch (tries) {
          case "1": {
            await message.react(`<:gigachad:1232728297205665793>`);
            break;
          }
          case "2": {
            await message.react(`<:nerdCheck:1122113911685140491>`);
            break;
          }
          case "3": {
            await message.react(`<:noice:1079060983449923686>`);
            break;
          }
          case "4": {
            await message.react(`<:BaldwinHand:1232731463733219399>`);
            break;
          }
          case "5": {
            await message.react(`<:shrug:1232731913878245476>`);
            break;
          }
          case "6": {
            await message.react(`<:monkaS:1232729296909373492`);
            break;
          }
          case "X": {
            const emoteList: string[] = [
              `<:Tbag:1080242887788343366>`,
              `<:OmegaNoob:1134059671536291881>`,
              `<:TeaBagging:1078010412030775296>`,
            ];

            const randomEmoteIndex: number = Math.floor(
              Math.random() * emoteList.length
            );
            await message.react(emoteList[randomEmoteIndex]);
            break;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
};
