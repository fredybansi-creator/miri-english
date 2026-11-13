// Topic "Café & Essen" (café and food) – 5 lessons, same format as travel.js (level A2–B1, short sentences, no idioms).
// After changing English sentences: run tools/make_audio.py and commit audio/.

export default {
  id: 'cafe',
  title: 'Café & Essen',
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'c1',
      title: 'Im Café bestellen',
      en: 'Ordering in a café',
      goal: 'Kaffee und Kuchen bestellen und sagen, ob du hier isst oder mitnimmst',
      repeat: [
        { en: "Can I have a cappuccino, please?", de: 'Kann ich bitte einen Cappuccino haben?' },
        { en: 'With oat milk, please.', de: 'Mit Hafermilch, bitte.' },
        { en: 'Is it to eat in or to take away?', de: 'Zum Hieressen oder zum Mitnehmen?' },
        { en: "I'll have a piece of chocolate cake.", de: 'Ich nehme ein Stück Schokoladenkuchen.' },
      ],
      build: [
        { en: 'A small black coffee, please.', de: 'Einen kleinen schwarzen Kaffee, bitte.', extra: ['little'] },
        { en: 'Can I have some more sugar?', de: 'Kann ich noch etwas Zucker haben?', extra: ['still'] },
        { en: 'Do you have any cakes without sugar?', de: 'Haben Sie Kuchen ohne Zucker?', extra: ['with'] },
      ],
      say: [
        {
          they: 'Hi! What can I get you?',
          de: 'Hallo! Kann ich bitte einen Cappuccino haben?',
          answers: ['Hi! Can I have a cappuccino, please?', "Hello! I'd like a cappuccino, please.", 'Hi! A cappuccino, please.'],
          keywords: [['cappuccino']],
        },
        {
          they: 'Sure. Is it to eat in or to take away?',
          de: 'Zum Hieressen, bitte.',
          answers: ['To eat in, please.', "I'd like to eat in, please.", "For here, please.", "I'll have it here, please."],
          keywords: [['eat in', 'here']],
        },
        {
          they: 'Anything to eat?',
          de: 'Ja, ein Stück Schokoladenkuchen, bitte.',
          answers: ['Yes, a piece of chocolate cake, please.', "Yes, I'll have a piece of chocolate cake, please.", 'Yes, some chocolate cake, please.'],
          keywords: [['chocolate'], ['cake']],
        },
      ],
      tip: {"de": "„Can I have …, please?“ ist die einfachste höfliche Bestellung. Noch höflicher: „Could I have …?“", "en": "Could I have a cappuccino, please?"},
      write: {"de": "Schreib, was du in einem Café am liebsten bestellst.", "useWords": ["I usually order", "with", "and"], "sample": "I usually order a cappuccino with oat milk and a piece of cake."},
      talk: {"they": "Do you drink coffee or tea in the morning?", "de": "Erzähl, was du morgens trinkst.", "useWords": ["I drink", "every morning", "with milk"], "sample": "I drink coffee with milk every morning."},
      story: {
        title: 'Das Lieblingscafé',
        de: 'Julia geht in ihr Lieblingscafé. Hör gut zu.',
        lines: [
          'Every Sunday, Julia goes to a small café near her flat.',
          'The owner, Marco, knows her very well.',
          'She always orders a latte and a croissant.',
          'Today Marco tells her about a new apple cake.',
          'Julia tries it, and it is still warm.',
          'She sits by the window and reads the newspaper.',
          'After an hour, her friend Kate comes in.',
          'They talk for a long time and order another coffee.',
        ],
        questions: [
          { q: 'What does Julia usually order?', qde: 'Was bestellt Julia normalerweise?', options: ['A tea and a cake', 'A latte and a croissant', 'A black coffee'], answer: 1 },
          { q: 'Who comes into the café?', qde: 'Wer kommt ins Café?', options: ['Her friend Kate', 'Her mother', 'Her boss'], answer: 0 },
        ],
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'c2',
      title: 'Beim Bäcker',
      en: 'At the bakery',
      goal: 'Brot und Gebäck kaufen und nach Zutaten fragen',
      repeat: [
        { en: 'Four bread rolls, please.', de: 'Vier Brötchen, bitte.' },
        { en: 'Is this bread made with wholemeal flour?', de: 'Ist dieses Brot aus Vollkornmehl?' },
        { en: 'Are there nuts in this?', de: 'Sind da Nüsse drin?' },
        { en: 'Can you slice it for me?', de: 'Können Sie es mir schneiden?' },
      ],
      build: [
        { en: 'What do you recommend?', de: 'Was empfehlen Sie?', extra: ['recommendation'] },
        { en: 'I would like a loaf of brown bread.', de: 'Ich hätte gern ein dunkles Brot.', extra: ['dark'] },
        { en: 'Are these still warm?', de: 'Sind die noch warm?', extra: ['yet'] },
      ],
      say: [
        {
          they: 'Good morning! What would you like?',
          de: 'Guten Morgen. Vier Brötchen, bitte.',
          answers: ['Good morning. Four bread rolls, please.', 'Good morning. Four rolls, please.', "Morning! I'd like four bread rolls, please."],
          keywords: [['four'], ['rolls', 'roll']],
        },
        {
          they: 'Anything else?',
          de: 'Ja. Sind in diesem Kuchen Nüsse?',
          answers: ['Yes. Are there nuts in this cake?', 'Yes. Does this cake have nuts in it?', 'Yes. Is there any nuts in this cake?'],
          keywords: [['nuts'], ['cake']],
        },
        {
          they: 'No, there are no nuts in it.',
          de: 'Gut, dann nehme ich zwei Stück.',
          answers: ["Good, then I'll take two pieces.", "Great, I'll have two pieces then.", 'Good, then I will take two pieces.'],
          keywords: [['two'], ['pieces', 'piece']],
        },
      ],
      tip: {"de": "„Are there nuts in this?“ = Sind da Nüsse drin? „there is / there are“ = es gibt / da ist.", "en": "Are there nuts in this?"},
      write: {"de": "Schreib eine Einkaufsliste für ein Frühstück mit Freunden – in ganzen Sätzen.", "useWords": ["I need", "some", "a loaf of"], "sample": "I need some rolls, a loaf of bread, cheese and fresh orange juice."},
      talk: {"they": "What do you have for breakfast?", "de": "Erzähl, was du zum Frühstück isst.", "useWords": ["I usually have", "bread", "muesli", "on Sundays"], "sample": "I usually have muesli. On Sundays I have fresh rolls."},
      story: {
        title: 'Frühstück für alle',
        de: 'Max holt Frühstück. Hör gut zu.',
        lines: [
          'It is Saturday, and Max has guests for breakfast.',
          'He gets up early and walks to the bakery.',
          'There is already a long queue outside.',
          'He buys eight rolls and a big brown loaf.',
          'His friend Lea cannot eat nuts, so he asks about the cakes.',
          'The baker shows him a lemon cake without nuts.',
          'Max buys the cake and some fresh orange juice.',
          'At home, his friends are already waiting at the door.',
        ],
        questions: [
          { q: 'Why does Max ask about nuts?', qde: 'Warum fragt Max nach Nüssen?', options: ['He does not like them.', 'His friend Lea cannot eat nuts.', 'The baker asks him.'], answer: 1 },
          { q: 'Which cake does he buy?', qde: 'Welchen Kuchen kauft er?', options: ['A chocolate cake', 'An apple cake', 'A lemon cake'], answer: 2 },
        ],
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'c3',
      title: 'Was isst du gern?',
      en: 'Food you like',
      goal: 'Sagen, was du gern und nicht gern isst, und über Essen reden',
      repeat: [
        { en: 'I love Italian food.', de: 'Ich liebe italienisches Essen.' },
        { en: "I don't eat meat.", de: 'Ich esse kein Fleisch.' },
        { en: "I'm not a big fan of fish.", de: 'Fisch mag ich nicht besonders.' },
        { en: 'What is your favourite dish?', de: 'Was ist dein Lieblingsgericht?' },
      ],
      build: [
        { en: 'I cook at home most days.', de: 'Ich koche an den meisten Tagen zu Hause.', extra: ['house'] },
        { en: 'This soup is too spicy for me.', de: 'Diese Suppe ist mir zu scharf.', extra: ['sharp'] },
        { en: 'Have you ever tried Thai food?', de: 'Hast du schon mal thailändisch gegessen?', extra: ['already'] },
      ],
      say: [
        {
          they: 'What kind of food do you like?',
          de: 'Ich liebe italienisches Essen, vor allem Pasta.',
          answers: ['I love Italian food, especially pasta.', 'I love Italian food, mostly pasta.', 'I really like Italian food, especially pasta.'],
          keywords: [['italian'], ['pasta']],
        },
        {
          they: 'Me too! Do you eat meat?',
          de: 'Nein, ich esse kein Fleisch.',
          answers: ["No, I don't eat meat.", 'No, I do not eat meat.', "No, I'm a vegetarian."],
          keywords: [['no'], ["don't eat meat", 'do not eat meat', 'vegetarian']],
        },
        {
          they: 'What is your favourite dish?',
          de: 'Mein Lieblingsgericht ist Lasagne mit Gemüse.',
          answers: ['My favourite dish is vegetable lasagne.', 'My favourite dish is lasagne with vegetables.', 'My favourite food is lasagne with vegetables.'],
          keywords: [['favourite', 'favorite'], ['lasagne', 'lasagna']],
        },
      ],
      tip: {"de": "Vorlieben: „I love …“, „I like …“, „I'm not a big fan of …“ (= mag ich nicht so). Das klingt freundlicher als „I hate …“.", "en": "I'm not a big fan of fish."},
      write: {"de": "Schreib, welches Essen du liebst und welches du nicht magst.", "useWords": ["I love", "I'm not a big fan of", "but"], "sample": "I love Italian food, but I'm not a big fan of very spicy dishes."},
      talk: {"they": "Can you cook? What do you like to make?", "de": "Erzähl, was du gern kochst.", "useWords": ["I like to make", "It's easy", "my family loves"], "sample": "Yes! I like to make lasagne. My family loves it."},
      story: {
        title: 'Der Kochabend',
        de: 'Freunde kochen zusammen. Hör gut zu.',
        lines: [
          'Once a month, Hanna and her friends have a cooking evening.',
          'Each person brings one dish from a different country.',
          'This time, Hanna makes a Greek salad.',
          'Her friend Tim brings a very spicy Indian curry.',
          'Hanna loves it, but she needs a lot of water.',
          'Another friend, Sara, does not eat meat.',
          'So she brings a big vegetable pizza for everyone.',
          'At the end, they all agree that the pizza was the best.',
        ],
        questions: [
          { q: 'What does Hanna make?', qde: 'Was macht Hanna?', options: ['A Greek salad', 'An Indian curry', 'A pizza'], answer: 0 },
          { q: 'Which dish was the best?', qde: 'Welches Gericht war das beste?', options: ['The curry', 'The salad', 'The pizza'], answer: 2 },
        ],
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'c4',
      title: 'Sonderwünsche',
      en: 'Special wishes',
      goal: 'Allergien erklären und um Änderungen am Essen bitten',
      repeat: [
        { en: "I'm allergic to nuts.", de: 'Ich bin allergisch gegen Nüsse.' },
        { en: 'Can I have it without onions?', de: 'Kann ich es ohne Zwiebeln haben?' },
        { en: 'Is this dish vegetarian?', de: 'Ist dieses Gericht vegetarisch?' },
        { en: 'Could I have the sauce on the side?', de: 'Kann ich die Soße extra haben?' },
      ],
      build: [
        { en: 'Does this contain milk?', de: 'Ist da Milch drin?', extra: ['inside'] },
        { en: 'Can you make it less spicy?', de: 'Können Sie es weniger scharf machen?', extra: ['fewer'] },
        { en: 'I would like salad instead of chips.', de: 'Ich hätte gern Salat statt Pommes.', extra: ['than'] },
      ],
      say: [
        {
          they: 'Are you ready to order?',
          de: 'Ja. Ist die Pasta mit Pesto vegetarisch?',
          answers: ['Yes. Is the pasta with pesto vegetarian?', 'Yes. Is the pesto pasta vegetarian?'],
          keywords: [['pasta'], ['vegetarian']],
        },
        {
          they: 'Yes, it is. But there are nuts in the pesto.',
          de: 'Oh, ich bin allergisch gegen Nüsse.',
          answers: ["Oh, I'm allergic to nuts.", 'Oh, I am allergic to nuts.', "Oh no, I'm allergic to nuts."],
          keywords: [['allergic'], ['nuts']],
        },
        {
          they: 'No problem. We can make it with tomato sauce.',
          de: 'Super, das nehme ich. Ohne Zwiebeln, bitte.',
          answers: ["Great, I'll have that. Without onions, please.", "Great, I'll take that. No onions, please.", 'Perfect, I will have that. Without onions, please.'],
          keywords: [['onions', 'onion'], ['without', 'no']],
        },
      ],
      tip: {"de": "Sonderwünsche: „Can I have it without …?“ und „instead of“ (= statt): salad instead of chips.", "en": "Can I have it without onions?"},
      write: {"de": "Schreib einem Restaurant, was du nicht essen kannst oder nicht magst.", "useWords": ["I'm allergic to", "I don't eat", "Is it possible"], "sample": "I don't eat meat. Is it possible to have the pasta without bacon?"},
      talk: {"they": "Is there any food you don't eat?", "de": "Erzähl, was du nicht isst oder nicht verträgst.", "useWords": ["I don't eat", "I can't have", "I don't like"], "sample": "I eat everything, but I don't like mushrooms."},
      story: {
        title: 'Ein Abend mit Hindernissen',
        de: 'Leo geht mit seiner Mutter essen. Hör gut zu.',
        lines: [
          'Leo takes his mother to a nice restaurant for her birthday.',
          'His mother cannot drink milk, so she is always careful.',
          'She asks the waiter about the fish soup.',
          'The waiter checks with the chef and comes back.',
          'There is cream in the soup, so she cannot have it.',
          'The chef offers to make her grilled fish with vegetables.',
          'She says it is the best fish she has had in years.',
          'At the end, the waiter brings a small cake with a candle.',
        ],
        questions: [
          { q: 'Why can the mother not have the soup?', qde: 'Warum kann die Mutter die Suppe nicht essen?', options: ['It is too spicy.', 'There is cream in it.', 'It is cold.'], answer: 1 },
          { q: 'What does the waiter bring at the end?', qde: 'Was bringt der Kellner am Ende?', options: ['The bill', 'A small cake with a candle', 'Flowers'], answer: 1 },
        ],
      },
    },
    // ------------------------------------------------------------------ 5
    {
      id: 'c5',
      title: 'Freunde zum Essen einladen',
      en: 'Inviting friends for dinner',
      goal: 'Jemanden einladen, fragen, was er mag, und Gäste begrüßen',
      repeat: [
        { en: 'Would you like to come for dinner on Saturday?', de: 'Möchtest du am Samstag zum Abendessen kommen?' },
        { en: 'Is there anything you don\'t eat?', de: 'Gibt es etwas, das du nicht isst?' },
        { en: 'Can I bring anything?', de: 'Kann ich etwas mitbringen?' },
        { en: 'Help yourself!', de: 'Bedien dich!' },
      ],
      build: [
        { en: 'Dinner will be ready in ten minutes.', de: 'Das Essen ist in zehn Minuten fertig.', extra: ['finished'] },
        { en: 'Would you like some more?', de: 'Möchtest du noch etwas?', extra: ['still'] },
        { en: 'Thank you for a lovely evening.', de: 'Danke für den schönen Abend.', extra: ['beautiful'] },
      ],
      say: [
        {
          they: 'Hi! What are you doing on Saturday?',
          de: 'Nichts Besonderes. Möchtest du zum Abendessen kommen?',
          answers: ['Nothing special. Would you like to come for dinner?', 'Nothing special. Do you want to come for dinner?', 'Nothing much. Would you like to come over for dinner?'],
          keywords: [['nothing'], ['dinner']],
        },
        {
          they: 'I\'d love to! Can I bring anything?',
          de: 'Vielleicht eine Flasche Wein?',
          answers: ['Maybe a bottle of wine?', 'Perhaps a bottle of wine?', 'You could bring a bottle of wine.'],
          keywords: [['bottle'], ['wine']],
        },
        {
          they: 'Sure. Is there anything you don\'t eat?',
          de: 'Nein, ich esse alles.',
          answers: ['No, I eat everything.', "No, I eat anything.", "No, I'm happy with anything."],
          keywords: [['no'], ['everything', 'anything']],
        },
      ],
      tip: {"de": "Einladen: „Would you like to come for dinner?“ Antwort: „I'd love to!“ oder „Sorry, I can't, but thank you!“", "en": "I'd love to!"},
      write: {"de": "Schreib eine Einladung zum Abendessen bei dir.", "useWords": ["Would you like to", "on", "I'm cooking"], "sample": "Would you like to come for dinner on Friday? I'm cooking a vegetable curry."},
      talk: {"they": "What would you cook for guests?", "de": "Erzähl, was du für Gäste kochen würdest.", "useWords": ["I would make", "for dessert", "because"], "sample": "I would make lasagne, and chocolate cake for dessert."},
      story: {
        title: 'Die erste Einladung',
        de: 'Emma lädt neue Nachbarn ein. Hör gut zu.',
        lines: [
          'Emma has new neighbours, a young couple from Canada.',
          'She invites them for dinner on Friday evening.',
          'She asks if there is anything they do not eat.',
          'The woman says they both love vegetables but not mushrooms.',
          'Emma cooks a vegetable soup and roast chicken.',
          'The neighbours bring a bottle of wine and some Canadian biscuits.',
          'They talk about Canada, Germany and their favourite holidays.',
          'At midnight, they say thank you for a lovely evening and go home.',
        ],
        questions: [
          { q: 'Where are the neighbours from?', qde: 'Woher kommen die Nachbarn?', options: ['From England', 'From Canada', 'From Germany'], answer: 1 },
          { q: 'What do they not like?', qde: 'Was mögen sie nicht?', options: ['Mushrooms', 'Chicken', 'Vegetables'], answer: 0 },
        ],
      },
    },
  ],
};
