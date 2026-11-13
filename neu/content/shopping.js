// Topic "Einkaufen" (shopping) – 5 lessons, same format as travel.js (level A2–B1, short sentences, no idioms).
// After changing English sentences: run tools/make_audio.py and commit audio/.

export default {
  id: 'shopping',
  title: 'Einkaufen',
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 's1',
      title: 'Im Supermarkt',
      en: 'At the supermarket',
      goal: 'Nach Produkten fragen und an der Kasse zahlen',
      repeat: [
        { en: 'Excuse me, where can I find the milk?', de: 'Entschuldigung, wo finde ich die Milch?' },
        { en: "It's in aisle three.", de: 'Es ist in Gang drei.' },
        { en: 'Do you need a bag?', de: 'Brauchen Sie eine Tüte?' },
        { en: 'Can I pay by card?', de: 'Kann ich mit Karte zahlen?' },
      ],
      build: [
        { en: 'I am looking for fresh bread.', de: 'Ich suche frisches Brot.', extra: ['search'] },
        { en: 'Do you have any eggs left?', de: 'Haben Sie noch Eier?', extra: ['still'] },
        { en: 'I would like a receipt, please.', de: 'Ich hätte gern einen Kassenbon, bitte.', extra: ['recipe'] },
      ],
      say: [
        {
          they: 'Hi! Can I help you find something?',
          de: 'Ja, bitte. Wo finde ich die Milch?',
          answers: ['Yes, please. Where can I find the milk?', 'Yes, please. Where is the milk?', 'Yes, please. Where do I find the milk?'],
          keywords: [['where'], ['milk']],
        },
        {
          they: "That's twelve fifty. Do you need a bag?",
          de: 'Nein, danke. Ich habe meine eigene Tasche.',
          answers: ['No, thank you. I have my own bag.', "No, thanks. I've got my own bag.", 'No, thanks. I have my own bag.'],
          keywords: [['no'], ['own bag', 'my bag']],
        },
        {
          they: 'Cash or card?',
          de: 'Mit Karte, bitte.',
          answers: ['Card, please.', 'By card, please.', "I'll pay by card, please."],
          keywords: [['card']],
        },
      ],
      tip: {"de": "„Where can I find …?“ = Wo finde ich …? Antwort: „It's in aisle three.“ (aisle spricht man „ail“).", "en": "Where can I find the milk?"},
      write: {"de": "Schreib, was du diese Woche einkaufen musst.", "useWords": ["I need to buy", "some", "and"], "sample": "I need to buy some milk, eggs, bread and a lot of fruit."},
      talk: {"they": "Where do you usually do your shopping?", "de": "Erzähl, wo und wann du einkaufst.", "useWords": ["I usually go to", "on Saturdays", "near my flat"], "sample": "I usually go to a supermarket near my flat on Saturdays."},
      story: {
        title: 'Der Wocheneinkauf',
        de: 'Tom kauft für die Woche ein. Hör gut zu.',
        lines: [
          'On Saturday morning, Tom goes to the supermarket.',
          'He has a long list in his pocket.',
          'He needs bread, milk, eggs, apples and coffee.',
          'He finds everything quickly, but there is no coffee.',
          'He asks a young woman who works there.',
          'She says the coffee is in aisle seven, next to the tea.',
          'At the checkout, Tom pays twenty-three euros.',
          'He forgot his bag, so he buys one for fifty cents.',
        ],
        questions: [
          { q: 'Where is the coffee?', qde: 'Wo ist der Kaffee?', options: ['In aisle seven, next to the tea', 'Next to the bread', 'At the checkout'], answer: 0 },
          { q: 'Why does Tom buy a bag?', qde: 'Warum kauft Tom eine Tüte?', options: ['He wants a nice bag.', 'He forgot his bag.', 'His bag is broken.'], answer: 1 },
        ],
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 's2',
      title: 'Kleidung kaufen',
      en: 'Buying clothes',
      goal: 'Nach Größe und Farbe fragen und etwas anprobieren',
      repeat: [
        { en: 'Do you have this in a medium?', de: 'Haben Sie das in M?' },
        { en: 'Can I try it on?', de: 'Kann ich es anprobieren?' },
        { en: 'Where are the changing rooms?', de: 'Wo sind die Umkleidekabinen?' },
        { en: "It's a bit too small.", de: 'Es ist ein bisschen zu klein.' },
      ],
      build: [
        { en: 'Do you have it in blue?', de: 'Haben Sie es in Blau?', extra: ['by'] },
        { en: 'I need a bigger size.', de: 'Ich brauche eine größere Größe.', extra: ['more'] },
        { en: 'This jacket fits perfectly.', de: 'Diese Jacke passt perfekt.', extra: ['fit'] },
      ],
      say: [
        {
          they: 'Hello! Are you looking for anything special?',
          de: 'Ja, ich suche eine warme Jacke.',
          answers: ["Yes, I'm looking for a warm jacket.", 'Yes, I am looking for a warm jacket.', 'Yes, I need a warm jacket.'],
          keywords: [['looking for', 'need', 'want'], ['jacket']],
        },
        {
          they: 'What about this one?',
          de: 'Sie ist schön. Kann ich sie anprobieren?',
          answers: ["It's nice. Can I try it on?", 'It is nice. Can I try it on?', "It's beautiful. Can I try it on?"],
          keywords: [['try'], ['on']],
        },
        {
          they: 'How is it?',
          de: 'Sie ist ein bisschen zu klein. Haben Sie sie in L?',
          answers: ["It's a bit too small. Do you have it in a large?", "It's a little too small. Do you have it in large?", 'It is a bit too small. Have you got it in a large?'],
          keywords: [['too small'], ['large']],
        },
      ],
      tip: {"de": "„Can I try it on?“ = Kann ich es anprobieren? „It fits.“ = Es passt (Größe). „It suits you.“ = Es steht dir.", "en": "It suits you!"},
      write: {"de": "Schreib, was du gern anziehst.", "useWords": ["I like wearing", "comfortable", "my favourite"], "sample": "I like wearing jeans and comfortable shoes. My favourite colour is blue."},
      talk: {"they": "Do you like shopping for clothes?", "de": "Erzähl, ob du gern Kleidung kaufst – im Geschäft oder online.", "useWords": ["I prefer", "online", "in shops", "because"], "sample": "Not really. I prefer to buy clothes online, because it's faster."},
      story: {
        title: 'Ein Kleid für die Hochzeit',
        de: 'Lisa sucht ein Kleid. Hör gut zu.',
        lines: [
          'Lisa is going to a wedding next month.',
          'She needs a new dress, so she goes into town.',
          'In the first shop, the dresses are too expensive.',
          'In the second shop, she sees a beautiful green dress.',
          'She tries it on, but it is too big.',
          'The shop assistant brings her a smaller size.',
          'This time it fits perfectly.',
          'The dress costs sixty euros, and Lisa is very happy.',
        ],
        questions: [
          { q: 'What colour is the dress?', qde: 'Welche Farbe hat das Kleid?', options: ['Red', 'Green', 'Blue'], answer: 1 },
          { q: 'What was the problem at first?', qde: 'Was war zuerst das Problem?', options: ['It was too big.', 'It was too short.', 'It was dirty.'], answer: 0 },
        ],
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 's3',
      title: 'Auf dem Markt',
      en: 'At the market',
      goal: 'Mengen und Preise erfragen und Obst und Gemüse kaufen',
      repeat: [
        { en: 'How much are the tomatoes?', de: 'Wie viel kosten die Tomaten?' },
        { en: "They're three euros a kilo.", de: 'Sie kosten drei Euro das Kilo.' },
        { en: "I'll take half a kilo, please.", de: 'Ich nehme ein halbes Kilo, bitte.' },
        { en: 'Anything else?', de: 'Sonst noch etwas?' },
      ],
      build: [
        { en: 'Are these strawberries sweet?', de: 'Sind diese Erdbeeren süß?', extra: ['sweat'] },
        { en: 'Can I have six apples, please?', de: 'Kann ich bitte sechs Äpfel haben?', extra: ['apple'] },
        { en: "That's all, thank you.", de: 'Das ist alles, danke.', extra: ['every'] },
      ],
      say: [
        {
          they: 'Good morning! What would you like?',
          de: 'Guten Morgen. Wie viel kosten die Tomaten?',
          answers: ['Good morning. How much are the tomatoes?', 'Good morning. How much do the tomatoes cost?', 'Morning! How much are the tomatoes?'],
          keywords: [['how much'], ['tomatoes']],
        },
        {
          they: 'Three euros a kilo. They are very fresh.',
          de: 'Dann nehme ich ein Kilo, bitte.',
          answers: ["Then I'll take a kilo, please.", "I'll take one kilo, please.", 'Then I will take one kilo, please.'],
          keywords: [['take', 'have'], ['kilo']],
        },
        {
          they: 'Here you are. Anything else?',
          de: 'Nein, das ist alles. Danke!',
          answers: ["No, that's all. Thank you!", 'No, that is all. Thanks!', "No, that's everything. Thank you!"],
          keywords: [['no'], ['all', 'everything']],
        },
      ],
      tip: {"de": "Mengen: „a kilo of“, „half a kilo of“, „a box of“, „a bunch of flowers“. „How much …?“ für Preise und Mengen.", "en": "Half a kilo of tomatoes, please."},
      write: {"de": "Schreib, was du auf einem Markt kaufen würdest.", "useWords": ["a kilo of", "some", "fresh"], "sample": "I would buy a kilo of tomatoes, some fresh bread and a bunch of flowers."},
      talk: {"they": "Do you like markets?", "de": "Erzähl, ob du gern auf den Markt gehst und was du dort kaufst.", "useWords": ["I love", "fresh", "every Saturday"], "sample": "Yes, I love them. I buy fresh fruit there every Saturday."},
      story: {
        title: 'Samstag auf dem Markt',
        de: 'Maria geht auf den Markt. Hör gut zu.',
        lines: [
          "Every Saturday, Maria goes to the farmers' market.",
          'She likes it more than the supermarket.',
          'The fruit and vegetables come from farms near the town.',
          'Today she buys potatoes, carrots and a big cabbage.',
          'The strawberries look very good, so she tries one.',
          'It is sweet, and she buys a box for four euros.',
          'The farmer gives her a free bunch of flowers.',
          'Maria walks home with a heavy bag and a big smile.',
        ],
        questions: [
          { q: 'Where does the fruit come from?', qde: 'Woher kommt das Obst?', options: ['From other countries', 'From farms near the town', 'From the supermarket'], answer: 1 },
          { q: 'What does Maria get for free?', qde: 'Was bekommt Maria geschenkt?', options: ['Some flowers', 'A box of strawberries', 'A cabbage'], answer: 0 },
        ],
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 's4',
      title: 'Etwas umtauschen',
      en: 'Returning something',
      goal: 'Ein Problem erklären und Geld zurück oder einen Umtausch verlangen',
      repeat: [
        { en: "I'd like to return this.", de: 'Ich möchte das zurückgeben.' },
        { en: "It doesn't work.", de: 'Es funktioniert nicht.' },
        { en: 'Do you have the receipt?', de: 'Haben Sie den Kassenbon?' },
        { en: 'Can I get my money back?', de: 'Kann ich mein Geld zurückbekommen?' },
      ],
      build: [
        { en: 'I bought it last week.', de: 'Ich habe es letzte Woche gekauft.', extra: ['buyed'] },
        { en: 'Can I exchange it for another one?', de: 'Kann ich es gegen ein anderes umtauschen?', extra: ['against'] },
        { en: 'There is a hole in the sleeve.', de: 'Im Ärmel ist ein Loch.', extra: ['whole'] },
      ],
      say: [
        {
          they: 'Hello. How can I help you?',
          de: 'Ich möchte diesen Toaster zurückgeben. Er funktioniert nicht.',
          answers: ["Hello. I'd like to return this toaster. It doesn't work.", 'Hello. I would like to return this toaster. It does not work.', "Hi. I want to return this toaster. It doesn't work."],
          keywords: [['return', 'bring back'], ['toaster'], ["doesn't work", 'does not work', 'is broken', "isn't working"]],
        },
        {
          they: 'Oh, I am sorry. Do you have the receipt?',
          de: 'Ja, hier ist er. Ich habe ihn letzte Woche gekauft.',
          answers: ['Yes, here it is. I bought it last week.', "Yes, here you are. I bought it last week."],
          keywords: [['here'], ['bought'], ['last week']],
        },
        {
          they: 'Would you like a new one or your money back?',
          de: 'Mein Geld zurück, bitte.',
          answers: ['My money back, please.', "I'd like my money back, please.", 'I would like my money back, please.'],
          keywords: [['money back']],
        },
      ],
      tip: {"de": "„I'd like to return this.“ = Ich möchte das zurückgeben. „exchange“ = umtauschen. Nicht „recipe“ für Kassenbon – das ist „receipt“!", "en": "Here is the receipt."},
      write: {"de": "Schreib einer Firma eine kurze Nachricht: Etwas, das du gekauft hast, funktioniert nicht.", "useWords": ["I bought", "last week", "It doesn't work", "Can I"], "sample": "I bought a toaster last week, but it doesn't work. Can I get my money back?"},
      talk: {"they": "Did you ever have to return something?", "de": "Erzähl, ob du schon einmal etwas zurückgeben musstest.", "useWords": ["Once I bought", "it was broken", "they gave me"], "sample": "Yes, once I bought shoes, but they were too small. They gave me a new pair."},
      story: {
        title: 'Die kaputten Kopfhörer',
        de: 'Ben bringt etwas zurück. Hör gut zu.',
        lines: [
          'Ben bought new headphones on Monday.',
          'On Wednesday, the left side stopped working.',
          'He was angry, because they were not cheap.',
          'On Thursday, he took them back to the shop.',
          'He did not have the box any more, but he had the receipt.',
          'The man in the shop tested the headphones.',
          'He said sorry and gave Ben a new pair.',
          'Now Ben listens to music on the train again.',
        ],
        questions: [
          { q: 'What was wrong with the headphones?', qde: 'Was war mit den Kopfhörern los?', options: ['They were too big.', 'The left side did not work.', 'They were the wrong colour.'], answer: 1 },
          { q: 'What did Ben get?', qde: 'Was hat Ben bekommen?', options: ['His money back', 'A new pair', 'Nothing'], answer: 1 },
        ],
      },
    },
    // ------------------------------------------------------------------ 5
    {
      id: 's5',
      title: 'Ein Geschenk kaufen',
      en: 'Buying a present',
      goal: 'Um Rat fragen, Preise vergleichen und etwas einpacken lassen',
      repeat: [
        { en: "I'm looking for a present for my friend.", de: 'Ich suche ein Geschenk für meine Freundin.' },
        { en: 'Do you have anything cheaper?', de: 'Haben Sie etwas Günstigeres?' },
        { en: 'Can you wrap it, please?', de: 'Können Sie es bitte einpacken?' },
        { en: "It's for her birthday.", de: 'Es ist für ihren Geburtstag.' },
      ],
      build: [
        { en: 'She likes reading and cooking.', de: 'Sie liest und kocht gern.', extra: ['gladly'] },
        { en: 'That is a bit too expensive.', de: 'Das ist ein bisschen zu teuer.', extra: ['to'] },
        { en: 'I will take the red one.', de: 'Ich nehme das rote.', extra: ['it'] },
      ],
      say: [
        {
          they: 'Hello! Can I help you?',
          de: 'Ja, bitte. Ich suche ein Geschenk für meine Freundin.',
          answers: ["Yes, please. I'm looking for a present for my friend.", 'Yes, please. I am looking for a gift for my friend.', 'Yes, please. I need a present for my friend.'],
          keywords: [['present', 'gift'], ['friend']],
        },
        {
          they: 'What does she like?',
          de: 'Sie kocht sehr gern.',
          answers: ['She likes cooking very much.', 'She loves cooking.', 'She really likes to cook.'],
          keywords: [['cook', 'cooking']],
        },
        {
          they: 'This cookbook is very popular. It costs thirty euros.',
          de: 'Schön! Können Sie es bitte einpacken?',
          answers: ['Nice! Can you wrap it, please?', 'Great! Could you wrap it, please?', 'Lovely! Can you wrap it for me, please?'],
          keywords: [['wrap']],
        },
      ],
      tip: {"de": "„for“ bei Geschenken: a present for my friend. Und „It's for her birthday.“ – „her“ für eine Frau, „his“ für einen Mann.", "en": "It's for her birthday."},
      write: {"de": "Schreib, was du einer guten Freundin zum Geburtstag schenken würdest und warum.", "useWords": ["I would buy", "because she loves"], "sample": "I would buy her a cookbook, because she loves cooking."},
      talk: {"they": "What was the best present you ever got?", "de": "Erzähl vom schönsten Geschenk, das du bekommen hast.", "useWords": ["The best present was", "from", "because"], "sample": "The best present was a trip to Paris from my sister."},
      story: {
        title: 'Ein Geschenk für Oma',
        de: 'Jonas sucht ein Geschenk. Hör gut zu.',
        lines: [
          'Next Sunday is Jonas\'s grandmother\'s eightieth birthday.',
          'He wants to buy her something special.',
          'She loves her garden, so he goes to a flower shop.',
          'He sees a small orange tree in a blue pot.',
          'It costs forty-five euros, and that is too much for him.',
          'The woman in the shop shows him a smaller tree for twenty-five euros.',
          'Jonas likes it and asks her to wrap it.',
          'His grandmother is so happy that she cries a little.',
        ],
        questions: [
          { q: 'What does Jonas buy?', qde: 'Was kauft Jonas?', options: ['Some flowers', 'A small orange tree', 'A blue pot'], answer: 1 },
          { q: 'How much does it cost?', qde: 'Wie viel kostet es?', options: ['Forty-five euros', 'Fifteen euros', 'Twenty-five euros'], answer: 2 },
        ],
      },
    },
  ],
};
