// Topic "Arbeit & Alltag" (work and daily life) – level 2 (B1): a bit longer answers, present simple vs. present continuous.
// Same format as travel.js. After changing English sentences: run tools/make_audio.py and commit audio/.

export default {
  id: 'work',
  title: 'Arbeit & Alltag',
  level: 2,
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'w1',
      title: 'Mein Alltag',
      en: 'My daily routine',
      goal: 'Deinen normalen Tag beschreiben (immer, oft, manchmal)',
      tip: { de: "Für Gewohnheiten nimmst du die einfache Gegenwart: „I get up at seven.“ Bei he/she/it kommt ein -s dazu: „She gets up at seven.“ Wörter wie always, usually, often stehen vor dem Verb.", en: 'I usually get up at seven.' },
      repeat: [
        { en: 'I usually get up at seven.', de: 'Ich stehe normalerweise um sieben auf.' },
        { en: 'I have breakfast with my family.', de: 'Ich frühstücke mit meiner Familie.' },
        { en: 'I often go for a walk after work.', de: 'Nach der Arbeit gehe ich oft spazieren.' },
        { en: 'I go to bed quite early.', de: 'Ich gehe ziemlich früh ins Bett.' },
      ],
      build: [
        { en: 'She always drinks coffee in the morning.', de: 'Sie trinkt morgens immer Kaffee.', extra: ['drink'] },
        { en: 'I never watch TV in the evening.', de: 'Ich schaue abends nie fern.', extra: ['not'] },
        { en: 'What time do you start work?', de: 'Um wie viel Uhr fängst du mit der Arbeit an?', extra: ['does'] },
      ],
      say: [
        {
          they: "What does a normal day look like for you?",
          de: 'Ich stehe um sieben auf und frühstücke mit meiner Familie.',
          answers: ['I get up at seven and have breakfast with my family.', 'I get up at seven and eat breakfast with my family.'],
        },
        {
          they: 'And what do you do after work?',
          de: 'Ich gehe oft spazieren, weil es mir hilft, mich zu entspannen.',
          answers: ['I often go for a walk, because it helps me relax.', 'I often go for a walk because it helps me to relax.'],
        },
        {
          they: 'Are you a morning person?',
          de: 'Nicht wirklich. Ich trinke zuerst immer einen Kaffee.',
          answers: ['Not really. I always have a coffee first.', 'Not really. I always drink a coffee first.'],
        },
      ],
      write: { de: 'Beschreib deinen Morgen: Was machst du zuerst, was danach?', useWords: ['First', 'Then', 'usually', 'after that'], sample: 'First I have a coffee. Then I take a shower, and after that I usually walk to work.' },
      talk: { they: "What's your favourite part of the day?", de: 'Erzähl, welche Tageszeit du am liebsten magst und warum.', useWords: ['I like the evening', 'because', 'I can relax'], sample: 'I like the evening, because I can relax and cook something nice.' },
      story: {
        title: 'Ein Tag im Leben von Sam',
        de: 'Sam erzählt von seinem Alltag. Hör gut zu.',
        lines: [
          'Sam is a nurse at a big hospital.',
          'He usually works from seven in the morning until three.',
          'He gets up at half past five, so he is often tired.',
          'He goes to work by bike, because it is quicker than the bus.',
          'After work, he picks up his daughter from school.',
          'In the evening, they cook dinner together.',
          'On Wednesdays, Sam plays football with his friends.',
          'He goes to bed at ten, because he has to get up early.',
        ],
        questions: [
          { q: 'Why does Sam go to work by bike?', qde: 'Warum fährt Sam mit dem Rad zur Arbeit?', options: ['It is cheaper.', 'It is quicker than the bus.', 'He likes the rain.'], answer: 1 },
          { q: 'What does Sam do on Wednesdays?', qde: 'Was macht Sam mittwochs?', options: ['He plays football.', 'He works late.', 'He cooks for friends.'], answer: 0 },
        ],
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'w2',
      title: 'Über die Arbeit reden',
      en: 'Talking about work',
      goal: 'Erzählen, was du arbeitest und was du daran magst',
      tip: { de: "Einen Beruf nennst du mit „a“: „I'm a nurse.“ Wo du arbeitest: „I work for a big company“ (Firma) oder „I work in an office / at a school“.", en: 'I work for a small company.' },
      repeat: [
        { en: 'I work for a small company.', de: 'Ich arbeite für eine kleine Firma.' },
        { en: 'I really like my colleagues.', de: 'Ich mag meine Kollegen sehr.' },
        { en: 'I work from home two days a week.', de: 'Ich arbeite zwei Tage die Woche von zu Hause.' },
        { en: 'The work is interesting, but sometimes stressful.', de: 'Die Arbeit ist interessant, aber manchmal stressig.' },
      ],
      build: [
        { en: 'How long have you worked there?', de: 'Wie lange arbeitest du schon dort?', extra: ['since'] },
        { en: 'I have worked there for five years.', de: 'Ich arbeite seit fünf Jahren dort.', extra: ['since'] },
        { en: 'What do you like most about your job?', de: 'Was magst du an deiner Arbeit am meisten?', extra: ['more'] },
      ],
      say: [
        {
          they: 'So, what do you do?',
          de: 'Ich arbeite in einem Büro, für eine kleine Firma.',
          answers: ['I work in an office, for a small company.', 'I work for a small company, in an office.'],
        },
        {
          they: 'Do you like it?',
          de: 'Ja, die Arbeit ist interessant und ich mag meine Kollegen sehr.',
          answers: ['Yes, the work is interesting and I really like my colleagues.', 'Yes, the work is interesting, and I like my colleagues a lot.'],
        },
        {
          they: 'Do you have to go to the office every day?',
          de: 'Nein, ich arbeite zwei Tage die Woche von zu Hause.',
          answers: ['No, I work from home two days a week.', 'No, I work at home two days a week.'],
        },
      ],
      write: { de: 'Schreib, was du an deiner Arbeit (oder deinem Alltag) magst und was nicht.', useWords: ['I like', "I don't like", 'because', 'but'], sample: "I like my colleagues, but I don't like the long meetings, because they are boring." },
      talk: { they: 'What did you want to be when you were a child?', de: 'Erzähl, was du als Kind werden wolltest.', useWords: ['When I was a child', 'I wanted to be', 'because'], sample: 'When I was a child, I wanted to be a vet, because I loved animals.' },
      story: {
        title: 'Ein neuer Job',
        de: 'Laura erzählt von ihrer neuen Arbeit. Hör gut zu.',
        lines: [
          'Laura started a new job last month.',
          'She works for a company that makes children\'s books.',
          'Before that, she worked in a bank for ten years.',
          'The new job pays a bit less money.',
          'But Laura is much happier now.',
          'Her colleagues are friendly, and the work is creative.',
          'She can work from home on Fridays.',
          'On those days, she takes her dog for long walks at lunchtime.',
        ],
        questions: [
          { q: 'Where did Laura work before?', qde: 'Wo hat Laura vorher gearbeitet?', options: ['In a school', 'In a bank', 'In a bookshop'], answer: 1 },
          { q: 'What is better about the new job?', qde: 'Was ist an der neuen Arbeit besser?', options: ['She earns more money.', 'She is happier there.', 'She never has to work.'], answer: 1 },
        ],
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'w3',
      title: 'Was machst du gerade?',
      en: 'What are you doing right now?',
      goal: 'Sagen, was gerade passiert (Verlaufsform)',
      tip: { de: "Was gerade jetzt passiert: am/is/are + -ing. „I'm cooking.“ Gewohnheit dagegen ohne -ing: „I cook every day.“ Im Deutschen gibt es diesen Unterschied nicht – deshalb lohnt sich die Übung.", en: "I'm cooking dinner right now." },
      repeat: [
        { en: "I'm cooking dinner right now.", de: 'Ich koche gerade Abendessen.' },
        { en: "Sorry, I'm driving. Can I call you back?", de: 'Sorry, ich fahre gerade. Kann ich dich zurückrufen?' },
        { en: "We're watching a film.", de: 'Wir schauen gerade einen Film.' },
        { en: "It's raining again.", de: 'Es regnet schon wieder.' },
      ],
      build: [
        { en: 'What are you doing at the moment?', de: 'Was machst du gerade?', extra: ['do'] },
        { en: "I'm working on a big project this week.", de: 'Diese Woche arbeite ich an einem großen Projekt.', extra: ['work'] },
        { en: 'The baby is sleeping, so I have to be quiet.', de: 'Das Baby schläft gerade, also muss ich leise sein.', extra: ['sleeps'] },
      ],
      say: [
        {
          they: 'Hi! Is this a good time to talk?',
          de: 'Nicht wirklich, ich koche gerade. Kann ich dich zurückrufen?',
          answers: ["Not really, I'm cooking right now. Can I call you back?", "Not really, I'm cooking at the moment. Can I call you back?"],
        },
        {
          they: 'Sure. Are you making something nice?',
          de: 'Ja, ich mache eine Gemüsesuppe.',
          answers: ["Yes, I'm making a vegetable soup.", "Yes, I'm cooking a vegetable soup."],
        },
        {
          they: 'Lovely! What are you doing later?',
          de: 'Später schauen wir einen Film. Ruf mich morgen an!',
          answers: ["Later we're watching a film. Call me tomorrow!", "We're watching a film later. Call me tomorrow!"],
        },
      ],
      write: { de: 'Schreib einer Freundin, was du gerade machst und was um dich herum passiert.', useWords: ["I'm sitting", "it's raining", "is playing"], sample: "I'm sitting on the sofa. It's raining outside, and my neighbour is playing the piano." },
      talk: { they: 'What are you doing these days? Anything new?', de: 'Erzähl, was du in letzter Zeit machst (Arbeit, Hobbys, Projekte).', useWords: ["I'm learning", "I'm reading", 'these days'], sample: "I'm learning English these days, and I'm reading a good book." },
      story: {
        title: 'Ein Anruf am Sonntag',
        de: 'Ella ruft ihre Mutter an. Hör gut zu.',
        lines: [
          'It is Sunday afternoon, and Ella calls her mother.',
          'Her mother says, "I can\'t talk long. I\'m baking a cake."',
          'Ella can hear the radio. Her father is listening to football.',
          'In the garden, the dog is barking at a cat.',
          'Ella laughs. "It\'s busy at your house today!"',
          'Her mother says, "Yes, and your brother is coming for coffee at four."',
          'Ella decides to visit too.',
          'She takes her bike and arrives just in time for cake.',
        ],
        questions: [
          { q: 'What is Ella\'s mother doing?', qde: 'Was macht Ellas Mutter gerade?', options: ['She is baking a cake.', 'She is watching football.', 'She is walking the dog.'], answer: 0 },
          { q: 'Who is coming at four?', qde: 'Wer kommt um vier?', options: ['Ella\'s aunt', 'Ella\'s brother', 'A neighbour'], answer: 1 },
        ],
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'w4',
      title: 'Hausarbeit und Erledigungen',
      en: 'Housework and errands',
      goal: 'Über Aufgaben zu Hause sprechen und um Hilfe bitten',
      tip: { de: "„have to“ = müssen: „I have to clean the kitchen.“ „don't have to“ heißt aber: muss nicht! („You don't have to help“ = Du musst nicht helfen.)", en: "You don't have to help, but thank you!" },
      repeat: [
        { en: 'I have to do the washing today.', de: 'Ich muss heute die Wäsche machen.' },
        { en: 'Could you take out the rubbish?', de: 'Könntest du den Müll rausbringen?' },
        { en: 'I hate ironing.', de: 'Ich hasse Bügeln.' },
        { en: "I'll do the shopping on my way home.", de: 'Ich erledige den Einkauf auf dem Heimweg.' },
      ],
      build: [
        { en: 'Who does the cooking in your house?', de: 'Wer kocht bei euch zu Hause?', extra: ['makes'] },
        { en: "You don't have to do the dishes.", de: 'Du musst nicht abwaschen.', extra: ['must'] },
        { en: 'I need to pick up a parcel from the post office.', de: 'Ich muss ein Paket bei der Post abholen.', extra: ['packet'] },
      ],
      say: [
        {
          they: 'What are your plans for Saturday?',
          de: 'Nichts Besonderes. Ich muss putzen und die Wäsche machen.',
          answers: ['Nothing special. I have to clean and do the washing.', 'Nothing special. I have to clean the flat and do the washing.'],
        },
        {
          they: 'Oh, I hate cleaning! Do you do it all alone?',
          de: 'Nein, mein Partner kocht und ich putze.',
          answers: ['No, my partner cooks and I clean.', 'No, my partner does the cooking and I do the cleaning.'],
        },
        {
          they: 'Can I help with anything?',
          de: 'Das ist lieb, aber du musst nicht helfen!',
          answers: ["That's kind, but you don't have to help!", "That's nice of you, but you don't have to help!"],
        },
      ],
      write: { de: 'Schreib eine kleine To-do-Liste für morgen, in ganzen Sätzen.', useWords: ['I have to', 'I need to', "I don't have to"], sample: "Tomorrow I have to clean the bathroom and I need to buy bread. I don't have to cook." },
      talk: { they: 'Which housework do you like, and which do you hate?', de: 'Erzähl, welche Hausarbeit du magst und welche nicht.', useWords: ["I don't mind", 'I hate', 'cooking', 'ironing'], sample: "I don't mind cooking, but I hate ironing." },
      story: {
        title: 'Ein voller Samstag',
        de: 'Tom hat viel zu erledigen. Hör gut zu.',
        lines: [
          'On Saturday, Tom has a long list of things to do.',
          'First, he has to pick up a parcel from the post office.',
          'Then he takes his old jacket to the dry cleaner\'s.',
          'At the supermarket, there is a very long queue.',
          'When he gets home, he notices that he forgot the milk.',
          'His flatmate Ben says, "Don\'t worry, I\'ll get it."',
          'So Tom cleans the kitchen while Ben goes to the shop.',
          'In the evening, they both relax with a pizza.',
        ],
        questions: [
          { q: 'What did Tom forget?', qde: 'Was hat Tom vergessen?', options: ['The bread', 'The milk', 'His jacket'], answer: 1 },
          { q: 'What does Tom do while Ben goes to the shop?', qde: 'Was macht Tom, während Ben einkauft?', options: ['He cleans the kitchen.', 'He makes a pizza.', 'He sleeps.'], answer: 0 },
        ],
      },
    },
    // ------------------------------------------------------------------ 5
    {
      id: 'w5',
      title: 'Freizeit und Hobbys',
      en: 'Free time and hobbies',
      goal: 'Über Hobbys reden und sagen, was du gern machst',
      tip: { de: "Nach like, love, enjoy und hate kommt die -ing-Form: „I enjoy swimming.“ – nicht „I enjoy to swim“.", en: 'I really enjoy swimming.' },
      repeat: [
        { en: 'I really enjoy swimming.', de: 'Ich schwimme sehr gern.' },
        { en: "I've just started a yoga class.", de: 'Ich habe gerade mit einem Yogakurs angefangen.' },
        { en: 'I read a lot in the evenings.', de: 'Abends lese ich viel.' },
        { en: "I'm not very good at it, but it's fun.", de: 'Ich bin nicht sehr gut darin, aber es macht Spaß.' },
      ],
      build: [
        { en: 'What do you do in your free time?', de: 'Was machst du in deiner Freizeit?', extra: ['make'] },
        { en: 'She loves going to concerts.', de: 'Sie geht sehr gern auf Konzerte.', extra: ['go'] },
        { en: 'How often do you go swimming?', de: 'Wie oft gehst du schwimmen?', extra: ['much'] },
      ],
      say: [
        {
          they: 'What do you like doing at the weekend?',
          de: 'Ich wandere gern und ich lese viel.',
          answers: ['I like hiking and I read a lot.', 'I enjoy hiking, and I read a lot.'],
        },
        {
          they: "That's nice. Do you do any sport?",
          de: 'Ich habe gerade mit Yoga angefangen. Ich bin nicht sehr gut, aber es macht Spaß.',
          answers: ["I've just started yoga. I'm not very good, but it's fun.", "I just started yoga. I'm not very good at it, but it's fun."],
        },
        {
          they: 'How often do you go?',
          de: 'Einmal pro Woche, am Dienstagabend.',
          answers: ['Once a week, on Tuesday evenings.', 'Once a week, on Tuesday evening.'],
        },
      ],
      write: { de: 'Schreib über ein Hobby: was, wie oft und warum du es magst.', useWords: ['I love', 'once a week', 'because', "it's"], sample: "I love gardening. I do it almost every day, because it's relaxing." },
      talk: { they: 'Is there a hobby you would like to try?', de: 'Erzähl, welches Hobby du gern einmal ausprobieren würdest.', useWords: ["I'd like to try", 'because', 'maybe'], sample: "I'd like to try painting, because it looks relaxing. Maybe next year." },
      story: {
        title: 'Der Tanzkurs',
        de: 'Anna probiert etwas Neues aus. Hör gut zu.',
        lines: [
          'Anna is fifty, and she has never danced before.',
          'Her friend Petra asks her to come to a salsa class.',
          'Anna is nervous, but she says yes.',
          'In the first class, she steps on her partner\'s feet three times.',
          'Everybody laughs, and Anna laughs too.',
          'After a month, she is much better.',
          'Now she goes every Thursday and practises in her kitchen.',
          'She says it is the best hobby she has ever had.',
        ],
        questions: [
          { q: 'What kind of class does Anna go to?', qde: 'Was für einen Kurs besucht Anna?', options: ['A yoga class', 'A salsa class', 'A cooking class'], answer: 1 },
          { q: 'How often does she go now?', qde: 'Wie oft geht sie jetzt hin?', options: ['Every Thursday', 'Once a month', 'Every day'], answer: 0 },
        ],
      },
    },
  ],
};
