// Topic "Probleme lösen" (solving problems) – level 2 (B1): apologies, polite complaints, misunderstandings, describing things, compromises.
// Same format as travel.js. After changing English sentences: run tools/make_audio.py and commit audio/.

export default {
  "id": "problems",
  "title": "Probleme lösen",
  "level": 2,
  "lessons": [
    {
      "id": "r1",
      "title": "Sich entschuldigen",
      "en": "Saying sorry",
      "goal": "Sich entschuldigen und auf eine Entschuldigung reagieren",
      "tip": {
        "de": "„Sorry“ allein ist kurz. Mit Grund klingt es ehrlicher: „I'm sorry I'm late. The train was delayed.“ Reaktion: „Don't worry about it.“ oder „No problem.“",
        "en": "I'm so sorry I'm late."
      },
      "repeat": [
        {
          "en": "I'm so sorry I'm late.",
          "de": "Es tut mir so leid, dass ich zu spät bin."
        },
        {
          "en": "The train was delayed.",
          "de": "Der Zug hatte Verspätung."
        },
        {
          "en": "Don't worry about it.",
          "de": "Mach dir keine Gedanken."
        },
        {
          "en": "It won't happen again.",
          "de": "Das kommt nicht wieder vor."
        }
      ],
      "build": [
        {
          "en": "I'm sorry I forgot your birthday.",
          "de": "Es tut mir leid, dass ich deinen Geburtstag vergessen habe.",
          "extra": [
            "forgotten"
          ]
        },
        {
          "en": "I really did not mean it.",
          "de": "Ich habe es wirklich nicht so gemeint.",
          "extra": [
            "meant"
          ]
        },
        {
          "en": "It's okay, these things happen.",
          "de": "Schon gut, so etwas passiert.",
          "extra": [
            "happens"
          ]
        }
      ],
      "say": [
        {
          "they": "There you are! I've been waiting for twenty minutes.",
          "de": "Es tut mir so leid, dass ich zu spät bin. Der Zug hatte Verspätung.",
          "answers": [
            "I'm so sorry I'm late. The train was delayed.",
            "I'm really sorry I'm late. My train was late."
          ]
        },
        {
          "they": "Oh, okay. You could send a message next time.",
          "de": "Du hast recht. Das kommt nicht wieder vor.",
          "answers": [
            "You're right. It won't happen again.",
            "You're right. It won't happen again, I promise."
          ]
        },
        {
          "they": "Don't worry about it. Let's get a coffee.",
          "de": "Gute Idee. Der Kaffee geht auf mich!",
          "answers": [
            "Good idea. I'll pay for the coffee!",
            "Good idea. The coffee is my treat!"
          ]
        }
      ],
      "write": {
        "de": "Schreib einer Freundin eine Entschuldigung: Du hast vergessen, sie zurückzurufen.",
        "useWords": [
          "I'm so sorry",
          "I forgot",
          "Can I call you"
        ],
        "sample": "I'm so sorry, I forgot to call you back yesterday. Can I call you tonight?"
      },
      "talk": {
        "they": "When was the last time you had to say sorry?",
        "de": "Erzähl, wann du dich zuletzt entschuldigen musstest.",
        "useWords": [
          "The last time was",
          "I forgot",
          "I was late",
          "she said"
        ],
        "sample": "The last time was last week. I was late for a dinner with friends, but they were very nice about it."
      },
      "story": {
        "title": "Der vergessene Geburtstag",
        "de": "Max hat etwas Wichtiges vergessen. Hör gut zu.",
        "lines": [
          "It is Monday morning, and Max looks at his phone.",
          "Suddenly he sees it: yesterday was his best friend Jan's birthday.",
          "Max feels terrible. He has never forgotten it before.",
          "He calls Jan straight away and says he is very sorry.",
          "Jan laughs and says, \"Don't worry about it. I was busy all day.\"",
          "But Max still wants to do something nice.",
          "He invites Jan to his favourite restaurant on Friday.",
          "He also writes the date in his calendar for next year."
        ],
        "questions": [
          {
            "q": "Whose birthday did Max forget?",
            "qde": "Wessen Geburtstag hat Max vergessen?",
            "options": [
              "His mother's",
              "His friend Jan's",
              "His sister's"
            ],
            "answer": 1
          },
          {
            "q": "What does Max do to say sorry?",
            "qde": "Wie entschuldigt sich Max?",
            "options": [
              "He buys flowers.",
              "He invites Jan to dinner.",
              "He sends a card."
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "r2",
      "title": "Sich höflich beschweren",
      "en": "Complaining politely",
      "goal": "Im Restaurant oder Hotel freundlich ein Problem ansprechen",
      "tip": {
        "de": "Höflich beschweren: erst „Excuse me“, dann das Problem, dann eine Bitte: „Excuse me, my soup is cold. Could you warm it up, please?“ Freundlich bleiben hilft fast immer.",
        "en": "Excuse me, I think there is a mistake on the bill."
      },
      "repeat": [
        {
          "en": "Excuse me, my soup is cold.",
          "de": "Entschuldigung, meine Suppe ist kalt."
        },
        {
          "en": "I think there is a mistake on the bill.",
          "de": "Ich glaube, auf der Rechnung ist ein Fehler."
        },
        {
          "en": "I ordered the fish, not the chicken.",
          "de": "Ich habe den Fisch bestellt, nicht das Hähnchen."
        },
        {
          "en": "Could I speak to the manager, please?",
          "de": "Könnte ich bitte mit dem Geschäftsführer sprechen?"
        }
      ],
      "build": [
        {
          "en": "We have been waiting for forty minutes.",
          "de": "Wir warten schon seit vierzig Minuten.",
          "extra": [
            "since"
          ]
        },
        {
          "en": "The room is very noisy at night.",
          "de": "Das Zimmer ist nachts sehr laut.",
          "extra": [
            "loudly"
          ]
        },
        {
          "en": "Could you change it, please?",
          "de": "Könnten Sie es bitte umtauschen?",
          "extra": [
            "changing"
          ]
        }
      ],
      "say": [
        {
          "they": "Is everything okay with your meal?",
          "de": "Entschuldigung, aber ich habe den Fisch bestellt, nicht das Hähnchen.",
          "answers": [
            "Excuse me, but I ordered the fish, not the chicken.",
            "Sorry, but I ordered the fish, not the chicken."
          ]
        },
        {
          "they": "Oh, I'm so sorry! I'll change it right away.",
          "de": "Danke. Und könnten Sie mir noch ein Glas Wasser bringen?",
          "answers": [
            "Thank you. And could you bring me a glass of water too?",
            "Thanks. Could I also have a glass of water?"
          ]
        },
        {
          "they": "Of course. Here's your bill.",
          "de": "Ich glaube, da ist ein Fehler. Wir hatten nur zwei Getränke.",
          "answers": [
            "I think there's a mistake. We only had two drinks.",
            "I think there is a mistake. We only had two drinks."
          ]
        }
      ],
      "write": {
        "de": "Schreib eine kurze, höfliche Nachricht an ein Hotel: Dein Zimmer war sehr laut.",
        "useWords": [
          "Dear",
          "Unfortunately",
          "very noisy",
          "Could you"
        ],
        "sample": "Dear Sir or Madam, unfortunately our room was very noisy at night. Could you give us a quieter room?"
      },
      "talk": {
        "they": "Do you complain in a restaurant when something is wrong?",
        "de": "Erzähl, ob du dich beschwerst oder lieber nichts sagst.",
        "useWords": [
          "I usually",
          "I don't like to",
          "if it is",
          "I say something"
        ],
        "sample": "I don't like to complain, but if the food is really bad, I say something politely."
      },
      "story": {
        "title": "Die laute Nacht",
        "de": "Eva hat ein Problem im Hotel. Hör gut zu.",
        "lines": [
          "Eva is on a business trip in Manchester.",
          "Her hotel room is next to the lift, and it is very noisy.",
          "She cannot sleep because of the noise.",
          "At midnight, she goes down to the reception.",
          "She explains the problem politely.",
          "The man at the desk is very sorry.",
          "He gives her a bigger room on the top floor.",
          "The next morning, breakfast is free to say sorry."
        ],
        "questions": [
          {
            "q": "Why is Eva's room noisy?",
            "qde": "Warum ist Evas Zimmer laut?",
            "options": [
              "It is next to the bar.",
              "It is next to the lift.",
              "The street is loud."
            ],
            "answer": 1
          },
          {
            "q": "What does Eva get?",
            "qde": "Was bekommt Eva?",
            "options": [
              "Her money back",
              "A better room and free breakfast",
              "A free taxi"
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "r3",
      "title": "Missverständnisse",
      "en": "Misunderstandings",
      "goal": "Nachfragen, wenn du etwas nicht verstehst, und etwas klarstellen",
      "tip": {
        "de": "Nachfragen ist normal und höflich: „Sorry, what do you mean by …?“ oder „Do you mean …?“ Klarstellen: „What I mean is …“",
        "en": "Sorry, what do you mean?"
      },
      "repeat": [
        {
          "en": "Sorry, what do you mean?",
          "de": "Entschuldigung, was meinst du?"
        },
        {
          "en": "Do you mean Tuesday or Thursday?",
          "de": "Meinst du Dienstag oder Donnerstag?"
        },
        {
          "en": "I think there is a misunderstanding.",
          "de": "Ich glaube, da gibt es ein Missverständnis."
        },
        {
          "en": "What I mean is, I need more time.",
          "de": "Ich meine damit, dass ich mehr Zeit brauche."
        }
      ],
      "build": [
        {
          "en": "Could you explain that again?",
          "de": "Könntest du das noch einmal erklären?",
          "extra": [
            "me"
          ]
        },
        {
          "en": "I'm not sure I understand.",
          "de": "Ich bin nicht sicher, ob ich das verstehe.",
          "extra": [
            "if"
          ]
        },
        {
          "en": "Sorry, I didn't catch that.",
          "de": "Entschuldigung, das habe ich nicht mitbekommen.",
          "extra": [
            "catched"
          ]
        }
      ],
      "say": [
        {
          "they": "So we're meeting at the usual place at six.",
          "de": "Entschuldigung, was meinst du mit „the usual place“?",
          "answers": [
            "Sorry, what do you mean by \"the usual place\"?",
            "Sorry, what is \"the usual place\"?"
          ]
        },
        {
          "they": "The café on Bridge Street, of course!",
          "de": "Ah, ich dachte, du meinst das Café am Bahnhof.",
          "answers": [
            "Oh, I thought you meant the café at the station.",
            "Ah, I thought you meant the café by the station."
          ]
        },
        {
          "they": "No, no! See you at six on Bridge Street.",
          "de": "Okay, gut, dass ich gefragt habe!",
          "answers": [
            "Okay, good thing I asked!",
            "Okay, I'm glad I asked!"
          ]
        }
      ],
      "write": {
        "de": "Schreib eine Nachricht: Du hast eine Einladung nicht ganz verstanden. Frag nach Tag und Ort.",
        "useWords": [
          "Sorry",
          "Do you mean",
          "Where exactly"
        ],
        "sample": "Sorry, do you mean this Saturday or next Saturday? And where exactly is the party?"
      },
      "talk": {
        "they": "Have you ever had a funny misunderstanding in English?",
        "de": "Erzähl von einem Missverständnis, das dir passiert ist (auf Englisch oder Deutsch).",
        "useWords": [
          "Once",
          "I thought",
          "but he meant",
          "we laughed"
        ],
        "sample": "Once a waiter asked me \"Still or sparkling?\" I thought he meant the weather. We laughed a lot."
      },
      "story": {
        "title": "Der falsche Bahnhof",
        "de": "Zwei Freundinnen verpassen sich. Hör gut zu.",
        "lines": [
          "Sophie and Kate want to meet at \"the station\" at ten.",
          "Sophie waits at the main station in the city centre.",
          "Kate waits at the small station near her house.",
          "After twenty minutes, Sophie sends a message: \"Where are you?\"",
          "Kate answers, \"I'm at the station! Where are YOU?\"",
          "Then they understand the mistake and laugh.",
          "Kate takes the next train to the city centre.",
          "Now they always say the name of the station."
        ],
        "questions": [
          {
            "q": "Where does Sophie wait?",
            "qde": "Wo wartet Sophie?",
            "options": [
              "At the main station",
              "At the small station",
              "At home"
            ],
            "answer": 0
          },
          {
            "q": "What do they do now?",
            "qde": "Was machen sie jetzt immer?",
            "options": [
              "They meet at home.",
              "They say the name of the station.",
              "They take a taxi."
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "r4",
      "title": "Etwas verloren oder gestohlen",
      "en": "Lost or stolen",
      "goal": "Einen Verlust melden und beschreiben, was passiert ist",
      "tip": {
        "de": "Etwas beschreiben: Farbe und Größe stehen vor dem Ding: „a small black bag“ (nicht „a bag small black“). Material mit „made of“: „It's made of leather.“",
        "en": "It's a small black bag made of leather."
      },
      "repeat": [
        {
          "en": "Someone has stolen my wallet.",
          "de": "Jemand hat mein Portemonnaie gestohlen."
        },
        {
          "en": "I think I left my phone on the bus.",
          "de": "Ich glaube, ich habe mein Handy im Bus liegen lassen."
        },
        {
          "en": "It's a small black bag.",
          "de": "Es ist eine kleine schwarze Tasche."
        },
        {
          "en": "My bank cards were inside.",
          "de": "Meine Bankkarten waren darin."
        }
      ],
      "build": [
        {
          "en": "When did you last see it?",
          "de": "Wann hast du es zuletzt gesehen?",
          "extra": [
            "saw"
          ]
        },
        {
          "en": "I need to block my credit card.",
          "de": "Ich muss meine Kreditkarte sperren lassen.",
          "extra": [
            "close"
          ]
        },
        {
          "en": "Has anyone found a blue umbrella?",
          "de": "Hat jemand einen blauen Regenschirm gefunden?",
          "extra": [
            "umbrela"
          ]
        }
      ],
      "say": [
        {
          "they": "Hello, how can I help you?",
          "de": "Hallo, ich glaube, ich habe meine Tasche im Bus liegen lassen.",
          "answers": [
            "Hello, I think I left my bag on the bus.",
            "Hi, I think I lost my bag on the bus."
          ]
        },
        {
          "they": "What does it look like?",
          "de": "Es ist eine kleine schwarze Ledertasche.",
          "answers": [
            "It's a small black leather bag.",
            "It's a small black bag made of leather."
          ]
        },
        {
          "they": "And what was inside?",
          "de": "Mein Portemonnaie, meine Schlüssel und eine Brille.",
          "answers": [
            "My wallet, my keys and some glasses.",
            "My wallet, my keys and a pair of glasses."
          ]
        }
      ],
      "write": {
        "de": "Schreib eine kurze Nachricht an das Fundbüro: Was hast du verloren, wo und wann?",
        "useWords": [
          "I lost",
          "on",
          "It is",
          "made of"
        ],
        "sample": "Hello, I lost my umbrella on the number five bus on Monday. It is long and dark green."
      },
      "talk": {
        "they": "Have you ever lost something important?",
        "de": "Erzähl, ob du schon einmal etwas Wichtiges verloren hast.",
        "useWords": [
          "Once I lost",
          "I was so",
          "luckily",
          "I never found it"
        ],
        "sample": "Once I lost my passport at an airport. Luckily, a cleaner found it."
      },
      "story": {
        "title": "Die Brieftasche im Taxi",
        "de": "Daniel hat Glück. Hör gut zu.",
        "lines": [
          "Daniel takes a taxi home after a long day at work.",
          "At home, he cannot find his wallet.",
          "He thinks he left it in the taxi.",
          "He calls the taxi company, but nobody has found it.",
          "So he blocks his bank cards and goes to bed, very unhappy.",
          "The next morning, somebody rings the doorbell.",
          "It is the taxi driver! He found the wallet under the seat.",
          "Daniel is so happy that he gives him fifty euros."
        ],
        "questions": [
          {
            "q": "Where was the wallet?",
            "qde": "Wo war die Brieftasche?",
            "options": [
              "At work",
              "Under the taxi seat",
              "At home"
            ],
            "answer": 1
          },
          {
            "q": "Who brings the wallet back?",
            "qde": "Wer bringt die Brieftasche zurück?",
            "options": [
              "The police",
              "The taxi driver",
              "A neighbour"
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "r5",
      "title": "Eine Lösung finden",
      "en": "Finding a solution",
      "goal": "Zusammen eine Lösung finden und Kompromisse machen",
      "tip": {
        "de": "Lösungen vorschlagen: „What if we …?“ (Was wäre, wenn wir …?) und „Let's find a compromise.“ (Lass uns einen Kompromiss finden). Am Ende: „Deal!“ = Abgemacht!",
        "en": "What if we take turns?"
      },
      "repeat": [
        {
          "en": "What if we take turns?",
          "de": "Was wäre, wenn wir uns abwechseln?"
        },
        {
          "en": "Let's find a compromise.",
          "de": "Lass uns einen Kompromiss finden."
        },
        {
          "en": "That works for me.",
          "de": "Das passt für mich."
        },
        {
          "en": "Deal!",
          "de": "Abgemacht!"
        }
      ],
      "build": [
        {
          "en": "How can we solve this problem?",
          "de": "Wie können wir dieses Problem lösen?",
          "extra": [
            "solution"
          ]
        },
        {
          "en": "You cook, and I will wash up.",
          "de": "Du kochst, und ich spüle ab.",
          "extra": [
            "washes"
          ]
        },
        {
          "en": "Is that okay for you?",
          "de": "Ist das für dich in Ordnung?",
          "extra": [
            "by"
          ]
        }
      ],
      "say": [
        {
          "they": "I want to go to the beach, but you want to go to the mountains.",
          "de": "Was wäre, wenn wir uns abwechseln? Dieses Jahr Strand, nächstes Jahr Berge.",
          "answers": [
            "What if we take turns? The beach this year, the mountains next year.",
            "What if we take turns? This year the beach, next year the mountains."
          ]
        },
        {
          "they": "Hmm. Or we could find a place with both.",
          "de": "Gute Idee! Zum Beispiel ein See in den Bergen.",
          "answers": [
            "Good idea! For example, a lake in the mountains.",
            "Great idea! Like a lake in the mountains."
          ]
        },
        {
          "they": "Perfect. I'll look for a hotel.",
          "de": "Abgemacht! Und ich suche die Zugtickets.",
          "answers": [
            "Deal! And I'll look for the train tickets.",
            "Deal! And I'll find the train tickets."
          ]
        }
      ],
      "write": {
        "de": "Du und eine Freundin wollt nicht dasselbe Restaurant. Schreib einen Kompromiss vor.",
        "useWords": [
          "What if",
          "this time",
          "next time"
        ],
        "sample": "What if we go to your Thai restaurant this time, and to my Italian one next time?"
      },
      "talk": {
        "they": "How do you usually solve a problem with a friend?",
        "de": "Erzähl, wie du normalerweise Probleme mit Freunden löst.",
        "useWords": [
          "I usually",
          "talk about it",
          "listen",
          "find a solution"
        ],
        "sample": "I usually talk about it the same day. I listen first, and then we find a solution together."
      },
      "story": {
        "title": "Die Hausarbeit",
        "de": "Zwei Mitbewohner streiten sich. Hör gut zu.",
        "lines": [
          "Nina and Paul share a flat, but they often argue about the housework.",
          "Nina says she always cleans the kitchen.",
          "Paul says he always takes out the rubbish and does the shopping.",
          "One evening, they sit down and make a plan.",
          "Nina will clean the kitchen, and Paul will clean the bathroom.",
          "They will take turns with the shopping every week.",
          "They put the plan on the fridge.",
          "Since then, the flat has been clean, and they are good friends again."
        ],
        "questions": [
          {
            "q": "What do Nina and Paul argue about?",
            "qde": "Worüber streiten Nina und Paul?",
            "options": [
              "Money",
              "The housework",
              "Music"
            ],
            "answer": 1
          },
          {
            "q": "Where do they put the plan?",
            "qde": "Wo hängen sie den Plan auf?",
            "options": [
              "On the door",
              "On the fridge",
              "In the bathroom"
            ],
            "answer": 1
          }
        ]
      }
    }
  ]
};
