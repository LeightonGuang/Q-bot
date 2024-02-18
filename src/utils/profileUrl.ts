export function profileUrl(riotId: string) {
  let modifiedId = riotId.replace(/\s+/g, "%20");
  modifiedId = modifiedId.replace(/#/g, "%23");

  return "https://tracker.gg/valorant/profile/riot/" + modifiedId;
}
