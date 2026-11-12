// Topic "Reisen" (travel) – 5 lessons for the new daily practice (level A2–B1, short sentences, no idioms).
// Each lesson is one day (about 10 minutes):
//   repeat: hear a sentence, say it again               { en, de }
//   build:  tap the words in the right order            { en, de, extra?: [wrong words to add] }
//   say:    see German, say it in English               { they?, de, answers: [...], keywords: [[alternatives], ...] }
//           they = what the other person says first (read aloud with the second voice)
//   story:  listen to a short story, answer 2 questions { title, de, lines: [...], questions: [{ q, qde, options, answer }] }
// After changing English sentences: run tools/make_audio.py and commit audio/.

export default {
  id: 'travel',
  title: 'Reisen',
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 't1',
      title: 'Am Flughafen',
      en: 'At the airport',
      goal: 'Einchecken, Fragen am Schalter verstehen und beantworten',
      repeat: [
        { en: "Here's my passport.", de: 'Hier ist mein Reisepass.' },
        { en: "I'd like a window seat, please.", de: 'Ich hätte gern einen Fensterplatz, bitte.' },
        { en: 'I have one suitcase.', de: 'Ich habe einen Koffer.' },
        { en: 'Which gate is it?', de: 'Welches Gate ist es?' },
      ],
      build: [
        { en: 'Where can I check in?', de: 'Wo kann ich einchecken?', extra: ['do'] },
        { en: 'My flight is at ten.', de: 'Mein Flug ist um zehn.', extra: ['on'] },
        { en: 'Is the flight on time?', de: 'Ist der Flug pünktlich?', extra: ['in'] },
      ],
      say: [
        {
          they: 'Good morning. Where are you flying today?',
          de: 'Ich fliege nach London.',
          answers: ["I'm flying to London.", 'I am flying to London.', 'To London.'],
          keywords: [['flying to london', 'fly to london', 'to london', 'going to london']],
        },
        {
          they: 'Do you have any bags to check in?',
          de: 'Ja, ich habe einen Koffer.',
          answers: ['Yes, I have one suitcase.', 'Yes, I have a suitcase.', 'Yes, one suitcase.'],
          keywords: [['yes'], ['suitcase', 'bag']],
        },
        {
          they: 'Would you like a window seat or an aisle seat?',
          de: 'Einen Fensterplatz, bitte.',
          answers: ['A window seat, please.', "I'd like a window seat, please.", 'Window, please.'],
          keywords: [['window'], ['please']],
        },
      ],
      story: {
        title: 'Annas Flug',
        de: 'Anna fliegt in den Urlaub. Hör gut zu.',
        lines: [
          'Anna is at the airport.',
          'She is flying to Lisbon for a holiday.',
          'She checks in her big red suitcase.',
          'Then she buys a coffee and a sandwich.',
          'Her flight is at eleven o\'clock.',
          'But at ten, she hears an announcement.',
          'The flight is thirty minutes late.',
          'Anna is not angry. She reads her book and waits.',
        ],
        questions: [
          { q: 'Where is Anna flying?', qde: 'Wohin fliegt Anna?', options: ['To London', 'To Lisbon', 'To Rome'], answer: 1 },
          { q: 'What is the problem?', qde: 'Was ist das Problem?', options: ['Her suitcase is lost.', 'She has no ticket.', 'The flight is late.'], answer: 2 },
        ],
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 't2',
      title: 'Im Hotel',
      en: 'At the hotel',
      goal: 'Einchecken im Hotel und nach Dingen fragen',
      repeat: [
        { en: 'I have a reservation.', de: 'Ich habe eine Reservierung.' },
        { en: 'My name is Miri.', de: 'Mein Name ist Miri.' },
        { en: 'What time is breakfast?', de: 'Wann gibt es Frühstück?' },
        { en: 'Is there Wi-Fi in the room?', de: 'Gibt es WLAN im Zimmer?' },
      ],
      build: [
        { en: 'We are staying for three nights.', de: 'Wir bleiben drei Nächte.', extra: ['since'] },
        { en: 'Can I have the key, please?', de: 'Kann ich bitte den Schlüssel haben?', extra: ['give'] },
        { en: 'The room is very nice.', de: 'Das Zimmer ist sehr schön.', extra: ['much'] },
      ],
      say: [
        {
          they: 'Hello, welcome! How can I help you?',
          de: 'Hallo, ich habe eine Reservierung.',
          answers: ['Hello, I have a reservation.', 'Hi, I have a reservation.', 'Hello, I have a booking.'],
          keywords: [['reservation', 'booking']],
        },
        {
          they: 'How many nights are you staying?',
          de: 'Drei Nächte.',
          answers: ['Three nights.', "We're staying for three nights.", 'For three nights.'],
          keywords: [['three nights']],
        },
        {
          they: 'Here is your key. Do you have any questions?',
          de: 'Ja, wann gibt es Frühstück?',
          answers: ['Yes, what time is breakfast?', 'Yes, when is breakfast?'],
          keywords: [['what time', 'when'], ['breakfast']],
        },
      ],
      story: {
        title: 'Ein Zimmer mit Aussicht',
        de: 'Tom kommt in seinem Hotel an. Hör gut zu.',
        lines: [
          'Tom arrives at his hotel in the evening.',
          'He is tired after a long day.',
          'The woman at the desk is very friendly.',
          'She gives him the key for room 204.',
          'Breakfast is from seven to ten.',
          'Tom goes to his room and opens the window.',
          'He can see the sea!',
          'He smiles and goes to bed early.',
        ],
        questions: [
          { q: 'What is Tom\'s room number?', qde: 'Welche Zimmernummer hat Tom?', options: ['204', '402', '240'], answer: 0 },
          { q: 'What can Tom see from the window?', qde: 'Was sieht Tom aus dem Fenster?', options: ['The mountains', 'The sea', 'A park'], answer: 1 },
        ],
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 't3',
      title: 'Den Weg finden',
      en: 'Finding the way',
      goal: 'Nach dem Weg fragen und Bus oder Zug nehmen',
      repeat: [
        { en: 'Excuse me, where is the station?', de: 'Entschuldigung, wo ist der Bahnhof?' },
        { en: 'Is it far from here?', de: 'Ist es weit von hier?' },
        { en: 'Go straight on and turn left.', de: 'Geh geradeaus und dann links.' },
        { en: 'A ticket to the city centre, please.', de: 'Eine Fahrkarte ins Stadtzentrum, bitte.' },
      ],
      build: [
        { en: 'How do I get to the museum?', de: 'Wie komme ich zum Museum?', extra: ['go'] },
        { en: 'Which bus goes to the beach?', de: 'Welcher Bus fährt zum Strand?', extra: ['drives'] },
        { en: 'It is about ten minutes on foot.', de: 'Es ist ungefähr zehn Minuten zu Fuß.', extra: ['with'] },
      ],
      say: [
        {
          de: 'Entschuldigung, wo ist der Bahnhof?',
          answers: ['Excuse me, where is the station?', 'Excuse me, where is the train station?', "Excuse me, where's the station?"],
          keywords: [['excuse me', 'sorry'], ['where'], ['station']],
        },
        {
          they: "It's not far. About five minutes on foot.",
          de: 'Super, vielen Dank!',
          answers: ['Great, thank you very much!', 'Great, thanks a lot!', 'Great, thank you!'],
          keywords: [['thank you', 'thanks']],
        },
        {
          they: 'Hello. Where would you like to go?',
          de: 'Eine Fahrkarte zum Flughafen, bitte.',
          answers: ['A ticket to the airport, please.', 'One ticket to the airport, please.'],
          keywords: [['ticket'], ['to the airport']],
        },
      ],
      story: {
        title: 'Der falsche Bus',
        de: 'Lisa will zum Strand fahren. Hör gut zu.',
        lines: [
          'Lisa wants to go to the beach.',
          'She takes the number five bus.',
          'After twenty minutes, she sees a lot of shops, but no sea.',
          'She asks the driver, "Is this the bus to the beach?"',
          'The driver says, "No, sorry. You need the number nine."',
          'Lisa gets off at the next stop.',
          'She finds a little café and has an ice cream.',
          'Then she takes the right bus.',
        ],
        questions: [
          { q: 'Which bus does Lisa take first?', qde: 'Welchen Bus nimmt Lisa zuerst?', options: ['Number five', 'Number nine', 'Number one'], answer: 0 },
          { q: 'What does Lisa do in the café?', qde: 'Was macht Lisa im Café?', options: ['She drinks a coffee.', 'She has an ice cream.', 'She reads a book.'], answer: 1 },
        ],
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 't4',
      title: 'Im Restaurant',
      en: 'At the restaurant',
      goal: 'Einen Tisch bekommen, bestellen und bezahlen',
      repeat: [
        { en: 'A table for two, please.', de: 'Einen Tisch für zwei, bitte.' },
        { en: 'Can I see the menu, please?', de: 'Kann ich bitte die Karte sehen?' },
        { en: "I'll have the fish, please.", de: 'Ich nehme den Fisch, bitte.' },
        { en: 'Can we have the bill, please?', de: 'Können wir bitte die Rechnung haben?' },
      ],
      build: [
        { en: 'What do you recommend?', de: 'Was empfehlen Sie?', extra: ['does'] },
        { en: 'I would like a glass of water.', de: 'Ich hätte gern ein Glas Wasser.', extra: ['want'] },
        { en: 'The food was really good.', de: 'Das Essen war wirklich gut.', extra: ['well'] },
      ],
      say: [
        {
          they: 'Good evening! How many people?',
          de: 'Zwei Personen, bitte.',
          answers: ['Two people, please.', 'Two, please.', 'A table for two, please.'],
          keywords: [['two']],
        },
        {
          they: 'Are you ready to order?',
          de: 'Ja, ich nehme die Pasta, bitte.',
          answers: ["Yes, I'll have the pasta, please.", "Yes, I'd like the pasta, please.", 'Yes, the pasta, please.'],
          keywords: [['yes'], ['pasta']],
        },
        {
          they: 'Was everything okay?',
          de: 'Ja, es war sehr lecker, danke!',
          answers: ['Yes, it was delicious, thank you!', 'Yes, it was very good, thanks!', 'Yes, it was really tasty, thank you!'],
          keywords: [['delicious', 'very good', 'tasty', 'really good', 'great', 'lovely'], ['thank', 'thanks']],
        },
      ],
      story: {
        title: 'Ein Abend in Rom',
        de: 'Maria und Paul gehen essen. Hör gut zu.',
        lines: [
          'Maria and Paul are on holiday in Rome.',
          'In the evening, they go to a small restaurant.',
          'The waiter gives them a table near the window.',
          'Maria orders a pizza, and Paul has the pasta.',
          'They also have a big bottle of water.',
          'The food is very good.',
          'After dinner, Paul asks for the bill.',
          'It is forty euros, and they pay by card.',
        ],
        questions: [
          { q: 'What does Maria order?', qde: 'Was bestellt Maria?', options: ['Pasta', 'Fish', 'A pizza'], answer: 2 },
          { q: 'How much is the bill?', qde: 'Wie viel kostet die Rechnung?', options: ['Fourteen euros', 'Forty euros', 'Four euros'], answer: 1 },
        ],
      },
    },
    // ------------------------------------------------------------------ 5
    {
      id: 't5',
      title: 'Wenn etwas schiefgeht',
      en: 'When something goes wrong',
      goal: 'Ein Problem erklären und um Hilfe bitten',
      repeat: [
        { en: 'Can you help me, please?', de: 'Können Sie mir bitte helfen?' },
        { en: 'I lost my bag.', de: 'Ich habe meine Tasche verloren.' },
        { en: "My suitcase didn't arrive.", de: 'Mein Koffer ist nicht angekommen.' },
        { en: 'I need a pharmacy.', de: 'Ich brauche eine Apotheke.' },
      ],
      build: [
        { en: 'I missed my train.', de: 'Ich habe meinen Zug verpasst.', extra: ['lost'] },
        { en: 'The shower in my room is broken.', de: 'Die Dusche in meinem Zimmer ist kaputt.', extra: ['by'] },
        { en: 'When is the next train?', de: 'Wann fährt der nächste Zug?', extra: ['goes'] },
      ],
      say: [
        {
          they: 'Hello, can I help you?',
          de: 'Ja, mein Koffer ist nicht angekommen.',
          answers: ["Yes, my suitcase didn't arrive.", 'Yes, my suitcase did not arrive.', "Yes, my suitcase hasn't arrived."],
          keywords: [['suitcase', 'luggage', 'bag'], ["didn't arrive", 'did not arrive', "hasn't arrived", 'has not arrived', 'is not here', "isn't here"]],
        },
        {
          they: 'Oh no. What colour is it?',
          de: 'Er ist groß und blau.',
          answers: ["It's big and blue.", 'It is big and blue.', "It's a big blue suitcase."],
          keywords: [['big', 'large'], ['blue']],
        },
        {
          they: 'Sorry, the next train is full.',
          de: 'Wann fährt der Zug danach?',
          answers: ['When is the train after that?', 'When is the next one after that?', 'What time is the train after that?'],
          keywords: [['when', 'what time'], ['after that', 'after', 'next']],
        },
      ],
      story: {
        title: 'Der verlorene Koffer',
        de: 'Ben kommt in Dublin an. Hör gut zu.',
        lines: [
          'Ben lands in Dublin late at night.',
          'He waits for his suitcase, but it doesn\'t come.',
          'He goes to the help desk.',
          'A man there asks, "What does your suitcase look like?"',
          'Ben says, "It\'s small and green."',
          'The man says, "We can bring it to your hotel tomorrow."',
          'The next morning, the suitcase arrives at ten.',
          'Ben is very happy.',
        ],
        questions: [
          { q: 'What colour is Ben\'s suitcase?', qde: 'Welche Farbe hat Bens Koffer?', options: ['Blue', 'Red', 'Green'], answer: 2 },
          { q: 'When does the suitcase arrive?', qde: 'Wann kommt der Koffer an?', options: ['The next morning', 'The same night', 'After a week'], answer: 0 },
        ],
      },
    },
  ],
};
