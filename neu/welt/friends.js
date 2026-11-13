// Ralucas Welt, step 6: the animal friends and what they say (easy English, A1–A2).
// Each friend has 5 steps. A step is either
//   say:  the friend asks something, Miri answers in English (voice or typing); `de` tells her what to say,
//         `answers` are good example answers (the server judges her answer against them)
//   bring: the friend wants a thing (`want` = a word of the book: mouse, fish, berries, worm, carrot, crystal …);
//         when Raluca gets one she brings it back.
// Every finished step = one heart. After changing English lines: run tools/make_audio.py and commit audio/.

export default {
  friends: [
    {
      id: 'olli', name: 'Olli', kind: 'owl', icon: '🦉', place: 'den',
      steps: [
        { say: { en: 'Hello! I am Olli, the owl. What is your name?', de: 'Hallo! Ich bin Olli, die Eule. Wie heißt du?' },
          task: 'Sag: Ich heiße Raluca.', answers: ['My name is Raluca.', "I'm Raluca.", 'I am Raluca.'] },
        { say: { en: 'I am very hungry. Can you catch a mouse for me?', de: 'Ich habe großen Hunger. Kannst du mir eine Maus fangen?' },
          want: 'mouse', thanks: { en: 'A mouse! Thank you, Raluca!', de: 'Eine Maus! Danke, Raluca!' } },
        { say: { en: 'Owls like the night. Do you like the night or the day?', de: 'Eulen mögen die Nacht. Magst du die Nacht oder den Tag?' },
          task: 'Sag, ob du die Nacht oder den Tag magst.', answers: ['I like the night.', 'I like the day.', 'I like the day and the night.'] },
        { say: { en: 'Fish are good for owls too. Can you bring me a fish from the water?', de: 'Fische sind auch gut für Eulen. Kannst du mir einen Fisch aus dem Wasser bringen?' },
          want: 'fish', thanks: { en: 'What a big fish! You are a good friend.', de: 'Was für ein großer Fisch! Du bist eine gute Freundin.' } },
        { say: { en: 'Tell me, where do you live?', de: 'Sag mal, wo wohnst du?' },
          task: 'Sag: Ich wohne in einem Bau auf der Wiese.', answers: ['I live in a den on the meadow.', 'I live in a den.', 'My home is a den on the meadow.'] },
      ],
      chat: [{ en: 'Hoo hoo! Nice to see you, Raluca.', de: 'Huhu! Schön, dich zu sehen, Raluca.' }, { en: 'Be careful at night!', de: 'Pass in der Nacht gut auf!' }],
    },
    {
      id: 'rosie', name: 'Rosie', kind: 'rabbit', icon: '🐰', place: 'meadow',
      steps: [
        { say: { en: "Hi! I'm Rosie, the rabbit. How are you today?", de: 'Hi! Ich bin Rosie, das Kaninchen. Wie geht es dir heute?' },
          task: 'Sag, wie es dir geht.', answers: ["I'm fine, thank you.", "I'm good, thanks.", "I'm great, thank you!"] },
        { say: { en: 'I lost my carrot. It is under the ground. Can you dig for a carrot?', de: 'Ich habe meine Karotte verloren. Sie ist unter der Erde. Kannst du nach einer Karotte graben?' },
          want: 'carrot', thanks: { en: 'My carrot! You found it! Thank you!', de: 'Meine Karotte! Du hast sie gefunden! Danke!' } },
        { say: { en: 'Yummy! What is your favourite food?', de: 'Lecker! Was isst du am liebsten?' },
          task: 'Sag, was du am liebsten isst.', answers: ['My favourite food is fish.', 'I like berries.', 'I love mice.'] },
        { say: { en: 'Please get some berries from a bush for me.', de: 'Bitte hol mir ein paar Beeren von einem Busch.' },
          want: 'berries', thanks: { en: 'Sweet berries! I love them. Thank you!', de: 'Süße Beeren! Ich liebe sie. Danke!' } },
        { say: { en: 'Do you want to play with me tomorrow?', de: 'Willst du morgen mit mir spielen?' },
          task: 'Sag: Ja, gern.', answers: ['Yes, I do!', "Yes, I'd love to.", "Yes, let's play tomorrow."] },
      ],
      chat: [{ en: "Let's run! I'm very fast.", de: 'Lass uns rennen! Ich bin sehr schnell.' }, { en: 'The grass is so green today.', de: 'Das Gras ist heute so grün.' }],
    },
    {
      id: 'hugo', name: 'Hugo', kind: 'hedgehog', icon: '🦔', place: 'forest',
      steps: [
        { say: { en: "Hello, I'm Hugo. I am very slow. Are you fast?", de: 'Hallo, ich bin Hugo. Ich bin sehr langsam. Bist du schnell?' },
          task: 'Sag: Ja, ich bin schnell.', answers: ['Yes, I am fast.', "Yes, I'm very fast."] },
        { say: { en: 'Hedgehogs eat worms. Can you dig up a worm for me?', de: 'Igel fressen Würmer. Kannst du mir einen Wurm ausgraben?' },
          want: 'worm', thanks: { en: 'A fat worm! Thank you!', de: 'Ein dicker Wurm! Danke!' } },
        { say: { en: 'I want to go to the pond. Which way is it?', de: 'Ich will zum Teich gehen. Wo lang geht es?' },
          task: 'Sag: Geh geradeaus, dann links.', answers: ['Go straight, then turn left.', 'Go straight on and then left.'] },
        { say: { en: 'I love apples. Can you find an apple for me?', de: 'Ich liebe Äpfel. Kannst du einen Apfel für mich finden?' },
          want: 'apple', thanks: { en: 'A red apple! You are so kind.', de: 'Ein roter Apfel! Du bist so lieb.' } },
        { say: { en: 'I am tired now. I want to sleep. Good night!', de: 'Ich bin jetzt müde. Ich will schlafen. Gute Nacht!' },
          task: 'Sag gute Nacht zu Hugo.', answers: ['Good night, Hugo!', 'Sleep well, Hugo!', 'Good night, sleep well!'] },
      ],
      chat: [{ en: 'Hello again! I am still slow.', de: 'Hallo nochmal! Ich bin immer noch langsam.' }, { en: 'Do you have a worm for me? Just kidding!', de: 'Hast du einen Wurm für mich? Nur Spaß!' }],
    },
    {
      id: 'luna', name: 'Luna', kind: 'owl', icon: '🦉', place: 'hill',
      steps: [
        { say: { en: 'Who are you? Why are you on my hill?', de: 'Wer bist du? Warum bist du auf meinem Hügel?' },
          task: 'Sag: Ich bin Raluca. Ich erkunde die Welt.', answers: ["I'm Raluca. I'm exploring the world.", 'I am Raluca and I am exploring.'] },
        { say: { en: 'There are crystals in this world. Can you find one for me?', de: 'Es gibt Kristalle in dieser Welt. Kannst du einen für mich finden?' },
          want: 'crystal', thanks: { en: 'Oh, it is beautiful! Thank you!', de: 'Oh, er ist wunderschön! Danke!' } },
        { say: { en: 'What did you do today?', de: 'Was hast du heute gemacht?' },
          task: 'Erzähl, was du heute gemacht hast (z. B. Maus gefangen, Fisch gefangen).', answers: ['I caught a mouse and I found a crystal.', 'I went to the pond and I caught a fish.', 'I played with my friends.'] },
        { say: { en: 'An old treasure is buried on my hill. Can you dig it up?', de: 'Auf meinem Hügel ist ein alter Schatz vergraben. Kannst du ihn ausgraben?' },
          want: 'treasure', thanks: { en: 'The treasure! You are very clever, Raluca.', de: 'Der Schatz! Du bist sehr schlau, Raluca.' } },
        { say: { en: 'Will you visit me again?', de: 'Besuchst du mich wieder?' },
          task: 'Sag: Ja, ich besuche dich wieder.', answers: ['Yes, I will visit you again.', 'Yes, of course!', 'Yes, I will come back.'] },
      ],
      chat: [{ en: 'The view from my hill is wonderful.', de: 'Die Aussicht von meinem Hügel ist wunderbar.' }, { en: 'Hello, my clever friend!', de: 'Hallo, meine schlaue Freundin!' }],
    },
  ],
};
