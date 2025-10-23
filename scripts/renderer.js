import { getRandomKaomoji } from './kaomoji.js';

const stage = document.getElementById('stage');
const hero = document.querySelector('.hero');
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduceMotion = reduceMotionQuery.matches;

if (!stage || !hero) {
  throw new Error('Missing required DOM elements for kaomoji showcase.');
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const getKaomojiLimit = () => (reduceMotion ? 120 : 220);

const trimKaomoji = () => {
  const kaomojiNodes = stage.querySelectorAll('.kaomoji');
  const excess = kaomojiNodes.length - getKaomojiLimit();

  if (excess > 0) {
    for (let i = 0; i < excess; i += 1) {
      const node = kaomojiNodes[i];
      if (node) {
        node.remove();
      }
    }
  }
};

const handleReduceMotionChange = (event) => {
  reduceMotion = event.matches;
  trimKaomoji();
};

if (typeof reduceMotionQuery.addEventListener === 'function') {
  reduceMotionQuery.addEventListener('change', handleReduceMotionChange);
} else if (typeof reduceMotionQuery.addListener === 'function') {
  reduceMotionQuery.addListener(handleReduceMotionChange);
}

const createKaomoji = (originX, originY, stageRect) => {
  const node = document.createElement('span');
  node.className = 'kaomoji';
  node.textContent = getRandomKaomoji();

  if (reduceMotion) {
    node.classList.add('calm');
  }
  const lateralSpread = stageRect.width * 0.18;
  const startX = (Math.random() - 0.5) * lateralSpread;
  const endX = (Math.random() - 0.5) * lateralSpread;
  const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 60;

  const startRot = reduceMotion ? '0deg' : `${(Math.random() - 0.5) * 60}deg`;
  const endRot = reduceMotion ? '0deg' : `${(Math.random() - 0.5) * 180}deg`;
  const midRot = reduceMotion ? '0deg' : `${(Math.random() - 0.5) * 120}deg`;

  const duration = reduceMotion
    ? 2000 + Math.random() * 800
    : 3600 + Math.random() * 2400;

  node.style.setProperty('--start-x', `${startX}px`);
  node.style.setProperty('--mid-x', `${midX}px`);
  node.style.setProperty('--end-x', `${endX}px`);
  node.style.setProperty('--start-rot', startRot);
  node.style.setProperty('--mid-rot', midRot);
  node.style.setProperty('--end-rot', endRot);
  node.style.left = `${originX}px`;
  node.style.top = `${originY}px`;
  node.style.animationDuration = `${duration}ms`;

  node.addEventListener('animationend', () => {
    node.remove();
  });

  return node;
};

const spawnKaomojiRain = (event, density = 12) => {
  const rect = stage.getBoundingClientRect();
  const baseX = event.clientX - rect.left;
  const baseY = event.clientY - rect.top;
  const maxX = rect.width;
  const maxY = rect.height;

  const sprinkleDensity = reduceMotion ? Math.min(density, 4) : density;

  for (let i = 0; i < sprinkleDensity; i += 1) {
    const offsetX = (Math.random() - 0.5) * 160;
    const offsetY = (Math.random() - 0.5) * 120;
    const originX = clamp(baseX + offsetX, 24, maxX - 24);
    const originY = clamp(baseY + offsetY, 8, maxY - 8);
    const kaomoji = createKaomoji(originX, originY, rect);
    stage.appendChild(kaomoji);
  }

  trimKaomoji();
};

const handleClick = (event) => {
  spawnKaomojiRain(event, 10);

  if (!reduceMotion) {
    hero.animate(
      [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.02)', opacity: 0.95 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      {
        duration: 280,
        easing: 'ease-out'
      }
    );
  }
};

const handleDoubleClick = (event) => {
  spawnKaomojiRain(event, 18);
};

stage.addEventListener('click', handleClick);
stage.addEventListener('dblclick', handleDoubleClick);

window.addEventListener('resize', () => {
  trimKaomoji();
});
