export const convertCountryToEmoji = (country: string) => {
  const emojiList: Object = {
    Albania: ":flag_al:",
    Austria: ":flag_at:",
    Belgium: ":flag_be:",
    Croatia: ":flag_hr:",
    Czechia: ":flag_cz:",
    Denmark: ":flag_dk:",
    England: ":england:",
    France: ":flag_fr:",
    Georgia: ":flag_ge:",
    Germany: ":flag_de:",
    Hungary: ":flag_hu:",
    Italy: ":flag_it:",
    Netherlands: ":flag_nl:",
    Poland: ":flag_pl:",
    Portugal: ":flag_pt:",
    Romania: ":flag_ro:",
    Scotland: ":scotland:",
    Serbia: ":flag_rs:",
    Slovakia: ":flag_sk:",
    Slovenia: ":flag_si:",
    Spain: ":flag_es:",
    Switzerland: ":flag_ch:",
    Turkey: ":flag_tr:",
    Ukraine: ":flag_ua:",
  };
  return emojiList[country];
};
