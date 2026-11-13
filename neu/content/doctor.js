// Topic "Beim Arzt" (at the doctor) – 5 lessons, same format as travel.js (level A2–B1, short sentences, no idioms).
// After changing English sentences: run tools/make_audio.py and commit audio/.

export default {
  id: 'doctor',
  title: 'Beim Arzt',
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'd1',
      title: 'Einen Termin machen',
      en: 'Making an appointment',
      goal: 'Anrufen, einen Termin ausmachen und deinen Namen buchstabieren',
      repeat: [
        { en: "I'd like to make an appointment.", de: 'Ich möchte einen Termin vereinbaren.' },
        { en: 'Is there anything free tomorrow?', de: 'Ist morgen etwas frei?' },
        { en: 'The morning is better for me.', de: 'Der Vormittag passt mir besser.' },
        { en: 'Can you spell your name, please?', de: 'Können Sie Ihren Namen bitte buchstabieren?' },
      ],
      build: [
        { en: 'I need to see a doctor.', de: 'Ich muss zum Arzt.', extra: ['go'] },
        { en: 'Is ten o\'clock okay?', de: 'Ist zehn Uhr in Ordnung?', extra: ['at'] },
        { en: 'I have to cancel my appointment.', de: 'Ich muss meinen Termin absagen.', extra: ['date'] },
      ],
      say: [
        {
          they: 'Good morning, Dr Brown\'s office. How can I help you?',
          de: 'Guten Morgen. Ich möchte einen Termin vereinbaren.',
          answers: ["Good morning. I'd like to make an appointment.", 'Good morning. I would like to make an appointment.', 'Hello, I need an appointment, please.'],
          keywords: [['appointment']],
        },
        {
          they: 'Of course. Is tomorrow morning okay?',
          de: 'Ja, der Vormittag passt mir gut.',
          answers: ['Yes, the morning is good for me.', 'Yes, the morning is fine for me.', 'Yes, morning is good.'],
          keywords: [['yes'], ['morning'], ['good', 'fine', 'okay', 'ok', 'great', 'perfect']],
        },
        {
          they: 'Ten o\'clock, then. What\'s your name, please?',
          de: 'Mein Name ist Miri. M-I-R-I.',
          answers: ['My name is Miri. M-I-R-I.', "It's Miri. M, I, R, I.", 'Miri. M-I-R-I.'],
          keywords: [['miri']],
        },
      ],
      tip: {"de": "Am Telefon: „I'd like to make an appointment.“ Uhrzeiten: at ten (um zehn), on Monday (am Montag), in the morning (am Vormittag).", "en": "Can I come on Monday at ten?"},
      write: {"de": "Schreib eine kurze E-Mail an eine Praxis: Du brauchst einen Termin diese Woche.", "useWords": ["I'd like to make an appointment", "this week", "in the morning"], "sample": "Hello, I'd like to make an appointment this week, if possible in the morning. Thank you!"},
      talk: {"they": "When is a good time for you to see the doctor?", "de": "Sag, wann du Zeit hast und wann nicht.", "useWords": ["I can come", "on", "I work until"], "sample": "I can come on Tuesday or Thursday. I work until five."},
      story: {
        title: 'Der Anruf',
        de: 'Paul ruft beim Arzt an. Hör gut zu.',
        lines: [
          'Paul has had a bad cough for a week.',
          'On Monday morning, he calls his doctor.',
          'The woman on the phone is very friendly.',
          'There are no free appointments on Monday.',
          'But there is one on Tuesday at half past eight.',
          'Paul says that is fine.',
          'She asks him to bring his insurance card.',
          'Paul writes the time in his calendar.',
        ],
        questions: [
          { q: 'When is Paul\'s appointment?', qde: 'Wann hat Paul seinen Termin?', options: ['Monday at eight', 'Tuesday at half past eight', 'Tuesday at ten'], answer: 1 },
          { q: 'What must Paul bring?', qde: 'Was soll Paul mitbringen?', options: ['His insurance card', 'His passport', 'A letter'], answer: 0 },
        ],
      },
    },
    // ------------------------------------------------------------------ 2
    {
      id: 'd2',
      title: 'Sagen, was weh tut',
      en: 'Saying what hurts',
      goal: 'Schmerzen und Beschwerden beschreiben',
      repeat: [
        { en: 'I have a headache.', de: 'Ich habe Kopfschmerzen.' },
        { en: 'My back hurts.', de: 'Mein Rücken tut weh.' },
        { en: "I don't feel well.", de: 'Ich fühle mich nicht gut.' },
        { en: 'It started three days ago.', de: 'Es hat vor drei Tagen angefangen.' },
      ],
      build: [
        { en: 'I have a sore throat.', de: 'Ich habe Halsschmerzen.', extra: ['neck'] },
        { en: 'It hurts when I walk.', de: 'Es tut weh, wenn ich gehe.', extra: ['if'] },
        { en: 'I feel tired all the time.', de: 'Ich bin die ganze Zeit müde.', extra: ['whole'] },
      ],
      say: [
        {
          they: 'Hello. What seems to be the problem?',
          de: 'Ich fühle mich nicht gut. Ich habe Kopfschmerzen.',
          answers: ["I don't feel well. I have a headache.", 'I do not feel well. I have a headache.', "I'm not feeling well. I've got a headache."],
          keywords: [["don't feel", 'do not feel', 'not feeling'], ['headache']],
        },
        {
          they: 'I see. When did it start?',
          de: 'Vor drei Tagen.',
          answers: ['Three days ago.', 'It started three days ago.'],
          keywords: [['three days ago']],
        },
        {
          they: 'Do you have any other problems?',
          de: 'Ja, ich habe auch Halsschmerzen.',
          answers: ['Yes, I also have a sore throat.', 'Yes, I have a sore throat too.', "Yes, my throat hurts too."],
          keywords: [['yes'], ['throat']],
        },
      ],
      tip: {"de": "Schmerzen: „I have a headache / a sore throat.“ Für Körperteile: „My back hurts.“ – mit „my“, nicht „the“.", "en": "My back hurts."},
      write: {"de": "Schreib deiner Chefin, dass du krank bist und heute nicht kommst.", "useWords": ["I'm sorry", "I don't feel well", "I have"], "sample": "I'm sorry, I don't feel well today. I have a bad headache and a sore throat."},
      talk: {"they": "You don't look well. What's wrong?", "de": "Erzähl, was dir weh tut und seit wann.", "useWords": ["I have", "It started", "ago"], "sample": "I have a headache. It started two days ago."},
      story: {
        title: 'Ein schlechter Tag',
        de: 'Sophie geht zum Arzt. Hör gut zu.',
        lines: [
          'Sophie wakes up on Thursday and feels terrible.',
          'Her head hurts, and she is very hot.',
          'She calls her boss and says she can\'t come to work.',
          'In the afternoon, she goes to the doctor.',
          'The doctor looks in her ears and her throat.',
          'Then he takes her temperature. It is thirty-nine degrees.',
          'He says she has the flu.',
          'She must stay in bed for a few days and drink a lot of water.',
        ],
        questions: [
          { q: 'What does the doctor say?', qde: 'Was sagt der Arzt?', options: ['She has the flu.', 'She broke her arm.', 'She is fine.'], answer: 0 },
          { q: 'What must Sophie do?', qde: 'Was soll Sophie tun?', options: ['Go back to work', 'Stay in bed and drink water', 'Go to the hospital'], answer: 1 },
        ],
      },
    },
    // ------------------------------------------------------------------ 3
    {
      id: 'd3',
      title: 'Fragen des Arztes',
      en: 'The doctor\'s questions',
      goal: 'Fragen zu Allergien, Medikamenten und Fieber beantworten',
      repeat: [
        { en: 'Do you have any allergies?', de: 'Haben Sie Allergien?' },
        { en: "I'm allergic to penicillin.", de: 'Ich bin allergisch gegen Penicillin.' },
        { en: "I don't take any medicine.", de: 'Ich nehme keine Medikamente.' },
        { en: 'I had a fever last night.', de: 'Ich hatte gestern Abend Fieber.' },
      ],
      build: [
        { en: 'Are you taking any medicine?', de: 'Nehmen Sie Medikamente?', extra: ['medicines'] },
        { en: 'I sleep very badly at the moment.', de: 'Ich schlafe im Moment sehr schlecht.', extra: ['bad'] },
        { en: 'I eat less than usual.', de: 'Ich esse weniger als sonst.', extra: ['then'] },
      ],
      say: [
        {
          they: 'Do you have any allergies?',
          de: 'Ja, ich bin allergisch gegen Penicillin.',
          answers: ["Yes, I'm allergic to penicillin.", 'Yes, I am allergic to penicillin.'],
          keywords: [['yes'], ['allergic'], ['penicillin']],
        },
        {
          they: 'Are you taking any medicine at the moment?',
          de: 'Nein, ich nehme keine Medikamente.',
          answers: ["No, I don't take any medicine.", "No, I'm not taking any medicine.", 'No, I do not take any medicine.'],
          keywords: [['no'], ['medicine', 'medication', 'tablets', 'pills']],
        },
        {
          they: 'Have you had a fever?',
          de: 'Ja, gestern Abend hatte ich Fieber.',
          answers: ['Yes, I had a fever last night.', 'Yes, last night I had a fever.', 'Yes, yesterday evening I had a fever.'],
          keywords: [['yes'], ['fever', 'temperature'], ['last night', 'yesterday']],
        },
      ],
      tip: {"de": "„Seit“ bei Zeiträumen ist „for“, nicht „since“: I've had a cough for three days. („since“ nur mit Zeitpunkt: since Monday.)", "en": "I've had a cough for three days."},
      write: {"de": "Schreib auf, welche Allergien oder Medikamente ein Arzt von dir wissen sollte (oder dass du keine hast).", "useWords": ["I'm allergic to", "I don't take", "I take"], "sample": "I'm not allergic to anything. I don't take any medicine."},
      talk: {"they": "How do you sleep at the moment?", "de": "Erzähl, wie du gerade schläfst.", "useWords": ["I sleep well", "badly", "I wake up"], "sample": "Not very well. I often wake up at night."},
      story: {
        title: 'Viele Fragen',
        de: 'Ben ist beim Arzt. Hör gut zu.',
        lines: [
          'Ben has a stomach ache, so he goes to the doctor.',
          'The doctor asks him many questions.',
          'What did you eat yesterday? Do you have a fever?',
          'Ben says he ate fish at a new restaurant.',
          'He has no fever, but he feels sick.',
          'He is allergic to nuts, but there were no nuts in the food.',
          'The doctor thinks the fish was bad.',
          'Ben must eat only rice and bananas for two days.',
        ],
        questions: [
          { q: 'What did Ben eat at the restaurant?', qde: 'Was hat Ben im Restaurant gegessen?', options: ['Chicken', 'Fish', 'Nuts'], answer: 1 },
          { q: 'What is Ben allergic to?', qde: 'Wogegen ist Ben allergisch?', options: ['Nuts', 'Fish', 'Bananas'], answer: 0 },
        ],
      },
    },
    // ------------------------------------------------------------------ 4
    {
      id: 'd4',
      title: 'In der Apotheke',
      en: 'At the pharmacy',
      goal: 'Ein Rezept einlösen und fragen, wie man ein Medikament nimmt',
      repeat: [
        { en: 'I have a prescription.', de: 'Ich habe ein Rezept.' },
        { en: 'How often do I take it?', de: 'Wie oft nehme ich das?' },
        { en: 'Take one tablet twice a day.', de: 'Nehmen Sie zweimal am Tag eine Tablette.' },
        { en: 'Do you have something for a cold?', de: 'Haben Sie etwas gegen Erkältung?' },
      ],
      build: [
        { en: 'Should I take it with food?', de: 'Soll ich es mit dem Essen nehmen?', extra: ['shall'] },
        { en: 'Can I drive after taking this?', de: 'Darf ich Auto fahren, nachdem ich das genommen habe?', extra: ['drove'] },
        { en: 'How much does it cost?', de: 'Wie viel kostet das?', extra: ['many'] },
      ],
      say: [
        {
          they: 'Hello! Can I help you?',
          de: 'Hallo, ich habe ein Rezept von meinem Arzt.',
          answers: ['Hello, I have a prescription from my doctor.', 'Hi, I have a prescription from my doctor.'],
          keywords: [['prescription'], ['doctor']],
        },
        {
          they: 'Here you are. Do you have any questions?',
          de: 'Ja, wie oft nehme ich das?',
          answers: ['Yes, how often do I take it?', 'Yes, how often should I take it?', 'Yes, how often do I take this?'],
          keywords: [['yes'], ['how often']],
        },
        {
          they: 'One tablet twice a day, after meals.',
          de: 'Okay. Haben Sie auch etwas gegen Halsschmerzen?',
          answers: ['Okay. Do you also have something for a sore throat?', 'Okay. Do you have something for a sore throat too?', 'Okay. Have you got anything for a sore throat?'],
          keywords: [['something', 'anything'], ['sore throat', 'throat']],
        },
      ],
      tip: {"de": "„Should“ = sollte: Should I take it with food? Antworten: „Yes, you should.“ / „No, you don't need to.“", "en": "Should I take it with food?"},
      write: {"de": "Schreib, was du machst, wenn du erkältet bist.", "useWords": ["When I have a cold", "I drink", "I stay"], "sample": "When I have a cold, I drink a lot of tea and stay in bed."},
      talk: {"they": "What do you do when you have a cold?", "de": "Erzähl, was dir bei einer Erkältung hilft.", "useWords": ["tea with honey", "I rest", "I go to bed early"], "sample": "I drink tea with honey and go to bed early."},
      story: {
        title: 'In der Apotheke',
        de: 'Anna holt ein Medikament. Hör gut zu.',
        lines: [
          'Anna goes to the pharmacy with her prescription.',
          'The pharmacist is a young man with glasses.',
          'He gives her a small white box of tablets.',
          'She must take one tablet in the morning and one in the evening.',
          'She should not drink alcohol with this medicine.',
          'Anna also buys some tea with honey for her cold.',
          'Everything together costs twelve euros.',
          'She pays by card and goes home to rest.',
        ],
        questions: [
          { q: 'How often must Anna take a tablet?', qde: 'Wie oft muss Anna eine Tablette nehmen?', options: ['Once a day', 'Twice a day', 'Three times a day'], answer: 1 },
          { q: 'How much does everything cost?', qde: 'Wie viel kostet alles zusammen?', options: ['Twelve euros', 'Twenty euros', 'Two euros'], answer: 0 },
        ],
      },
    },
    // ------------------------------------------------------------------ 5
    {
      id: 'd5',
      title: 'Im Notfall',
      en: 'In an emergency',
      goal: 'Im Urlaub schnell Hilfe holen',
      repeat: [
        { en: 'I need help, please!', de: 'Ich brauche bitte Hilfe!' },
        { en: 'Please call an ambulance.', de: 'Bitte rufen Sie einen Krankenwagen.' },
        { en: 'Where is the nearest hospital?', de: 'Wo ist das nächste Krankenhaus?' },
        { en: 'My friend fell and hurt her leg.', de: 'Meine Freundin ist gestürzt und hat sich am Bein verletzt.' },
      ],
      build: [
        { en: 'She can\'t stand up.', de: 'Sie kann nicht aufstehen.', extra: ['stay'] },
        { en: 'I think it is broken.', de: 'Ich glaube, es ist gebrochen.', extra: ['thinks'] },
        { en: 'Is there a doctor who speaks German?', de: 'Gibt es einen Arzt, der Deutsch spricht?', extra: ['which'] },
      ],
      say: [
        {
          they: 'Hello, are you okay? What happened?',
          de: 'Meine Freundin ist gestürzt. Sie kann nicht aufstehen.',
          answers: ["My friend fell. She can't stand up.", 'My friend fell down. She cannot stand up.', 'My friend had a fall. She can\'t get up.'],
          keywords: [['friend'], ['fell', 'fall'], ["can't", 'cannot', 'can not'], ['stand', 'get up']],
        },
        {
          they: 'Oh no. Should I call an ambulance?',
          de: 'Ja, bitte rufen Sie einen Krankenwagen!',
          answers: ['Yes, please call an ambulance!', 'Yes, please, call an ambulance!'],
          keywords: [['yes'], ['call'], ['ambulance']],
        },
        {
          they: 'They are coming. Can I do anything else?',
          de: 'Wo ist das nächste Krankenhaus?',
          answers: ['Where is the nearest hospital?', 'Where is the next hospital?', 'Which hospital is the nearest?'],
          keywords: [['where', 'which'], ['hospital']],
        },
      ],
      tip: {"de": "Im Notfall kurz und klar: „Please call an ambulance!“ – „Please“ steht am Anfang, das ist dringend und trotzdem höflich.", "en": "Please call an ambulance!"},
      write: {"de": "Schreib einer Freundin, was im Urlaub passiert ist: Jemand hat sich verletzt.", "useWords": ["fell", "hurt", "hospital", "now"], "sample": "My friend fell and hurt her leg. We went to the hospital, but now she is fine."},
      talk: {"they": "Have you ever been to a hospital on holiday?", "de": "Erzähl, ob du schon einmal im Urlaub einen Arzt gebraucht hast.", "useWords": ["No, never", "Once", "I needed"], "sample": "No, never. But once a friend needed a doctor in Spain."},
      story: {
        title: 'Ein Unfall im Urlaub',
        de: 'Lena und Maria sind in Spanien. Hör gut zu.',
        lines: [
          'Lena and her friend Maria are on holiday in Spain.',
          'One day, they go for a walk in the mountains.',
          'Maria falls on the rocks and hurts her ankle.',
          'She can\'t walk, so Lena calls for help.',
          'A friendly man drives them to the hospital.',
          'The doctor speaks a little German, so it is easy.',
          'Maria\'s ankle is not broken, but she must rest.',
          'They spend the rest of the week by the pool.',
        ],
        questions: [
          { q: 'Where does Maria hurt herself?', qde: 'Wo verletzt sich Maria?', options: ['At the beach', 'In the mountains', 'At the hotel'], answer: 1 },
          { q: 'Is Maria\'s ankle broken?', qde: 'Ist Marias Knöchel gebrochen?', options: ['Yes, it is broken.', 'No, it is not broken.', 'The doctor does not know.'], answer: 1 },
        ],
      },
    },
  ],
};
