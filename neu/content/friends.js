// Topic "Freunde" (friends) – 5 lessons, same format as travel.js (level A2–B1, short sentences, no idioms).
// After changing English sentences: run tools/make_audio.py and commit audio/.

export default {
  id: 'friends',
  title: 'Freunde',
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'f1',
      title: 'Jemanden kennenlernen',
      en: 'Meeting someone new',
      goal: 'Sich vorstellen und einfache Fragen stellen',
      repeat: [
        { en: 'Nice to meet you.', de: 'Schön, dich kennenzulernen.' },
        { en: "I'm from Germany.", de: 'Ich komme aus Deutschland.' },
        { en: 'What do you do?', de: 'Was machst du beruflich?' },
        { en: 'How do you know Sarah?', de: 'Woher kennst du Sarah?' },
      ],
      build: [
        { en: 'I live near Munich.', de: 'Ich wohne in der Nähe von München.', extra: ['by'] },
        { en: 'How long have you lived here?', de: 'Wie lange wohnst du schon hier?', extra: ['since'] },
        { en: 'I work in an office.', de: 'Ich arbeite in einem Büro.', extra: ['at'] },
      ],
      say: [
        {
          they: "Hi, I'm Kate. What's your name?",
          de: 'Hallo, ich bin Miri. Schön, dich kennenzulernen.',
          answers: ["Hi, I'm Miri. Nice to meet you.", 'Hello, my name is Miri. Nice to meet you.', "I'm Miri, nice to meet you."],
          keywords: [['miri'], ['nice to meet you', 'pleased to meet you', 'nice meeting you']],
        },
        {
          they: 'Where are you from?',
          de: 'Ich komme aus Deutschland.',
          answers: ["I'm from Germany.", 'I am from Germany.', 'I come from Germany.', 'From Germany.'],
          keywords: [['germany']],
        },
        {
          they: 'And what do you do?',
          de: 'Ich arbeite in einem Büro. Und du?',
          answers: ['I work in an office. And you?', 'I work in an office. What about you?'],
          keywords: [['work'], ['office'], ['and you', 'what about you', 'how about you']],
        },
      ],
      tip: {"de": "„What do you do?“ heißt: Was machst du beruflich? Antwort: „I work in …“ oder „I'm a nurse / a teacher“ – mit „a“!", "en": "I'm a teacher."},
      write: {"de": "Stell dich in 2 Sätzen vor: Name, woher du kommst, was du machst.", "useWords": ["My name is", "I'm from", "I work"], "sample": "My name is Miri. I'm from Germany and I work in an office."},
      talk: {"they": "So, tell me a little about yourself!", "de": "Erzähl kurz etwas über dich: Wohnort, Arbeit, was du gern machst.", "useWords": ["I live in", "I work", "I like"], "sample": "I live near Munich. I work in an office, and I like walking."},
      story: {
        title: 'Eine neue Freundin',
        de: 'Lisa ist auf einer Party. Hör gut zu.',
        lines: [
          'Lisa is at a party at her friend Sarah\'s house.',
          'She does not know many people there.',
          'A woman with short black hair says hello.',
          'Her name is Kate, and she is from Canada.',
          'Kate is a teacher. She teaches English to children.',
          'Lisa and Kate talk about books and music.',
          'They both love old films.',
          'At the end of the evening, they swap phone numbers.',
        ],
        questions: [
          { q: 'Where is Kate from?', qde: 'Woher kommt Kate?', options: ['From England', 'From Canada', 'From Australia'], answer: 1 },
          { q: 'What do Lisa and Kate both love?', qde: 'Was lieben Lisa und Kate beide?', options: ['Old films', 'Cooking', 'Football'], answer: 0 },
        ],
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'f2',
      title: 'Sich verabreden',
      en: 'Making plans',
      goal: 'Jemanden einladen, einen Tag und eine Uhrzeit ausmachen',
      repeat: [
        { en: 'Are you free on Saturday?', de: 'Hast du am Samstag Zeit?' },
        { en: "Let's meet for a coffee.", de: 'Lass uns auf einen Kaffee treffen.' },
        { en: 'What time is good for you?', de: 'Welche Uhrzeit passt dir?' },
        { en: 'See you then!', de: 'Bis dann!' },
      ],
      build: [
        { en: 'Do you want to go to the cinema?', de: 'Willst du ins Kino gehen?', extra: ['in'] },
        { en: 'I can meet you at six.', de: 'Ich kann dich um sechs treffen.', extra: ['on'] },
        { en: "Sorry, I can't on Friday.", de: 'Tut mir leid, am Freitag kann ich nicht.', extra: ['at'] },
      ],
      say: [
        {
          they: 'Hey! Do you want to do something this weekend?',
          de: 'Ja, gern! Hast du am Samstag Zeit?',
          answers: ['Yes, I would love to! Are you free on Saturday?', 'Sure! Are you free on Saturday?', 'Yes! Do you have time on Saturday?'],
          keywords: [['yes', 'sure', 'love to', 'great'], ['saturday']],
        },
        {
          they: "Saturday is good. What should we do?",
          de: 'Lass uns auf einen Kaffee treffen.',
          answers: ["Let's meet for a coffee.", "Let's have a coffee.", "Let's go for a coffee."],
          keywords: [["let's", 'let us', 'we could', 'maybe'], ['coffee']],
        },
        {
          they: 'Great idea. What time?',
          de: 'Um drei Uhr? Bis dann!',
          answers: ['At three o\'clock? See you then!', 'At three? See you then!', 'How about three? See you!'],
          keywords: [['three', '3'], ['see you']],
        },
      ],
      tip: {"de": "Vorschläge machen: „Let's …“ (Lass uns …) oder „How about …?“ (Wie wäre es mit …?). Nach „How about“ kommt die -ing-Form: How about going to the cinema?", "en": "How about going to the cinema?"},
      write: {"de": "Schreib einer Freundin eine Nachricht: Lade sie für Samstag ins Café ein.", "useWords": ["Are you free", "Let's", "at"], "sample": "Hi! Are you free on Saturday? Let's meet for a coffee at three."},
      talk: {"they": "What do you like to do with your friends?", "de": "Erzähl, was du mit Freunden gern unternimmst.", "useWords": ["We often", "go for a walk", "have dinner"], "sample": "We often go for a walk or have dinner together."},
      story: {
        title: 'Kino am Freitag',
        de: 'Ben und Jana wollen sich treffen. Hör gut zu.',
        lines: [
          'Ben calls his friend Jana on Wednesday.',
          'He wants to go to the cinema on Friday.',
          'But Jana can\'t on Friday. She has to work late.',
          'So they meet on Saturday afternoon instead.',
          'They meet in front of the cinema at four.',
          'Ben is ten minutes late because of the traffic.',
          'Jana is not angry. She buys popcorn for them both.',
          'The film is funny, and they laugh a lot.',
        ],
        questions: [
          { q: 'Why can\'t Jana go on Friday?', qde: 'Warum kann Jana am Freitag nicht?', options: ['She is ill.', 'She has to work late.', 'She is on holiday.'], answer: 1 },
          { q: 'Why is Ben late?', qde: 'Warum kommt Ben zu spät?', options: ['Because of the traffic', 'He forgot the time', 'He lost his ticket'], answer: 0 },
        ],
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'f3',
      title: 'Über das Wochenende reden',
      en: 'Talking about the weekend',
      goal: 'Erzählen, was du gemacht hast (Vergangenheit)',
      repeat: [
        { en: 'How was your weekend?', de: 'Wie war dein Wochenende?' },
        { en: 'It was really nice, thanks.', de: 'Es war wirklich schön, danke.' },
        { en: 'I visited my parents.', de: 'Ich habe meine Eltern besucht.' },
        { en: 'We went for a long walk.', de: 'Wir sind lange spazieren gegangen.' },
      ],
      build: [
        { en: 'What did you do on Sunday?', de: 'Was hast du am Sonntag gemacht?', extra: ['made'] },
        { en: 'I stayed at home and relaxed.', de: 'Ich bin zu Hause geblieben und habe mich ausgeruht.', extra: ['in'] },
        { en: 'We had dinner with friends.', de: 'Wir haben mit Freunden zu Abend gegessen.', extra: ['ate'] },
      ],
      say: [
        {
          they: 'Hi! How was your weekend?',
          de: 'Es war schön, danke. Ich habe meine Eltern besucht.',
          answers: ['It was nice, thanks. I visited my parents.', 'It was good, thank you. I visited my parents.'],
          keywords: [['nice', 'good', 'great', 'lovely'], ['visited'], ['parents']],
        },
        {
          they: 'Oh, nice. What did you do there?',
          de: 'Wir sind lange spazieren gegangen.',
          answers: ['We went for a long walk.', 'We took a long walk.', 'We went for a walk.'],
          keywords: [['went', 'took', 'had'], ['walk']],
        },
        {
          they: 'Sounds lovely. And on Sunday?',
          de: 'Am Sonntag bin ich zu Hause geblieben.',
          answers: ['On Sunday I stayed at home.', 'I stayed at home on Sunday.', 'On Sunday I stayed home.'],
          keywords: [['sunday'], ['stayed'], ['home']],
        },
      ],
      tip: {"de": "Vergangenheit: Viele Verben bekommen -ed (visited, stayed). Wichtige Ausnahmen: go → went, have → had, see → saw, eat → ate.", "en": "We went for a long walk."},
      write: {"de": "Schreib, was du letztes Wochenende gemacht hast.", "useWords": ["On Saturday", "I went", "I visited", "it was"], "sample": "On Saturday I visited my sister. On Sunday I stayed at home. It was nice."},
      talk: {"they": "How was your weekend? What did you do?", "de": "Erzähl von deinem letzten Wochenende.", "useWords": ["It was", "I went", "I stayed"], "sample": "It was good, thanks. I went to the market and cooked with friends."},
      story: {
        title: 'Ein nasses Wochenende',
        de: 'Mark erzählt von seinem Wochenende. Hör gut zu.',
        lines: [
          'On Saturday morning, Mark went to the market.',
          'He bought fresh bread, cheese and some apples.',
          'In the afternoon, it started to rain.',
          'So he stayed at home and read a book.',
          'On Sunday, his sister came to visit.',
          'They cooked lunch together and talked for hours.',
          'In the evening, they watched a football game on TV.',
          'It was a quiet but happy weekend.',
        ],
        questions: [
          { q: 'What did Mark do when it rained?', qde: 'Was hat Mark gemacht, als es regnete?', options: ['He went shopping.', 'He read a book.', 'He played football.'], answer: 1 },
          { q: 'Who visited Mark on Sunday?', qde: 'Wer hat Mark am Sonntag besucht?', options: ['His mother', 'His friend', 'His sister'], answer: 2 },
        ],
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'f4',
      title: 'Zu Besuch',
      en: 'Visiting a friend',
      goal: 'Als Gast höflich sein, etwas anbieten und annehmen',
      repeat: [
        { en: 'Come in! Make yourself at home.', de: 'Komm rein! Fühl dich wie zu Hause.' },
        { en: 'What a beautiful flat!', de: 'Was für eine schöne Wohnung!' },
        { en: 'Would you like something to drink?', de: 'Möchtest du etwas trinken?' },
        { en: 'A cup of tea would be great.', de: 'Eine Tasse Tee wäre toll.' },
      ],
      build: [
        { en: 'Thank you for inviting me.', de: 'Danke für die Einladung.', extra: ['to'] },
        { en: 'I brought you some flowers.', de: 'Ich habe dir ein paar Blumen mitgebracht.', extra: ['bringed'] },
        { en: 'This cake is delicious.', de: 'Dieser Kuchen ist sehr lecker.', extra: ['very'] },
      ],
      say: [
        {
          they: 'Hi! Come in, come in!',
          de: 'Danke für die Einladung. Die sind für dich.',
          answers: ['Hi! Thank you for inviting me. These are for you.', 'Hello! Thanks for inviting me. These are for you.', 'Hi! Thanks for having me. These are for you.'],
          keywords: [['thank you', 'thanks'], ['for you']],
        },
        {
          they: 'Oh, beautiful flowers! Would you like something to drink?',
          de: 'Ja, gern. Eine Tasse Tee, bitte.',
          answers: ['Yes, please. A cup of tea, please.', "Yes, I'd love a cup of tea.", 'Yes, a tea, please.'],
          keywords: [['yes', 'love'], ['tea']],
        },
        {
          they: 'Here you are. Would you like some cake too?',
          de: 'Ja, bitte. Der Kuchen sieht sehr lecker aus!',
          answers: ['Yes, please. The cake looks delicious!', 'Yes, please! It looks really good!', 'Yes, please. It looks very tasty!'],
          keywords: [['yes'], ['looks'], ['delicious', 'good', 'tasty', 'great', 'lovely', 'yummy']],
        },
      ],
      tip: {"de": "Etwas anbieten: „Would you like …?“ = Möchtest du …? Antwort: „Yes, please.“ oder „No, thank you.“ – nicht nur „Yes.“", "en": "Would you like something to drink?"},
      write: {"de": "Schreib eine kurze Danke-Nachricht nach einem Abend bei Freunden.", "useWords": ["Thank you for", "lovely", "delicious"], "sample": "Thank you for a lovely evening! The food was delicious."},
      talk: {"they": "What do you usually bring when you visit friends?", "de": "Erzähl, was du mitbringst, wenn du Freunde besuchst.", "useWords": ["I usually bring", "flowers", "a bottle of wine"], "sample": "I usually bring flowers or some chocolate."},
      story: {
        title: 'Abendessen bei Emma',
        de: 'Tom besucht seine Freundin Emma. Hör gut zu.',
        lines: [
          'Emma invites Tom to dinner at her new flat.',
          'Tom brings a bottle of red wine.',
          'Emma\'s flat is small, but it has a lovely balcony.',
          'She cooks fish with rice and vegetables.',
          'Tom does not eat meat, so the fish is perfect.',
          'After dinner, they sit on the balcony.',
          'They drink tea and look at the stars.',
          'Tom says thank you and goes home at midnight.',
        ],
        questions: [
          { q: 'What does Tom bring?', qde: 'Was bringt Tom mit?', options: ['Flowers', 'A cake', 'A bottle of wine'], answer: 2 },
          { q: 'What does Emma cook?', qde: 'Was kocht Emma?', options: ['Fish with rice', 'Pasta', 'Chicken soup'], answer: 0 },
        ],
      },
    },
    // ------------------------------------------------------------------ 5
    {
      id: 'f5',
      title: 'Wie geht es dir wirklich?',
      en: 'Sharing news and feelings',
      goal: 'Erzählen, wie es dir geht, und auf Neuigkeiten reagieren',
      repeat: [
        { en: "I'm a bit tired today.", de: 'Ich bin heute ein bisschen müde.' },
        { en: 'That sounds great!', de: 'Das klingt toll!' },
        { en: "I'm sorry to hear that.", de: 'Das tut mir leid.' },
        { en: 'I have some good news.', de: 'Ich habe gute Neuigkeiten.' },
      ],
      build: [
        { en: 'I had a stressful week at work.', de: 'Ich hatte eine stressige Woche auf der Arbeit.', extra: ['by'] },
        { en: "I'm really happy for you.", de: 'Ich freue mich wirklich für dich.', extra: ['me'] },
        { en: "Don't worry, it will be fine.", de: 'Mach dir keine Sorgen, das wird schon.', extra: ['make'] },
      ],
      say: [
        {
          they: 'Hey, how are you? You look tired.',
          de: 'Ja, ich hatte eine stressige Woche auf der Arbeit.',
          answers: ['Yes, I had a stressful week at work.', 'Yeah, I had a really stressful week at work.', 'Yes, work was very stressful this week.'],
          keywords: [['stressful', 'stress', 'busy', 'hard'], ['week'], ['work']],
        },
        {
          they: "Oh no. Well, I have some good news: I'm getting married!",
          de: 'Wow, das ist ja toll! Ich freue mich so für dich!',
          answers: ["Wow, that's great! I'm so happy for you!", "Wow, that's wonderful! I'm really happy for you!", 'Congratulations! I am so happy for you!'],
          keywords: [['great', 'wonderful', 'amazing', 'fantastic', 'congratulations'], ['happy for you']],
        },
        {
          they: "Thanks! I'm a bit nervous about the wedding, though.",
          de: 'Mach dir keine Sorgen, das wird bestimmt schön.',
          answers: ["Don't worry, it will be lovely.", "Don't worry, it will be beautiful.", "Don't worry, it's going to be great."],
          keywords: [["don't worry", 'do not worry'], ['lovely', 'beautiful', 'great', 'fine', 'wonderful', 'perfect', 'good']],
        },
      ],
      tip: {"de": "Auf Neuigkeiten reagieren: gut → „That's great!“, schlecht → „I'm sorry to hear that.“ Ganz kurz ist völlig normal.", "en": "I'm sorry to hear that."},
      write: {"de": "Eine Freundin schreibt dir: „I passed my driving test!“ Antworte ihr.", "useWords": ["Congratulations", "I'm so happy for you", "Let's"], "sample": "Congratulations! I'm so happy for you. Let's celebrate this weekend!"},
      talk: {"they": "How are you today, really?", "de": "Erzähl ehrlich, wie es dir heute geht und warum.", "useWords": ["I'm a bit tired", "I'm happy because", "work was"], "sample": "I'm a bit tired. Work was busy, but I'm fine."},
      story: {
        title: 'Gute Nachrichten',
        de: 'Zwei Freundinnen treffen sich im Café. Hör gut zu.',
        lines: [
          'Julia meets her old friend Nina in a café.',
          'Nina looks tired. She has a new job and works a lot.',
          'But she likes her new boss and her team.',
          'Then Julia tells her some big news.',
          'She and her husband are going to have a baby!',
          'Nina is so happy that she almost cries.',
          'The baby will come in March.',
          'They order two pieces of chocolate cake to celebrate.',
        ],
        questions: [
          { q: 'Why is Nina tired?', qde: 'Warum ist Nina müde?', options: ['She has a new job.', 'She has a baby.', 'She was ill.'], answer: 0 },
          { q: 'When will the baby come?', qde: 'Wann kommt das Baby?', options: ['In May', 'In March', 'In December'], answer: 1 },
        ],
      },
    },
  ],
};
