import test from 'node:test';
import assert from 'node:assert/strict';

import { kaomojiPool, getRandomKaomoji } from '../scripts/kaomoji.js';

test('kaomoji pool is not empty and contains only strings', () => {
  assert.ok(Array.isArray(kaomojiPool), 'kaomoji pool should be an array');
  assert.ok(kaomojiPool.length > 0, 'kaomoji pool should have entries');
  for (const entry of kaomojiPool) {
    assert.equal(typeof entry, 'string', 'every kaomoji should be a string');
    assert.notEqual(entry.trim().length, 0, 'kaomoji strings should not be empty');
  }
});

test('kaomoji pool does not contain duplicates', () => {
  const uniqueCount = new Set(kaomojiPool).size;
  assert.equal(uniqueCount, kaomojiPool.length, 'kaomoji pool should be unique');
});

test('getRandomKaomoji always returns a pool member', () => {
  const samples = Array.from({ length: 200 }, () => getRandomKaomoji());
  for (const sample of samples) {
    assert.ok(kaomojiPool.includes(sample), 'sample should come from pool');
  }
  const variety = new Set(samples).size;
  assert.ok(variety > 1, 'random generator should produce variety');
});
