# Unwrap the Surprise

An 8-level React gift game with 3 clickable boxes on every level.

## Run

```bash
npm install
npm run dev
```

## Add images or GIFs

Put your files in `public/media`, then edit the `mediaByPage` list in
`src/giftData.js`. It has 8 rows for the pages and 3 files in every row:

```js
const mediaByPage = [
  [
    "/media/page-1-box-1.gif",
    "/media/page-1-box-2.jpg",
    "/media/page-1-box-3.png",
  ],
  // Pages 2 through 8 follow the same format.
];
```

That file also contains every page title, color, emoji, gift title, and message.

## Add logos for Guess Brand Game

Put the 23 logo files in `public/logos`. The expected filenames and all question
answers are listed in `src/brandData.js`. Each question has its own `logo` path,
so you can rename or replace every file independently.
