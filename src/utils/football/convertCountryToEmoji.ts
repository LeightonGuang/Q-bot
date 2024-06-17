export const convertCountryToEmoji = (country: string) => {
  const emojiList: Object = {
    Albania: "🇦🇱",
    Austria: "🇦🇹",
    Belgium: "🇧🇪",
    Croatia: "🇭🇷",
    Czechia: "🇨🇿",
    Denmark: "🇩🇰",
    England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    France: "🇫🇷",
    Georgia: "🇬🇪",
    Germany: "🇩🇪",
    Hungary: "🇭🇺",
    Italy: "🇮🇹",
    Netherlands: "🇳🇱",
    Poland: "🇵🇱",
    Portugal: "🇵🇹",
    Romania: "🇷🇴",
    Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    Serbia: "🇷🇸",
    Slovakia: "🇸🇰",
    Slovenia: "🇸🇮",
    Spain: "🇪🇸",
    Switzerland: "🇨🇭",
    Turkey: "🇹🇷",
    Ukraine: "🇺🇦",
  };
  return emojiList[country];
};
