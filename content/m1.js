// Module 1 – Small talk & getting to know people (level B1+ → B2).
// Lesson format:
//   phrases:   new chunks → become flashcards (de = front, en = back)
//   tip:       short explanation in German, with wrong/right examples
//   speak:     a mini conversation. they = what the friend says (English, read aloud),
//              de = Miri's reply in German that she says in English.
//              answers = accepted versions, keywords = groups of alternatives that make the
//              reply natural, levelUp = richer version.
//   exercises: order of the lesson; { type: 'speak', id } refers to an item in speak[]
//              types: choice, gap, fix (tap the wrong word), build, match, speak

export default {
  id: 'm1',
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'm1l1',
      title: "It's been ages!",
      goal: 'Jemanden wiedertreffen und erzählen, was los war',
      phrases: [
        { id: 'm1l1p1', en: "It's been ages!", de: 'Ewig nicht gesehen! / Ist ewig her!', ex: "Oh my god, Sarah! It's been ages! How are you?" },
        { id: 'm1l1p2', en: 'What have you been up to?', de: 'Was hast du so gemacht? / Was treibst du so?', ex: 'So, what have you been up to since uni?', note: '„be up to“ = etwas machen / vorhaben.' },
        { id: 'm1l1p3', en: 'Things have been pretty hectic lately.', de: 'In letzter Zeit war ziemlich viel los.', ex: "Sorry I didn't reply – things have been pretty hectic lately." },
        { id: 'm1l1p4', en: "I've been snowed under with work.", de: 'Ich bin mit Arbeit total zugeschüttet.', ex: "I'd love to come, but I've been completely snowed under with work.", note: 'snowed under = überhäuft, total überlastet (umgangssprachlich).' },
        { id: 'm1l1p5', en: "I can't complain.", de: 'Ich kann nicht klagen.', ex: "“How's life?” – “Busy, but I can't complain.”" },
        { id: 'm1l1p6', en: 'We should catch up properly.', de: 'Wir sollten uns mal richtig austauschen.', ex: "We should catch up properly – it's been way too long.", note: 'catch up = sich gegenseitig erzählen, was so los war.' },
      ],
      tip: {
        title: '„Was war los?“ – present perfect oder past simple?',
        body: '<p>Wenn du erzählst, was in letzter Zeit los war, ohne genauen Zeitpunkt, nimm das <b>present perfect</b>: <b>I’ve been</b> busy, <b>I’ve started</b> a new course.</p><p>Sobald ein <b>abgeschlossener Zeitpunkt</b> fällt (<i>last week, two months ago, in May, yesterday</i>), nimm das <b>past simple</b>: I <b>started</b> a new job two months ago.</p><p>Im Deutschen sagt man in beiden Fällen „ich habe … angefangen“ – deshalb ist das ein typischer Fehler.</p>',
        examples: [
          { bad: "I've started a new job two months ago.", good: 'I started a new job two months ago.', why: '„ago“ = abgeschlossener Zeitpunkt → past simple.' },
          { bad: 'I am so busy since March.', good: "I've been so busy since March.", why: 'Dauer bis jetzt (since/for) → present perfect.' },
        ],
      },
      speak: [
        { id: 'm1l1s1', they: "Oh my god, hi! It's been ages! How are you?", de: 'Ja, ewig nicht gesehen! Mir geht’s gut, aber in letzter Zeit war ziemlich viel los. Ich habe vor zwei Monaten einen neuen Job angefangen.', answers: ["Yes, it's been ages! I'm good, but things have been pretty hectic lately. I started a new job two months ago.", "I know, it's been ages! I'm doing well, but it's been pretty busy lately. I started a new job two months ago.", "Yeah, long time no see! I'm good, but things have been really hectic recently. I started a new job two months ago."], keywords: [["it's been ages", 'long time no see', "it's been forever", "it's been so long"], ['things have been', "it's been", "i've been", "there's been"], ['hectic', 'busy', 'crazy', 'a lot going on'], ['lately', 'recently'], ['started a new job'], ['two months ago']], levelUp: "I know, it's been ages! I'm good, thanks – things have been pretty hectic lately, though. I started a new job a couple of months ago.", note: '„vor zwei Monaten“ = two months ago → past simple: I started (nicht „I have started“).' },
        { id: 'm1l1s2', they: 'A new job? No way! What are you doing now?', de: 'Ich arbeite jetzt im Marketing für eine kleine Firma. Es ist echt anstrengend, aber ich habe schon so viel gelernt.', answers: ["I'm working in marketing for a small company now. It's really exhausting, but I've already learned so much.", "I work in marketing for a small company now. It's really tiring, but I've learned so much already.", "I'm in marketing now, at a small company. It's really demanding, but I've already learned a lot."], keywords: [['marketing'], ['small company', 'small firm'], ['exhausting', 'tiring', 'demanding', 'stressful', 'hard work', 'intense'], ["i've already learned", "i've learned", "i've already learnt", "i've learnt"], ['so much', 'a lot']], levelUp: "I'm doing marketing for a small start-up now. It's pretty full-on, but I've already learned so much.", note: '„schon so viel gelernt“ → I’ve already learned (das Ergebnis zählt jetzt). „full-on“ = intensiv, anstrengend.' },
        { id: 'm1l1s3', they: 'Sounds intense! So what else have you been up to?', de: 'Nicht viel, ehrlich gesagt. Ich war total mit Arbeit zugeschüttet. Aber letztes Wochenende war ich endlich mal wieder wandern.', answers: ["Not much, to be honest. I've been snowed under with work. But last weekend I finally went hiking again.", "Not a lot, honestly. I've been really busy with work. But last weekend I finally went hiking again.", 'Not much, to be honest. Work has been crazy. But I finally went hiking again last weekend.'], keywords: [['to be honest', 'honestly'], ['snowed under', 'really busy', 'so busy', 'crazy', 'swamped'], ['last weekend'], ['finally'], ['went hiking', 'went for a hike']], levelUp: "Not much, to be honest – I've been completely snowed under with work. But I finally managed to go hiking again last weekend.", note: '„last weekend“ = abgeschlossene Zeit → past simple: I went. „manage to“ = es schaffen, etwas zu tun.' },
        { id: 'm1l1s4', they: 'Aw, we should hang out soon!', de: 'Auf jeden Fall! Wir sollten uns mal richtig austauschen. Hast du nächste Woche irgendwann Zeit?', answers: ['Definitely! We should catch up properly. Are you free sometime next week?', 'Absolutely! We should catch up properly. Do you have time sometime next week?', 'For sure! We should properly catch up. Are you free at some point next week?'], keywords: [['definitely', 'absolutely', 'for sure', 'totally'], ['catch up'], ['properly'], ['are you free', 'do you have time'], ['next week']], levelUp: 'Definitely! We really need to catch up properly. Are you free at some point next week?', note: '„irgendwann“ = sometime / at some point.' },
      ],
      exercises: [
        { type: 'choice', q: 'Welcher Satz ist korrekt?', options: ['I started a new job two months ago.', "I've started a new job two months ago.", 'I have been starting a new job two months ago.', 'I start a new job since two months.'], answer: 0, explain: '„ago“ = abgeschlossener Zeitpunkt → past simple. Present perfect steht nie mit „ago“, „yesterday“ oder „last week“.' },
        { type: 'gap', sentence: "I ___ snowed under with work all week, so I haven't had time to call you.", options: ['have been', 'was being', 'am', 'had been being'], answer: 0, explain: 'Etwas dauert bis jetzt an → present perfect: I have been.' },
        { type: 'fix', sentence: 'I have moved to Hamburg last year.', wrong: [1], correct: 'I moved to Hamburg last year.', explain: '„last year“ ist ein abgeschlossener Zeitpunkt → past simple, also kein „have“.' },
        { type: 'speak', id: 'm1l1s1' },
        { type: 'choice', q: 'Ein Kollege fragt: „How’s work?“ Du hattest eine stressige Woche, willst aber nicht jammern. Was klingt am natürlichsten?', options: ['Pretty hectic, to be honest – but I can’t complain.', 'Quite stressful, but I don’t want to complain about.', 'It’s been a bit much stress lately.', 'Very busy, but I can’t complain myself.'], answer: 0, explain: '„much stress“ ist kein natürliches Englisch (a lot of stress), „complain about“ braucht ein Objekt, und „complain myself“ gibt es nicht.' },
        { type: 'match', pairs: [['catch up', 'sich austauschen'], ['snowed under', 'total überlastet'], ["It's been ages!", 'Ewig nicht gesehen!'], ["I can't complain.", 'Ich kann nicht klagen.']] },
        { type: 'build', de: 'Wir sollten uns bald mal richtig austauschen.', answer: 'We should catch up properly soon.', distractors: ['exchange', 'us'] },
        { type: 'speak', id: 'm1l1s2' },
      ],
    },

    // ------------------------------------------------------------------ 2
    {
      id: 'm1l2',
      title: 'Born and raised',
      goal: 'Über dein Leben erzählen: Herkunft, Umzüge, Hobbys, Pläne',
      phrases: [
        { id: 'm1l2p1', en: 'I was born and raised in …', de: 'Ich bin in … geboren und aufgewachsen.', ex: 'I was born and raised in a small village near Cologne.' },
        { id: 'm1l2p2', en: 'I ended up moving to …', de: 'Am Ende bin ich nach … gezogen.', ex: 'I ended up moving to Hamburg for work.', note: 'end up + -ing = schließlich (oft ungeplant) etwas tun.' },
        { id: 'm1l2p3', en: "I've been living here for about five years now.", de: 'Ich wohne jetzt seit ungefähr fünf Jahren hier.', ex: "I've been living here for about five years now, so it feels like home.", note: 'seit + Zeitraum → for + present perfect.' },
        { id: 'm1l2p4', en: "I'm really into … at the moment.", de: 'Im Moment steh ich total auf …', ex: "I'm really into yoga at the moment." },
        { id: 'm1l2p5', en: "It's not really my thing.", de: 'Das ist nicht so mein Ding.', ex: "I tried running, but it's not really my thing." },
        { id: 'm1l2p6', en: "I'm still figuring things out.", de: 'Ich finde gerade noch heraus, was ich will.', ex: "To be honest, I'm still figuring things out career-wise.", note: 'figure out = herausfinden.' },
      ],
      tip: {
        title: 'Früher und seit: used to & since/for',
        body: '<ul><li><b>used to</b> + Grundform = früher (heute nicht mehr): <i>I used to live in Berlin.</i></li><li><b>be/get used to</b> + -ing = an etwas gewöhnt sein / sich gewöhnen: <i>I’m used to getting up early.</i></li><li><b>seit</b> heißt im Englischen immer present perfect: <b>for</b> + Zeitraum (for five years), <b>since</b> + Zeitpunkt (since 2019).</li></ul>',
        examples: [
          { bad: 'I live here since five years.', good: "I've been living here for five years.", why: 'Zeitraum → for · und present perfect statt Präsens.' },
          { bad: 'Earlier I have lived in Berlin.', good: 'I used to live in Berlin.', why: '„früher“ = used to.' },
        ],
      },
      speak: [
        { id: 'm1l2s1', they: 'So where are you from originally?', de: 'Ich bin in einem kleinen Dorf in der Nähe von Köln geboren und aufgewachsen. Wegen der Arbeit bin ich dann nach Hamburg gezogen.', answers: ['I was born and raised in a small village near Cologne. Then I ended up moving to Hamburg for work.', 'I was born and grew up in a small village near Cologne. Then I moved to Hamburg because of work.', 'I was born and raised in a little village near Cologne, and then I moved to Hamburg for work.'], keywords: [['born and raised', 'born and grew up', 'grew up'], ['small village', 'little village', 'tiny village'], ['near cologne', 'close to cologne', 'outside cologne'], ['moved to hamburg', 'moving to hamburg'], ['for work', 'because of work', 'for my job', 'because of my job']], levelUp: 'I was born and raised in a tiny village near Cologne, but I ended up moving to Hamburg for work.', note: '„wegen der Arbeit“ = for work – kürzer und natürlicher als „because of the work“. Köln = Cologne!' },
        { id: 'm1l2s2', they: 'Oh nice! And how long have you been living there?', de: 'Seit ungefähr fünf Jahren. Am Anfang war es ziemlich schwer, aber inzwischen fühlt es sich wie Zuhause an.', answers: ['For about five years now. It was pretty hard at first, but now it feels like home.', 'About five years now. At the beginning it was quite hard, but by now it feels like home.', "I've been living there for about five years. It was pretty difficult at first, but these days it feels like home."], keywords: [['about five years', 'around five years'], ['at first', 'at the beginning', 'in the beginning'], ['hard', 'difficult', 'tough'], ['now', 'by now', 'these days'], ['feels like home']], levelUp: 'For about five years now. It was pretty tough at first, but these days it really feels like home.', note: '„am Anfang“ = at first. „inzwischen“ = now / by now / these days.' },
        { id: 'm1l2s3', they: 'What do you like doing when you’re not working?', de: 'Im Moment steh ich total auf Yoga. Joggen ist ehrlich gesagt nicht so mein Ding, aber Schwimmen macht mir echt Spaß.', answers: ["At the moment I'm really into yoga. Jogging isn't really my thing, to be honest, but I really enjoy swimming.", "I'm really into yoga at the moment. To be honest, jogging isn't really my thing, but swimming is really fun.", "Right now I'm really into yoga. Honestly, running isn't really my thing, but I love swimming."], keywords: [['at the moment', 'right now', 'currently'], ['really into'], ['yoga'], ['not really my thing'], ['enjoy swimming', 'swimming is really fun', 'love swimming', 'swimming is fun', 'like swimming']], levelUp: "I'm really into yoga at the moment. Running's not really my thing, to be honest, but I could swim for hours.", note: '„macht mir Spaß“ = I enjoy it / it’s fun – nie „it makes me fun“!' },
        { id: 'm1l2s4', they: 'Do you know what you want to do long-term?', de: 'Ehrlich gesagt finde ich das gerade noch heraus. Früher wollte ich Lehrerin werden, aber jetzt bin ich mir nicht mehr so sicher.', answers: ["To be honest, I'm still figuring that out. I used to want to be a teacher, but now I'm not so sure anymore.", "Honestly, I'm still working that out. I used to want to become a teacher, but now I'm not so sure.", "To be honest, I'm still figuring it out. I wanted to be a teacher before, but I'm not that sure anymore."], keywords: [['to be honest', 'honestly'], ['still figuring', 'still working'], ['used to want', 'wanted to be', 'wanted to become'], ['teacher'], ['not so sure', 'not that sure', 'not sure anymore']], levelUp: "Honestly, I'm still figuring that out. I used to want to be a teacher, but I'm not so sure anymore.", note: '„werden“ = become / be – nie „will“! „früher“ = used to.' },
      ],
      exercises: [
        { type: 'fix', sentence: 'I am living here since 2019.', wrong: [1, 2], correct: "I've been living here since 2019.", explain: '„seit“ → present perfect: I’ve been living (nicht „I am living“).' },
        { type: 'choice', q: '„Früher habe ich in Berlin gewohnt.“', options: ['I used to live in Berlin.', 'I used to living in Berlin.', 'I was used to live in Berlin.', 'Earlier I have lived in Berlin.'], answer: 0, explain: 'used to + Grundform = früher. „be used to + -ing“ heißt dagegen „an etwas gewöhnt sein“.' },
        { type: 'gap', sentence: 'After uni I ended up ___ to Hamburg, which I never planned.', options: ['moving', 'to move', 'move', 'moved'], answer: 0, explain: 'end up + -ing: I ended up moving.' },
        { type: 'speak', id: 'm1l2s1' },
        { type: 'choice', q: 'Welcher Satz bedeutet „Ich bin daran gewöhnt, früh aufzustehen“?', options: ["I'm used to getting up early.", 'I used to get up early.', "I'm used to get up early.", 'I use to getting up early.'], answer: 0, explain: 'be used to + -ing = gewöhnt sein. „I used to get up early“ hieße: Früher bin ich früh aufgestanden.' },
        { type: 'match', pairs: [['end up doing', 'schließlich etwas tun'], ['used to', 'früher (mal)'], ['figure out', 'herausfinden'], ['not my thing', 'nicht mein Ding']] },
        { type: 'build', de: 'Ehrlich gesagt ist Joggen nicht so mein Ding.', answer: "To be honest, jogging isn't really my thing.", distractors: ['so', 'not'] },
        { type: 'speak', id: 'm1l2s2' },
      ],
    },

    // ------------------------------------------------------------------ 3
    {
      id: 'm1l3',
      title: 'Good questions',
      goal: 'Interessiert nachfragen, damit das Gespräch weiterläuft',
      phrases: [
        { id: 'm1l3p1', en: 'What do you do for a living?', de: 'Was machst du beruflich?', ex: 'So, what do you do for a living?' },
        { id: 'm1l3p2', en: "What's it like living in …?", de: 'Wie ist es so, in … zu leben?', ex: "What's it like living in London?" },
        { id: 'm1l3p3', en: 'How did you get into …?', de: 'Wie bist du zu … gekommen?', ex: 'How did you get into photography?', note: 'get into sth = mit etwas anfangen, sich dafür begeistern.' },
        { id: 'm1l3p4', en: 'What made you decide to …?', de: 'Was hat dich dazu gebracht, … zu …?', ex: 'What made you decide to move abroad?' },
        { id: 'm1l3p5', en: 'Do you ever miss …?', de: 'Vermisst du manchmal …?', ex: 'Do you ever miss living by the sea?' },
        { id: 'm1l3p6', en: 'How come?', de: 'Wieso denn? / Wie kommt’s?', ex: "“I'm moving back to Germany.” – “Really? How come?”", note: 'Nach „How come“ keine Frage-Wortstellung: How come you left? (nicht „did you leave“).' },
      ],
      tip: {
        title: 'Indirekte Fragen & Fragen ohne „do“',
        body: '<p><b>Indirekte Fragen</b> (Do you know …? / I don’t know …) haben die normale Satzstellung: <b>Do you know where the station is?</b> – nicht „where is the station“.</p><p>Fragst du nach dem <b>Subjekt</b> (Was hat dich …? Wer hat …?), brauchst du <b>kein do/did</b>: <b>What made you decide …?</b> · <b>Who told you?</b></p>',
        examples: [
          { bad: 'Do you know where is the café?', good: 'Do you know where the café is?', why: 'Indirekte Frage → normale Wortstellung.' },
          { bad: 'What did make you move?', good: 'What made you move?', why: '„What“ ist hier das Subjekt → kein did.' },
        ],
      },
      speak: [
        { id: 'm1l3s1', they: 'I moved to London last year.', de: 'Echt? Wie ist es so, dort zu leben? Ich habe gehört, dass es wahnsinnig teuer ist.', answers: ["Really? What's it like living there? I've heard it's incredibly expensive.", "Really? What's it like to live there? I heard it's insanely expensive.", "Seriously? How is it living there? I've heard that it's really expensive."], keywords: [['really', 'seriously', 'oh wow'], ["what's it like", 'how is it'], ['living there', 'live there'], ["i've heard", 'i heard'], ['expensive']], levelUp: "Oh really? What's it like living there? I've heard it's ridiculously expensive.", note: '„Ich habe gehört“ = I’ve heard – sehr typisch.' },
        { id: 'm1l3s2', they: 'Yeah, it is! I work as a nurse there.', de: 'Wie bist du dazu gekommen? Und was hat dich dazu gebracht, ins Ausland zu gehen?', answers: ['How did you get into that? And what made you decide to move abroad?', 'How did you get into nursing? And what made you decide to go abroad?', 'How did you end up doing that? And what made you want to move abroad?'], keywords: [['how did you get into', 'how did you end up'], ['what made you'], ['decide', 'want'], ['abroad']], levelUp: 'Oh, how did you get into nursing? And what made you decide to move abroad?', note: '„Was hat dich dazu gebracht …?“ = What made you …? – ohne „did“.' },
        { id: 'm1l3s3', they: 'Honestly, I just needed a change.', de: 'Das verstehe ich total. Vermisst du manchmal deine Familie, oder gewöhnst du dich langsam daran?', answers: ['I totally get that. Do you ever miss your family, or are you slowly getting used to it?', 'I completely understand that. Do you sometimes miss your family, or are you getting used to it?', 'I totally understand. Do you ever miss your family, or are you slowly getting used to it?'], keywords: [['totally get', 'totally understand', 'completely understand', 'i get that'], ['do you ever miss', 'do you sometimes miss'], ['your family'], ['getting used to']], levelUp: 'I totally get that. Do you ever miss your family, or are you slowly getting used to being away?', note: '„sich gewöhnen an“ = get used to (+ -ing).' },
        { id: 'm1l3s4', they: 'Do you know a good place for lunch around here?', de: 'Ich weiß nicht genau, wo das Café ist, aber ich kann meine Freundin fragen. Sie wohnt hier um die Ecke.', answers: ["I don't know exactly where the café is, but I can ask my friend. She lives just around the corner.", "I'm not sure exactly where the café is, but I could ask my friend. She lives around the corner.", "I don't know exactly where the cafe is, but I can ask my friend. She lives right around the corner."], keywords: [["don't know exactly", 'not sure exactly', "don't know where", 'not sure where'], ['where the cafe is'], ['ask my friend'], ['around the corner']], levelUp: "I'm not sure exactly where the café is, but I can ask my friend – she lives just around the corner.", note: 'Indirekte Frage: „where the café IS“ – nicht „where is the café“.' },
      ],
      exercises: [
        { type: 'choice', q: 'Welche Frage ist korrekt?', options: ['Do you know where the station is?', 'Do you know where is the station?', 'Do you know where does the station is?', 'Know you where the station is?'], answer: 0, explain: 'Indirekte Frage → normale Wortstellung: where the station is.' },
        { type: 'fix', sentence: 'What did made you decide to move abroad?', wrong: [1], correct: 'What made you decide to move abroad?', explain: '„What“ ist das Subjekt (Was hat dich …?) → kein „did“.' },
        { type: 'gap', sentence: 'How did you get ___ photography in the first place?', options: ['into', 'in', 'to', 'on'], answer: 0, explain: 'get into sth = mit etwas anfangen. „in the first place“ = überhaupt / ursprünglich.' },
        { type: 'speak', id: 'm1l3s1' },
        { type: 'fix', sentence: 'How come did you leave your job?', wrong: [2], correct: 'How come you left your job?', explain: 'Nach „How come“ steht die normale Satzstellung, ohne „did“.' },
        { type: 'match', pairs: [['get into', 'anfangen mit'], ['get used to', 'sich gewöhnen an'], ['How come?', 'Wieso denn?'], ['for a living', 'beruflich']] },
        { type: 'build', de: 'Was hat dich dazu gebracht, nach London zu ziehen?', answer: 'What made you decide to move to London?', distractors: ['did', 'moving'] },
        { type: 'speak', id: 'm1l3s2' },
      ],
    },

    // ------------------------------------------------------------------ 4
    {
      id: 'm1l4',
      title: 'That must have been tough',
      goal: 'Mitfühlend reagieren – bei guten und schlechten Nachrichten',
      phrases: [
        { id: 'm1l4p1', en: "No way! That's amazing!", de: 'Nicht dein Ernst! Wie genial!', ex: "You got the flat? No way! That's amazing!" },
        { id: 'm1l4p2', en: 'That must have been really tough.', de: 'Das muss echt hart gewesen sein.', ex: 'You were in hospital for a week? That must have been really tough.', note: 'must have + 3. Form = Vermutung über die Vergangenheit.' },
        { id: 'm1l4p3', en: "I'm sure it'll work out.", de: 'Ich bin sicher, das wird schon klappen.', ex: "Don't worry too much – I'm sure it'll work out." },
        { id: 'm1l4p4', en: "It's bound to happen.", de: 'Das passiert bestimmt / garantiert.', ex: "You're so talented – the right job is bound to come along.", note: 'be bound to = mit Sicherheit (passieren).' },
        { id: 'm1l4p5', en: "That's such a shame.", de: 'Das ist so schade.', ex: "You can't come to the wedding? That's such a shame." },
        { id: 'm1l4p6', en: "I'm wiped out.", de: 'Ich bin total erledigt.', ex: "I'd love to, but I'm completely wiped out today." },
      ],
      tip: {
        title: 'Vermutungen: must have been & falsche Freunde',
        body: '<p><b>must have + 3. Form</b> = „muss … gewesen sein / muss … haben“: <i>That must have been scary.</i> · <i>She must have forgotten.</i></p><p>Und Vorsicht bei diesen Wörtern:</p><ul><li><b>actually</b> = eigentlich (aktuell = <i>currently</i>)</li><li><b>become</b> = werden (bekommen = <i>get</i>)</li><li><b>sensible</b> = vernünftig (sensibel = <i>sensitive</i>)</li></ul>',
        examples: [
          { bad: 'That must be very hard last year.', good: 'That must have been really hard last year.', why: 'Vergangenheit → must have been.' },
          { bad: "I'll become a new phone.", good: "I'm getting a new phone.", why: 'become = werden!' },
        ],
      },
      speak: [
        { id: 'm1l4s1', they: 'Guess what – I finally passed my driving test!', de: 'Nicht dein Ernst! Glückwunsch! Ich weiß, wie nervös du die ganze Woche warst.', answers: ['No way! Congratulations! I know how nervous you were all week.', "No way! Congrats! I know how nervous you've been all week.", 'Seriously? Congratulations! I know how nervous you were the whole week.'], keywords: [['no way', 'seriously', "you're kidding"], ['congratulations', 'congrats'], ['i know how nervous'], ['all week', 'the whole week']], levelUp: 'No way! Congrats! I know how nervous you were all week – you totally deserve it.', note: '„wie nervös du warst“ – indirekt: how nervous you WERE (nicht „how nervous were you“).' },
        { id: 'm1l4s2', they: 'My flat got flooded and I had to stay in a hotel for two weeks.', de: 'Oh nein, das muss echt hart gewesen sein. Hat deine Versicherung wenigstens etwas bezahlt?', answers: ['Oh no, that must have been really tough. Did your insurance at least pay for something?', 'Oh no, that must have been really hard. Did your insurance pay anything at least?', 'Oh no, that must have been awful. Did your insurance at least cover some of it?'], keywords: [['oh no'], ['must have been'], ['tough', 'hard', 'awful', 'horrible', 'terrible', 'stressful'], ['insurance'], ['at least']], levelUp: 'Oh no, that must have been a nightmare! Did your insurance at least cover some of it?', note: '„muss … gewesen sein“ = must have been. „übernehmen/bezahlen“ (Versicherung) = cover.' },
        { id: 'm1l4s3', they: "I didn't get the job. I'm so disappointed.", de: 'Das ist so schade, aber ich bin sicher, dass es klappen wird. Die richtige Stelle kommt bestimmt bald.', answers: ["That's such a shame, but I'm sure it'll work out. The right job will definitely come along soon.", "That's such a shame, but I'm sure it will work out. The right job is bound to come soon.", "What a shame, but I'm sure it'll work out. I'm sure the right job will come along soon."], keywords: [['such a shame', 'what a shame', 'really sorry'], ["i'm sure"], ['work out'], ['the right job', 'the right position'], ['soon']], levelUp: "Oh, that's such a shame. But I'm sure it'll work out – the right job is bound to come along soon.", note: '„klappen“ = work out. „kommt bestimmt“ = is bound to come.' },
        { id: 'm1l4s4', they: "I'm too tired to come tonight, sorry.", de: 'Kein Problem, verständlich. Eigentlich bin ich selbst ziemlich erledigt. Lass es uns aufs Wochenende verschieben.', answers: ["No problem, fair enough. Actually, I'm pretty wiped out myself. Let's move it to the weekend.", "No worries, fair enough. Actually I'm quite tired myself. Let's postpone it to the weekend.", "That's fine, I understand. Actually, I'm pretty tired myself. Let's push it to the weekend."], keywords: [['no problem', 'no worries', "that's fine", "that's okay"], ['fair enough', 'i understand', 'totally understandable'], ['actually'], ['myself'], ['move it', 'postpone it', 'push it', 'do it'], ['weekend']], levelUp: "No worries, fair enough! Actually, I'm pretty wiped out myself. Shall we push it to the weekend?", note: 'eigentlich = actually. verschieben = move / push / postpone.' },
      ],
      exercises: [
        { type: 'choice', q: 'Eine Freundin erzählt, dass ihr Hund gestorben ist. Was passt am besten?', options: ["Oh no, I'm so sorry. That must be really hard.", 'Oh no, what a pity!', 'Fair enough, that happens.', "That's a shame, but I'm sure it'll work out."], answer: 0, explain: '„What a pity“ klingt bei ernsten Dingen zu leicht – eher für Kleinigkeiten. Bei einem Verlust: I’m so sorry.' },
        { type: 'gap', sentence: 'You worked a 12-hour shift yesterday? You must ___ exhausted!', options: ['have been', 'be having', 'had been', 'been'], answer: 0, explain: 'Vermutung über gestern → must have been.' },
        { type: 'fix', sentence: 'I will become a new phone next week.', wrong: [2], correct: "I'm getting a new phone next week.", explain: 'become = werden. bekommen = get.' },
        { type: 'speak', id: 'm1l4s1' },
        { type: 'choice', q: '„Eigentlich wollte ich zu Hause bleiben, aber dann bin ich doch mitgegangen.“', options: ['Actually, I wanted to stay home, but then I ended up going.', 'Currently I wanted to stay home, but then I went with anyway.', 'Actually I wanted to stay home, but then I went with.', 'Actually, I wanted to stay home, but then I have gone along.'], answer: 0, explain: '„doch mitgegangen“ → ended up going. „went with“ ohne Objekt ist Denglisch.' },
        { type: 'match', pairs: [['must have been', 'muss … gewesen sein'], ['work out', 'klappen'], ['be bound to', 'bestimmt passieren'], ['wiped out', 'total erledigt']] },
        { type: 'build', de: 'Das muss echt hart gewesen sein.', answer: 'That must have been really tough.', distractors: ['be', 'was'] },
        { type: 'speak', id: 'm1l4s2' },
      ],
    },

    // ------------------------------------------------------------------ 5
    {
      id: 'm1l5',
      title: 'Making plans',
      goal: 'Sich verabreden und freundlich verabschieden',
      phrases: [
        { id: 'm1l5p1', en: "I'd better get going.", de: 'Ich sollte langsam los.', ex: "Oh, look at the time – I'd better get going.", note: "I'd better = ich sollte lieber." },
        { id: 'm1l5p2', en: 'It was really good to catch up.', de: 'Schön, dass wir uns mal ausgetauscht haben.', ex: 'It was really good to catch up – we should do this more often!' },
        { id: 'm1l5p3', en: 'Are you up for …?', de: 'Hast du Lust auf …?', ex: 'Are you up for a drink after work?', note: 'Auch: Do you fancy …? / Do you feel like …? – nie „Do you have lust“!' },
        { id: 'm1l5p4', en: "I'll let you know.", de: 'Ich sag dir Bescheid.', ex: "I'm not sure yet – I'll let you know tomorrow." },
        { id: 'm1l5p5', en: 'Give me a shout if …', de: 'Melde dich, wenn …', ex: 'Give me a shout if you need anything.' },
        { id: 'm1l5p6', en: "if you can't make it after all", de: 'falls du doch nicht kommen kannst', ex: "Text me if you can't make it after all.", note: 'make it = es schaffen (zu kommen) · after all = doch (nicht).' },
      ],
      tip: {
        title: 'Zukunft: will, going to oder -ing?',
        body: '<ul><li><b>Feste Verabredung</b> → present continuous: <i>I’m meeting Anna on Saturday.</i></li><li><b>Plan / Absicht</b> → going to: <i>I’m going to look for a new flat.</i></li><li><b>Spontane Entscheidung</b> im Moment → will: <i>I’ll check and let you know.</i></li></ul><p>Im Deutschen reicht oft das Präsens („Ich treffe Anna am Samstag“) – im Englischen nicht.</p>',
        examples: [
          { bad: 'I meet my sister on Saturday.', good: "I'm meeting my sister on Saturday.", why: 'Feste Verabredung → present continuous.' },
          { bad: 'Do you have lust to go for a drink?', good: 'Are you up for a drink?', why: '„lust“ heißt auf Englisch etwas ganz anderes 😅' },
        ],
      },
      speak: [
        { id: 'm1l5s1', they: 'Anyway, I should probably head home.', de: 'Ja, ich sollte auch langsam los. Es war echt schön, dass wir uns mal wieder ausgetauscht haben!', answers: ["Yeah, I'd better get going too. It was really good to catch up!", 'Yeah, I should get going as well. It was really nice to catch up again!', "Yes, I'd better head off too. It was so good to catch up!"], keywords: [['better get going', 'should get going', 'better head off', 'should head off', 'better go', 'should go'], ['too', 'as well'], ['good to catch up', 'nice to catch up', 'great to catch up']], levelUp: "Yeah, I'd better get going too. It was so good to catch up – we should do this more often!", note: '„langsam“ = probably / I’d better – nicht „slowly“.' },
        { id: 'm1l5s2', they: 'Are you doing anything on Saturday?', de: 'Ich treffe mich mittags mit meiner Schwester, aber abends habe ich noch nichts vor. Hast du Lust, was trinken zu gehen?', answers: ["I'm meeting my sister for lunch, but I don't have any plans in the evening yet. Are you up for going for a drink?", "I'm meeting my sister at lunchtime, but I haven't got anything planned for the evening. Do you fancy going for a drink?", "I'm meeting my sister for lunch, but I'm free in the evening. Do you want to go for a drink?"], keywords: [["i'm meeting"], ['my sister'], ['lunch', 'lunchtime'], ['evening'], ['no plans', 'any plans', 'anything planned', 'free', 'nothing planned'], ['up for', 'fancy', 'want to', 'feel like'], ['a drink']], levelUp: "I'm meeting my sister for lunch, but I'm free in the evening. Are you up for grabbing a drink?", note: 'Feste Verabredung → I’m meeting my sister.' },
        { id: 'm1l5s3', they: 'Sure, sounds good! Where should we go?', de: 'Ich weiß noch nicht genau. Ich schau mal, was es in der Nähe gibt, und sag dir dann Bescheid.', answers: ["I'm not sure yet. I'll have a look at what's nearby and let you know.", "I don't know exactly yet. I'll check what's around and then let you know.", "Not sure yet. I'll see what there is nearby and I'll let you know."], keywords: [['not sure yet', "don't know yet", "don't know exactly yet"], ["i'll have a look", "i'll check", "i'll see", "i'll look"], ['nearby', 'around', 'close by', 'in the area'], ['let you know']], levelUp: "Not sure yet – I'll have a look at what's around and let you know.", note: 'Spontane Entscheidung → will: I’ll check, I’ll let you know.' },
        { id: 'm1l5s4', they: 'Perfect. Text me if anything changes!', de: 'Mach ich! Und melde dich, falls du doch nicht kommen kannst. Bis Samstag!', answers: ["Will do! And give me a shout if you can't make it after all. See you on Saturday!", "I will! And let me know if you can't come after all. See you Saturday!", "Will do! And text me if you can't make it. See you on Saturday!"], keywords: [['will do', 'i will', 'sure'], ['give me a shout', 'let me know', 'text me', 'message me'], ["can't make it", "can't come"], ['after all'], ['see you'], ['saturday']], levelUp: "Will do! And give me a shout if you can't make it after all. See you Saturday!", note: '„doch nicht“ = after all. „Mach ich!“ = Will do!' },
      ],
      exercises: [
        { type: 'choice', q: 'Du bist schon fest mit Anna fürs Kino verabredet. Wie sagst du das?', options: ["I'm seeing Anna tonight – we're going to the cinema.", 'I will see Anna tonight – we will go to the cinema.', 'I see Anna tonight – we go to the cinema.', "I'm going to seeing Anna tonight."], answer: 0, explain: 'Feste Verabredung → present continuous: I’m seeing / we’re going.' },
        { type: 'fix', sentence: 'Do you have lust to go for a drink?', wrong: [3], correct: 'Do you fancy going for a drink?', explain: '„lust“ heißt auf Englisch sexuelles Verlangen 😅 Sag: Do you fancy …? / Are you up for …? / Do you feel like …?' },
        { type: 'gap', sentence: "I'm not sure yet, but I ___ you know by tonight.", options: ['will let', 'am letting', 'let', 'am going to letting'], answer: 0, explain: 'Spontanes Versprechen → will: I’ll let you know.' },
        { type: 'speak', id: 'm1l5s1' },
        { type: 'fix', sentence: "I meet my sister on Saturday, but I'm free in the evening.", wrong: [1], correct: "I'm meeting my sister on Saturday, but I'm free in the evening.", explain: 'Feste Verabredung → present continuous: I’m meeting.' },
        { type: 'match', pairs: [['be up for', 'Lust haben auf'], ['give me a shout', 'melde dich'], ['after all', 'doch (nicht)'], ['make it', 'es schaffen']] },
        { type: 'build', de: 'Hast du am Samstag Lust auf einen Drink?', answer: 'Are you up for a drink on Saturday?', distractors: ['lust', 'have'] },
        { type: 'speak', id: 'm1l5s2' },
      ],
    },
  ],
};
