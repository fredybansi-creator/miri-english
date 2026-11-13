// Topic "Im Urlaub" (on holiday) – 5 lessons, same format as travel.js (level A2–B1, short sentences, no idioms).
// After changing English sentences: run tools/make_audio.py and commit audio/.

export default {
  id: 'holiday',
  title: 'Im Urlaub',
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'h1',
      title: 'Am Strand',
      en: 'At the beach',
      goal: 'Liegen mieten, nach dem Wasser fragen und Small Talk am Strand',
      repeat: [
        { en: 'How much is a sunbed for the day?', de: 'Wie viel kostet eine Liege für den Tag?' },
        { en: 'Is the water warm today?', de: 'Ist das Wasser heute warm?' },
        { en: 'Is it safe to swim here?', de: 'Kann man hier sicher schwimmen?' },
        { en: 'Can you watch my bag for a moment?', de: 'Können Sie kurz auf meine Tasche aufpassen?' },
      ],
      build: [
        { en: 'We would like two sunbeds and an umbrella.', de: 'Wir hätten gern zwei Liegen und einen Sonnenschirm.', extra: ['screen'] },
        { en: "Don't forget the sun cream.", de: 'Vergiss die Sonnencreme nicht.', extra: ['not'] },
        { en: 'The waves are very big today.', de: 'Die Wellen sind heute sehr hoch.', extra: ['more'] },
      ],
      say: [
        {
          they: 'Hello! Would you like a sunbed?',
          de: 'Ja, bitte. Wie viel kostet eine Liege für den Tag?',
          answers: ['Yes, please. How much is a sunbed for the day?', 'Yes, please. How much does a sunbed cost for the day?', 'Yes, please. How much is it for the whole day?'],
          keywords: [['how much'], ['day']],
        },
        {
          they: 'Ten euros, with an umbrella.',
          de: 'Gut, ich nehme zwei, bitte.',
          answers: ["Okay, I'll take two, please.", 'Good, I will take two, please.', "Great, two, please."],
          keywords: [['two']],
        },
        {
          they: 'Here you are. Have a nice day!',
          de: 'Danke! Ist es hier sicher zum Schwimmen?',
          answers: ['Thanks! Is it safe to swim here?', 'Thank you! Is it safe for swimming here?', 'Thank you! Can we swim here safely?'],
          keywords: [['safe'], ['swim', 'swimming']],
        },
      ],
      tip: {"de": "„How much is …?“ (ein Ding) und „How much are …?“ (mehrere): How much are the sunbeds?", "en": "How much are the sunbeds?"},
      write: {"de": "Schreib, was du an einem perfekten Strandtag machst.", "useWords": ["I swim", "I read", "I eat"], "sample": "I swim in the morning, read a book and eat an ice cream."},
      talk: {"they": "Do you like beach holidays?", "de": "Erzähl, ob du lieber Strand oder Berge magst und warum.", "useWords": ["I prefer", "because", "the sea", "the mountains"], "sample": "I prefer the mountains, because the beach is too hot for me."},
      story: {
        title: 'Ein Tag am Meer',
        de: 'Eine Familie fährt an den Strand. Hör gut zu.',
        lines: [
          'The Müller family is on holiday in Spain.',
          'On the first day, they go to the beach very early.',
          'They rent two sunbeds and a big umbrella.',
          'The children build a sandcastle near the water.',
          'At lunchtime, the sun is very hot.',
          'The father forgot the sun cream, and his back turns red.',
          'In the afternoon, a man sells ice cream on the beach.',
          'Everyone eats an ice cream, and the father buys sun cream.',
        ],
        questions: [
          { q: 'What do the children do?', qde: 'Was machen die Kinder?', options: ['They swim all day.', 'They build a sandcastle.', 'They sleep.'], answer: 1 },
          { q: 'What happens to the father?', qde: 'Was passiert dem Vater?', options: ['He gets a sunburn.', 'He loses his bag.', 'He falls asleep.'], answer: 0 },
        ],
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'h2',
      title: 'Eine Stadtführung',
      en: 'A city tour',
      goal: 'Tickets für eine Tour kaufen und Fragen zu Sehenswürdigkeiten stellen',
      repeat: [
        { en: 'What time does the tour start?', de: 'Um wie viel Uhr beginnt die Führung?' },
        { en: 'How long does it take?', de: 'Wie lange dauert es?' },
        { en: 'Is there a tour in German?', de: 'Gibt es eine Führung auf Deutsch?' },
        { en: 'Can we take photos inside?', de: 'Dürfen wir drinnen fotografieren?' },
      ],
      build: [
        { en: 'When was this church built?', de: 'Wann wurde diese Kirche gebaut?', extra: ['become'] },
        { en: 'Where does the tour finish?', de: 'Wo endet die Führung?', extra: ['ends'] },
        { en: 'Two adults, please.', de: 'Zwei Erwachsene, bitte.', extra: ['adult'] },
      ],
      say: [
        {
          they: 'Hello! Would you like tickets for the city tour?',
          de: 'Ja. Um wie viel Uhr beginnt die Führung?',
          answers: ['Yes. What time does the tour start?', 'Yes. When does the tour start?', 'Yes. What time does the tour begin?'],
          keywords: [['what time', 'when'], ['start', 'begin']],
        },
        {
          they: 'At eleven o\'clock, at the old church.',
          de: 'Und wie lange dauert sie?',
          answers: ['And how long does it take?', 'And how long is it?', 'And how long does it last?'],
          keywords: [['how long']],
        },
        {
          they: 'About two hours. How many tickets?',
          de: 'Zwei Erwachsene, bitte.',
          answers: ['Two adults, please.', 'Two tickets for adults, please.', 'Two adult tickets, please.'],
          keywords: [['two'], ['adult', 'adults']],
        },
      ],
      tip: {"de": "Fragen mit „When was … built?“ = Wann wurde … gebaut? Passiv in der Vergangenheit: was/were + 3. Form.", "en": "When was this church built?"},
      write: {"de": "Schreib über eine Stadt, die dir gefallen hat.", "useWords": ["I visited", "beautiful", "old", "I liked"], "sample": "I visited Prague. The old town is beautiful and I liked the bridges."},
      talk: {"they": "What do you like to see in a new city?", "de": "Erzähl, was du dir in einer neuen Stadt gern ansiehst.", "useWords": ["old churches", "museums", "markets", "I like walking"], "sample": "I like walking around the old town and visiting markets."},
      story: {
        title: 'Die alte Burg',
        de: 'Clara macht eine Führung mit. Hör gut zu.',
        lines: [
          'Clara is on holiday in Scotland with her sister.',
          'They want to see the old castle on the hill.',
          'The tour starts at ten, but they are five minutes late.',
          'The guide is friendly and waits for them.',
          'He tells them that the castle is nine hundred years old.',
          'Inside, they cannot take photos.',
          'From the top of the tower, they can see the whole city.',
          'After the tour, they drink tea in the castle café.',
        ],
        questions: [
          { q: 'How old is the castle?', qde: 'Wie alt ist die Burg?', options: ['Ninety years', 'Nine hundred years', 'Two hundred years'], answer: 1 },
          { q: 'What can they see from the tower?', qde: 'Was sehen sie vom Turm aus?', options: ['The sea', 'The whole city', 'Their hotel'], answer: 1 },
        ],
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'h3',
      title: 'Ein Auto mieten',
      en: 'Renting a car',
      goal: 'Ein Auto mieten und nach Versicherung und Rückgabe fragen',
      repeat: [
        { en: "I'd like to rent a car for three days.", de: 'Ich möchte für drei Tage ein Auto mieten.' },
        { en: 'Is insurance included?', de: 'Ist eine Versicherung inbegriffen?' },
        { en: 'Where do I return the car?', de: 'Wo gebe ich das Auto zurück?' },
        { en: 'Do I need to fill up the tank?', de: 'Muss ich volltanken?' },
      ],
      build: [
        { en: 'Here is my driving licence.', de: 'Hier ist mein Führerschein.', extra: ['leader'] },
        { en: 'Is it an automatic car?', de: 'Ist es ein Automatikauto?', extra: ['automatically'] },
        { en: 'We need a car with a big boot.', de: 'Wir brauchen ein Auto mit einem großen Kofferraum.', extra: ['suitcase'] },
      ],
      say: [
        {
          they: 'Good morning! How can I help?',
          de: 'Guten Morgen. Ich möchte für drei Tage ein Auto mieten.',
          answers: ["Good morning. I'd like to rent a car for three days.", 'Good morning. I would like to rent a car for three days.', 'Morning! I want to rent a car for three days.'],
          keywords: [['rent', 'hire'], ['car'], ['three days']],
        },
        {
          they: 'No problem. Can I see your driving licence?',
          de: 'Ja, hier ist er. Ist eine Versicherung inbegriffen?',
          answers: ['Yes, here it is. Is insurance included?', 'Yes, here you are. Is the insurance included?', 'Sure, here it is. Is insurance included?'],
          keywords: [['here'], ['insurance'], ['included']],
        },
        {
          they: 'Yes, it is. Please bring the car back with a full tank.',
          de: 'Okay. Wo gebe ich das Auto zurück?',
          answers: ['Okay. Where do I return the car?', 'Okay. Where do I bring the car back?', 'Okay. Where should I return the car?'],
          keywords: [['where'], ['return', 'bring', 'back']],
        },
      ],
      tip: {"de": "„Is … included?“ = Ist … inbegriffen? Sehr nützlich für Hotel, Auto und Touren.", "en": "Is breakfast included?"},
      write: {"de": "Schreib eine kurze Anfrage an eine Autovermietung.", "useWords": ["I'd like to rent", "from … to …", "Is insurance included?"], "sample": "Hello, I'd like to rent a small car from Monday to Friday. Is insurance included?"},
      talk: {"they": "Do you like driving?", "de": "Erzähl, ob du gern Auto fährst, auch im Ausland.", "useWords": ["I like", "I'm nervous", "on the left"], "sample": "Yes, but I'm a bit nervous in other countries."},
      story: {
        title: 'Mit dem Auto über die Insel',
        de: 'Peter und Eva mieten ein Auto. Hör gut zu.',
        lines: [
          'Peter and Eva are on holiday on a small Greek island.',
          'They want to see the beaches on the other side of the island.',
          'So they rent a small red car for two days.',
          'The man at the rental office gives them a map.',
          'The roads are narrow, and there are many goats.',
          'Eva drives, because Peter is a bit nervous.',
          'They find a quiet beach with clear blue water.',
          'They bring the car back on time, with a full tank.',
        ],
        questions: [
          { q: 'Why do they rent a car?', qde: 'Warum mieten sie ein Auto?', options: ['To go to the airport', 'To see the beaches on the other side', 'To visit friends'], answer: 1 },
          { q: 'Who drives?', qde: 'Wer fährt?', options: ['Peter', 'Eva', 'The man from the office'], answer: 1 },
        ],
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'h4',
      title: 'Über das Wetter reden',
      en: 'Talking about the weather',
      goal: 'Das Wetter beschreiben und Pläne danach machen',
      repeat: [
        { en: "It's going to rain this afternoon.", de: 'Heute Nachmittag wird es regnen.' },
        { en: 'What a beautiful day!', de: 'Was für ein schöner Tag!' },
        { en: "It's too hot for me.", de: 'Es ist mir zu heiß.' },
        { en: "Let's stay inside today.", de: 'Lass uns heute drinnen bleiben.' },
      ],
      build: [
        { en: 'What is the weather like tomorrow?', de: 'Wie wird das Wetter morgen?', extra: ['how'] },
        { en: 'It is very windy at the beach.', de: 'Am Strand ist es sehr windig.', extra: ['wind'] },
        { en: 'Take a jacket with you.', de: 'Nimm eine Jacke mit.', extra: ['took'] },
      ],
      say: [
        {
          they: 'What a lovely morning!',
          de: 'Ja! Aber heute Nachmittag wird es regnen.',
          answers: ["Yes! But it's going to rain this afternoon.", 'Yes! But it will rain this afternoon.', 'Yes! But it is going to rain in the afternoon.'],
          keywords: [['but'], ['rain'], ['afternoon']],
        },
        {
          they: 'Oh no. What should we do then?',
          de: 'Lass uns am Vormittag an den Strand gehen.',
          answers: ["Let's go to the beach in the morning.", "Let's go to the beach this morning.", 'We can go to the beach in the morning.'],
          keywords: [['beach'], ['morning']],
        },
        {
          they: 'Good idea. And in the afternoon?',
          de: 'Am Nachmittag können wir ins Museum gehen.',
          answers: ['In the afternoon, we can go to the museum.', 'We can go to the museum in the afternoon.', 'In the afternoon we could visit the museum.'],
          keywords: [['afternoon'], ['museum']],
        },
      ],
      tip: {"de": "Zukunft beim Wetter: „It's going to rain.“ (man sieht es schon kommen) oder „It will be sunny tomorrow.“", "en": "It's going to rain this afternoon."},
      write: {"de": "Schreib, wie das Wetter heute ist und was du deshalb machst.", "useWords": ["Today it's", "so I", "going to"], "sample": "Today it's cold and windy, so I'm going to stay at home."},
      talk: {"they": "What's your favourite kind of weather?", "de": "Erzähl, welches Wetter du am liebsten magst.", "useWords": ["I love", "when it's", "not too hot"], "sample": "I love warm days, but not too hot. Spring is my favourite."},
      story: {
        title: 'Regen in Irland',
        de: 'Sam macht Urlaub in Irland. Hör gut zu.',
        lines: [
          'Sam is on holiday in Ireland for one week.',
          'On Monday, it is sunny and warm, so he walks by the sea.',
          'On Tuesday, it rains all day.',
          'He stays in a small café and reads a book.',
          'On Wednesday, it is very windy and cold.',
          'He buys a warm hat and a rain jacket.',
          'The weather changes every hour, but Sam does not mind.',
          'He says the green hills look beautiful in the rain.',
        ],
        questions: [
          { q: 'What does Sam do on Tuesday?', qde: 'Was macht Sam am Dienstag?', options: ['He walks by the sea.', 'He reads in a café.', 'He goes swimming.'], answer: 1 },
          { q: 'What does Sam buy?', qde: 'Was kauft Sam?', options: ['An umbrella and boots', 'A warm hat and a rain jacket', 'Sunglasses'], answer: 1 },
        ],
      },
    },
    // ------------------------------------------------------------------ 5
    {
      id: 'h5',
      title: 'Vom Urlaub erzählen',
      en: 'Telling about a holiday',
      goal: 'In der Vergangenheit erzählen, wo du warst und was du gemacht hast',
      repeat: [
        { en: 'We went to Italy for two weeks.', de: 'Wir waren zwei Wochen in Italien.' },
        { en: 'The food was amazing.', de: 'Das Essen war fantastisch.' },
        { en: 'We stayed in a small hotel by the sea.', de: 'Wir haben in einem kleinen Hotel am Meer gewohnt.' },
        { en: 'I would love to go back.', de: 'Ich würde sehr gern wieder hinfahren.' },
      ],
      build: [
        { en: 'We visited a lot of old towns.', de: 'Wir haben viele alte Städte besucht.', extra: ['much'] },
        { en: 'The weather was perfect.', de: 'Das Wetter war perfekt.', extra: ['were'] },
        { en: 'What did you like best?', de: 'Was hat dir am besten gefallen?', extra: ['good'] },
      ],
      say: [
        {
          they: 'Welcome back! Where did you go?',
          de: 'Wir waren zwei Wochen in Italien.',
          answers: ['We went to Italy for two weeks.', 'We were in Italy for two weeks.', 'We spent two weeks in Italy.'],
          keywords: [['italy'], ['two weeks']],
        },
        {
          they: 'How lovely! How was it?',
          de: 'Es war wunderschön. Das Essen war fantastisch.',
          answers: ['It was beautiful. The food was amazing.', 'It was wonderful. The food was fantastic.', 'It was lovely. The food was great.'],
          keywords: [['was'], ['food']],
        },
        {
          they: 'What did you like best?',
          de: 'Am besten hat mir das Meer gefallen.',
          answers: ['I liked the sea best.', 'The best thing was the sea.', 'I liked the sea the most.'],
          keywords: [['sea']],
        },
      ],
      tip: {"de": "Vom Urlaub erzählen: „We went to …“, „We stayed in …“, „It was …“. Am Ende: „I would love to go back.“", "en": "We stayed in a small hotel by the sea."},
      write: {"de": "Schreib über deinen schönsten Urlaub.", "useWords": ["We went to", "We stayed", "The best thing was"], "sample": "We went to Italy last summer. We stayed by the sea. The best thing was the food."},
      talk: {"they": "Where was your last holiday?", "de": "Erzähl von deinem letzten Urlaub: wo, wie lange, wie es war.", "useWords": ["I went to", "for a week", "It was"], "sample": "I went to Austria for a week. It was very relaxing."},
      story: {
        title: 'Zurück aus Portugal',
        de: 'Nina erzählt von ihrem Urlaub. Hör gut zu.',
        lines: [
          'Nina is back at work after her holiday.',
          'Her colleague asks her where she went.',
          'She tells him that she spent ten days in Portugal.',
          'She stayed in Lisbon for five days and then went to the coast.',
          'In Lisbon, she rode in an old yellow tram.',
          'At the coast, she learned to surf, but she fell in the water a lot.',
          'She says the fish was the best she has ever eaten.',
          'She already wants to go back next year.',
        ],
        questions: [
          { q: 'How long was Nina in Portugal?', qde: 'Wie lange war Nina in Portugal?', options: ['Five days', 'Ten days', 'Two weeks'], answer: 1 },
          { q: 'What did she learn at the coast?', qde: 'Was hat sie an der Küste gelernt?', options: ['To surf', 'To cook fish', 'To speak Portuguese'], answer: 0 },
        ],
      },
    },
  ],
};
