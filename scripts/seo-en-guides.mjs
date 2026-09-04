/** English search-intent guide clusters (not Chinese keyword mirrors). */
export const EN_GUIDE_CLUSTERS = [
  {
    route: 'guides/one-card-tarot',
    title: 'One Card Tarot Reading: How to Ask & Interpret',
    description:
      'A free one-card tarot ritual: clarify one question, draw upright or reversed, and turn the meaning into a next step—no account required.',
    parentName: 'Tarot Reading',
    parentHref: '/tarot',
    sections: [
      {
        heading: 'When one card is enough',
        body: 'Use a single draw when you need focus, not a full narrative. Good for “what energy am I in today?” or “what am I overlooking in this choice?”',
      },
      {
        heading: 'How to ask',
        body: 'Phrase an open question you can act on within a week. Avoid yes/no traps; prefer “what helps me handle X?” over “will X happen?”',
      },
      {
        heading: 'Upright vs reversed',
        body: 'Upright often shows the theme in clearer flow. Reversed highlights friction, delay, or an inner adjustment—not automatic bad luck.',
      },
      {
        heading: 'Turn meaning into action',
        body: 'After you read the card, write one concrete action for the next 24 hours. Fate Atelier’s single-card tool keeps upright, reversed, and advice in the browser for free.',
      },
    ],
    links: [
      ['/tarot', 'Draw one card online'],
      ['/tarot/cards', 'Browse all 78 card meanings'],
      ['/guides/three-card-spread', 'Three-card past–present–future'],
    ],
  },
  {
    route: 'guides/three-card-spread',
    title: 'Three Card Tarot Spread: Past, Present, Future',
    description:
      'Learn a simple three-card tarot spread for past–present–future storytelling, then try it free online with synthesized guidance.',
    parentName: 'Tarot Reading',
    parentHref: '/tarot',
    sections: [
      {
        heading: 'Why three cards',
        body: 'Three positions create a short timeline: what shaped the issue, what is active now, and what may unfold if you stay on the current path.',
      },
      {
        heading: 'Read as a sentence',
        body: 'Do not treat each card as a separate fortune. Link them: the past card names the pattern, the present names the pressure, the future names a likely tendency—not a fixed fate.',
      },
      {
        heading: 'Common mistakes',
        body: 'Redrawing until you like the future card empties the ritual. If the spread feels harsh, ask what boundary or conversation it is pointing to.',
      },
    ],
    links: [
      ['/tarot', 'Try a three-card spread'],
      ['/guides/one-card-tarot', 'One-card ritual'],
      ['/divination', 'Compare with a fortune stick'],
    ],
  },
  {
    route: 'guides/chinese-almanac-today',
    title: 'Chinese Almanac Today: Lunar Date, Dos & Don’ts',
    description:
      'How to read a Chinese daily almanac (huangli): lunar date, stem-branch day, solar terms, and favorable activities—as cultural timing, not rigid law.',
    parentName: 'Chinese Daily Almanac',
    parentHref: '/almanac',
    sections: [
      {
        heading: 'What “today’s almanac” usually includes',
        body: 'Gregorian and lunar dates, stem-branch markers, nearby solar terms, and lists of favorable or unfavorable activities. Hour notes are a rough filter, not a medical schedule.',
      },
      {
        heading: 'How English readers can use it',
        body: 'Treat dos/don’ts as a cultural checklist before travel, ceremonies, or meetings. If it conflicts with real constraints, prioritize safety and practicality.',
      },
      {
        heading: 'Simplified experience edition',
        body: 'Fate Atelier’s almanac uses simplified traditional rules for cultural play. See Methodology for how this differs from astronomy-grade calendars.',
      },
    ],
    links: [
      ['/almanac', 'Open today’s Chinese almanac'],
      ['/auspicious', 'Pick a favorable date'],
      ['/methodology', 'Read methodology'],
    ],
  },
  {
    route: 'guides/bazi-calculator',
    title: 'BaZi Calculator: Four Pillars Birth Chart Basics',
    description:
      'A plain-English intro to BaZi (Four Pillars): birth year, month, day, and hour stems and branches—plus how Fate Atelier’s free calculator works as a cultural experience.',
    parentName: 'BaZi',
    parentHref: '/bazi',
    sections: [
      {
        heading: 'What BaZi charts',
        body: 'BaZi maps birth time into four pillars—year, month, day, and hour—each with a heavenly stem and earthly branch. People use it to reflect on temperament patterns and timing themes.',
      },
      {
        heading: 'What you need to enter',
        body: 'A birth date and, when possible, birth hour. Hour boundaries (especially late night) can shift the hour pillar; our tool documents simplified handling.',
      },
      {
        heading: 'Not a professional verdict',
        body: 'Online calculators vary. Fate Atelier offers a free cultural experience edition—useful for learning vocabulary, not for life-critical decisions.',
      },
    ],
    links: [
      ['/bazi', 'Open the BaZi calculator'],
      ['/ziwei', 'Compare with Zi Wei charting'],
      ['/disclaimer', 'Read the disclaimer'],
    ],
  },
  {
    route: 'guides/chinese-zodiac-compatibility',
    title: 'Chinese Zodiac Compatibility: Animal Sign Chemistry',
    description:
      'Explore Chinese zodiac (shengxiao) compatibility themes between animal signs—friendship, work, and romance cues framed as cultural reflection.',
    parentName: 'Chinese Zodiac',
    parentHref: '/shengxiao',
    sections: [
      {
        heading: 'Compatibility is a conversation starter',
        body: 'Animal-sign pairs highlight traditional stories about support, tension, and humor. Use them to notice habits—not to approve or reject a relationship.',
      },
      {
        heading: 'Year vs whole person',
        body: 'Shengxiao usually follows birth year patterns. Real chemistry also includes communication, values, and context that no animal pair can score.',
      },
    ],
    links: [
      ['/shengxiao', 'Try zodiac compatibility'],
      ['/horoscope', 'Western daily horoscope'],
      ['/nametest', 'Playful name reading'],
    ],
  },
  {
    route: 'guides/fortune-stick-meaning',
    title: 'Fortune Stick Interpretation: How to Read a Lot',
    description:
      'How to interpret Chinese fortune sticks (lots): set an intention, draw once, read poem and plain meaning, then choose one practical action.',
    parentName: 'Fortune Sticks',
    parentHref: '/divination',
    sections: [
      {
        heading: 'The ritual',
        body: 'Quietly name one concern. Draw a single stick (or shake on mobile when sensors allow). Read the poem, plain paraphrase, and advice before redrawing.',
      },
      {
        heading: 'Levels are tones, not verdicts',
        body: 'Traditional lots use auspicious tiers. Treat them as emotional weather—encouragement or caution—then translate into a next step you control.',
      },
      {
        heading: 'Browse vs draw',
        body: 'You can study any of the 100 stick pages for vocabulary, or draw online for a fresh ritual. Both stay free and ad-free on Fate Atelier.',
      },
    ],
    links: [
      ['/divination', 'Draw a fortune stick'],
      ['/divination/sticks', 'Browse all 100 sticks'],
      ['/guides/one-card-tarot', 'Or try one-card tarot'],
    ],
  },
]
