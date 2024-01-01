module.exports = (riotId) => {
  //gets the tracker.gg profile url using their riot id
  let modifiedId = riotId.replace(/\s+/g, "%20");
  modifiedId = modifiedId.replace(/#/g, "%23");

  let playerUrl = "https://tracker.gg/valorant/profile/riot/" + modifiedId;
  return playerUrl;
};
