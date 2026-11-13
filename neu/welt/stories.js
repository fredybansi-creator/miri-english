// Ralucas Welt: Olli's story of the day. Every day a new short story (easy English, A1–A2), first only to listen to;
// then one question with three answers. The stories follow each other, each ends with a little "what happens tomorrow?".
// After changing English lines: run tools/make_audio.py and commit audio/.

export default {
  stories: [
    {
      title: 'A new morning', de: 'Ein neuer Morgen',
      en: ['It is early in the morning.', 'Raluca opens her eyes in the den.', 'The sun is warm and the birds are singing.', 'She is hungry, so she goes outside to look for food.'],
      tr: ['Es ist früh am Morgen.', 'Raluca öffnet im Bau die Augen.', 'Die Sonne ist warm und die Vögel singen.', 'Sie hat Hunger, also geht sie hinaus, um Futter zu suchen.'],
      q: 'Why does Raluca go outside?', options: ['She is hungry.', 'She is tired.', 'She is cold.'], right: 0,
    },
    {
      title: "Olli's lost glasses", de: 'Ollis verlorene Brille',
      en: ['Olli the owl is very sad today.', 'He cannot find his glasses.', 'Without his glasses, he cannot read his book.', 'Raluca looks under the big oak tree, and there they are!'],
      tr: ['Olli, die Eule, ist heute sehr traurig.', 'Er kann seine Brille nicht finden.', 'Ohne Brille kann er sein Buch nicht lesen.', 'Raluca schaut unter der großen Eiche nach – und da ist sie!'],
      q: 'Where are the glasses?', options: ['In the pond.', 'Under the big oak tree.', 'In the den.'], right: 1,
    },
    {
      title: 'The rainy day', de: 'Der Regentag',
      en: ['Today it is raining all day.', 'Rosie the rabbit is wet and cold.', 'Raluca says: "Come into my den. It is dry and warm."', 'They drink warm tea and tell stories.'],
      tr: ['Heute regnet es den ganzen Tag.', 'Rosie, das Kaninchen, ist nass und friert.', 'Raluca sagt: „Komm in meinen Bau. Da ist es trocken und warm.“', 'Sie trinken warmen Tee und erzählen Geschichten.'],
      q: 'What is the weather like?', options: ['It is sunny.', 'It is snowing.', 'It is raining.'], right: 2,
    },
    {
      title: "Hugo's birthday", de: 'Hugos Geburtstag',
      en: ['Today is Hugo\'s birthday.', 'He is five years old.', 'All the animals bring him a present.', 'Raluca gives him a big red apple, and Hugo is very happy.'],
      tr: ['Heute hat Hugo Geburtstag.', 'Er wird fünf Jahre alt.', 'Alle Tiere bringen ihm ein Geschenk.', 'Raluca schenkt ihm einen großen roten Apfel, und Hugo freut sich sehr.'],
      q: 'How old is Hugo?', options: ['Three years old.', 'Five years old.', 'Ten years old.'], right: 1,
    },
    {
      title: 'Storm is afraid', de: 'Storm hat Angst',
      en: ['Storm the wolf is big and strong.', 'But tonight there is thunder, and Storm is afraid.', 'Raluca sits next to him.', '"Don\'t worry," she says. "The thunder can\'t hurt you."'],
      tr: ['Storm, der Wolf, ist groß und stark.', 'Aber heute Nacht donnert es, und Storm hat Angst.', 'Raluca setzt sich neben ihn.', '„Keine Sorge“, sagt sie. „Der Donner kann dir nichts tun.“'],
      q: 'Why is Storm afraid?', options: ['Because of the thunder.', 'Because he is hungry.', 'Because he is lost.'], right: 0,
    },
    {
      title: 'A letter for Luna', de: 'Ein Brief für Luna',
      en: ['Luna lives on the hill.', 'She wants to send a letter to her sister in the city.', 'But owls in the city are very busy.', 'Raluca helps her write: "Dear sister, I miss you. Please visit me soon."'],
      tr: ['Luna wohnt auf dem Hügel.', 'Sie möchte ihrer Schwester in der Stadt einen Brief schicken.', 'Aber Eulen in der Stadt haben sehr viel zu tun.', 'Raluca hilft ihr beim Schreiben: „Liebe Schwester, ich vermisse dich. Bitte besuch mich bald.“'],
      q: 'Who is the letter for?', options: ["Luna's brother.", "Luna's mother.", "Luna's sister."], right: 2,
    },
    {
      title: 'The fishing contest', de: 'Der Angelwettbewerb',
      en: ['Today there is a fishing contest at the big pond.', 'Finn catches two fish.', 'Raluca catches three fish.', 'Finn laughs and says: "You are the winner!"'],
      tr: ['Heute gibt es einen Angelwettbewerb am großen Teich.', 'Finn fängt zwei Fische.', 'Raluca fängt drei Fische.', 'Finn lacht und sagt: „Du hast gewonnen!“'],
      q: 'How many fish does Raluca catch?', options: ['Two.', 'Three.', 'Four.'], right: 1,
    },
    {
      title: 'Pip goes shopping', de: 'Pip geht einkaufen',
      en: ['Pip\'s shop is almost empty.', 'He needs carrots, apples and honey.', 'Raluca goes with him to the farm.', 'The farmer says: "That is twelve coins, please."'],
      tr: ['Pips Laden ist fast leer.', 'Er braucht Karotten, Äpfel und Honig.', 'Raluca geht mit ihm zum Bauernhof.', 'Der Bauer sagt: „Das macht zwölf Münzen, bitte.“'],
      q: 'What does Pip NOT need?', options: ['Carrots.', 'Honey.', 'Fish.'], right: 2,
    },
    {
      title: 'The cubs are bored', de: 'Die Kleinen langweilen sich',
      en: ['Mia, Leo and Kiki are bored.', '"Mum, what can we do?" they ask.', 'Raluca says: "Let\'s play hide and seek!"', 'Leo hides behind a bush, but his tail is too long.'],
      tr: ['Mia, Leo und Kiki ist langweilig.', '„Mama, was können wir machen?“, fragen sie.', 'Raluca sagt: „Lasst uns Verstecken spielen!“', 'Leo versteckt sich hinter einem Busch, aber sein Schwanz ist zu lang.'],
      q: 'What game do they play?', options: ['Hide and seek.', 'Football.', 'Cards.'], right: 0,
    },
    {
      title: 'A visitor from the north', de: 'Besuch aus dem Norden',
      en: ['A white fox comes to the meadow.', 'His name is Nils, and he comes from the cold north.', 'He has never seen a green forest before.', '"Everything is so green here!" he says.'],
      tr: ['Ein weißer Fuchs kommt auf die Wiese.', 'Er heißt Nils und kommt aus dem kalten Norden.', 'Er hat noch nie einen grünen Wald gesehen.', '„Hier ist alles so grün!“, sagt er.'],
      q: 'Where does Nils come from?', options: ['From the south.', 'From the north.', 'From the city.'], right: 1,
    },
    {
      title: 'The lost crystal', de: 'Der verlorene Kristall',
      en: ['Luna had a beautiful crystal, but now it is gone.', 'Raluca follows little footprints in the sand.', 'They lead to a magpie\'s nest.', 'The magpie says sorry and gives the crystal back.'],
      tr: ['Luna hatte einen wunderschönen Kristall, aber jetzt ist er weg.', 'Raluca folgt kleinen Fußspuren im Sand.', 'Sie führen zum Nest einer Elster.', 'Die Elster entschuldigt sich und gibt den Kristall zurück.'],
      q: 'Who took the crystal?', options: ['A magpie.', 'A mouse.', 'Storm.'], right: 0,
    },
    {
      title: 'Cooking with Finn', de: 'Kochen mit Finn',
      en: ['Finn wants to make dinner for the family.', 'He makes a soup with mushrooms and berries.', 'Kiki tastes it and makes a funny face.', '"Maybe a little less salt next time," says Raluca.'],
      tr: ['Finn möchte für die Familie Abendessen machen.', 'Er kocht eine Suppe mit Pilzen und Beeren.', 'Kiki probiert und macht ein lustiges Gesicht.', '„Vielleicht nächstes Mal etwas weniger Salz“, sagt Raluca.'],
      q: 'What is in the soup?', options: ['Fish and carrots.', 'Mushrooms and berries.', 'Apples and honey.'], right: 1,
    },
    {
      title: 'The first snow', de: 'Der erste Schnee',
      en: ['One morning, everything is white.', 'It is the first snow of the year.', 'The cubs run outside and make tracks in the snow.', 'Raluca says: "Put on your scarf, it is cold!"'],
      tr: ['Eines Morgens ist alles weiß.', 'Es ist der erste Schnee des Jahres.', 'Die Kleinen rennen hinaus und machen Spuren in den Schnee.', 'Raluca sagt: „Zieh deinen Schal an, es ist kalt!“'],
      q: 'What should the cubs put on?', options: ['A hat.', 'Their boots.', 'A scarf.'], right: 2,
    },
    {
      title: 'A party at the den', de: 'Ein Fest am Bau',
      en: ['Tonight there is a big party at the den.', 'All the friends come: Olli, Rosie, Hugo, Storm, Luna and Pip.', 'They eat, sing and dance under the stars.', 'Raluca says: "Thank you for being my friends."'],
      tr: ['Heute Abend gibt es ein großes Fest am Bau.', 'Alle Freunde kommen: Olli, Rosie, Hugo, Storm, Luna und Pip.', 'Sie essen, singen und tanzen unter den Sternen.', 'Raluca sagt: „Danke, dass ihr meine Freunde seid.“'],
      q: 'When is the party?', options: ['In the morning.', 'At lunchtime.', 'In the evening.'], right: 2,
    },
  ],
};
