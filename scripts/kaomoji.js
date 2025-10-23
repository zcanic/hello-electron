export const kaomojiPool = [
  '(ﾉ´ヮ`)ﾉ*: ･ﾟ',
  '(ノ◕ヮ◕)ノ*:・ﾟ✧',
  '(っ´▽`)っ',
  '(๑˃ᴗ˂)ﻭ',
  '(づ｡◕‿‿◕｡)づ',
  '( •̀ᴗ•́ )و ̑̑',
  'ヽ(＾Д＾)ﾉ',
  '(๑˃̵ᴗ˂̵)و',
  '(･ω･)b',
  '(~‾▿‾)~',
  '\\(＾▽＾)／',
  '(ﾉ≧ڡ≦)',
  '(ง •̀_•́)ง',
  '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
  '(｡♥‿♥｡)',
  'ヾ(＾-＾)ノ',
  '(≧▽≦)'
];

const getRandomIndex = () => Math.floor(Math.random() * kaomojiPool.length);

export const getRandomKaomoji = () => kaomojiPool[getRandomIndex()];
