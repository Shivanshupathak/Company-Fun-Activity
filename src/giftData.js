// Replace any `media` value with your own image or GIF path.
// Example local file: "/media/my-surprise.gif"
// Put local files inside the public/media folder.

// One row per page and one file per mystery box.
// You can give all 24 boxes a different image or GIF.
const mediaByPage = [
  ["/media/g9912-1.gif", "/media/ye.gif", "/media/g9912-2.gif"],
  ["/media/g9912-6.gif", "/media/g9912-3.gif", "/media/1000049804.gif"],
  ["/media/g9912-7.gif", "/media/garam-mas.gif", "/media/g9912-5.gif"],
  ["/media/kgf-chapter2.gif", "/media/mouli-middle-class-biopic.gif", "/media/rey-evarra-meerantha.gif"],
  ["/media/balayy.gif", "/media/balayy.gif", "/media/balayy.gif"],
  ["/media/moham.gif", "/media/mohammad.gif", "/media/tumhe-.gif"],
  ["/media/cid-pizza-bhya.gif", "/media/cid-pizza-bhya.gif", "/media/cid-pizza-bhya.gif"],
  ["/media/r2h-oh-re-maiya.gif", "/media/memes-maaro.gif", "/media/bhagwan-ka.gif"],
];

const pageThemes = [
  { name: "Moonlight Magic", accent: "#bda5ff", emoji: "🌙" },
  { name: "Candy Carnival", accent: "#ff8fbd", emoji: "🍬" },
  { name: "Ocean Treasure", accent: "#70e1f5", emoji: "🌊" },
  { name: "Golden Wishes", accent: "#ffd166", emoji: "✨" },
  { name: "Forest Secrets", accent: "#7ee787", emoji: "🌿" },
  { name: "Cosmic Dreams", accent: "#ff78c4", emoji: "🪐" },
  { name: "Sunset Party", accent: "#ff9f68", emoji: "🎉" },
  { name: "Final Celebration", accent: "#f9e27d", emoji: "🏆" },
];

export const gamePages = pageThemes.map((theme, pageIndex) => ({
  ...theme,
  gifts: Array.from({ length: 3 }, (_, giftIndex) => ({
    id: `${pageIndex + 1}-${giftIndex + 1}`,
    label: `Mystery ${giftIndex + 1}`,
    title: "Here is your challenge 🤪",
    message: `Demo reward from level ${pageIndex + 1}. Replace this image or GIF whenever you're ready.`,
    media: mediaByPage[pageIndex][giftIndex],
  })),
}));
