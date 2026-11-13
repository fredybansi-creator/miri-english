// Topic "Meinungen & Gefühle" (opinions and feelings) – level 2 (B1): giving reasons, agreeing, -ed/-ing, advice, first conditional.
// Same format as travel.js. After changing English sentences: run tools/make_audio.py and commit audio/.

export default {
  "id": "opinions",
  "title": "Meinungen & Gefühle",
  "level": 2,
  "lessons": [
    {
      "id": "o1",
      "title": "Was denkst du?",
      "en": "What do you think?",
      "goal": "Deine Meinung sagen und begründen",
      "tip": {
        "de": "Meinung + Grund: „I think … because …“. Nach „because“ kommt ein ganzer Satz mit normaler Wortstellung: „because it is cheaper“ – nicht „because it cheaper is“.",
        "en": "I think it's a good idea, because it saves time."
      },
      "repeat": [
        {
          "en": "I think it's a good idea.",
          "de": "Ich finde, das ist eine gute Idee."
        },
        {
          "en": "I'm not sure about that.",
          "de": "Da bin ich mir nicht sicher."
        },
        {
          "en": "In my opinion, it is too expensive.",
          "de": "Meiner Meinung nach ist es zu teuer."
        },
        {
          "en": "What do you think?",
          "de": "Was denkst du?"
        }
      ],
      "build": [
        {
          "en": "I don't think it is a good idea.",
          "de": "Ich glaube nicht, dass es eine gute Idee ist.",
          "extra": [
            "not"
          ]
        },
        {
          "en": "I like it, because it is simple.",
          "de": "Ich mag es, weil es einfach ist.",
          "extra": [
            "simply"
          ]
        },
        {
          "en": "What is your opinion?",
          "de": "Was ist deine Meinung?",
          "extra": [
            "meaning"
          ]
        }
      ],
      "say": [
        {
          "they": "Do you like the new café in town?",
          "de": "Ich finde es toll, weil der Kaffee wirklich gut ist.",
          "answers": [
            "I think it's great, because the coffee is really good.",
            "I love it, because the coffee is really good."
          ]
        },
        {
          "they": "Really? I think it's too expensive.",
          "de": "Da bin ich mir nicht sicher. Der Kuchen ist günstig.",
          "answers": [
            "I'm not sure about that. The cake is cheap.",
            "I'm not so sure. The cake isn't expensive."
          ]
        },
        {
          "they": "Hmm, maybe. Shall we go there on Saturday?",
          "de": "Gute Idee! Was denkst du, um zehn?",
          "answers": [
            "Good idea! What do you think, at ten?",
            "Great idea! How about ten?"
          ]
        }
      ],
      "write": {
        "de": "Schreib deine Meinung zu Handys beim Essen – und einen Grund.",
        "useWords": [
          "I think",
          "because",
          "I don't like it when"
        ],
        "sample": "I think phones should stay in your bag at dinner, because it's nicer to talk."
      },
      "talk": {
        "they": "What do you think about learning a language with an app?",
        "de": "Sag deine Meinung zum Sprachenlernen mit einer App – mit Grund.",
        "useWords": [
          "I think",
          "because",
          "every day",
          "but"
        ],
        "sample": "I think it helps, because I can practise every day. But I also need real conversations."
      },
      "story": {
        "title": "Das neue Schwimmbad",
        "de": "Eine Stadt diskutiert. Hör gut zu.",
        "lines": [
          "The town wants to build a new swimming pool.",
          "Many families think it is a great idea.",
          "There is no pool in the town, so children have to take the bus to the next town.",
          "But some people are not sure about it.",
          "They think it is too expensive, and the town needs a new school first.",
          "At a meeting, everybody gives their opinion.",
          "In the end, they decide to build the school first.",
          "The pool will come two years later."
        ],
        "questions": [
          {
            "q": "Why do families want a pool?",
            "qde": "Warum wollen die Familien ein Schwimmbad?",
            "options": [
              "The old one is dirty.",
              "There is no pool in the town.",
              "They want to win prizes."
            ],
            "answer": 1
          },
          {
            "q": "What will the town build first?",
            "qde": "Was baut die Stadt zuerst?",
            "options": [
              "The pool",
              "A school",
              "A bus station"
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "o2",
      "title": "Zustimmen und widersprechen",
      "en": "Agreeing and disagreeing",
      "goal": "Höflich zustimmen oder anderer Meinung sein",
      "tip": {
        "de": "Zustimmen: „I agree.“ – nicht „I am agree“! Widersprechen, aber freundlich: „I see what you mean, but …“ (Ich verstehe dich, aber …).",
        "en": "I see what you mean, but I don't agree."
      },
      "repeat": [
        {
          "en": "I totally agree with you.",
          "de": "Da stimme ich dir völlig zu."
        },
        {
          "en": "I see what you mean, but I don't agree.",
          "de": "Ich verstehe, was du meinst, aber ich sehe das anders."
        },
        {
          "en": "That's true.",
          "de": "Das stimmt."
        },
        {
          "en": "I'm not so sure.",
          "de": "Ich bin mir da nicht so sicher."
        }
      ],
      "build": [
        {
          "en": "I agree with you about the film.",
          "de": "Was den Film angeht, stimme ich dir zu.",
          "extra": [
            "am"
          ]
        },
        {
          "en": "You are right, it was too long.",
          "de": "Du hast recht, er war zu lang.",
          "extra": [
            "have"
          ]
        },
        {
          "en": "I have a different opinion.",
          "de": "Ich habe eine andere Meinung.",
          "extra": [
            "other"
          ]
        }
      ],
      "say": [
        {
          "they": "That film was so boring!",
          "de": "Ich verstehe, was du meinst, aber mir hat das Ende gefallen.",
          "answers": [
            "I see what you mean, but I liked the end.",
            "I know what you mean, but I liked the ending."
          ]
        },
        {
          "they": "The end? It was much too long!",
          "de": "Das stimmt, er war zu lang.",
          "answers": [
            "That's true, it was too long.",
            "You're right, it was too long."
          ]
        },
        {
          "they": "Next time I'm choosing the film.",
          "de": "Einverstanden! Du hast einen besseren Geschmack.",
          "answers": [
            "Agreed! You have better taste.",
            "Okay! You have better taste than me."
          ]
        }
      ],
      "write": {
        "de": "Ein Freund sagt: „Summer is the best season.“ Schreib, ob du zustimmst und warum.",
        "useWords": [
          "I agree",
          "I don't agree",
          "because",
          "I prefer"
        ],
        "sample": "I don't agree. Summer is too hot for me. I prefer autumn, because the colours are beautiful."
      },
      "talk": {
        "they": "Is it better to live alone or with other people?",
        "de": "Sag deine Meinung und begründe sie.",
        "useWords": [
          "I think",
          "better",
          "because",
          "on the other hand"
        ],
        "sample": "I think it is better to live with other people, because you are not alone. On the other hand, you have less space."
      },
      "story": {
        "title": "Der Streit ums Auto",
        "de": "Ein Paar ist sich nicht einig. Hör gut zu.",
        "lines": [
          "Max and Julia want to buy a new car.",
          "Max wants a big car, because they often go on holiday with the bikes.",
          "Julia does not agree. She thinks a small car is better for the city.",
          "Max says, \"I see what you mean, but where do we put the bikes?\"",
          "Julia says they can put the bikes on the roof.",
          "Max thinks that is a good idea.",
          "In the end, they buy a small electric car.",
          "Max is happy, because it is very quiet and fast."
        ],
        "questions": [
          {
            "q": "Why does Julia want a small car?",
            "qde": "Warum will Julia ein kleines Auto?",
            "options": [
              "It is cheaper.",
              "It is better for the city.",
              "She can't drive a big car."
            ],
            "answer": 1
          },
          {
            "q": "Where can they put the bikes?",
            "qde": "Wohin können sie die Räder tun?",
            "options": [
              "In the car",
              "On the roof",
              "In the garden"
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "o3",
      "title": "Wie fühlst du dich?",
      "en": "How do you feel?",
      "goal": "Gefühle genauer beschreiben",
      "tip": {
        "de": "Gefühle mit -ed beschreiben, wie DU dich fühlst: „I'm bored / tired / interested.“ Mit -ing beschreibst du die Sache: „The film is boring.“ Also nie „I am boring“ sagen – das heißt „Ich bin langweilig“!",
        "en": "I'm bored, because the film is boring."
      },
      "repeat": [
        {
          "en": "I'm really excited about the trip.",
          "de": "Ich freue mich sehr auf die Reise."
        },
        {
          "en": "I'm a bit worried about my mum.",
          "de": "Ich mache mir ein bisschen Sorgen um meine Mutter."
        },
        {
          "en": "I was so surprised!",
          "de": "Ich war so überrascht!"
        },
        {
          "en": "I'm tired, but happy.",
          "de": "Ich bin müde, aber glücklich."
        }
      ],
      "build": [
        {
          "en": "The film was really boring.",
          "de": "Der Film war wirklich langweilig.",
          "extra": [
            "bored"
          ]
        },
        {
          "en": "I'm interested in history.",
          "de": "Ich interessiere mich für Geschichte.",
          "extra": [
            "interesting"
          ]
        },
        {
          "en": "She feels nervous before the exam.",
          "de": "Sie ist vor der Prüfung nervös.",
          "extra": [
            "feel"
          ]
        }
      ],
      "say": [
        {
          "they": "You look happy today!",
          "de": "Ja, ich freue mich so auf unsere Reise nach Spanien!",
          "answers": [
            "Yes, I'm so excited about our trip to Spain!",
            "Yes, I'm really looking forward to our trip to Spain!"
          ]
        },
        {
          "they": "When are you going?",
          "de": "Nächste Woche. Aber ich mache mir ein bisschen Sorgen wegen des Fliegens.",
          "answers": [
            "Next week. But I'm a bit worried about flying.",
            "Next week. But I'm a little nervous about flying."
          ]
        },
        {
          "they": "Don't worry, it's very safe.",
          "de": "Ich weiß. Ich bin trotzdem ein bisschen nervös.",
          "answers": [
            "I know. I'm still a bit nervous.",
            "I know. But I'm still a little nervous."
          ]
        }
      ],
      "write": {
        "de": "Schreib, wie du dich heute fühlst und warum.",
        "useWords": [
          "I'm",
          "because",
          "a bit",
          "really"
        ],
        "sample": "I'm a bit tired today, because I slept badly. But I'm happy, because it's Friday."
      },
      "talk": {
        "they": "What makes you really happy?",
        "de": "Erzähl, was dich richtig glücklich macht.",
        "useWords": [
          "I feel happy when",
          "it makes me",
          "for example"
        ],
        "sample": "I feel happy when I spend time with my family, for example on long Sunday walks."
      },
      "story": {
        "title": "Die erste Prüfung",
        "de": "Mira macht ihre Führerscheinprüfung. Hör gut zu.",
        "lines": [
          "Mira is thirty-five, and today is her driving test.",
          "She is very nervous, and she didn't sleep well.",
          "Her husband says, \"Don't worry, you are a good driver.\"",
          "The examiner is a friendly older man.",
          "At first, Mira's hands are shaking.",
          "But after ten minutes, she feels more relaxed.",
          "At the end, the examiner smiles and says, \"You passed!\"",
          "Mira is so surprised and happy that she hugs him."
        ],
        "questions": [
          {
            "q": "How does Mira feel before the test?",
            "qde": "Wie fühlt sich Mira vor der Prüfung?",
            "options": [
              "Bored",
              "Very nervous",
              "Angry"
            ],
            "answer": 1
          },
          {
            "q": "What does Mira do at the end?",
            "qde": "Was macht Mira am Ende?",
            "options": [
              "She cries.",
              "She hugs the examiner.",
              "She calls her mother."
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "o4",
      "title": "Ratschläge geben",
      "en": "Giving advice",
      "goal": "Einer Freundin einen Rat geben (should, could, if I were you)",
      "tip": {
        "de": "Rat geben: „You should …“ (du solltest), „You could …“ (du könntest), „If I were you, I would …“ (an deiner Stelle würde ich …).",
        "en": "If I were you, I would talk to her."
      },
      "repeat": [
        {
          "en": "You should talk to her.",
          "de": "Du solltest mit ihr reden."
        },
        {
          "en": "Maybe you could ask your boss.",
          "de": "Vielleicht könntest du deinen Chef fragen."
        },
        {
          "en": "If I were you, I would wait.",
          "de": "An deiner Stelle würde ich warten."
        },
        {
          "en": "You shouldn't worry so much.",
          "de": "Du solltest dir nicht so viele Sorgen machen."
        }
      ],
      "build": [
        {
          "en": "What should I do?",
          "de": "Was soll ich tun?",
          "extra": [
            "doing"
          ]
        },
        {
          "en": "You should get more sleep.",
          "de": "Du solltest mehr schlafen.",
          "extra": [
            "much"
          ]
        },
        {
          "en": "Why don't you take a day off?",
          "de": "Warum nimmst du dir nicht einen Tag frei?",
          "extra": [
            "free"
          ]
        }
      ],
      "say": [
        {
          "they": "I'm so tired all the time.",
          "de": "Du solltest früher ins Bett gehen.",
          "answers": [
            "You should go to bed earlier.",
            "You should go to sleep earlier."
          ]
        },
        {
          "they": "But I have so much work.",
          "de": "Vielleicht könntest du deinen Chef um Hilfe bitten.",
          "answers": [
            "Maybe you could ask your boss for help.",
            "Perhaps you could ask your boss for help."
          ]
        },
        {
          "they": "I don't know. He is always so busy.",
          "de": "An deiner Stelle würde ich es trotzdem versuchen.",
          "answers": [
            "If I were you, I would try anyway.",
            "If I were you, I'd still try."
          ]
        }
      ],
      "write": {
        "de": "Eine Freundin schreibt: „I want to learn English, but I have no time.“ Schreib ihr zwei Ratschläge.",
        "useWords": [
          "You should",
          "You could",
          "every day"
        ],
        "sample": "You should learn ten minutes every day. You could also listen to English podcasts in the car."
      },
      "talk": {
        "they": "What's the best advice anyone ever gave you?",
        "de": "Erzähl vom besten Rat, den du je bekommen hast.",
        "useWords": [
          "The best advice was",
          "my mother told me",
          "it helped me"
        ],
        "sample": "My mother told me: \"Don't worry about small things.\" It helped me a lot."
      },
      "story": {
        "title": "Ein guter Rat",
        "de": "Tim braucht einen Rat. Hör gut zu.",
        "lines": [
          "Tim has a new job, but he is not happy.",
          "His colleagues are nice, but the work is boring.",
          "He asks his friend Clara what he should do.",
          "Clara says, \"You shouldn't leave too quickly.\"",
          "She thinks he should talk to his boss about more interesting work.",
          "Tim is nervous, but he talks to his boss the next day.",
          "His boss gives him a new project with a small team.",
          "Now Tim enjoys his job much more."
        ],
        "questions": [
          {
            "q": "What is the problem with Tim's job?",
            "qde": "Was ist das Problem mit Tims Job?",
            "options": [
              "His colleagues are unfriendly.",
              "The work is boring.",
              "It is far away."
            ],
            "answer": 1
          },
          {
            "q": "What does Clara tell him to do?",
            "qde": "Was rät ihm Clara?",
            "options": [
              "Leave the job",
              "Talk to his boss",
              "Take a holiday"
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "o5",
      "title": "Wenn …, dann …",
      "en": "If …, then …",
      "goal": "Über mögliche Folgen sprechen (if + will)",
      "tip": {
        "de": "„If“-Sätze für die Zukunft: Im if-Teil steht die Gegenwart, im anderen „will“: „If it rains, we'll stay at home.“ – nicht „If it will rain“.",
        "en": "If it rains, we'll stay at home."
      },
      "repeat": [
        {
          "en": "If it rains, we'll stay at home.",
          "de": "Wenn es regnet, bleiben wir zu Hause."
        },
        {
          "en": "If you're hungry, I'll make something.",
          "de": "Wenn du Hunger hast, mache ich dir etwas."
        },
        {
          "en": "I'll call you if I'm late.",
          "de": "Ich rufe dich an, wenn ich mich verspäte."
        },
        {
          "en": "If we leave now, we'll catch the train.",
          "de": "Wenn wir jetzt losgehen, erwischen wir den Zug."
        }
      ],
      "build": [
        {
          "en": "If you need help, just ask me.",
          "de": "Wenn du Hilfe brauchst, frag mich einfach.",
          "extra": [
            "will"
          ]
        },
        {
          "en": "What will you do if it snows?",
          "de": "Was machst du, wenn es schneit?",
          "extra": [
            "snow"
          ]
        },
        {
          "en": "If I have time, I'll visit you.",
          "de": "Wenn ich Zeit habe, besuche ich dich.",
          "extra": [
            "will"
          ]
        }
      ],
      "say": [
        {
          "they": "Are we still going hiking tomorrow?",
          "de": "Ja, aber wenn es regnet, bleiben wir zu Hause.",
          "answers": [
            "Yes, but if it rains, we'll stay at home.",
            "Yes, but if it rains, we'll stay home."
          ]
        },
        {
          "they": "Okay. What will we do at home?",
          "de": "Wenn wir zu Hause bleiben, koche ich etwas Schönes.",
          "answers": [
            "If we stay at home, I'll cook something nice.",
            "If we stay home, I'll make something nice."
          ]
        },
        {
          "they": "Sounds good! What time should I come?",
          "de": "Um neun. Ich rufe dich an, wenn sich etwas ändert.",
          "answers": [
            "At nine. I'll call you if something changes.",
            "At nine. I'll call you if anything changes."
          ]
        }
      ],
      "write": {
        "de": "Schreib zwei Sätze mit „if“ über dein Wochenende.",
        "useWords": [
          "If",
          "I'll",
          "we will"
        ],
        "sample": "If the weather is nice, I'll go to the lake. If it rains, I'll read a book."
      },
      "talk": {
        "they": "What will you do if you have a free day next week?",
        "de": "Erzähl, was du machst, wenn du nächste Woche einen freien Tag hast.",
        "useWords": [
          "If I have",
          "I'll",
          "maybe"
        ],
        "sample": "If I have a free day, I'll sleep late and maybe go to a museum."
      },
      "story": {
        "title": "Der Plan B",
        "de": "Eine Familie plant einen Ausflug. Hör gut zu.",
        "lines": [
          "The Becker family wants to go to the zoo on Saturday.",
          "But the weather report says it might rain.",
          "The mother says, \"If it rains, we'll go to the museum instead.\"",
          "The children are not happy. They want to see the elephants.",
          "On Saturday morning, the sky is grey.",
          "At ten o'clock, the sun comes out.",
          "So they go to the zoo after all.",
          "They see the elephants, and it does not rain all day."
        ],
        "questions": [
          {
            "q": "What is the family's plan B?",
            "qde": "Was ist der Plan B der Familie?",
            "options": [
              "The cinema",
              "The museum",
              "Staying at home"
            ],
            "answer": 1
          },
          {
            "q": "Where do they go in the end?",
            "qde": "Wohin gehen sie am Ende?",
            "options": [
              "To the zoo",
              "To the museum",
              "Nowhere"
            ],
            "answer": 0
          }
        ]
      }
    }
  ]
};
