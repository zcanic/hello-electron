import { getRandomKaomoji } from './kaomoji.js';

const stage = document.getElementById('stage');
const hero = document.querySelector('.hero');
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduceMotion = reduceMotionQuery.matches;
const EDGE_PADDING_X = 24;
const EDGE_PADDING_Y = 8;
const POINTER_SPREAD_X = 60;
const POINTER_SPREAD_Y = 90;
const CURSOR_RADIUS = 19;

const pointerState = {
  active: false,
  x: EDGE_PADDING_X,
  y: EDGE_PADDING_Y,
  rect: null
};

let pointerRainInterval = 140;
let pointerRainDensity = 2;
let lastPointerSpawnAt = 0;
let pointerAnimationFrame = null;

const cursorNode = document.createElement('div');
cursorNode.className = 'cursor-kaomoji';

if (!stage || !hero) {
  throw new Error('Missing required DOM elements for kaomoji showcase.');
}

stage.appendChild(cursorNode);
pointerState.rect = stage.getBoundingClientRect();

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const getKaomojiLimit = () => (reduceMotion ? 120 : 220);

const updatePointerRainSettings = () => {
  pointerRainInterval = reduceMotion ? 260 : 140;
  pointerRainDensity = reduceMotion ? 1 : 2;
};

updatePointerRainSettings();

const syncCursorPosition = (x, y) => {
  cursorNode.style.transform = `translate3d(${x - CURSOR_RADIUS}px, ${y - CURSOR_RADIUS}px, 0)`;
};

const setCursorVisibility = (isVisible) => {
  if (isVisible) {
    cursorNode.classList.add('is-visible');
  } else {
    cursorNode.classList.remove('is-visible');
  }
};

const updatePointerStateFromEvent = (event) => {
  pointerState.rect = stage.getBoundingClientRect();
  const relativeX = clamp(event.clientX - pointerState.rect.left, EDGE_PADDING_X, pointerState.rect.width - EDGE_PADDING_X);
  const relativeY = clamp(event.clientY - pointerState.rect.top, EDGE_PADDING_Y, pointerState.rect.height - EDGE_PADDING_Y);
  pointerState.x = relativeX;
  pointerState.y = relativeY;
  syncCursorPosition(relativeX, relativeY);
};

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
  updatePointerRainSettings();
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
    const originX = clamp(baseX + offsetX, EDGE_PADDING_X, maxX - EDGE_PADDING_X);
    const originY = clamp(baseY + offsetY, EDGE_PADDING_Y, maxY - EDGE_PADDING_Y);
    const kaomoji = createKaomoji(originX, originY, rect);
    stage.appendChild(kaomoji);
  }

  trimKaomoji();
};

const spawnPointerRain = (density = pointerRainDensity) => {
  if (!pointerState.rect) {
    pointerState.rect = stage.getBoundingClientRect();
  }

  const { width, height } = pointerState.rect;
  const baseX = clamp(pointerState.x, EDGE_PADDING_X, width - EDGE_PADDING_X);
  const baseY = clamp(pointerState.y, EDGE_PADDING_Y, height - EDGE_PADDING_Y);
  const sprinkleDensity = Math.max(0, density);

  if (!pointerState.active || Number.isNaN(baseX) || Number.isNaN(baseY)) {
    return;
  }

  for (let i = 0; i < sprinkleDensity; i += 1) {
    const offsetX = (Math.random() - 0.5) * POINTER_SPREAD_X;
    const offsetY = (Math.random() - 0.5) * POINTER_SPREAD_Y;
    const originX = clamp(baseX + offsetX, EDGE_PADDING_X, width - EDGE_PADDING_X);
    const originY = clamp(baseY + offsetY, EDGE_PADDING_Y, height - EDGE_PADDING_Y);
    const kaomoji = createKaomoji(originX, originY, pointerState.rect);
    stage.appendChild(kaomoji);
  }

  trimKaomoji();
};

const pointerRainLoop = (timestamp) => {
  if (!pointerState.active) {
    lastPointerSpawnAt = timestamp;
  } else if (timestamp - lastPointerSpawnAt >= pointerRainInterval) {
    spawnPointerRain();
    lastPointerSpawnAt = timestamp;
  }

  pointerAnimationFrame = window.requestAnimationFrame(pointerRainLoop);
};

pointerAnimationFrame = window.requestAnimationFrame(pointerRainLoop);

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
stage.addEventListener('pointerenter', (event) => {
  pointerState.active = true;
  updatePointerStateFromEvent(event);
  setCursorVisibility(true);
  spawnPointerRain(pointerRainDensity + 1);
});

stage.addEventListener('pointermove', (event) => {
  pointerState.active = true;
  updatePointerStateFromEvent(event);
  setCursorVisibility(true);
});

stage.addEventListener('pointerleave', () => {
  pointerState.active = false;
  setCursorVisibility(false);
});

window.addEventListener('blur', () => {
  pointerState.active = false;
  setCursorVisibility(false);
});

window.addEventListener('resize', () => {
  trimKaomoji();
  pointerState.rect = stage.getBoundingClientRect();

  if (pointerState.active) {
    pointerState.x = clamp(pointerState.x, EDGE_PADDING_X, pointerState.rect.width - EDGE_PADDING_X);
    pointerState.y = clamp(pointerState.y, EDGE_PADDING_Y, pointerState.rect.height - EDGE_PADDING_Y);
    syncCursorPosition(pointerState.x, pointerState.y);
  }
});
