// Which sentences of a lesson become flip cards (Karten tab and the game's question marks).
// repeat + build sentences, and the "Sag es auf Englisch" answers (the most useful lines for real talks).
export function cardItems(lesson) {
  return [
    ...(lesson.repeat || []).map((x) => ({ en: x.en, de: x.de })),
    ...(lesson.build || []).map((x) => ({ en: x.en, de: x.de })),
    ...(lesson.say || []).map((x) => ({ en: x.answers[0], de: x.de })),
  ];
}
