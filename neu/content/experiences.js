// Topic "Erlebnisse erzählen" (telling about experiences) – level 2 (B1): present perfect, past stories, past continuous, used to, for/since.
// Same format as travel.js. After changing English sentences: run tools/make_audio.py and commit audio/.

export default {
  "id": "experiences",
  "title": "Erlebnisse erzählen",
  "level": 2,
  "lessons": [
    {
      "id": "e1",
      "title": "Hast du schon mal …?",
      "en": "Have you ever …?",
      "goal": "Nach Erfahrungen fragen und davon erzählen",
      "tip": {
        "de": "Erfahrungen ohne Zeitpunkt: „Have you ever …?“ – „Yes, I have.“ / „No, never.“ Sobald ein Zeitpunkt kommt, nimmst du die einfache Vergangenheit: „I went there in 2019.“",
        "en": "Have you ever been to Scotland?"
      },
      "repeat": [
        {
          "en": "Have you ever been to Scotland?",
          "de": "Warst du schon einmal in Schottland?"
        },
        {
          "en": "I've never tried sushi.",
          "de": "Ich habe noch nie Sushi probiert."
        },
        {
          "en": "Yes, I went there two years ago.",
          "de": "Ja, ich war vor zwei Jahren dort."
        },
        {
          "en": "I've always wanted to go there.",
          "de": "Ich wollte schon immer dorthin."
        }
      ],
      "build": [
        {
          "en": "Have you ever seen a whale?",
          "de": "Hast du schon einmal einen Wal gesehen?",
          "extra": [
            "saw"
          ]
        },
        {
          "en": "I've been to London three times.",
          "de": "Ich war schon dreimal in London.",
          "extra": [
            "was"
          ]
        },
        {
          "en": "When did you go there?",
          "de": "Wann warst du dort?",
          "extra": [
            "have"
          ]
        }
      ],
      "say": [
        {
          "they": "Have you ever been to Scotland?",
          "de": "Nein, noch nie. Aber ich wollte schon immer dorthin.",
          "answers": [
            "No, never. But I've always wanted to go there.",
            "No, I haven't. But I've always wanted to go there."
          ]
        },
        {
          "they": "You should go! Have you been to Ireland?",
          "de": "Ja, ich war vor zwei Jahren in Dublin.",
          "answers": [
            "Yes, I went to Dublin two years ago.",
            "Yes, I was in Dublin two years ago."
          ]
        },
        {
          "they": "Did you like it?",
          "de": "Sehr! Die Leute waren so freundlich.",
          "answers": [
            "Very much! The people were so friendly.",
            "I loved it! The people were so friendly."
          ]
        }
      ],
      "write": {
        "de": "Schreib zwei Dinge, die du schon gemacht hast, und eines, das du noch nie gemacht hast.",
        "useWords": [
          "I've been",
          "I've tried",
          "I've never"
        ],
        "sample": "I've been to Paris and I've tried snails. I've never flown in a small plane."
      },
      "talk": {
        "they": "What's the most interesting place you've ever been to?",
        "de": "Erzähl von dem interessantesten Ort, an dem du je warst.",
        "useWords": [
          "The most interesting place",
          "I went there",
          "it was"
        ],
        "sample": "The most interesting place was Morocco. I went there ten years ago with a friend."
      },
      "story": {
        "title": "Die Liste",
        "de": "Oma Ruth hat eine besondere Liste. Hör gut zu.",
        "lines": [
          "Ruth is seventy, and she has a list of things she wants to do.",
          "She has already done many of them.",
          "She has seen the northern lights in Norway.",
          "She has learned to swim, at the age of sixty-five.",
          "Last year, she flew in a hot air balloon.",
          "But she has never been to New York.",
          "So her grandson is taking her there next spring.",
          "She says, \"You are never too old for something new.\""
        ],
        "questions": [
          {
            "q": "When did Ruth learn to swim?",
            "qde": "Wann hat Ruth schwimmen gelernt?",
            "options": [
              "As a child",
              "At sixty-five",
              "Last year"
            ],
            "answer": 1
          },
          {
            "q": "Where is Ruth going next spring?",
            "qde": "Wohin fährt Ruth nächsten Frühling?",
            "options": [
              "To Norway",
              "To New York",
              "To the sea"
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "e2",
      "title": "Was ist passiert?",
      "en": "What happened?",
      "goal": "Eine kleine Geschichte in der Vergangenheit erzählen",
      "tip": {
        "de": "Geschichten verbinden: first (zuerst), then (dann), after that (danach), in the end (am Ende). So klingt deine Erzählung sofort flüssiger.",
        "en": "First we missed the bus, then it started to rain."
      },
      "repeat": [
        {
          "en": "First we missed the bus.",
          "de": "Zuerst haben wir den Bus verpasst."
        },
        {
          "en": "Then it started to rain.",
          "de": "Dann fing es an zu regnen."
        },
        {
          "en": "After that, we went into a café.",
          "de": "Danach sind wir in ein Café gegangen."
        },
        {
          "en": "In the end, it was a lovely day.",
          "de": "Am Ende war es ein schöner Tag."
        }
      ],
      "build": [
        {
          "en": "What happened next?",
          "de": "Was ist dann passiert?",
          "extra": [
            "happend"
          ]
        },
        {
          "en": "We waited for an hour.",
          "de": "Wir haben eine Stunde gewartet.",
          "extra": [
            "since"
          ]
        },
        {
          "en": "Luckily, a friendly man helped us.",
          "de": "Zum Glück hat uns ein netter Mann geholfen.",
          "extra": [
            "Happily"
          ]
        }
      ],
      "say": [
        {
          "they": "How was your trip to the mountains?",
          "de": "Es war lustig! Zuerst haben wir den Bus verpasst.",
          "answers": [
            "It was funny! First we missed the bus.",
            "It was fun! First we missed the bus."
          ]
        },
        {
          "they": "Oh no! What did you do?",
          "de": "Wir haben eine Stunde gewartet, dann fing es an zu regnen.",
          "answers": [
            "We waited for an hour, then it started to rain.",
            "We waited an hour, and then it started raining."
          ]
        },
        {
          "they": "That sounds terrible!",
          "de": "Ja, aber am Ende war es ein schöner Tag.",
          "answers": [
            "Yes, but in the end it was a lovely day.",
            "Yes, but in the end it was a nice day."
          ]
        }
      ],
      "write": {
        "de": "Schreib eine kleine Geschichte (2–3 Sätze) über einen Tag, an dem etwas schiefging.",
        "useWords": [
          "First",
          "Then",
          "In the end"
        ],
        "sample": "First I lost my keys. Then I missed my train. In the end, a colleague drove me home."
      },
      "talk": {
        "they": "Tell me about a funny thing that happened to you.",
        "de": "Erzähl eine lustige Sache, die dir passiert ist.",
        "useWords": [
          "Once",
          "I was",
          "suddenly",
          "everybody laughed"
        ],
        "sample": "Once I said hello to a man, but it was a shop window. Everybody laughed."
      },
      "story": {
        "title": "Ein Tag am See",
        "de": "Jakob und Nora machen einen Ausflug. Hör gut zu.",
        "lines": [
          "Last Sunday, Jakob and Nora wanted to have a picnic by the lake.",
          "First, they forgot the sandwiches at home.",
          "So they bought some bread and cheese at a small shop.",
          "Then a dog ran to their blanket and took the cheese.",
          "Its owner was very sorry and laughed a lot.",
          "She invited them to her little boat.",
          "They spent the whole afternoon on the water.",
          "In the end, it was the best picnic they ever had."
        ],
        "questions": [
          {
            "q": "What did they forget at home?",
            "qde": "Was haben sie zu Hause vergessen?",
            "options": [
              "The blanket",
              "The sandwiches",
              "The dog"
            ],
            "answer": 1
          },
          {
            "q": "Where did they spend the afternoon?",
            "qde": "Wo haben sie den Nachmittag verbracht?",
            "options": [
              "In a café",
              "On a boat",
              "At home"
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "e3",
      "title": "Gerade, als …",
      "en": "Just when …",
      "goal": "Erzählen, was gerade passierte, als etwas geschah (was/were + -ing)",
      "tip": {
        "de": "Was gerade lief: was/were + -ing. Was plötzlich passierte: einfache Vergangenheit. „I was cooking when the phone rang.“ – Ich kochte gerade, als das Telefon klingelte.",
        "en": "I was cooking when the phone rang."
      },
      "repeat": [
        {
          "en": "I was cooking when the phone rang.",
          "de": "Ich kochte gerade, als das Telefon klingelte."
        },
        {
          "en": "We were walking home when it started to snow.",
          "de": "Wir gingen gerade nach Hause, als es anfing zu schneien."
        },
        {
          "en": "What were you doing at eight?",
          "de": "Was hast du um acht gemacht?"
        },
        {
          "en": "I was sleeping, so I didn't hear it.",
          "de": "Ich habe geschlafen, deshalb habe ich es nicht gehört."
        }
      ],
      "build": [
        {
          "en": "She was reading when the lights went out.",
          "de": "Sie las gerade, als das Licht ausging.",
          "extra": [
            "goes"
          ]
        },
        {
          "en": "Were you watching the match?",
          "de": "Hast du gerade das Spiel geschaut?",
          "extra": [
            "Did"
          ]
        },
        {
          "en": "While I was waiting, I met an old friend.",
          "de": "Während ich wartete, traf ich eine alte Freundin.",
          "extra": [
            "During"
          ]
        }
      ],
      "say": [
        {
          "they": "I called you last night. Where were you?",
          "de": "Tut mir leid, ich habe gerade gekocht und es nicht gehört.",
          "answers": [
            "Sorry, I was cooking and I didn't hear it.",
            "Sorry, I was cooking, so I didn't hear it."
          ]
        },
        {
          "they": "No problem. I wanted to tell you something funny.",
          "de": "Erzähl! Was ist passiert?",
          "answers": [
            "Tell me! What happened?",
            "Tell me! What happened?"
          ]
        },
        {
          "they": "I saw our old teacher at the station!",
          "de": "Wirklich? Ich habe sie letzte Woche getroffen, als ich auf den Bus wartete.",
          "answers": [
            "Really? I met her last week when I was waiting for the bus.",
            "Really? I saw her last week while I was waiting for the bus."
          ]
        }
      ],
      "write": {
        "de": "Schreib, was du gerade gemacht hast, als du gestern eine Nachricht bekommen hast.",
        "useWords": [
          "I was",
          "when",
          "it was from"
        ],
        "sample": "I was watching TV when I got a message. It was from my brother."
      },
      "talk": {
        "they": "Where were you when you heard some really good news?",
        "de": "Erzähl, wo du warst, als du eine richtig gute Nachricht bekommen hast.",
        "useWords": [
          "I was",
          "when",
          "I was so happy"
        ],
        "sample": "I was sitting in the garden when my friend called. She was pregnant! I was so happy."
      },
      "story": {
        "title": "Der Stromausfall",
        "de": "Plötzlich ist der Strom weg. Hör gut zu.",
        "lines": [
          "Last Friday evening, everybody in Anna's street was at home.",
          "Anna was taking a shower, and her son was playing a video game.",
          "Suddenly, all the lights went out.",
          "Her son shouted, \"My game! I was winning!\"",
          "Anna found some candles in the kitchen.",
          "Without TV and phones, they played cards by candlelight.",
          "After two hours, the lights came back on.",
          "Her son said, \"Can we turn them off again? This was fun.\""
        ],
        "questions": [
          {
            "q": "What was Anna's son doing?",
            "qde": "Was machte Annas Sohn gerade?",
            "options": [
              "He was sleeping.",
              "He was playing a video game.",
              "He was cooking."
            ],
            "answer": 1
          },
          {
            "q": "What did they do without lights?",
            "qde": "Was haben sie ohne Licht gemacht?",
            "options": [
              "They went to bed.",
              "They played cards.",
              "They went out."
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "e4",
      "title": "Früher",
      "en": "In the past",
      "goal": "Erzählen, wie es früher war (used to)",
      "tip": {
        "de": "„used to“ = früher (aber heute nicht mehr): „I used to live in Berlin.“ Das klingt im Englischen sehr natürlich, wenn du von früher erzählst.",
        "en": "I used to live in Berlin."
      },
      "repeat": [
        {
          "en": "I used to live in Berlin.",
          "de": "Früher habe ich in Berlin gewohnt."
        },
        {
          "en": "We used to go camping every summer.",
          "de": "Früher sind wir jeden Sommer zelten gegangen."
        },
        {
          "en": "I didn't use to like vegetables.",
          "de": "Früher mochte ich kein Gemüse."
        },
        {
          "en": "Things were very different back then.",
          "de": "Damals war alles ganz anders."
        }
      ],
      "build": [
        {
          "en": "Did you use to play an instrument?",
          "de": "Hast du früher ein Instrument gespielt?",
          "extra": [
            "used"
          ]
        },
        {
          "en": "My grandmother used to make the best cakes.",
          "de": "Meine Oma hat früher die besten Kuchen gebacken.",
          "extra": [
            "uses"
          ]
        },
        {
          "en": "There used to be a cinema here.",
          "de": "Hier war früher ein Kino.",
          "extra": [
            "was"
          ]
        }
      ],
      "say": [
        {
          "they": "Have you always lived here?",
          "de": "Nein, früher habe ich in Berlin gewohnt.",
          "answers": [
            "No, I used to live in Berlin.",
            "No, I didn't. I used to live in Berlin."
          ]
        },
        {
          "they": "Oh, nice! Why did you move?",
          "de": "Wegen meiner Arbeit. Aber ich vermisse die Stadt manchmal.",
          "answers": [
            "Because of my job. But I sometimes miss the city.",
            "For my job. But sometimes I miss the city."
          ]
        },
        {
          "they": "What do you miss most?",
          "de": "Die Cafés. Früher habe ich jeden Sonntag mit Freunden gefrühstückt.",
          "answers": [
            "The cafés. I used to have breakfast with friends every Sunday.",
            "The cafés. Every Sunday I used to have breakfast with friends."
          ]
        }
      ],
      "write": {
        "de": "Schreib, was du als Kind oft gemacht hast und heute nicht mehr machst.",
        "useWords": [
          "When I was a child",
          "I used to",
          "but now I don't"
        ],
        "sample": "When I was a child, I used to climb trees every day, but now I don't."
      },
      "talk": {
        "they": "How was your life different ten years ago?",
        "de": "Erzähl, wie dein Leben vor zehn Jahren anders war.",
        "useWords": [
          "Ten years ago",
          "I used to",
          "now I"
        ],
        "sample": "Ten years ago I used to work in a shop. Now I work in an office and I have more free time."
      },
      "story": {
        "title": "Opas Dorf",
        "de": "Leo besucht das Dorf seines Großvaters. Hör gut zu.",
        "lines": [
          "Leo visits the village where his grandfather grew up.",
          "His grandfather shows him the old school.",
          "\"I used to walk here every day, even in the snow,\" he says.",
          "There used to be a small shop next to the church.",
          "Now there is a café there, and they have a coffee.",
          "His grandfather used to swim in the river behind the farm.",
          "Leo is surprised, because his grandfather hates cold water now.",
          "His grandfather laughs and says, \"People change.\""
        ],
        "questions": [
          {
            "q": "What is next to the church now?",
            "qde": "Was ist heute neben der Kirche?",
            "options": [
              "A shop",
              "A café",
              "A school"
            ],
            "answer": 1
          },
          {
            "q": "What did his grandfather use to do in the river?",
            "qde": "Was hat der Opa früher im Fluss gemacht?",
            "options": [
              "Fish",
              "Swim",
              "Wash clothes"
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "e5",
      "title": "Wie lange schon?",
      "en": "How long?",
      "goal": "Sagen, wie lange etwas schon so ist (for / since)",
      "tip": {
        "de": "„Seit“ auf Englisch: Zeitraum mit „for“ (for ten years), Zeitpunkt mit „since“ (since 2015). Und du nimmst have + 3. Form: „I've lived here for ten years“ – nicht „I live here since …“!",
        "en": "I've known her for twenty years."
      },
      "repeat": [
        {
          "en": "I've known her for twenty years.",
          "de": "Ich kenne sie seit zwanzig Jahren."
        },
        {
          "en": "We've been married since 2010.",
          "de": "Wir sind seit 2010 verheiratet."
        },
        {
          "en": "I've had this car for a long time.",
          "de": "Ich habe dieses Auto schon lange."
        },
        {
          "en": "I haven't seen him since Christmas.",
          "de": "Ich habe ihn seit Weihnachten nicht gesehen."
        }
      ],
      "build": [
        {
          "en": "How long have you known each other?",
          "de": "Wie lange kennt ihr euch schon?",
          "extra": [
            "know"
          ]
        },
        {
          "en": "I've worked here since March.",
          "de": "Ich arbeite hier seit März.",
          "extra": [
            "for"
          ]
        },
        {
          "en": "She has lived in Spain for five years.",
          "de": "Sie wohnt seit fünf Jahren in Spanien.",
          "extra": [
            "since"
          ]
        }
      ],
      "say": [
        {
          "they": "How do you know Kate?",
          "de": "Wir kennen uns seit der Schule.",
          "answers": [
            "We've known each other since school.",
            "We've known each other since we were at school."
          ]
        },
        {
          "they": "Wow, that is a long time!",
          "de": "Ja, seit fast dreißig Jahren!",
          "answers": [
            "Yes, for almost thirty years!",
            "Yes, for nearly thirty years!"
          ]
        },
        {
          "they": "Do you still see her often?",
          "de": "Nicht so oft. Ich habe sie seit Weihnachten nicht gesehen.",
          "answers": [
            "Not so often. I haven't seen her since Christmas.",
            "Not very often. I haven't seen her since Christmas."
          ]
        }
      ],
      "write": {
        "de": "Schreib über eine Person, die du schon lange kennst: seit wann und woher.",
        "useWords": [
          "I've known",
          "for",
          "since",
          "We met"
        ],
        "sample": "I've known my friend Julia for fifteen years. We met at work."
      },
      "talk": {
        "they": "Who is your oldest friend?",
        "de": "Erzähl von deiner ältesten Freundschaft.",
        "useWords": [
          "We've known each other",
          "since",
          "we still"
        ],
        "sample": "My oldest friend is Sandra. We've known each other since we were six. We still talk every week."
      },
      "story": {
        "title": "Fünfzig Jahre",
        "de": "Ein Paar feiert ein großes Fest. Hör gut zu.",
        "lines": [
          "Hans and Greta have been married for fifty years.",
          "They met at a dance in 1975.",
          "Hans says he has loved her since the first song.",
          "They have lived in the same house for forty years.",
          "Their children and grandchildren organise a party.",
          "Greta has kept her wedding dress since that day.",
          "At the party, she wears it again, and it still fits!",
          "Everybody dances to the same song they heard in 1975."
        ],
        "questions": [
          {
            "q": "Where did Hans and Greta meet?",
            "qde": "Wo haben sich Hans und Greta kennengelernt?",
            "options": [
              "At work",
              "At a dance",
              "On holiday"
            ],
            "answer": 1
          },
          {
            "q": "How long have they lived in their house?",
            "qde": "Wie lange wohnen sie schon in ihrem Haus?",
            "options": [
              "For fifty years",
              "For forty years",
              "For ten years"
            ],
            "answer": 1
          }
        ]
      }
    }
  ]
};
