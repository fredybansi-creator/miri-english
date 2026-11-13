// Topic "Wohnen & Nachbarn" (home and neighbours) – level 2 (B1): there is/are, comparing, polite requests, already/yet.
// Same format as travel.js. After changing English sentences: run tools/make_audio.py and commit audio/.

export default {
  "id": "home",
  "title": "Wohnen & Nachbarn",
  "level": 2,
  "lessons": [
    {
      "id": "n1",
      "title": "Mein Zuhause",
      "en": "My home",
      "goal": "Deine Wohnung beschreiben (there is / there are)",
      "tip": {
        "de": "„There is“ für eines, „there are“ für mehrere: „There is a small balcony. There are two bedrooms.“ Auf Deutsch sagt man dafür oft „es gibt“ oder „wir haben“.",
        "en": "There are two bedrooms and a small balcony."
      },
      "repeat": [
        {
          "en": "I live in a flat on the third floor.",
          "de": "Ich wohne in einer Wohnung im dritten Stock."
        },
        {
          "en": "There are two bedrooms and a small balcony.",
          "de": "Es gibt zwei Schlafzimmer und einen kleinen Balkon."
        },
        {
          "en": "My favourite room is the kitchen.",
          "de": "Mein Lieblingsraum ist die Küche."
        },
        {
          "en": "It's quite small, but it's very cosy.",
          "de": "Sie ist ziemlich klein, aber sehr gemütlich."
        }
      ],
      "build": [
        {
          "en": "Is there a garden?",
          "de": "Gibt es einen Garten?",
          "extra": [
            "Gives"
          ]
        },
        {
          "en": "The living room has a big window.",
          "de": "Das Wohnzimmer hat ein großes Fenster.",
          "extra": [
            "house"
          ]
        },
        {
          "en": "We have lived here for three years.",
          "de": "Wir wohnen seit drei Jahren hier.",
          "extra": [
            "since"
          ]
        }
      ],
      "say": [
        {
          "they": "Do you live in a house or a flat?",
          "de": "In einer Wohnung, im dritten Stock.",
          "answers": [
            "In a flat, on the third floor.",
            "I live in a flat on the third floor."
          ]
        },
        {
          "they": "Is it big?",
          "de": "Nicht sehr. Es gibt zwei Schlafzimmer und einen kleinen Balkon.",
          "answers": [
            "Not very. There are two bedrooms and a small balcony.",
            "Not really. It has two bedrooms and a small balcony."
          ]
        },
        {
          "they": "How long have you lived there?",
          "de": "Seit drei Jahren. Wir mögen es sehr.",
          "answers": [
            "For three years. We really like it.",
            "We've lived there for three years. We like it a lot."
          ]
        }
      ],
      "write": {
        "de": "Beschreib dein Lieblingszimmer: was es dort gibt und warum du es magst.",
        "useWords": [
          "My favourite room is",
          "There is",
          "There are",
          "because"
        ],
        "sample": "My favourite room is the living room. There is a big sofa and there are lots of plants."
      },
      "talk": {
        "they": "What would your dream home look like?",
        "de": "Erzähl, wie dein Traumhaus aussehen würde.",
        "useWords": [
          "I would like",
          "a big garden",
          "near the sea",
          "with"
        ],
        "sample": "I would like a small house near the sea, with a big garden."
      },
      "story": {
        "title": "Die neue Wohnung",
        "de": "Kim zieht um. Hör gut zu.",
        "lines": [
          "Kim is moving to a new flat in the city centre.",
          "Her old flat was big, but it was far from her work.",
          "The new flat is smaller, but she can walk to the office.",
          "There is only one bedroom, but there is a lovely balcony.",
          "From the balcony, she can see the old church.",
          "The kitchen is very small, so she gives her big table to her brother.",
          "Her new neighbours are a young couple with a baby.",
          "They bring her a plant to say welcome."
        ],
        "questions": [
          {
            "q": "Why does Kim move?",
            "qde": "Warum zieht Kim um?",
            "options": [
              "The old flat was too small.",
              "The old flat was far from work.",
              "She wants a garden."
            ],
            "answer": 1
          },
          {
            "q": "What do the neighbours give her?",
            "qde": "Was schenken ihr die Nachbarn?",
            "options": [
              "A cake",
              "A plant",
              "A table"
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "n2",
      "title": "Vergleichen",
      "en": "Comparing things",
      "goal": "Dinge vergleichen (bigger, more expensive, the best)",
      "tip": {
        "de": "Vergleiche: kurze Wörter mit -er (bigger, cheaper), lange Wörter mit „more“ (more expensive). Danach „than“ – nicht „then“ und nicht „as“: „It's cheaper than my old flat.“",
        "en": "It's cheaper than my old flat."
      },
      "repeat": [
        {
          "en": "The new flat is bigger than the old one.",
          "de": "Die neue Wohnung ist größer als die alte."
        },
        {
          "en": "It is more expensive, but it is quieter.",
          "de": "Sie ist teurer, aber ruhiger."
        },
        {
          "en": "This is the best area in town.",
          "de": "Das ist die beste Gegend in der Stadt."
        },
        {
          "en": "Living in the city is more exciting.",
          "de": "In der Stadt zu wohnen ist spannender."
        }
      ],
      "build": [
        {
          "en": "The country is quieter than the city.",
          "de": "Auf dem Land ist es ruhiger als in der Stadt.",
          "extra": [
            "then"
          ]
        },
        {
          "en": "My street is not as busy as yours.",
          "de": "Meine Straße ist nicht so belebt wie deine.",
          "extra": [
            "like"
          ]
        },
        {
          "en": "What is the most beautiful place you know?",
          "de": "Was ist der schönste Ort, den du kennst?",
          "extra": [
            "beautifulest"
          ]
        }
      ],
      "say": [
        {
          "they": "Do you prefer the city or the country?",
          "de": "Ich wohne lieber auf dem Land. Es ist ruhiger als in der Stadt.",
          "answers": [
            "I prefer the country. It's quieter than the city.",
            "I'd rather live in the country. It's quieter than the city."
          ]
        },
        {
          "they": "But isn't the city more exciting?",
          "de": "Ja, aber auf dem Land ist es günstiger und die Luft ist besser.",
          "answers": [
            "Yes, but the country is cheaper and the air is better.",
            "Yes, but it's cheaper in the country and the air is better."
          ]
        },
        {
          "they": "And what about shops and restaurants?",
          "de": "Das stimmt, in der Stadt gibt es mehr Geschäfte.",
          "answers": [
            "That's true, there are more shops in the city.",
            "True, the city has more shops."
          ]
        }
      ],
      "write": {
        "de": "Vergleiche zwei Orte, an denen du gewohnt hast oder die du gut kennst.",
        "useWords": [
          "bigger",
          "quieter",
          "more",
          "than"
        ],
        "sample": "My town is smaller than Munich, but it is quieter and the people are friendlier."
      },
      "talk": {
        "they": "Is life better in a big city or in a small town?",
        "de": "Erzähl, wo du lieber lebst und warum.",
        "useWords": [
          "I think",
          "better",
          "cheaper",
          "more interesting"
        ],
        "sample": "I think a small town is better, because it is quieter and cheaper."
      },
      "story": {
        "title": "Stadt oder Land?",
        "de": "Zwei Schwestern vergleichen ihr Leben. Hör gut zu.",
        "lines": [
          "Eva lives in Berlin, and her sister Clara lives in a small village.",
          "Eva says her life is more exciting than Clara's.",
          "There are concerts, museums and restaurants on every street.",
          "But her flat is small and very expensive.",
          "Clara has a big house with a garden, and it is much cheaper.",
          "The village is quieter, but there is only one shop.",
          "Clara has to drive twenty minutes to the next cinema.",
          "They both agree that the best place is in the middle."
        ],
        "questions": [
          {
            "q": "What is better about Clara's life?",
            "qde": "Was ist an Claras Leben besser?",
            "options": [
              "More concerts",
              "A bigger, cheaper house",
              "More shops"
            ],
            "answer": 1
          },
          {
            "q": "How far is the next cinema from Clara?",
            "qde": "Wie weit ist das nächste Kino von Clara?",
            "options": [
              "Five minutes on foot",
              "Twenty minutes by car",
              "One hour by train"
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "n3",
      "title": "Die Nachbarn",
      "en": "The neighbours",
      "goal": "Freundlich mit Nachbarn reden und um etwas bitten",
      "tip": {
        "de": "Höflich bitten: „Could you …?“ ist freundlicher als „Can you …?“. Noch höflicher: „Would you mind …-ing?“ – Antwort „No, not at all“ heißt: Kein Problem!",
        "en": "Would you mind watering my plants?"
      },
      "repeat": [
        {
          "en": "Hi, I just moved in next door.",
          "de": "Hallo, ich bin gerade nebenan eingezogen."
        },
        {
          "en": "Could you take my parcel if I am not at home?",
          "de": "Könntest du mein Paket annehmen, wenn ich nicht zu Hause bin?"
        },
        {
          "en": "Would you mind watering my plants next week?",
          "de": "Würde es dir etwas ausmachen, nächste Woche meine Pflanzen zu gießen?"
        },
        {
          "en": "Thanks a lot, that is really kind of you.",
          "de": "Vielen Dank, das ist wirklich nett von dir."
        }
      ],
      "build": [
        {
          "en": "If you need anything, just ring the bell.",
          "de": "Wenn du etwas brauchst, klingel einfach.",
          "extra": [
            "clock"
          ]
        },
        {
          "en": "I am going on holiday for a week.",
          "de": "Ich fahre für eine Woche in den Urlaub.",
          "extra": [
            "since"
          ]
        },
        {
          "en": "Of course, no problem at all.",
          "de": "Natürlich, überhaupt kein Problem.",
          "extra": [
            "nothing"
          ]
        }
      ],
      "say": [
        {
          "they": "Hello! You're the new neighbour, right?",
          "de": "Ja, ich bin Miri. Ich bin gerade nebenan eingezogen.",
          "answers": [
            "Yes, hello! I'm Miri. I just moved in next door.",
            "Yes, hi! I'm Miri. I've just moved in next door."
          ]
        },
        {
          "they": "Welcome! How do you like it here?",
          "de": "Sehr gut, danke. Darf ich dich etwas fragen?",
          "answers": [
            "Very much, thanks. Can I ask you something?",
            "I like it a lot, thank you. Could I ask you something?"
          ]
        },
        {
          "they": "Sure, go ahead.",
          "de": "Ich fahre nächste Woche weg. Würde es dir etwas ausmachen, meine Pflanzen zu gießen?",
          "answers": [
            "I'm going away next week. Would you mind watering my plants?",
            "I'm away next week. Could you water my plants?"
          ]
        }
      ],
      "write": {
        "de": "Schreib einen kurzen Zettel für deine Nachbarn: Du machst am Samstag eine Party.",
        "useWords": [
          "Dear neighbours",
          "I'm having",
          "I'm sorry",
          "Thank you"
        ],
        "sample": "Dear neighbours, I'm having a small party on Saturday. I'm sorry if it is a bit loud. Thank you!"
      },
      "talk": {
        "they": "Do you know your neighbours well?",
        "de": "Erzähl, wie gut du deine Nachbarn kennst.",
        "useWords": [
          "I know",
          "we say hello",
          "we sometimes",
          "not very well"
        ],
        "sample": "Not very well. We say hello, and sometimes we talk in the garden."
      },
      "story": {
        "title": "Das Paket",
        "de": "Herr Weber hilft seiner Nachbarin. Hör gut zu.",
        "lines": [
          "Mrs Brown works long hours, so she is never at home in the day.",
          "One morning, a delivery driver rings her neighbour's bell.",
          "Her neighbour, Mr Weber, is retired, so he is at home.",
          "He takes the big parcel for Mrs Brown.",
          "In the evening, Mrs Brown comes to get it.",
          "The parcel is a new coffee machine.",
          "To say thank you, she invites Mr Weber for a coffee.",
          "Now they have coffee together every Sunday."
        ],
        "questions": [
          {
            "q": "Why is Mr Weber at home in the day?",
            "qde": "Warum ist Herr Weber tagsüber zu Hause?",
            "options": [
              "He is ill.",
              "He is retired.",
              "He works at home."
            ],
            "answer": 1
          },
          {
            "q": "What is in the parcel?",
            "qde": "Was ist in dem Paket?",
            "options": [
              "A coffee machine",
              "Books",
              "A lamp"
            ],
            "answer": 0
          }
        ]
      }
    },
    {
      "id": "n4",
      "title": "Wenn etwas kaputt ist",
      "en": "When something is broken",
      "goal": "Ein Problem in der Wohnung melden",
      "tip": {
        "de": "„It doesn't work“ = es funktioniert nicht. „It's leaking“ = es tropft/leckt. „Since when?“ = Seit wann? – Antwort mit „since“ + Zeitpunkt: since Monday.",
        "en": "The heating doesn't work."
      },
      "repeat": [
        {
          "en": "The heating doesn't work.",
          "de": "Die Heizung funktioniert nicht."
        },
        {
          "en": "The tap in the bathroom is leaking.",
          "de": "Der Wasserhahn im Bad tropft."
        },
        {
          "en": "When can someone come and fix it?",
          "de": "Wann kann jemand kommen und es reparieren?"
        },
        {
          "en": "It has been like this since Monday.",
          "de": "Das ist schon seit Montag so."
        }
      ],
      "build": [
        {
          "en": "The light in the hall is broken.",
          "de": "Das Licht im Flur ist kaputt.",
          "extra": [
            "broke"
          ]
        },
        {
          "en": "Can you come tomorrow morning?",
          "de": "Können Sie morgen Vormittag kommen?",
          "extra": [
            "morgen"
          ]
        },
        {
          "en": "I will be at home after four.",
          "de": "Ich bin ab vier Uhr zu Hause.",
          "extra": [
            "since"
          ]
        }
      ],
      "say": [
        {
          "they": "Hello, this is Tom from the housing company.",
          "de": "Hallo, hier ist Miri. Unsere Heizung funktioniert nicht.",
          "answers": [
            "Hello, this is Miri. Our heating doesn't work.",
            "Hi, this is Miri. Our heating isn't working."
          ]
        },
        {
          "they": "Oh no. Since when?",
          "de": "Seit Montag. Es ist sehr kalt in der Wohnung.",
          "answers": [
            "Since Monday. It's very cold in the flat.",
            "Since Monday. The flat is very cold."
          ]
        },
        {
          "they": "Someone can come on Thursday. Is that okay?",
          "de": "Geht es nicht früher? Ich bin morgen ab vier zu Hause.",
          "answers": [
            "Isn't it possible earlier? I'm at home tomorrow after four.",
            "Can't you come earlier? I'll be at home tomorrow from four."
          ]
        }
      ],
      "write": {
        "de": "Schreib eine kurze E-Mail an deinen Vermieter: Etwas ist kaputt.",
        "useWords": [
          "Dear",
          "hasn't worked",
          "since",
          "Could someone"
        ],
        "sample": "Dear Mr Smith, the shower in our bathroom hasn't worked since Friday. Could someone come this week?"
      },
      "talk": {
        "they": "Can you fix things at home yourself?",
        "de": "Erzähl, ob du Dinge selbst reparierst oder Hilfe holst.",
        "useWords": [
          "I can",
          "I'm not good at",
          "I usually call"
        ],
        "sample": "I'm not good at fixing things. I usually call my brother."
      },
      "story": {
        "title": "Eine kalte Woche",
        "de": "Bei Familie Lee ist die Heizung kaputt. Hör gut zu.",
        "lines": [
          "It is January, and the heating in the Lees' flat stops working.",
          "Mr Lee calls the landlord on Monday morning.",
          "The landlord says a repairman can come on Friday.",
          "Mr Lee says that is too late, because they have a small baby.",
          "The landlord finds another repairman for Tuesday.",
          "Until then, the family uses two small electric heaters.",
          "On Tuesday, the repairman fixes the heating in one hour.",
          "The flat is warm again, and the baby sleeps well."
        ],
        "questions": [
          {
            "q": "Why can't the family wait until Friday?",
            "qde": "Warum kann die Familie nicht bis Freitag warten?",
            "options": [
              "They are going on holiday.",
              "They have a small baby.",
              "The landlord is away."
            ],
            "answer": 1
          },
          {
            "q": "When is the heating fixed?",
            "qde": "Wann wird die Heizung repariert?",
            "options": [
              "On Monday",
              "On Tuesday",
              "On Friday"
            ],
            "answer": 1
          }
        ]
      }
    },
    {
      "id": "n5",
      "title": "Umziehen",
      "en": "Moving house",
      "goal": "Über einen Umzug sprechen (was du schon gemacht hast)",
      "tip": {
        "de": "„already“ (schon) und „yet“ (noch nicht, in Fragen: schon?) mit have + 3. Form: „I've already packed the kitchen.“ – „Have you found a flat yet?“",
        "en": "I've already packed the kitchen."
      },
      "repeat": [
        {
          "en": "I've already packed the kitchen.",
          "de": "Ich habe die Küche schon eingepackt."
        },
        {
          "en": "We haven't found a van yet.",
          "de": "Wir haben noch keinen Transporter gefunden."
        },
        {
          "en": "Can you help me carry the sofa?",
          "de": "Kannst du mir helfen, das Sofa zu tragen?"
        },
        {
          "en": "Everything is in boxes. It's chaos!",
          "de": "Alles ist in Kisten. Es ist Chaos!"
        }
      ],
      "build": [
        {
          "en": "Have you told your landlord yet?",
          "de": "Hast du es deinem Vermieter schon gesagt?",
          "extra": [
            "still"
          ]
        },
        {
          "en": "We are moving at the end of the month.",
          "de": "Wir ziehen Ende des Monats um.",
          "extra": [
            "in"
          ]
        },
        {
          "en": "I need to change my address.",
          "de": "Ich muss meine Adresse ändern.",
          "extra": [
            "adress"
          ]
        }
      ],
      "say": [
        {
          "they": "I heard you are moving! When?",
          "de": "Ja, Ende des Monats. Ich habe schon fast alles eingepackt.",
          "answers": [
            "Yes, at the end of the month. I've already packed almost everything.",
            "Yes, at the end of the month. I've packed nearly everything already."
          ]
        },
        {
          "they": "Wow, you are fast! Do you need any help?",
          "de": "Ja, bitte! Kannst du mir am Samstag helfen, das Sofa zu tragen?",
          "answers": [
            "Yes, please! Can you help me carry the sofa on Saturday?",
            "Yes, please! Could you help me carry the sofa on Saturday?"
          ]
        },
        {
          "they": "Sure. Have you found a van yet?",
          "de": "Noch nicht. Ich rufe morgen ein paar Firmen an.",
          "answers": [
            "Not yet. I'll call a few companies tomorrow.",
            "Not yet. I'm going to call some companies tomorrow."
          ]
        }
      ],
      "write": {
        "de": "Schreib einer Freundin, was du für den Umzug schon gemacht hast und was noch nicht.",
        "useWords": [
          "I've already",
          "I haven't",
          "yet"
        ],
        "sample": "I've already packed my books, but I haven't found a van yet."
      },
      "talk": {
        "they": "Have you moved house many times?",
        "de": "Erzähl, wie oft du schon umgezogen bist und wie es war.",
        "useWords": [
          "I've moved",
          "times",
          "the last time",
          "it was"
        ],
        "sample": "I've moved four times. The last time was very stressful, but my friends helped me."
      },
      "story": {
        "title": "Der Umzugstag",
        "de": "Ben zieht um. Hör gut zu.",
        "lines": [
          "It is Ben's moving day, and it is raining.",
          "Four friends come to help him at eight in the morning.",
          "The new flat is on the fifth floor, and there is no lift.",
          "They carry fifty boxes up the stairs.",
          "The sofa is too big for the door, so they take the legs off.",
          "At three o'clock, everything is in the new flat.",
          "Ben orders pizza for everybody to say thank you.",
          "They eat it on the floor, because the table is still in pieces."
        ],
        "questions": [
          {
            "q": "What is the problem with the new flat?",
            "qde": "Was ist das Problem mit der neuen Wohnung?",
            "options": [
              "It is too small.",
              "There is no lift.",
              "It is far away."
            ],
            "answer": 1
          },
          {
            "q": "Why do they eat on the floor?",
            "qde": "Warum essen sie auf dem Boden?",
            "options": [
              "The table is still in pieces.",
              "They like it.",
              "There are no chairs."
            ],
            "answer": 0
          }
        ]
      }
    }
  ]
};
