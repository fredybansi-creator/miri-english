// Module 2 – Telling stories (level B1+ → B2). Format: see m1.js.

export default {
  id: 'm2',
  lessons: [
    // ------------------------------------------------------------------ 1
    {
      id: 'm2l1',
      title: "You'll never guess what happened",
      goal: 'Eine Geschichte spannend anfangen',
      phrases: [
        { id: 'm2l1p1', en: "You'll never guess what happened!", de: 'Du errätst nie, was passiert ist!', ex: "You'll never guess what happened at work today!" },
        { id: 'm2l1p2', en: 'So basically, …', de: 'Also, im Grunde …', ex: 'So basically, I was on my way to work when …', note: 'Typischer Einstieg ins Erzählen im gesprochenen Englisch.' },
        { id: 'm2l1p3', en: 'I was …ing when …', de: 'Ich war gerade dabei, …, als …', ex: 'I was walking home when it started pouring.', note: 'past continuous (Hintergrund) + past simple (plötzliches Ereignis).' },
        { id: 'm2l1p4', en: 'I ran into …', de: 'Ich habe zufällig … getroffen.', ex: 'I ran into my ex at the supermarket – so awkward!', note: 'Auch: bump into sb.' },
        { id: 'm2l1p5', en: 'The thing is, …', de: 'Die Sache ist die: …', ex: "The thing is, I'd never actually met him before." },
        { id: 'm2l1p6', en: 'Long story short, …', de: 'Lange Rede, kurzer Sinn: …', ex: 'Long story short, we missed the train.' },
      ],
      tip: {
        title: 'Hintergrund & Ereignis: past continuous + past simple',
        body: '<p>Beim Erzählen gibt es oft zwei Ebenen:</p><ul><li><b>Was gerade lief</b> (Hintergrund) → past continuous: <i>I was cooking …</i></li><li><b>Was plötzlich passierte</b> → past simple: <i>… when the phone rang.</i></li></ul><p>Im Deutschen sagt man beides im Präteritum/Perfekt – deshalb vergisst man das „-ing“ leicht.</p>',
        examples: [
          { bad: 'While I cooked dinner, the phone was ringing.', good: 'While I was cooking dinner, the phone rang.', why: 'Hintergrund → was cooking · Ereignis → rang.' },
        ],
      },
      speak: [
        { id: 'm2l1s1', they: "You look like you've got a story to tell!", de: 'Du errätst nie, was passiert ist! Ich war gestern im Supermarkt einkaufen, als ich zufällig meinen alten Lehrer getroffen habe.', answers: ["You'll never guess what happened! I was shopping at the supermarket yesterday when I ran into my old teacher.", "You'll never guess what happened! Yesterday I was doing my shopping at the supermarket when I bumped into my old teacher.", "You won't believe what happened! I was at the supermarket yesterday when I bumped into my old teacher."], keywords: [['never guess', "won't believe"], ['i was shopping', 'i was doing my shopping', 'i was at the supermarket', 'i was in the supermarket'], ['yesterday'], ['ran into', 'bumped into', 'met'], ['old teacher']], levelUp: "You'll never guess what happened! I was doing my shopping yesterday when I bumped into my old maths teacher.", note: '„zufällig treffen“ = run into / bump into. Hintergrund (I was shopping) + Ereignis (I ran into).' },
        { id: 'm2l1s2', they: 'No way! Did he recognise you?', de: 'Ja, sofort! Die Sache ist die: Ich war in der Schule ziemlich frech, also war es ein bisschen peinlich.', answers: ['Yes, straight away! The thing is, I was pretty cheeky at school, so it was a bit awkward.', 'Yes, immediately! The thing is, I was quite naughty at school, so it was a bit embarrassing.', 'Yeah, right away! The thing is, I was pretty cheeky in school, so it was kind of embarrassing.'], keywords: [['straight away', 'immediately', 'right away'], ['the thing is'], ['cheeky', 'naughty', 'a troublemaker', 'rude'], ['at school', 'in school'], ['awkward', 'embarrassing']], levelUp: 'Yeah, straight away! The thing is, I was a bit of a troublemaker at school, so it was pretty awkward.', note: '„frech“ (Kind) = cheeky / naughty. „peinlich“ = awkward / embarrassing.' },
        { id: 'm2l1s3', they: 'Haha, what did you talk about?', de: 'Lange Rede, kurzer Sinn: Er hat mir erzählt, dass er nächstes Jahr in Rente geht, und wir haben eine halbe Stunde gequatscht.', answers: ["Long story short, he told me he's retiring next year, and we chatted for half an hour.", "Long story short, he told me that he's going to retire next year, and we talked for half an hour.", 'Long story short, he said he was retiring next year and we ended up chatting for half an hour.'], keywords: [['long story short'], ['told me', 'said'], ['retiring', 'retire'], ['next year'], ['chatted', 'talked', 'chatting', 'talking'], ['half an hour']], levelUp: "Long story short, he told me he's retiring next year, and we ended up chatting for half an hour in the frozen food aisle!", note: '„in Rente gehen“ = retire. „quatschen“ = chat.' },
        { id: 'm2l1s4', they: "That's actually really sweet.", de: 'Ja, total! Egal, wo war ich? Ach ja – danach habe ich gemerkt, dass ich mein Portemonnaie vergessen hatte.', answers: ["Yeah, totally! Anyway, where was I? Oh yes – after that I realised I had forgotten my wallet.", "Yes, totally! Anyway, where was I? Oh right – afterwards I realised I'd forgotten my wallet.", 'Yeah, it was! Anyway, where was I? Oh yeah, after that I noticed that I had forgotten my purse.'], keywords: [['anyway'], ['where was i'], ['after that', 'afterwards', 'then'], ['realised', 'realized', 'noticed'], ['had forgotten', "i'd forgotten", 'forgot'], ['wallet', 'purse']], levelUp: "It really was! Anyway, where was I? Oh yeah – then I got to the checkout and realised I'd left my wallet at home.", note: '„merken“ = realise. Was davor passiert war → past perfect: I’d forgotten.' },
      ],
      exercises: [
        { type: 'choice', q: 'Welcher Satz ist richtig?', options: ['I was walking home when it started to rain.', 'I walked home when it was starting to rain.', 'I am walking home when it started to rain.', 'I was walking home when it was starting suddenly to rain.'], answer: 0, explain: 'Hintergrund (was walking) + plötzliches Ereignis (started).' },
        { type: 'listen', en: 'So basically, I was halfway through my presentation when the fire alarm went off, and everyone had to leave the building.', q: 'Was ist passiert?', options: ['Mitten in der Präsentation ging der Feueralarm los.', 'Sie hat die Präsentation vergessen.', 'Das Gebäude hat gebrannt.', 'Nach der Präsentation kam ein Alarm.'], answer: 0, explain: 'halfway through = mittendrin. go off = losgehen (Alarm, Wecker).' },
        { type: 'fix', sentence: 'I was having a shower when somebody was knocking at the door.', wrong: [7, 8], correct: 'I was having a shower when somebody knocked at the door.', explain: 'Das plötzliche Ereignis steht im past simple: knocked.' },
        { type: 'speak', id: 'm2l1s1' },
        { type: 'match', pairs: [['run into', 'zufällig treffen'], ['cheeky', 'frech'], ['retire', 'in Rente gehen'], ['awkward', 'peinlich, unangenehm']] },
        { type: 'listenbuild', en: "The thing is, I'd never met him before.", distractors: ['have', 'was'] },
        { type: 'gap', sentence: 'We ___ dinner when the lights suddenly went out.', options: ['were having', 'had', 'have had', 'are having'], answer: 0, explain: 'Hintergrund → past continuous: were having.' },
        { type: 'speak', id: 'm2l1s2' },
        { type: 'shadow', en: "You'll never guess what happened! So basically, I was on my way to work …", de: 'Du errätst nie, was passiert ist! Also, ich war auf dem Weg zur Arbeit …' },
        { type: 'free' },
      ],
      free: { id: 'm2l1f', they: 'Tell me about something funny or strange that happened to you recently.', hint: 'Erzähl eine kurze Geschichte (3–4 Sätze). Fang mit „You’ll never guess …“ oder „So basically …“ an.', useWords: ['So basically …', 'I was …ing when …', 'The thing is …', 'Long story short …'], sample: 'So basically, I was waiting for the bus when a dog ran up and stole my sandwich. The thing is, the owner just laughed! Long story short, I bought another sandwich and missed my bus.' },
    },

    // ------------------------------------------------------------------ 2
    {
      id: 'm2l2',
      title: 'And then …',
      goal: 'Eine Geschichte flüssig erzählen: Reihenfolge & Vorvergangenheit',
      phrases: [
        { id: 'm2l2p1', en: 'At first, …', de: 'Zuerst / Am Anfang …', ex: 'At first, I thought it was a joke.' },
        { id: 'm2l2p2', en: 'After a while, …', de: 'Nach einer Weile …', ex: 'After a while, we gave up and went home.' },
        { id: 'm2l2p3', en: 'All of a sudden, …', de: 'Ganz plötzlich …', ex: 'All of a sudden, the lights went out.' },
        { id: 'm2l2p4', en: 'Eventually, …', de: 'Schließlich / Irgendwann (endlich) …', ex: 'Eventually, the bus turned up – two hours late.', note: 'eventually ≠ eventuell! eventuell = maybe / might.' },
        { id: 'm2l2p5', en: 'In the end, …', de: 'Am Ende / Letztendlich …', ex: 'In the end, we had a great time.', note: 'in the end = Ergebnis · at the end of = am Ende von (at the end of the film).' },
        { id: 'm2l2p6', en: 'By the time we got there, it had already …', de: 'Als wir ankamen, hatte es schon …', ex: 'By the time we got there, the film had already started.' },
      ],
      tip: {
        title: 'Was davor war: past perfect – und „eventually“',
        body: '<p>Wenn in einer Geschichte etwas <b>noch früher</b> passiert war, nimm das <b>past perfect</b> (had + 3. Form): <i>By the time we got to the airport, our flight <b>had</b> already <b>left</b>.</i></p><p>Und Vorsicht: <b>eventually</b> heißt „schließlich, nach langer Zeit“. Das deutsche „eventuell“ ist <b>maybe / might / possibly</b>.</p>',
        examples: [
          { bad: 'When we arrived, the film already started.', good: 'When we arrived, the film had already started.', why: 'Der Film begann vor der Ankunft → had started.' },
          { bad: 'Eventually I come later.', good: 'I might come later.', why: 'eventuell = might / maybe.' },
        ],
      },
      speak: [
        { id: 'm2l2s1', they: 'How was your trip to Lisbon?', de: 'Am Anfang war es eine Katastrophe. Als wir am Flughafen ankamen, war unser Flug schon weg.', answers: ['At first it was a disaster. By the time we got to the airport, our flight had already left.', 'At first, it was a total disaster. When we arrived at the airport, our plane had already left.', 'In the beginning it was a disaster. By the time we got to the airport, the plane had already gone.'], keywords: [['at first', 'in the beginning', 'at the beginning'], ['disaster', 'nightmare'], ['by the time', 'when'], ['got to the airport', 'arrived at the airport'], ['had already left', 'had already gone']], levelUp: 'Honestly, at first it was a total disaster. By the time we got to the airport, our flight had already left!', note: 'Was vorher abgeschlossen war → had already left.' },
        { id: 'm2l2s2', they: 'Oh no! What did you do?', de: 'Nach einer Weile haben wir einen anderen Flug gefunden, aber der ging erst am nächsten Morgen. Also haben wir am Flughafen geschlafen.', answers: ["After a while we found another flight, but it didn't leave until the next morning. So we slept at the airport.", 'After a while, we found a different flight, but it only left the next morning. So we slept at the airport.', "After a while we found another flight, but it wasn't until the next morning, so we ended up sleeping at the airport."], keywords: [['after a while'], ['another flight', 'a different flight', 'a new flight'], ['not until', "didn't leave until", 'only left', "wasn't until"], ['next morning', 'following morning'], ['slept at the airport', 'sleeping at the airport']], levelUp: "After a while we managed to find another flight, but it didn't leave until the next morning, so we ended up sleeping at the airport.", note: '„erst am nächsten Morgen“ = not until the next morning.' },
        { id: 'm2l2s3', they: 'That sounds awful. Was it worth it in the end?', de: 'Ja, total! Am Ende hatten wir eine tolle Woche, und das ganze Chaos war schnell vergessen.', answers: ['Yes, totally! In the end we had a great week, and all the chaos was quickly forgotten.', 'Yeah, definitely! In the end, we had an amazing week and we soon forgot all the chaos.', 'Yes, absolutely! In the end we had a great week, and the whole chaos was forgotten pretty quickly.'], keywords: [['totally', 'definitely', 'absolutely'], ['in the end'], ['great week', 'amazing week', 'fantastic week', 'wonderful week', 'brilliant week'], ['chaos', 'stress', 'drama'], ['forgotten', 'forgot']], levelUp: 'Oh, totally! In the end we had an amazing week, and we forgot about all the chaos pretty quickly.', note: '„am Ende“ (Ergebnis) = in the end.' },
        { id: 'm2l2s4', they: 'Would you go back?', de: 'Irgendwann schon, aber nächstes Mal fahre ich lieber mit dem Zug. Eventuell nehme ich meine Schwester mit.', answers: ["Eventually, yes, but next time I'd rather take the train. Maybe I'll take my sister with me.", "Eventually yes, but next time I'll take the train instead. I might bring my sister along.", "Yes, at some point, but next time I'd prefer to go by train. Maybe I'll bring my sister."], keywords: [['eventually', 'at some point', 'one day'], ['next time'], ['rather', 'prefer', 'instead'], ['train'], ['maybe', 'might', 'perhaps'], ['sister']], levelUp: "At some point, yeah – but next time I'm definitely taking the train. I might bring my sister along, too.", note: 'eventuell = maybe / might – NICHT eventually!' },
      ],
      exercises: [
        { type: 'gap', sentence: 'By the time we got to the cinema, the film ___ already started.', options: ['had', 'has', 'was', 'have'], answer: 0, explain: 'Vorher passiert → past perfect: had started.' },
        { type: 'choice', q: '„Eventuell komme ich später.“', options: ['I might come later.', "I'll eventually come later.", 'Eventually I come later.', 'I come eventually later.'], answer: 0, explain: 'eventuell = maybe / might. eventually = schließlich (nach langer Zeit).' },
        { type: 'listen', en: 'We waited for ages, and eventually the bus turned up – two hours late.', q: 'Was ist passiert?', options: ['Der Bus kam schließlich, aber zwei Stunden zu spät.', 'Der Bus kam vielleicht.', 'Sie sind nach zwei Stunden gelaufen.', 'Der Bus ist ausgefallen.'], answer: 0, explain: 'eventually = schließlich. turn up = auftauchen.' },
        { type: 'speak', id: 'm2l2s1' },
        { type: 'fix', sentence: 'At the end, we had a really great holiday.', wrong: [0, 1, 2], correct: 'In the end, we had a really great holiday.', explain: 'Ergebnis → in the end. „at the end“ nur mit „of“: at the end of the trip.' },
        { type: 'match', pairs: [['eventually', 'schließlich'], ['in the end', 'am Ende (Ergebnis)'], ['all of a sudden', 'ganz plötzlich'], ['turn up', 'auftauchen']] },
        { type: 'listenbuild', en: 'After a while, we decided to walk home.', distractors: ['were', 'deciding'] },
        { type: 'speak', id: 'm2l2s2' },
        { type: 'shadow', en: 'By the time we got to the airport, our flight had already left.', de: 'Als wir am Flughafen ankamen, war unser Flug schon weg.' },
        { type: 'free' },
      ],
      free: { id: 'm2l2f', they: "What's the worst journey you've ever had?", hint: 'Erzähl von einer schlimmen Reise (3–4 Sätze) – mit At first, After a while und In the end.', useWords: ['At first …', 'After a while …', 'had already …', 'In the end …'], sample: "At first everything was fine, but then our train broke down in the middle of nowhere. After a while they sent a bus, but by the time we got to Munich, our connection had already left. In the end we arrived six hours late – but at least we had a good story!" },
    },

    // ------------------------------------------------------------------ 3
    {
      id: 'm2l3',
      title: 'I was so embarrassed',
      goal: 'Gefühle in Geschichten: peinlich, lustig, enttäuschend',
      phrases: [
        { id: 'm2l3p1', en: 'I was so embarrassed.', de: 'Es war mir so peinlich.', ex: 'I called my boss "Mum" – I was so embarrassed.', note: 'embarrassed = Gefühl · embarrassing = die Situation ist peinlich.' },
        { id: 'm2l3p2', en: 'It was a total nightmare.', de: 'Es war ein totaler Albtraum.', ex: 'The flight was a total nightmare.' },
        { id: 'm2l3p3', en: "I couldn't believe my eyes.", de: 'Ich traute meinen Augen nicht.', ex: "When I opened the door, I couldn't believe my eyes." },
        { id: 'm2l3p4', en: "I couldn't stop laughing.", de: 'Ich konnte nicht mehr aufhören zu lachen.', ex: "He fell into the pool in his suit – I couldn't stop laughing." },
        { id: 'm2l3p5', en: 'I was really disappointed.', de: 'Ich war total enttäuscht.', ex: 'I was really disappointed when they cancelled the concert.' },
        { id: 'm2l3p6', en: 'I just wanted to disappear.', de: 'Ich wäre am liebsten im Boden versunken.', ex: 'Everyone turned around – I just wanted to disappear.' },
      ],
      tip: {
        title: 'bored oder boring? -ed vs. -ing',
        body: '<ul><li><b>-ed</b> = wie <b>ich mich fühle</b>: I’m bored, I was embarrassed, I’m interested.</li><li><b>-ing</b> = wie <b>etwas ist</b> (was das Gefühl auslöst): The film is boring. That was embarrassing.</li></ul><p>„I’m boring“ heißt also „Ich bin langweilig“ 😅 – ein sehr typischer Fehler.</p>',
        examples: [
          { bad: "I'm so boring today.", good: "I'm so bored today.", why: 'Gefühl → -ed.' },
          { bad: 'It was so embarrassed.', good: 'It was so embarrassing.', why: 'Die Situation → -ing.' },
        ],
      },
      speak: [
        { id: 'm2l3s1', they: "What's the most embarrassing thing that's ever happened to you?", de: 'Oh Gott, letzte Woche habe ich in einem Meeting aus Versehen meinen Chef Mama genannt. Es war mir so peinlich!', answers: ['Oh god, last week I accidentally called my boss Mum in a meeting. I was so embarrassed!', 'Oh my god, last week in a meeting I accidentally called my boss Mum. I was so embarrassed!', 'Oh god, last week I called my boss Mum by accident in a meeting. It was so embarrassing!'], keywords: [['last week'], ['accidentally', 'by accident', 'by mistake'], ['called my boss'], ['mum', 'mom', 'mummy', 'mommy'], ['meeting'], ['so embarrassed', 'so embarrassing']], levelUp: 'Oh god – last week I accidentally called my boss Mum in the middle of a meeting. I just wanted to disappear!', note: '„aus Versehen“ = accidentally / by accident. Gefühl → embarrassed.' },
        { id: 'm2l3s2', they: 'Haha, no way! How did everyone react?', de: 'Alle haben gelacht, sogar mein Chef. Ich musste auch total lachen, aber gleichzeitig wäre ich am liebsten im Boden versunken.', answers: ["Everyone laughed, even my boss. I couldn't stop laughing either, but at the same time I just wanted to disappear.", 'Everybody laughed, even my boss. I laughed a lot too, but at the same time I just wanted to disappear.', 'Everyone laughed, even my boss. I had to laugh too, but at the same time I wanted to disappear.'], keywords: [['everyone laughed', 'everybody laughed'], ['even my boss'], ["couldn't stop laughing", 'laughed a lot', 'had to laugh', 'laughed so hard'], ['at the same time'], ['disappear', 'hide', 'swallow me up']], levelUp: "Everyone burst out laughing – even my boss! I couldn't stop laughing either, but honestly, I just wanted to disappear.", note: '„im Boden versinken“ sagt man einfach: I wanted to disappear.' },
        { id: 'm2l3s3', they: "Oh, I'd be mortified. Was your boss annoyed?", de: 'Zum Glück nicht. Er fand es total lustig und hat den ganzen Tag Witze darüber gemacht.', answers: ['Luckily not. He thought it was really funny and made jokes about it all day.', 'Luckily, no. He found it really funny and kept making jokes about it all day.', 'Luckily not! He thought it was hilarious and joked about it for the rest of the day.'], keywords: [['luckily', 'fortunately'], ['thought it was', 'found it'], ['funny', 'hilarious'], ['jokes', 'joked', 'joking'], ['all day', 'the whole day', 'rest of the day']], levelUp: 'Luckily not – he thought it was hilarious and kept joking about it for the rest of the day.', note: '„fand es lustig“ = thought it was funny. keep doing = immer wieder tun.' },
        { id: 'm2l3s4', they: "Ha! At least it wasn't boring.", de: 'Stimmt! Aber ehrlich gesagt bin ich immer noch ein bisschen genervt, weil mich jetzt alle im Büro so nennen.', answers: ["True! But to be honest I'm still a bit annoyed because now everyone in the office calls me that.", "That's true! But honestly, I'm still a little annoyed, because now everybody at the office calls me that.", "True! But to be honest, I'm still a bit irritated because everyone in the office calls me that now."], keywords: [['true'], ['to be honest', 'honestly'], ['still'], ['annoyed', 'irritated'], ['everyone', 'everybody'], ['office'], ['calls me that', 'call me that']], levelUp: "True! But to be honest, I'm still a bit annoyed – now the whole office calls me that.", note: 'Gefühl → annoyed (annoying hieße: ich bin nervig).' },
      ],
      exercises: [
        { type: 'choice', q: '„Der Film war langweilig, ich habe mich gelangweilt.“', options: ['The film was boring – I was bored.', 'The film was bored – I was boring.', 'The film was boring – I was boring.', 'The film bored – I was boring.'], answer: 0, explain: 'Der Film → boring (löst es aus). Ich → bored (Gefühl).' },
        { type: 'fix', sentence: "I'm so boring today, let's do something fun!", wrong: [2], correct: "I'm so bored today, let's do something fun!", explain: '„I’m boring“ = Ich bin langweilig 😅 Gefühl → bored.' },
        { type: 'gap', sentence: 'That was the most ___ moment of my life!', options: ['embarrassing', 'embarrassed', 'embarrass', 'embarrassment'], answer: 0, explain: 'Der Moment ist peinlich → -ing.' },
        { type: 'speak', id: 'm2l3s1' },
        { type: 'listen', en: 'I was really disappointed when they cancelled the concert, but luckily we got our money back.', q: 'Wie ging es der Person?', options: ['Sehr enttäuscht, aber das Geld kam zurück.', 'Froh, dass das Konzert ausfiel.', 'Wütend, weil kein Geld zurückkam.', 'Egal, sie wollte eh nicht hin.'], answer: 0, explain: 'disappointed = enttäuscht. luckily = zum Glück.' },
        { type: 'match', pairs: [['disappointed', 'enttäuscht'], ['embarrassed', 'peinlich berührt'], ['mortified', 'zutiefst beschämt'], ['hilarious', 'urkomisch']] },
        { type: 'listenbuild', en: 'Luckily, he thought it was hilarious.', distractors: ['found', 'funny'] },
        { type: 'speak', id: 'm2l3s2' },
        { type: 'shadow', en: 'I was so embarrassed – I just wanted to disappear!', de: 'Es war mir so peinlich – ich wäre am liebsten im Boden versunken!' },
        { type: 'free' },
      ],
      free: { id: 'm2l3f', they: 'Tell me about a time something went wrong – but turned out funny.', hint: 'Erzähl, was passiert ist und wie du dich gefühlt hast (3–4 Sätze). Achte auf -ed/-ing.', useWords: ['I was so embarrassed', 'Luckily …', "I couldn't stop laughing", 'It was a total nightmare'], sample: 'Last summer I went to a wedding and spilled red wine all over the bride’s dad. I was so embarrassed! Luckily, he thought it was hilarious, and by the end of the night we were dancing together.' },
    },

    // ------------------------------------------------------------------ 4
    {
      id: 'm2l4',
      title: 'Everything went wrong',
      goal: 'Erzählen, was schiefging',
      phrases: [
        { id: 'm2l4p1', en: 'My phone died.', de: 'Mein Handy war leer.', ex: 'I wanted to call you, but my phone died.' },
        { id: 'm2l4p2', en: 'I got completely lost.', de: 'Ich habe mich total verlaufen / verfahren.', ex: 'I got completely lost on the way to the hotel.' },
        { id: 'm2l4p3', en: 'I missed the last train.', de: 'Ich habe den letzten Zug verpasst.', ex: 'We stayed too long and missed the last train.' },
        { id: 'm2l4p4', en: 'It turned out that …', de: 'Es stellte sich heraus, dass …', ex: 'It turned out that the restaurant was closed.' },
        { id: 'm2l4p5', en: 'To make matters worse, …', de: 'Zu allem Überfluss …', ex: 'To make matters worse, it started to rain.' },
        { id: 'm2l4p6', en: 'I got soaked.', de: 'Ich bin klitschnass geworden.', ex: "I forgot my umbrella and got completely soaked." },
      ],
      tip: {
        title: '„werden“ heißt oft get – nicht will!',
        body: '<p>Für Veränderungen sagt man im Englischen oft <b>get + Adjektiv</b>:</p><ul><li>nass werden = <b>get wet / get soaked</b></li><li>sich verlaufen = <b>get lost</b></li><li>sauer werden = <b>get angry</b> · heiraten = <b>get married</b></li></ul><p>„will“ ist dagegen Zukunft: I will = ich werde (etwas tun).</p>',
        examples: [
          { bad: 'It was raining and I became completely wet.', good: 'It was raining and I got completely soaked.', why: 'become klingt hier steif → get.' },
          { bad: 'We have lost us.', good: 'We got lost.', why: 'sich verlaufen = get lost.' },
        ],
      },
      speak: [
        { id: 'm2l4s1', they: 'How was the party on Saturday?', de: 'Die Party war super, aber danach habe ich den letzten Zug verpasst. Und zu allem Überfluss war mein Handy leer.', answers: ['The party was great, but afterwards I missed the last train. And to make matters worse, my phone died.', 'The party was amazing, but after that I missed the last train. To make matters worse, my phone was dead.', 'The party was great, but then I missed the last train, and to make matters worse my phone had died.'], keywords: [['great', 'amazing', 'awesome', 'brilliant', 'fun'], ['afterwards', 'after that', 'then', 'after the party'], ['missed the last train'], ['to make matters worse'], ['phone died', 'phone was dead', 'phone had died', 'ran out of battery', 'battery died']], levelUp: 'The party was amazing, but then I missed the last train home – and to make matters worse, my phone died.', note: '„Handy ist leer“ = my phone died / my battery ran out.' },
        { id: 'm2l4s2', they: 'Oh no! So how did you get home?', de: 'Ich bin zu Fuß gegangen, aber ich habe mich total verlaufen. Dann hat es angefangen zu regnen und ich bin klitschnass geworden.', answers: ['I walked, but I got completely lost. Then it started raining and I got soaked.', 'I walked home, but I got totally lost. Then it started to rain and I got soaked.', 'I went on foot, but I got completely lost. Then it started pouring and I got absolutely soaked.'], keywords: [['walked', 'on foot'], ['got completely lost', 'got totally lost', 'got lost'], ['started raining', 'started to rain', 'started pouring'], ['got soaked', 'got drenched', 'got wet', 'soaking wet']], levelUp: 'I ended up walking, but I got completely lost – and then it started pouring, so I got absolutely soaked.', note: '„sich verlaufen“ = get lost. „nass werden“ = get wet / get soaked.' },
        { id: 'm2l4s3', they: 'That sounds like a nightmare!', de: 'Ja! Und es stellte sich heraus, dass ich die ganze Zeit in die falsche Richtung gelaufen war.', answers: ["Yeah! And it turned out that I'd been walking in the wrong direction the whole time.", 'Yes! And it turned out I had been walking the wrong way the whole time.', 'Totally! And it turned out that I was walking in the wrong direction the whole time.'], keywords: [['it turned out'], ['walking'], ['wrong direction', 'wrong way'], ['the whole time', 'all the time', 'all along']], levelUp: "Honestly! And it turned out I'd been walking in the wrong direction the whole time.", note: '„es stellte sich heraus“ = it turned out (that).' },
        { id: 'm2l4s4', they: 'Poor you! What time did you get home in the end?', de: 'Ich bin erst um vier Uhr morgens angekommen. Am Ende habe ich mir ein Taxi genommen, weil ich so erschöpft war.', answers: ["I didn't get home until four in the morning. In the end I took a taxi because I was so exhausted.", 'I only got home at 4 a.m. In the end, I got a taxi because I was so exhausted.', "I didn't get home until 4 in the morning. In the end I took a cab because I was completely exhausted."], keywords: [["didn't get home until", 'only got home', 'got home at'], ['four', '4'], ['in the end'], ['took a taxi', 'got a taxi', 'took a cab', 'got a cab'], ['exhausted', 'so tired', 'knackered', 'worn out']], levelUp: "I didn't get home until four in the morning! In the end I gave up and got a taxi – I was completely exhausted.", note: '„erst um 4“ = not until 4.' },
      ],
      exercises: [
        { type: 'choice', q: '„Wir haben uns verfahren.“', options: ['We got lost.', 'We have lost us.', 'We drove us wrong.', 'We became lost ourselves.'], answer: 0, explain: 'sich verlaufen / verfahren = get lost.' },
        { type: 'gap', sentence: 'It started raining and I ___ completely soaked.', options: ['got', 'became', 'was getting to', 'have'], answer: 0, explain: 'nass werden = get soaked.' },
        { type: 'listen', en: 'I was supposed to meet them at eight, but my train got cancelled, and to make matters worse, my phone died.', q: 'Was ging alles schief?', options: ['Zug ausgefallen und Handy leer.', 'Nur der Zug war zu spät.', 'Sie hat den Termin vergessen.', 'Ihr Handy wurde gestohlen.'], answer: 0, explain: 'be supposed to = eigentlich sollen. get cancelled = ausfallen.' },
        { type: 'speak', id: 'm2l4s1' },
        { type: 'fix', sentence: 'In the end it turned out, that he had the wrong address.', wrong: [5], correct: 'In the end it turned out that he had the wrong address.', explain: 'Vor „that“ steht im Englischen kein Komma – anders als im Deutschen.' },
        { type: 'match', pairs: [['turn out', 'sich herausstellen'], ['get soaked', 'klitschnass werden'], ['exhausted', 'total erschöpft'], ['be supposed to', 'eigentlich sollen']] },
        { type: 'listenbuild', en: 'To make matters worse, my phone died.', distractors: ['was', 'empty'] },
        { type: 'speak', id: 'm2l4s2' },
        { type: 'shadow', en: "It turned out that I'd been walking in the wrong direction the whole time.", de: 'Es stellte sich heraus, dass ich die ganze Zeit in die falsche Richtung gelaufen war.' },
        { type: 'free' },
      ],
      free: { id: 'm2l4f', they: 'Have you ever had a day where everything went wrong?', hint: 'Erzähl von so einem Tag (3–4 Sätze) – mit „To make matters worse“ und „It turned out“.', useWords: ['To make matters worse …', 'It turned out …', 'I got lost / soaked', 'I ended up …'], sample: 'Last month I had a job interview and my alarm didn’t go off. To make matters worse, I got stuck in traffic. It turned out the interviewer was late too, so in the end it was fine – and I got the job!' },
    },

    // ------------------------------------------------------------------ 5
    {
      id: 'm2l5',
      title: 'Back in the day',
      goal: 'Von früher und der Kindheit erzählen',
      phrases: [
        { id: 'm2l5p1', en: 'When I was a kid, …', de: 'Als ich ein Kind war, …', ex: 'When I was a kid, I wanted to be a vet.' },
        { id: 'm2l5p2', en: 'We used to …', de: 'Früher haben wir (immer) …', ex: 'We used to spend every summer at my grandma’s.' },
        { id: 'm2l5p3', en: "We'd spend hours …", de: 'Wir haben oft stundenlang …', ex: "We'd spend hours playing in the garden.", note: 'would = früher immer (nur für Handlungen, nicht für Zustände).' },
        { id: 'm2l5p4', en: "I'll never forget …", de: 'Ich werde nie vergessen …', ex: "I'll never forget the day we got our first dog." },
        { id: 'm2l5p5', en: 'It reminds me of …', de: 'Das erinnert mich an …', ex: 'This smell reminds me of my grandma’s kitchen.', note: 'remind sb of = jdn erinnern an · remember = sich erinnern.' },
        { id: 'm2l5p6', en: 'Looking back, …', de: 'Rückblickend …', ex: 'Looking back, I had a really happy childhood.' },
      ],
      tip: {
        title: 'remember oder remind? used to oder would?',
        body: '<ul><li><b>remember</b> = sich erinnern: <i>I remember that day.</i> (ohne „me“, ohne „on“!)</li><li><b>remind sb of</b> = jdn an etwas erinnern: <i>That song reminds me of school.</i></li></ul><p><b>used to</b> geht für Gewohnheiten <i>und</i> Zustände (I used to have long hair). <b>would</b> nur für wiederholte Handlungen (We’d play outside for hours).</p>',
        examples: [
          { bad: 'That remembers me of my childhood.', good: 'That reminds me of my childhood.', why: 'jdn erinnern = remind.' },
          { bad: 'Do you remember on that summer?', good: 'Do you remember that summer?', why: 'remember ohne „on“.' },
        ],
      },
      speak: [
        { id: 'm2l5s1', they: 'This song is so old! It takes me back.', de: 'Mich auch! Das erinnert mich an meine Kindheit. Als ich klein war, haben wir das immer im Auto gehört.', answers: ['Me too! It reminds me of my childhood. When I was little, we always used to listen to it in the car.', 'Same! This reminds me of my childhood. When I was a kid, we used to listen to it in the car all the time.', 'Me too! It reminds me of when I was a kid. We would always listen to it in the car.'], keywords: [['me too', 'same'], ['reminds me of'], ['childhood', 'when i was a kid', 'when i was little'], ['used to listen', 'would always listen', 'always listened', 'would listen'], ['in the car']], levelUp: 'Same! It really reminds me of my childhood – we used to listen to it in the car on every single road trip.', note: '„erinnert mich an“ = reminds me of (nicht remembers me).' },
        { id: 'm2l5s2', they: 'Aw. What else did you do as a kid?', de: 'Im Sommer haben wir oft stundenlang im See geschwommen. Ich werde nie vergessen, wie kalt das Wasser war!', answers: ["In the summer we would spend hours swimming in the lake. I'll never forget how cold the water was!", "In summer we often spent hours swimming in the lake. I'll never forget how cold the water was!", "In the summer we used to swim in the lake for hours. I'll never forget how cold the water was!"], keywords: [['summer'], ['spend hours', 'spent hours', 'for hours'], ['swimming in the lake', 'swim in the lake'], ['never forget'], ['how cold the water was']], levelUp: "In the summer we'd spend hours swimming in the lake – I'll never forget how freezing the water was!", note: '„wie kalt das Wasser war“ – indirekt: how cold the water WAS.' },
        { id: 'm2l5s3', they: 'That sounds idyllic. Do you miss it?', de: 'Manchmal schon. Rückblickend hatte ich eine echt schöne Kindheit, aber damals fand ich unser Dorf total langweilig.', answers: ['Sometimes, yes. Looking back, I had a really nice childhood, but back then I found our village really boring.', 'Sometimes. Looking back, I had a really lovely childhood, but at the time I thought our village was so boring.', 'Sometimes, yeah. Looking back I had a really good childhood, but back then I thought our village was totally boring.'], keywords: [['sometimes'], ['looking back'], ['childhood'], ['back then', 'at the time', 'in those days'], ['village'], ['boring']], levelUp: 'Sometimes, yeah. Looking back, I had a really lovely childhood – but at the time I thought our village was the most boring place on earth.', note: '„damals“ = back then / at the time. Das Dorf ist boring, nicht bored.' },
        { id: 'm2l5s4', they: 'Ha, every teenager thinks that!', de: 'Stimmt! Erinnerst du dich noch an deinen ersten Urlaub ohne Eltern?', answers: ['True! Do you still remember your first holiday without your parents?', "That's true! Do you remember your first holiday without your parents?", 'So true! Can you still remember your first trip without your parents?'], keywords: [['true'], ['do you remember', 'do you still remember', 'can you remember', 'can you still remember'], ['first holiday', 'first trip', 'first vacation'], ['without your parents']], levelUp: 'So true! Do you still remember your first holiday without your parents?', note: '„sich erinnern an“ = remember (ohne „me“ und ohne „on“).' },
      ],
      exercises: [
        { type: 'choice', q: '„Das erinnert mich an unseren Urlaub in Italien.“', options: ['That reminds me of our holiday in Italy.', 'That remembers me of our holiday in Italy.', 'That reminds me on our holiday in Italy.', 'I remember me at our holiday in Italy.'], answer: 0, explain: 'jdn erinnern an = remind sb of.' },
        { type: 'fix', sentence: 'Do you remember on the summer we spent in Spain?', wrong: [3], correct: 'Do you remember the summer we spent in Spain?', explain: 'remember steht ohne „on“.' },
        { type: 'gap', sentence: 'When I was a kid, I ___ have really long hair.', options: ['used to', 'would', 'was used to', 'use to'], answer: 0, explain: 'Zustand (have) → used to. would nur für Handlungen.' },
        { type: 'speak', id: 'm2l5s1' },
        { type: 'listen', en: "Looking back, I didn't appreciate how lucky I was to grow up so close to the sea.", q: 'Was meint die Person?', options: ['Sie hat damals nicht geschätzt, wie viel Glück sie hatte.', 'Sie mochte das Meer nie.', 'Sie wohnt jetzt am Meer.', 'Sie hatte Pech in ihrer Kindheit.'], answer: 0, explain: 'appreciate = zu schätzen wissen.' },
        { type: 'match', pairs: [['remind sb of', 'jdn erinnern an'], ['back then', 'damals'], ['looking back', 'rückblickend'], ['appreciate', 'zu schätzen wissen']] },
        { type: 'listenbuild', en: 'That song always reminds me of my childhood.', distractors: ['remembers', 'on'] },
        { type: 'speak', id: 'm2l5s2' },
        { type: 'shadow', en: "When I was a kid, we'd spend hours swimming in the lake.", de: 'Als ich ein Kind war, sind wir oft stundenlang im See geschwommen.' },
        { type: 'free' },
      ],
      free: { id: 'm2l5f', they: 'What was your childhood like?', hint: 'Erzähl von deiner Kindheit (3–4 Sätze): wo, was ihr gemacht habt, eine Erinnerung. Mit used to / would.', useWords: ['When I was a kid …', 'used to …', "We'd …", 'Looking back …'], sample: "When I was a kid, we lived in a small town with a big forest nearby. We'd spend hours building dens and climbing trees. I used to hate going to school, but looking back, I had a really happy childhood." },
    },
  ],
};
