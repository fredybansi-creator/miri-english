// Tests for the answer check of Ralucas Welt (neu/welt/answer.js). Run: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { words, hasKey, missingKey, typedLevel, finalLevel } from '../neu/welt/answer.js';
import friendData from '../neu/welt/friends.js';
import { TOPICS } from '../neu/content/index.js';

const step = (id, n) => friendData.friends.find((f) => f.id === id).steps[n];
const right = (st, said, ai = null) => finalLevel(ai || typedLevel(said, st.answers), said, st.answers, st.keys).level !== 'try';

test('words: punctuation, case, iPhone apostrophes, contractions, numbers, filler words', () => {
  assert.deepEqual(words('I’m FINE, thanks!'), ['i', 'am', 'fine', 'thanks']);
  assert.deepEqual(words("Um, I don't know."), ['i', 'do', 'not', 'know']);
  assert.deepEqual(words('You have 1 brother and 1 sister.'), ['you', 'have', 'one', 'brother', 'and', 'one', 'sister']);
});

test('key words: phrases, joined words, word starts, small slips', () => {
  assert.ok(hasKey('Thank you so much!', 'thank you'));
  assert.ok(hasKey("It's been ages!", "it's been ages"));
  assert.ok(hasKey('Goodnight, Hugo!', 'night'));
  assert.ok(hasKey("I'm exploring the world", 'explor'));
  assert.ok(hasKey("Hi, I'm Raluka.", 'raluca'));
  assert.ok(hasKey('I live in a den on the medow', 'meadow'));
  assert.ok(hasKey('Can I have the candles?', 'candle'));
  assert.ok(hasKey('A honeycake, please', 'cake'));
  assert.ok(!hasKey('I eat breakfast', 'fast'));
  assert.ok(!hasKey('I live in a hole', 'den'));
});

test('every example answer of every friend passes its own key words (also typed with ’ and without punctuation)', () => {
  for (const f of friendData.friends) for (const [i, st] of f.steps.entries()) {
    if (!st.answers) continue;
    for (const a of st.answers) {
      for (const v of [a, a.replace(/'/g, '’'), a.toLowerCase().replace(/[.,!?]/g, '')]) {
        assert.equal(missingKey(v, st.keys), null, `${f.id} step ${i + 1}: "${v}"`);
        assert.ok(right(st, v), `${f.id} step ${i + 1}: "${v}" marked wrong`);
      }
    }
  }
});

test('right answers to the friends are right (as speech recognition writes them)', () => {
  const ok = [
    ['olli', 0, 'My name is Raluka.'], ['olli', 0, 'Hello Olli, I am Raluca'],
    ['olli', 2, 'I prefer the night.'], ['olli', 2, 'I love the day!'],
    ['olli', 4, 'I live in a den in the meadow.'],
    ['rosie', 0, "I'm very well, thank you."], ['rosie', 0, 'Excellent, thanks!'], ['rosie', 0, 'Not bad.'],
    ['rosie', 2, 'I like fish.'], ['rosie', 4, 'Yeah, of course!'], ['rosie', 4, 'Yes, I would love to.'],
    ['hugo', 0, 'Yes, I am very fast.'], ['hugo', 2, 'Go straight ahead and then turn left.'],
    ['hugo', 4, 'Goodnight, Hugo!'], ['hugo', 4, 'Sleep well!'],
    ['storm', 0, 'No, I’m not afraid of you.'], ['storm', 0, "No, I'm not scared."],
    ['storm', 2, "Let's go north!"], ['storm', 4, "Yes, let's be friends."],
    ['luna', 0, "I'm Raluca and I'm exploring the world."], ['luna', 0, "I'm Raluca, I'm discovering the world."],
    ['luna', 4, 'Yes, of course!'], ['luna', 4, "Yes, I'll come back."],
    ['finn', 0, "I'm from the den on the meadow."], ['finn', 2, 'I enjoy swimming.'], ['finn', 4, 'Yes, you can live with me.'],
    ['mia', 0, "That's your daddy."], ['mia', 2, 'You have 1 brother and 1 sister.'], ['mia', 4, 'I love you two, Mia.'],
    ['leo', 0, 'This is grass.'], ['leo', 2, "She's at home."], ['leo', 4, 'Yes, we can hunt together.'],
    ['kiki', 0, 'Yes, thanks. And you?'], ['kiki', 2, "It's blue."], ['kiki', 4, 'Once upon a time there was a little fox.'],
  ];
  for (const [id, n, said] of ok) {
    const st = step(id, n);
    assert.ok(right(st, said, 'good'), `${id} step ${n + 1} with AI "good": "${said}"`);
  }
});

test('nearly an example answer is right even when the AI says "try"', () => {
  assert.ok(right(step('luna', 4), 'Yes, of course.', 'try'));
  assert.ok(right(step('hugo', 4), 'Good night Hugo', 'try'));
});

test('wrong answers stay wrong', () => {
  const no = [['olli', 4, 'I live in a hole in the ground.'], ['olli', 0, 'My name is Anna.'], ['hugo', 2, 'Go right.'], ['kiki', 2, 'It is green.'], ['storm', 2, 'I want to sleep.']];
  for (const [id, n, said] of no) assert.ok(!right(step(id, n), said, 'good'), `${id} step ${n + 1}: "${said}" should be wrong`);
});

test('lesson answers at the question marks and in the quests pass their key words (phrases too)', () => {
  for (const t of TOPICS) for (const l of t.lessons) for (const s of l.say || []) {
    for (const a of s.answers) assert.equal(missingKey(a, s.keywords), null, `${l.id}: "${a}" misses ${JSON.stringify(missingKey(a, s.keywords))}`);
  }
});
