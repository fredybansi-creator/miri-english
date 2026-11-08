// Module 1 – Small talk & getting to know people.
// Lesson format:
//   phrases:   new chunks → become flashcards (de = front, en = back)
//   tip:       short explanation in German, with wrong/right examples
//   speak:     voice translations (answers = accepted versions, keywords = groups of alternatives
//              that make the sentence natural, levelUp = richer version)
//   exercises: order of the lesson; { type: 'speak', id } refers to an item in speak[]

export default {
  id: 'm1',
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'm1l1',
      title: "Hi! How's it going?",
      goal: 'Locker begrüßen und fragen, wie es geht',
      phrases: [
        { id: 'm1l1p1', en: "How's it going?", de: "Wie läuft's? / Wie geht's?", ex: "Hey Sam! How's it going?", note: 'Unter Freunden viel häufiger als „How are you?“.' },
        { id: 'm1l1p2', en: 'Not bad, you?', de: 'Nicht schlecht, und dir?', ex: "“How's it going?” – “Not bad, you?”", note: 'Kurz antworten und zurückfragen – ganz normal.' },
        { id: 'm1l1p3', en: 'Long time no see!', de: 'Lange nicht gesehen!', ex: 'Long time no see! How have you been?' },
        { id: 'm1l1p4', en: 'What have you been up to?', de: 'Was hast du so gemacht?', ex: 'So, what have you been up to lately?', note: '„be up to“ = etwas machen / vorhaben.' },
        { id: 'm1l1p5', en: "I've been really busy lately.", de: 'Ich hatte in letzter Zeit echt viel zu tun.', ex: "Sorry I didn't text back – I've been really busy lately.", note: 'lately = in letzter Zeit → mit „I have been …“.' },
        { id: 'm1l1p6', en: 'Same here.', de: 'Bei mir genauso. / Geht mir auch so.', ex: "“I'm so tired this week.” – “Same here.”" },
      ],
      tip: {
        title: '„How are you?“ ist keine echte Frage',
        body: '<p>Wenn jemand <b>„How are you?“</b> oder <b>„How’s it going?“</b> fragt, erwartet niemand einen Bericht. Antworte kurz und positiv – und frag zurück.</p><p>Ein deutsches „Geht so“ klingt auf Englisch schnell negativ. Sag lieber <b>„Not bad“</b>, <b>„Pretty good“</b> oder <b>„Good, thanks!“</b>.</p>',
        examples: [{ bad: 'I am fine, thank you. And you?', good: 'Pretty good, thanks! You?', why: '„I am fine, thank you“ klingt wie aus dem Schulbuch.' }],
      },
      speak: [
        { id: 'm1l1s1', de: 'Lange nicht gesehen! Was hast du so gemacht?', answers: ['Long time no see! What have you been up to?', 'Long time no see! What have you been doing?'], keywords: [['long time no see'], ['been up to', 'been doing']], levelUp: 'Long time no see! What have you been up to lately?', note: '„been up to“ ist die typische Frage unter Freunden.' },
        { id: 'm1l1s2', de: "Mir geht's gut, danke! Ich hatte in letzter Zeit echt viel zu tun.", answers: ["I'm good, thanks! I've been really busy lately.", "I'm fine, thanks! I've been really busy lately.", "Pretty good, thanks! I've been really busy lately.", "I'm doing well, thanks! I've been really busy lately.", "I'm good, thanks! I've had a lot to do lately."], keywords: [['been really busy', 'been busy', 'had a lot to do', 'been super busy', 'been so busy'], ['lately', 'recently']], levelUp: "Pretty good, thanks! I've been super busy lately, but it's been fun.", note: 'Merke: lately / recently → I have been … (present perfect).' },
        { id: 'm1l1s3', de: 'Bei mir genauso! Diese Woche war verrückt.', answers: ['Same here! This week has been crazy.', 'Same here! This week was crazy.', 'Me too! This week has been crazy.'], keywords: [['same here', 'me too', 'same'], ['this week'], ['crazy', 'mad', 'insane', 'hectic']], levelUp: 'Same here! This week has been absolutely crazy.', note: '„Same here“ = bei mir auch – kurz und natürlich.' },
        { id: 'm1l1s4', de: "Hey! Wie läuft's? Alles gut bei dir?", answers: ["Hey! How's it going? All good with you?", "Hey! How's it going? Is everything good with you?", "Hey! How's it going? Everything okay?", "Hey! How's it going? Everything good?", 'Hey! How are you? Everything okay?'], keywords: [["how's it going", 'how are you', 'how are things'], ['all good', 'everything good', 'everything okay', 'everything alright', 'everything all right', 'everything fine']], levelUp: "Hey! How's it going? All good with you?", note: '„All good?“ ist kurz und typisch für gesprochenes Englisch.' },
      ],
      exercises: [
        { type: 'choice', q: 'Dein Freund fragt: „How’s it going?“ Was ist die natürlichste Antwort?', options: ['Pretty good, you?', 'It goes well.', 'I am going good, thank you very much.'], answer: 0, explain: '„It goes well“ ist eine wörtliche Übersetzung von „Es geht gut“ – so sagt man das auf Englisch nicht.' },
        { type: 'gap', sentence: 'Long time no ___!', options: ['see', 'look', 'watch'], answer: 0, explain: 'Feste Wendung: „Long time no see!“' },
        { type: 'build', de: 'Was hast du so gemacht?', answer: 'What have you been up to?', distractors: ['did'] },
        { type: 'match', pairs: [["How's it going?", "Wie läuft's?"], ['Same here.', 'Bei mir genauso.'], ['lately', 'in letzter Zeit'], ['Long time no see!', 'Lange nicht gesehen!']] },
        { type: 'speak', id: 'm1l1s1' },
        { type: 'choice', q: 'Welcher Satz ist richtig?', options: ["I've been really busy lately.", 'I am really busy since a few weeks.', 'I was really busy lately.'], answer: 0, explain: 'Mit „lately“ oder „since“ nimmt man im Englischen das present perfect (I’ve been …) – nicht das Präsens wie im Deutschen.' },
        { type: 'speak', id: 'm1l1s2' },
      ],
    },

    // ------------------------------------------------------------------ 2
    {
      id: 'm1l2',
      title: 'A bit about me',
      goal: 'Über dich erzählen: Herkunft, Job, Hobbys',
      phrases: [
        { id: 'm1l2p1', en: 'I grew up in …', de: 'Ich bin in … aufgewachsen.', ex: 'I grew up in a small town near Munich.' },
        { id: 'm1l2p2', en: 'I work as a …', de: 'Ich arbeite als …', ex: 'I work as a nurse at a hospital.', note: 'Mit „a/an“! Nicht „I work as nurse“.' },
        { id: 'm1l2p3', en: "I'm really into …", de: 'Ich steh total auf … / Ich mag … sehr.', ex: "I'm really into yoga at the moment." },
        { id: 'm1l2p4', en: 'In my free time, I …', de: 'In meiner Freizeit …', ex: 'In my free time, I like going for long walks.' },
        { id: 'm1l2p5', en: "I've lived here for three years.", de: 'Ich wohne seit drei Jahren hier.', ex: "I've lived here for about three years now.", note: 'seit + Zeitraum → for' },
        { id: 'm1l2p6', en: "I've known her since 2019.", de: 'Ich kenne sie seit 2019.', ex: "We've been friends since 2019.", note: 'seit + Zeitpunkt → since' },
      ],
      tip: {
        title: 'since oder for – und nie Präsens!',
        body: '<p>Deutsch: „Ich wohne <b>seit</b> drei Jahren hier“ – im Präsens. Englisch braucht das <b>present perfect</b>: „I’ve lived here for three years.“</p><ul><li><b>for</b> + Zeitraum: for three years, for a long time, for ages</li><li><b>since</b> + Zeitpunkt: since 2019, since Monday, since I was a kid</li></ul>',
        examples: [{ bad: 'I live here since three years.', good: "I've lived here for three years.", why: 'Zeitraum → for · und „I’ve lived“ statt „I live“.' }],
      },
      speak: [
        { id: 'm1l2s1', de: 'Ich bin in einer kleinen Stadt aufgewachsen, aber ich wohne seit fünf Jahren hier.', answers: ["I grew up in a small town, but I've lived here for five years.", "I grew up in a small town, but I've been living here for five years.", 'I grew up in a small town but I have lived here for five years.'], keywords: [['grew up'], ['small town'], ['lived here for', 'been living here for'], ['five years']], levelUp: "I grew up in a small town, but I've been living here for five years now, so it feels like home.", note: 'seit + Zeitraum → for … mit „I’ve lived“.' },
        { id: 'm1l2s2', de: 'In meiner Freizeit gehe ich gern wandern und ich steh total auf Kochen.', answers: ["In my free time, I like going hiking and I'm really into cooking.", "In my free time I like to go hiking and I'm really into cooking.", "In my free time, I love hiking and I'm really into cooking.", "In my free time I like hiking, and I'm really into cooking."], keywords: [['in my free time', 'in my spare time'], ['hiking'], ['really into', 'really like', 'love']], levelUp: "In my free time, I love going hiking, and I'm really into cooking – especially Italian food.", note: '„I’m into …“ = ich mag … / steh auf … – sehr umgangssprachlich und natürlich.' },
        { id: 'm1l2s3', de: 'Meine Schwester arbeitet seit 2018 als Lehrerin.', answers: ['My sister has worked as a teacher since 2018.', 'My sister has been working as a teacher since 2018.'], keywords: [['has worked', 'has been working'], ['as a teacher'], ['since 2018', 'since twenty eighteen', 'since two thousand eighteen']], levelUp: 'My sister has been working as a teacher since 2018, and she still loves it.', note: '„seit 2018“ = Zeitpunkt → since. Verb: has worked / has been working.' },
        { id: 'm1l2s4', de: 'Woher kommst du eigentlich? – Ich komme aus der Nähe von Köln.', answers: ["Where are you from, actually? I'm from near Cologne.", "Where are you actually from? I'm from near Cologne.", "Where are you from originally? I'm from near Cologne.", "So where are you from? I'm from near Cologne.", 'Where do you come from? I come from near Cologne.'], keywords: [['where are you from', 'where are you actually from', 'where do you come from', 'where are you originally from'], ['near cologne', 'close to cologne', 'outside cologne', 'near koln']], levelUp: "So where are you from originally? – I'm from a small place near Cologne.", note: '„eigentlich“ in Fragen = originally / actually. Köln heißt auf Englisch Cologne!' },
      ],
      exercises: [
        { type: 'gap', sentence: "I've lived in Hamburg ___ 2020.", options: ['since', 'for', 'from'], answer: 0, explain: '2020 ist ein Zeitpunkt → since.' },
        { type: 'gap', sentence: "We've known each other ___ ten years.", options: ['for', 'since', 'by'], answer: 0, explain: 'Zehn Jahre sind ein Zeitraum → for.' },
        { type: 'choice', q: 'Welcher Satz klingt natürlich?', options: ['I work as a teacher.', 'I work as teacher.', 'I am working as a teacher since 2018.'], answer: 0, explain: 'Vor Berufen steht „a/an“. Und „since 2018“ braucht das present perfect: I’ve worked as a teacher since 2018.' },
        { type: 'build', de: 'Ich steh total auf Krimiserien.', answer: "I'm really into crime shows.", distractors: ['on'] },
        { type: 'speak', id: 'm1l2s1' },
        { type: 'match', pairs: [['grew up', 'aufgewachsen'], ['free time', 'Freizeit'], ['since 2019', 'seit 2019'], ['for two years', 'seit zwei Jahren']] },
        { type: 'speak', id: 'm1l2s2' },
      ],
    },

    // ------------------------------------------------------------------ 3
    {
      id: 'm1l3',
      title: 'Asking questions',
      goal: 'Fragen stellen, damit das Gespräch weiterläuft',
      phrases: [
        { id: 'm1l3p1', en: 'What do you do?', de: 'Was machst du beruflich?', ex: 'So, what do you do?', note: 'Heißt fast immer: Was arbeitest du?' },
        { id: 'm1l3p2', en: "What's it like?", de: 'Wie ist es so?', ex: "You moved to London? What's it like?" },
        { id: 'm1l3p3', en: 'How come?', de: 'Wieso denn? / Wie kommt’s?', ex: "“I'm not coming tonight.” – “How come?”" },
        { id: 'm1l3p4', en: 'Tell me more!', de: 'Erzähl mehr!', ex: 'A new job? Tell me more!' },
        { id: 'm1l3p5', en: 'That sounds fun!', de: 'Das klingt nach Spaß!', ex: 'A road trip? That sounds fun!', note: 'sound + Adjektiv: That sounds great / interesting / awful.' },
        { id: 'm1l3p6', en: 'How long have you been …?', de: 'Wie lange … schon?', ex: 'How long have you been learning the guitar?' },
      ],
      tip: {
        title: 'Fragen brauchen „do“',
        body: '<p>Im Deutschen dreht man einfach um: „Was <b>bedeutet</b> das?“ Im Englischen braucht man bei den meisten Verben ein Hilfsverb: <b>„What does that mean?“</b> – nicht „What means that?“.</p><p>Ausnahmen: Sätze mit <b>be</b> (Where is …?) und Modalverben (Can you …?).</p>',
        examples: [
          { bad: 'Where works your brother?', good: 'Where does your brother work?', why: 'Fragewort + do/does + Subjekt + Verb.' },
          { bad: 'What means this word?', good: 'What does this word mean?', why: '' },
        ],
      },
      speak: [
        { id: 'm1l3s1', de: 'Du bist nach Berlin gezogen? Wie ist es so?', answers: ["You moved to Berlin? What's it like?", "You've moved to Berlin? What's it like?", 'You moved to Berlin? How is it?', 'You moved to Berlin? What is it like there?'], keywords: [['moved to berlin'], ["what's it like", 'how is it']], levelUp: "Wait, you moved to Berlin? What's it like living there?", note: '„What’s it like?“ fragt nach dem Eindruck – sehr natürlich.' },
        { id: 'm1l3s2', de: 'Was machst du beruflich? Und wie lange machst du das schon?', answers: ['What do you do? And how long have you been doing that?', 'What do you do for work? And how long have you been doing it?', 'What do you do for a living? And how long have you been doing that?', "What's your job? And how long have you been doing that?"], keywords: [['what do you do', "what's your job"], ['how long have you been doing']], levelUp: 'So what do you do for work? And how long have you been doing that?', note: '„Wie lange schon …?“ → How long have you been …ing?' },
        { id: 'm1l3s3', de: 'Wieso denn? Ich dachte, du magst deinen Job.', answers: ['How come? I thought you liked your job.', 'Why? I thought you liked your job.', 'How come? I thought you like your job.'], keywords: [['how come', 'why'], ['i thought'], ['liked your job', 'like your job', 'loved your job']], levelUp: 'How come? I thought you really liked your job!', note: 'Nach „I thought“ rutscht das Verb meist in die Vergangenheit: I thought you liked …' },
        { id: 'm1l3s4', de: 'Entschuldige, was bedeutet dieses Wort?', answers: ['Sorry, what does this word mean?', 'Sorry, what does that word mean?', 'Excuse me, what does this word mean?'], keywords: [['sorry', 'excuse me'], ['what does'], ['mean']], levelUp: "Sorry, what does that word mean? I've never heard it before.", note: 'Nicht „What means …?“ – Fragen brauchen „does“.' },
      ],
      exercises: [
        { type: 'choice', q: 'Welche Frage ist richtig?', options: ['Where does your brother live?', 'Where lives your brother?', 'Where your brother lives?'], answer: 0, explain: 'Fragewort + does + Subjekt + Verb: Where does your brother live?' },
        { type: 'build', de: 'Seit wann lernst du Gitarre?', answer: 'How long have you been learning the guitar?', distractors: ['since'] },
        { type: 'gap', sentence: 'A trip to Japan? That ___ amazing!', options: ['sounds', 'hears', 'listens'], answer: 0, explain: '„Das klingt …“ = That sounds …' },
        { type: 'speak', id: 'm1l3s1' },
        { type: 'match', pairs: [['How come?', 'Wieso denn?'], ['What do you do?', 'Was machst du beruflich?'], ['Tell me more!', 'Erzähl mehr!'], ["What's it like?", 'Wie ist es so?']] },
        { type: 'speak', id: 'm1l3s2' },
      ],
    },

    // ------------------------------------------------------------------ 4
    {
      id: 'm1l4',
      title: 'No way! – Reacting',
      goal: 'Reagieren und Interesse zeigen',
      phrases: [
        { id: 'm1l4p1', en: 'No way!', de: 'Echt jetzt?! / Nicht dein Ernst!', ex: '“I got the job!” – “No way! Congrats!”' },
        { id: 'm1l4p2', en: 'That makes sense.', de: 'Das ergibt Sinn. / Leuchtet ein.', ex: 'Oh, you were sick? That makes sense.' },
        { id: 'm1l4p3', en: 'Fair enough.', de: 'Okay, verständlich. / Na gut.', ex: "“I'm too tired to go out.” – “Fair enough.”" },
        { id: 'm1l4p4', en: 'I know what you mean.', de: 'Ich weiß, was du meinst.', ex: 'I know what you mean – Mondays are the worst.' },
        { id: 'm1l4p5', en: "That's a shame.", de: 'Schade.', ex: "You can't come? That's a shame.", note: '„Schade“ = That’s a shame / That’s a pity / What a shame.' },
        { id: 'm1l4p6', en: 'Good for you!', de: 'Freut mich für dich!', ex: 'You ran a marathon? Good for you!' },
      ],
      tip: {
        title: 'Falsche Freunde',
        body: '<p>Diese Wörter sehen deutsch aus, bedeuten aber etwas anderes:</p><ul><li><b>actually</b> = eigentlich (aktuell = <i>currently</i>)</li><li><b>become</b> = werden (bekommen = <i>get</i>)</li><li><b>sensible</b> = vernünftig (sensibel = <i>sensitive</i>)</li><li><b>chef</b> = Koch (Chef = <i>boss</i>)</li><li><b>gift</b> = Geschenk</li><li>Handy = <i>phone</i> (nicht „handy“)</li></ul>',
        examples: [
          { bad: "I'll become a new phone.", good: "I'm getting a new phone.", why: 'become = werden! Klingt, als würdest du dich in ein Handy verwandeln.' },
          { bad: 'My chef is really nice.', good: 'My boss is really nice.', why: 'chef = Koch.' },
        ],
      },
      speak: [
        { id: 'm1l4s1', de: 'Echt jetzt?! Du hast den Job bekommen? Freut mich für dich!', answers: ['No way! You got the job? Good for you!', "No way! You got the job? I'm so happy for you!", 'Really? You got the job? Good for you!', 'No way! Did you get the job? Good for you!'], keywords: [['no way', 'really', 'seriously'], ['got the job', 'get the job'], ['good for you', 'happy for you']], levelUp: "No way! You actually got the job? I'm so happy for you!", note: 'bekommen = get (nicht become!).' },
        { id: 'm1l4s2', de: 'Ach so, du warst krank? Das ergibt Sinn.', answers: ['Oh, you were sick? That makes sense.', 'Oh, you were ill? That makes sense.', 'Ah, you were sick? That makes sense.', 'Oh I see, you were sick? That makes sense.'], keywords: [['you were sick', 'you were ill'], ['makes sense']], levelUp: 'Oh, you were sick? That makes sense – I was wondering where you were.', note: '„Ach so“ = Oh / Oh, I see.' },
        { id: 'm1l4s3', de: 'Schade, dass du heute Abend nicht kommen kannst.', answers: ["It's a shame you can't come tonight.", "That's a shame you can't come tonight.", "What a shame you can't come tonight.", "It's a pity you can't come tonight.", "Too bad you can't come tonight."], keywords: [['shame', 'pity', 'too bad'], ["can't come", "can't make it"], ['tonight']], levelUp: "It's such a shame you can't make it tonight – next time, okay?", note: '„make it“ = es schaffen (zu kommen). Sehr häufig!' },
        { id: 'm1l4s4', de: 'Eigentlich bin ich gerade ziemlich müde.', answers: ["Actually, I'm pretty tired right now.", "Actually, I'm quite tired at the moment.", "Actually I'm pretty tired at the moment.", "Actually, I'm really tired right now."], keywords: [['actually'], ['pretty tired', 'quite tired', 'really tired', 'kind of tired', 'rather tired'], ['right now', 'at the moment', 'currently']], levelUp: "Actually, I'm pretty exhausted right now – can we do it tomorrow?", note: 'eigentlich = actually · gerade = right now / at the moment.' },
      ],
      exercises: [
        { type: 'choice', q: 'Deine Freundin sagt: „I failed my driving test.“ Was passt?', options: ["Oh no, that's a shame!", 'Good for you!', 'No way, congrats!'], answer: 0, explain: 'Bei schlechten Nachrichten: That’s a shame / Oh no, I’m sorry.' },
        { type: 'gap', sentence: "I'm ___ a new phone next week.", options: ['getting', 'becoming', 'winning'], answer: 0, explain: 'bekommen = get. become heißt „werden“.' },
        { type: 'choice', q: '„Eigentlich wollte ich zu Hause bleiben.“', options: ['Actually, I wanted to stay at home.', 'Currently, I wanted to stay at home.', 'Actual I wanted to stay at home.'], answer: 0, explain: 'actually = eigentlich · aktuell = currently / at the moment.' },
        { type: 'match', pairs: [['No way!', 'Echt jetzt?!'], ['Fair enough.', 'Na gut, verständlich.'], ["That's a shame.", 'Schade.'], ['Good for you!', 'Freut mich für dich!']] },
        { type: 'speak', id: 'm1l4s1' },
        { type: 'build', de: 'Ich weiß, was du meinst.', answer: 'I know what you mean.', distractors: ['think'] },
        { type: 'speak', id: 'm1l4s2' },
      ],
    },

    // ------------------------------------------------------------------ 5
    {
      id: 'm1l5',
      title: 'Catch you later!',
      goal: 'Sich verabschieden und in Kontakt bleiben',
      phrases: [
        { id: 'm1l5p1', en: 'It was nice talking to you.', de: 'Schön, mit dir geredet zu haben.', ex: 'Anyway, it was really nice talking to you!' },
        { id: 'm1l5p2', en: "I'd better get going.", de: 'Ich sollte langsam los.', ex: "Oh, look at the time – I'd better get going.", note: "I'd better = I had better = ich sollte lieber." },
        { id: 'm1l5p3', en: "Let's keep in touch!", de: 'Lass uns in Kontakt bleiben!', ex: "Let's keep in touch – I'll text you." },
        { id: 'm1l5p4', en: 'Do you want to grab a coffee sometime?', de: 'Wollen wir mal einen Kaffee trinken gehen?', ex: 'We should catch up properly. Do you want to grab a coffee sometime?', note: 'grab = sich locker etwas holen (coffee, lunch, a drink).' },
        { id: 'm1l5p5', en: 'Let me know!', de: 'Sag mir Bescheid!', ex: "If you're free on Saturday, let me know!" },
        { id: 'm1l5p6', en: 'Catch you later!', de: 'Bis später! / Man sieht sich!', ex: 'Okay, catch you later!' },
      ],
      tip: {
        title: 'Höflich gehen – mit Weichmachern',
        body: '<p>Ein direktes „I go now“ klingt auf Englisch abrupt. Man polstert gern ab:</p><ul><li><b>Anyway, …</b> (leitet das Ende ein)</li><li><b>I’d better get going.</b></li><li><b>I should probably head off.</b></li></ul>',
        examples: [{ bad: 'I go now. Bye.', good: "Anyway, I'd better get going. It was great to see you!", why: 'Mit „Anyway“ und „I’d better“ klingt es freundlich.' }],
      },
      speak: [
        { id: 'm1l5s1', de: 'Ich sollte langsam los. Schön, mit dir geredet zu haben!', answers: ["I'd better get going. It was nice talking to you!", 'I should get going. It was nice talking to you!', "I'd better get going. It was nice to talk to you!", 'I should go. It was nice talking to you!', "I'd better go. It was great talking to you!"], keywords: [['better get going', 'should get going', 'better go', 'should go', 'should head off', 'better head off'], ['nice talking to you', 'nice to talk to you', 'great talking to you', 'nice chatting', 'good talking to you']], levelUp: "Anyway, I'd better get going – it was really nice talking to you!", note: '„langsam“ in „ich sollte langsam los“ = probably / I’d better.' },
        { id: 'm1l5s2', de: 'Wollen wir mal einen Kaffee trinken gehen? Sag mir Bescheid!', answers: ['Do you want to grab a coffee sometime? Let me know!', 'Do you want to get a coffee sometime? Let me know!', 'Shall we grab a coffee sometime? Let me know!', 'Should we get coffee sometime? Let me know!'], keywords: [['grab a coffee', 'get a coffee', 'get coffee', 'grab coffee', 'have a coffee'], ['sometime'], ['let me know']], levelUp: 'We should catch up properly – do you want to grab a coffee sometime this week? Let me know!', note: '„mal“ in Vorschlägen = sometime.' },
        { id: 'm1l5s3', de: 'Lass uns in Kontakt bleiben – ich schreib dir!', answers: ["Let's keep in touch – I'll text you!", "Let's stay in touch – I'll text you!", "Let's keep in touch, I'll message you!", "Let's stay in touch, I'll write to you!"], keywords: [['keep in touch', 'stay in touch'], ['text you', 'message you', 'write to you', 'write you']], levelUp: "Let's definitely keep in touch – I'll text you this weekend!", note: '„schreiben“ (am Handy) = text / message.' },
        { id: 'm1l5s4', de: 'Bis später! Und grüß deine Schwester von mir.', answers: ['See you later! And say hi to your sister for me.', 'Catch you later! And say hi to your sister for me.', 'See you later! And say hello to your sister from me.', 'See you later! Tell your sister I said hi.'], keywords: [['see you later', 'catch you later', 'see you'], ['say hi to', 'say hello to', 'said hi'], ['your sister']], levelUp: 'Catch you later! Oh, and say hi to your sister for me.', note: '„grüß … von mir“ = say hi to … for me.' },
      ],
      exercises: [
        { type: 'choice', q: 'Du willst dich freundlich verabschieden. Was passt am besten?', options: ["Anyway, I'd better get going!", 'I go now.', 'Now I must go away.'], answer: 0, explain: '„Anyway, I’d better get going“ klingt freundlich und natürlich.' },
        { type: 'gap', sentence: 'If you have time on Friday, let me ___!', options: ['know', 'knowing', 'to know'], answer: 0, explain: 'let + Person + Verb ohne „to“: let me know.' },
        { type: 'build', de: 'Lass uns in Kontakt bleiben!', answer: "Let's keep in touch!", distractors: ['contact'] },
        { type: 'match', pairs: [['Let me know!', 'Sag mir Bescheid!'], ["I'd better get going.", 'Ich sollte langsam los.'], ['grab a coffee', 'einen Kaffee trinken gehen'], ['Catch you later!', 'Bis später!']] },
        { type: 'speak', id: 'm1l5s1' },
        { type: 'choice', q: 'Wiederholung: Welcher Satz ist richtig?', options: ["I've known her since we were kids.", 'I know her since we were kids.', 'I knew her since we were kids.'], answer: 0, explain: 'Aus Lektion 2: since + present perfect (I’ve known).' },
        { type: 'speak', id: 'm1l5s2' },
      ],
    },
  ],
};
