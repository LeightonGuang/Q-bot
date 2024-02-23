export const stringSelectMenuHandler: Function = async (client) => {
  let helpStringSelectMenuHandler: any = await import(
    "./help/helpStringSelectMenuHandler.js"
  );
  helpStringSelectMenuHandler = helpStringSelectMenuHandler.handler(client);

  let upcomingMatchesStringSelectHandler: any = await import(
    "./vct/upcomingMatchesStringSelectHandler.js"
  );
  upcomingMatchesStringSelectHandler =
    upcomingMatchesStringSelectHandler.handler(client);
};
