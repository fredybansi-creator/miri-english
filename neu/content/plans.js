// Topic "Pläne & Verabredungen" (plans and arrangements) – level 2 (B1): going to, present continuous for plans, suggestions.
// Same format as travel.js. After changing English sentences: run tools/make_audio.py and commit audio/.

export default {
  "id": "plans",
  "title": "Pläne & Verabredungen",
  "level": 2,
  "lessons": [
    {
      "id": "p1",
      "title": "Was hast du vor?",
      "en": "Talking about plans",
      "goal": "Über Pläne sprechen (going to, Verlaufsform für feste Termine)",
      "tip": {
        "de": "Pläne: „I'm going to …“ (ich habe vor). Feste Termine mit Uhrzeit oft mit -ing: „I'm meeting Anna at six.“ Beides heißt auf Deutsch einfach Gegenwart.",
        "en": "I'm meeting Anna at six."
      },
      "repeat": [
        {
          "en": "I'm going to visit my sister next weekend.",
          "de": "Nächstes Wochenende besuche ich meine Schwester."
        },
        {
          "en": "I'm meeting Anna at six.",
          "de": "Ich treffe Anna um sechs."
        },
        {
          "en": "We're going to paint the kitchen.",
          "de": "Wir wollen die Küche streichen."
        },
        {
          "en": "I haven't decided yet.",
          "de": "Ich habe mich noch nicht entschieden."
        }
      ],
      "build": [
        {
          "en": "What are you doing this weekend?",
          "de": "Was machst du dieses Wochenende?",
          "extra": [
            "make"
          ]
        },
        {
          "en": "I'm going to stay at home and relax.",
          "de": "Ich bleibe zu Hause und entspanne mich.",
          "extra": [
            "will"
          ]
        },
        {
          "en": "Are you doing anything tonight?",
          "de": "Hast du heute Abend etwas vor?",
          "extra": [
            "what"
          ]
        }
      ],
      "say": [
        {
          "they": "Any plans for the weekend?",
          "de": "Ja, ich besuche meine Schwester in Hamburg.",
          "answers": [
            "Yes, I'm visiting my sister in Hamburg.",
            "Yes, I'm going to visit my sister in Hamburg."
          ]
        },
        {
          "they": "Nice! How long are you staying?",
          "de": "Nur zwei Tage. Ich komme am Sonntagabend zurück.",
          "answers": [
            "Only two days. I'm coming back on Sunday evening.",
            "Just two days. I'll be back on Sunday evening."
          ]
        },
        {
          "they": "What are you going to do there?",
          "de": "Wir gehen ins Museum und essen in einem Fischrestaurant.",
          "answers": [
            "We're going to the museum and eating in a fish restaurant.",
            "We're going to go to a museum and eat at a fish restaurant."
          ]
        }
      ],
      "write": {
        "de": "Schreib, was du nächstes Wochenende vorhast.",
        "useWords": [
          "I'm going to",
          "I'm meeting",
          "on Saturday"
        ],
        "sample": "On Saturday I'm meeting a friend for lunch. On Sunday I'm going to clean the flat."
      },
      "talk": {
        "they": "Do you have any plans for the summer?",
        "de": "Erzähl, was du im Sommer vorhast oder gern machen würdest.",
        "useWords": [
          "I'm going to",
          "I'd like to",
          "maybe"
        ],
        "sample": "I'm going to visit friends in Italy. Maybe we'll go to the sea."
      },
      "story": {
        "title": "Ein Plan für Samstag",
        "de": "Mia und Jonas planen ihr Wochenende. Hör gut zu.",
        "lines": [
          "Mia and Jonas are talking about the weekend.",
          "Jonas is going to play tennis on Saturday morning.",
          "Mia is meeting her friend Kate for lunch in town.",
          "In the afternoon, they want to buy a new sofa together.",
          "On Saturday evening, they are going to a birthday party.",
          "Mia has not bought a present yet.",
          "So Jonas says, \"Let's buy one after the sofa shop.\"",
          "On Sunday, they are going to sleep late and do nothing."
        ],
        "questions": [
          {
            "q": "What is Mia doing at lunchtime?",
            "qde": "Was macht Mia mittags?",
            "options": [
              "Playing tennis",
              "Meeting her friend Kate",
              "Buying a sofa"
            ],
            "answer": 1
          },
          {
            "q": "What are they doing on Sunday?",
            "qde": "Was machen sie am Sonntag?",
            "options": [
              "Going to a party",
              "Nothing special",
              "Visiting family"
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "p2",
      "title": "Pläne ändern",
      "en": "Changing plans",
      "goal": "Absagen, verschieben und einen neuen Termin finden",
      "tip": {
        "de": "Etwas verschieben: „Can we move it to Thursday?“ Absagen: „I'm afraid I can't make it.“ („I'm afraid“ heißt hier: leider – nicht Angst!)",
        "en": "I'm afraid I can't make it."
      },
      "repeat": [
        {
          "en": "I'm afraid I can't make it tonight.",
          "de": "Leider schaffe ich es heute Abend nicht."
        },
        {
          "en": "Can we move it to Thursday?",
          "de": "Können wir es auf Donnerstag verschieben?"
        },
        {
          "en": "Something came up at work.",
          "de": "Bei der Arbeit ist etwas dazwischengekommen."
        },
        {
          "en": "Does next week work for you?",
          "de": "Passt dir nächste Woche?"
        }
      ],
      "build": [
        {
          "en": "I'm really sorry about this.",
          "de": "Das tut mir wirklich leid.",
          "extra": [
            "much"
          ]
        },
        {
          "en": "Can we meet a bit later?",
          "de": "Können wir uns etwas später treffen?",
          "extra": [
            "latest"
          ]
        },
        {
          "en": "Let's try again next week.",
          "de": "Lass es uns nächste Woche noch einmal versuchen.",
          "extra": [
            "Let"
          ]
        }
      ],
      "say": [
        {
          "they": "Hi! Are we still meeting at seven?",
          "de": "Es tut mir so leid, aber leider schaffe ich es heute nicht.",
          "answers": [
            "I'm so sorry, but I'm afraid I can't make it today.",
            "I'm really sorry, but I can't make it today."
          ]
        },
        {
          "they": "Oh no, is everything okay?",
          "de": "Ja, aber bei der Arbeit ist etwas dazwischengekommen.",
          "answers": [
            "Yes, but something came up at work.",
            "Yes, but something happened at work."
          ]
        },
        {
          "they": "No problem. When are you free?",
          "de": "Passt dir Donnerstag? Um die gleiche Zeit?",
          "answers": [
            "Does Thursday work for you? At the same time?",
            "Is Thursday okay for you? At the same time?"
          ]
        }
      ],
      "write": {
        "de": "Schreib eine Nachricht: Du musst ein Treffen absagen. Entschuldige dich und schlag einen neuen Tag vor.",
        "useWords": [
          "I'm sorry",
          "I can't make it",
          "Can we"
        ],
        "sample": "I'm sorry, I can't make it on Friday. Can we meet on Monday instead?"
      },
      "talk": {
        "they": "What do you do when a friend cancels at the last minute?",
        "de": "Erzähl, wie es für dich ist, wenn jemand kurzfristig absagt.",
        "useWords": [
          "I don't mind",
          "it depends",
          "a bit annoyed"
        ],
        "sample": "I don't mind, if it's not often. But sometimes I'm a bit annoyed."
      },
      "story": {
        "title": "Der verschobene Abend",
        "de": "Lena muss ein Treffen absagen. Hör gut zu.",
        "lines": [
          "Lena and her friend Sara planned to go to a concert on Friday.",
          "On Thursday, Lena's boss asks her to work late on Friday.",
          "Lena calls Sara and says she is very sorry.",
          "Sara is a bit sad, but she understands.",
          "Lena's brother takes her ticket, so it is not wasted.",
          "Lena and Sara find a new date for dinner.",
          "They meet the next Tuesday at a Thai restaurant.",
          "Lena pays for dinner to say sorry."
        ],
        "questions": [
          {
            "q": "Why can't Lena go to the concert?",
            "qde": "Warum kann Lena nicht zum Konzert?",
            "options": [
              "She is ill.",
              "She has to work late.",
              "She lost her ticket."
            ],
            "answer": 1
          },
          {
            "q": "Who goes to the concert instead?",
            "qde": "Wer geht stattdessen zum Konzert?",
            "options": [
              "Lena's brother",
              "Lena's boss",
              "Nobody"
            ],
            "answer": 0
          }
        ]
      }
    },
    {
      "id": "p3",
      "title": "Telefonieren",
      "en": "On the phone",
      "goal": "Am Telefon etwas klären und eine Nachricht hinterlassen",
      "tip": {
        "de": "Am Telefon sagt man „This is Miri.“ (nicht „Here is Miri“). Wenn du nichts verstehst: „Sorry, could you say that again?“",
        "en": "Hello, this is Miri."
      },
      "repeat": [
        {
          "en": "Hello, this is Miri.",
          "de": "Hallo, hier ist Miri."
        },
        {
          "en": "Could you say that again, please?",
          "de": "Könnten Sie das bitte noch einmal sagen?"
        },
        {
          "en": "Can I leave a message?",
          "de": "Kann ich eine Nachricht hinterlassen?"
        },
        {
          "en": "Sorry, the line is bad. I can't hear you.",
          "de": "Entschuldigung, die Verbindung ist schlecht. Ich kann dich nicht hören."
        }
      ],
      "build": [
        {
          "en": "Could you speak a bit more slowly?",
          "de": "Könnten Sie etwas langsamer sprechen?",
          "extra": [
            "slow"
          ]
        },
        {
          "en": "I will call you back in five minutes.",
          "de": "Ich rufe dich in fünf Minuten zurück.",
          "extra": [
            "return"
          ]
        },
        {
          "en": "Can you ask her to call me?",
          "de": "Kannst du sie bitten, mich anzurufen?",
          "extra": [
            "say"
          ]
        }
      ],
      "say": [
        {
          "they": "Good morning, Green Garden Hotel.",
          "de": "Guten Morgen, hier ist Miri. Ich habe eine Frage zu meiner Buchung.",
          "answers": [
            "Good morning, this is Miri. I have a question about my booking.",
            "Good morning, my name is Miri. I have a question about my booking."
          ]
        },
        {
          "they": "Of course. What is your booking number?",
          "de": "Entschuldigung, könnten Sie das noch einmal sagen? Etwas langsamer, bitte.",
          "answers": [
            "Sorry, could you say that again? A bit more slowly, please.",
            "Sorry, could you repeat that? More slowly, please."
          ]
        },
        {
          "they": "Sure. Your booking number, please.",
          "de": "Sie ist sieben, vier, zwei, neun.",
          "answers": [
            "It's seven, four, two, nine.",
            "It is seven four two nine."
          ]
        }
      ],
      "write": {
        "de": "Schreib eine kurze Nachricht für die Mailbox einer Freundin: Wer du bist, warum du anrufst, wann sie zurückrufen soll.",
        "useWords": [
          "This is",
          "I'm calling because",
          "Can you call me"
        ],
        "sample": "Hi, this is Miri. I'm calling because of Saturday. Can you call me back tonight?"
      },
      "talk": {
        "they": "Do you prefer to call people or to write messages?",
        "de": "Erzähl, ob du lieber anrufst oder schreibst – und warum.",
        "useWords": [
          "I prefer",
          "because",
          "faster",
          "more personal"
        ],
        "sample": "I prefer to write messages, because I can think first. But calls are more personal."
      },
      "story": {
        "title": "Der falsche Anruf",
        "de": "Paul ruft beim Zahnarzt an. Hör gut zu.",
        "lines": [
          "Paul wants to change his appointment at the dentist.",
          "He calls the number on the card, but a man answers.",
          "The man says, \"This is Pizza Roma. Can I take your order?\"",
          "Paul laughs and says sorry. He has the wrong number.",
          "He looks at the card again. The last number is a six, not an eight.",
          "This time, a friendly woman answers.",
          "She moves his appointment from Monday to Wednesday.",
          "That evening, Paul orders a pizza from Pizza Roma."
        ],
        "questions": [
          {
            "q": "Who answers the first call?",
            "qde": "Wer geht beim ersten Anruf ran?",
            "options": [
              "The dentist",
              "A man from a pizza place",
              "Paul's friend"
            ],
            "answer": 1
          },
          {
            "q": "When is Paul's new appointment?",
            "qde": "Wann ist Pauls neuer Termin?",
            "options": [
              "On Monday",
              "On Wednesday",
              "On Friday"
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "p4",
      "title": "Einladen und antworten",
      "en": "Invitations",
      "goal": "Eine Einladung annehmen oder höflich ablehnen",
      "tip": {
        "de": "Höflich ablehnen: Erst danken, dann einen Grund: „Thanks so much for asking, but I'm busy that day.“ Ein reines „No“ wirkt im Englischen sehr hart.",
        "en": "Thanks so much for asking, but I'm busy that day."
      },
      "repeat": [
        {
          "en": "I'd love to come!",
          "de": "Ich komme sehr gern!"
        },
        {
          "en": "Thanks for asking, but I'm busy that day.",
          "de": "Danke für die Einladung, aber ich habe an dem Tag keine Zeit."
        },
        {
          "en": "What should I bring?",
          "de": "Was soll ich mitbringen?"
        },
        {
          "en": "What time does it start?",
          "de": "Wann fängt es an?"
        }
      ],
      "build": [
        {
          "en": "Would you like to come to my birthday party?",
          "de": "Möchtest du zu meiner Geburtstagsfeier kommen?",
          "extra": [
            "will"
          ]
        },
        {
          "en": "It's at my place on Saturday.",
          "de": "Sie ist am Samstag bei mir.",
          "extra": [
            "by"
          ]
        },
        {
          "en": "Can I bring my partner?",
          "de": "Darf ich meinen Partner mitbringen?",
          "extra": [
            "brought"
          ]
        }
      ],
      "say": [
        {
          "they": "I'm having a barbecue on Sunday. Would you like to come?",
          "de": "Sehr gern! Wann fängt es an?",
          "answers": [
            "I'd love to! What time does it start?",
            "Yes, I'd love to! When does it start?"
          ]
        },
        {
          "they": "At about two. Bring your swimming things, we have a pool!",
          "de": "Super! Soll ich etwas zu essen mitbringen?",
          "answers": [
            "Great! Should I bring some food?",
            "Great! Shall I bring something to eat?"
          ]
        },
        {
          "they": "Maybe a salad?",
          "de": "Klar, ich mache meinen Kartoffelsalat.",
          "answers": [
            "Sure, I'll make my potato salad.",
            "Of course, I'll bring my potato salad."
          ]
        }
      ],
      "write": {
        "de": "Eine Freundin lädt dich zu ihrer Party ein, aber du kannst nicht. Schreib ihr eine freundliche Absage.",
        "useWords": [
          "Thank you so much",
          "but I can't",
          "I'm visiting",
          "Have fun"
        ],
        "sample": "Thank you so much for the invitation, but I can't come. I'm visiting my parents. Have fun!"
      },
      "talk": {
        "they": "What kind of parties do you like?",
        "de": "Erzähl, welche Feiern du magst: groß, klein, draußen, mit Tanzen …?",
        "useWords": [
          "I prefer",
          "small",
          "with good friends",
          "dancing"
        ],
        "sample": "I prefer small parties with good friends and nice food."
      },
      "story": {
        "title": "Die Überraschungsparty",
        "de": "Freunde planen eine Party für Jana. Hör gut zu.",
        "lines": [
          "Jana is going to be forty next month.",
          "Her husband Tom wants to have a surprise party for her.",
          "He invites thirty friends, but he tells them to keep it a secret.",
          "Everybody brings some food, and Tom orders a big cake.",
          "On the evening, Tom takes Jana out for a \"quiet dinner\".",
          "When they come home, the lights are off.",
          "Suddenly everybody shouts, \"Surprise!\"",
          "Jana is so happy that she cries and laughs at the same time."
        ],
        "questions": [
          {
            "q": "How old is Jana going to be?",
            "qde": "Wie alt wird Jana?",
            "options": [
              "Thirty",
              "Forty",
              "Fifty"
            ],
            "answer": 1
          },
          {
            "q": "What does Tom tell Jana?",
            "qde": "Was sagt Tom zu Jana?",
            "options": [
              "That they are going to a quiet dinner",
              "That there is a party",
              "That he is ill"
            ],
            "answer": 0
          }
        ]
      }
    },
    {
      "id": "p5",
      "title": "Vorschläge machen",
      "en": "Making suggestions",
      "goal": "Vorschläge machen und gemeinsam entscheiden",
      "tip": {
        "de": "Vorschläge: „Why don't we …?“, „How about …-ing?“, „We could …“. Zustimmen: „Good idea!“ Gegenvorschlag: „I'd rather …“ (= ich würde lieber).",
        "en": "Why don't we go for a walk?"
      },
      "repeat": [
        {
          "en": "Why don't we go for a walk?",
          "de": "Warum gehen wir nicht spazieren?"
        },
        {
          "en": "We could try the new Greek restaurant.",
          "de": "Wir könnten das neue griechische Restaurant ausprobieren."
        },
        {
          "en": "I'd rather stay in tonight.",
          "de": "Ich bleibe heute Abend lieber zu Hause."
        },
        {
          "en": "That's a good idea!",
          "de": "Das ist eine gute Idee!"
        }
      ],
      "build": [
        {
          "en": "How about going to the lake?",
          "de": "Wie wäre es, wenn wir an den See fahren?",
          "extra": [
            "go"
          ]
        },
        {
          "en": "It depends on the weather.",
          "de": "Es kommt auf das Wetter an.",
          "extra": [
            "from"
          ]
        },
        {
          "en": "I don't mind. You choose.",
          "de": "Mir ist es egal. Du entscheidest.",
          "extra": [
            "egal"
          ]
        }
      ],
      "say": [
        {
          "they": "I'm bored. What should we do today?",
          "de": "Warum fahren wir nicht an den See?",
          "answers": [
            "Why don't we go to the lake?",
            "How about going to the lake?"
          ]
        },
        {
          "they": "Hmm, it's a bit cold for the lake.",
          "de": "Dann könnten wir das neue Café in der Stadt ausprobieren.",
          "answers": [
            "Then we could try the new café in town.",
            "We could try the new café in town then."
          ]
        },
        {
          "they": "Good idea! Shall we walk or take the car?",
          "de": "Mir ist es egal. Lass uns laufen, wenn es nicht regnet.",
          "answers": [
            "I don't mind. Let's walk if it doesn't rain.",
            "I don't mind. Let's walk, if it isn't raining."
          ]
        }
      ],
      "write": {
        "de": "Ein Freund weiß nicht, was er am Samstag machen soll. Schreib ihm zwei Vorschläge.",
        "useWords": [
          "Why don't you",
          "You could",
          "How about"
        ],
        "sample": "Why don't you go to the market in the morning? You could also see a film in the evening."
      },
      "talk": {
        "they": "What would be a perfect Sunday for you?",
        "de": "Erzähl, wie dein perfekter Sonntag aussehen würde.",
        "useWords": [
          "I would",
          "sleep late",
          "have a long breakfast",
          "go for a walk"
        ],
        "sample": "I would sleep late, have a long breakfast and then go for a walk by the river."
      },
      "story": {
        "title": "Kino oder Spieleabend?",
        "de": "Drei Freunde können sich nicht entscheiden. Hör gut zu.",
        "lines": [
          "It is Friday evening, and Ben, Lisa and Max want to do something together.",
          "Ben wants to see the new action film at the cinema.",
          "Lisa says she would rather stay in, because it is raining.",
          "Max suggests a games evening at his flat.",
          "Ben says, \"Okay, but only if we can order pizza.\"",
          "They play cards and a board game until midnight.",
          "Lisa wins every game.",
          "Next Friday, they promise to go to the cinema."
        ],
        "questions": [
          {
            "q": "Why does Lisa want to stay in?",
            "qde": "Warum will Lisa zu Hause bleiben?",
            "options": [
              "She is tired.",
              "It is raining.",
              "She has no money."
            ],
            "answer": 1
          },
          {
            "q": "Who wins the games?",
            "qde": "Wer gewinnt die Spiele?",
            "options": [
              "Ben",
              "Max",
              "Lisa"
            ],
            "answer": 2
          }
        ]
      }
    }
  ]
};
