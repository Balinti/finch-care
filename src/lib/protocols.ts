// Co-Regulation Mode Protocols

export interface Protocol {
  id: string
  name: string
  description: string
  duration: string
  type: 'breathing' | 'grounding' | 'cognitive' | 'rest'
}

export const protocols: Protocol[] = [
  {
    id: 'panic-breathing',
    name: 'Panic Reset Breathing',
    description: 'Paced breathing to calm your nervous system',
    duration: '60-120 seconds',
    type: 'breathing'
  },
  {
    id: '5-4-3-2-1',
    name: 'Grounding 5-4-3-2-1',
    description: 'Use your senses to anchor to the present moment',
    duration: '2-3 minutes',
    type: 'grounding'
  },
  {
    id: 'defusion',
    name: 'Cognitive Defusion',
    description: 'Create distance from anxious thoughts',
    duration: '2-3 minutes',
    type: 'cognitive'
  },
  {
    id: 'worry-postpone',
    name: 'Worry Postponement',
    description: 'Schedule a time to address your worries later',
    duration: '1 minute',
    type: 'cognitive'
  },
  {
    id: 'rest',
    name: 'Rest Protocol',
    description: 'Permission to do nothing - smallest next step suggestions',
    duration: 'As needed',
    type: 'rest'
  }
]

export const breathingPatterns = {
  '4-7-8': {
    name: '4-7-8 Breathing',
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 4
  },
  'box': {
    name: 'Box Breathing',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    cycles: 4
  },
  'calm': {
    name: 'Calming Breath',
    inhale: 4,
    hold: 0,
    exhale: 6,
    cycles: 6
  }
}

export const groundingPrompts = {
  see: [
    'What colors can you see around you?',
    'Find something blue in your environment',
    'Notice the light and shadows nearby',
    'What is the smallest thing you can see?',
    'Look at something you find beautiful'
  ],
  touch: [
    'Feel the texture of what you\'re sitting on',
    'Notice the temperature of the air on your skin',
    'Feel your feet on the ground',
    'Touch something soft nearby'
  ],
  hear: [
    'What\'s the quietest sound you can hear?',
    'Listen for sounds in the distance',
    'Notice any rhythmic sounds nearby'
  ],
  smell: [
    'Can you detect any scents in the air?',
    'Take a deep breath - what do you notice?'
  ],
  taste: [
    'What\'s the current taste in your mouth?',
    'Run your tongue over your teeth - what do you notice?'
  ]
}

export const defusionThoughts = [
  {
    thought: 'I can\'t handle this',
    reframes: [
      'I\'m having the thought that I can\'t handle this',
      'My mind is telling me I can\'t handle this',
      'This is an anxious prediction, not a fact'
    ]
  },
  {
    thought: 'Something bad will happen',
    reframes: [
      'I notice I\'m predicting something bad',
      'My worry brain is active right now',
      'This is anxiety talking, not reality'
    ]
  },
  {
    thought: 'Everyone is judging me',
    reframes: [
      'I\'m having the thought that everyone is judging me',
      'My mind is mind-reading right now',
      'I don\'t actually know what others are thinking'
    ]
  },
  {
    thought: 'I\'m going to panic',
    reframes: [
      'I notice fear about panicking',
      'Panic is uncomfortable but not dangerous',
      'This feeling will pass like they always do'
    ]
  }
]

export const restSuggestions = [
  'Doing nothing is allowed and sometimes necessary',
  'Your only job right now is to exist',
  'Can you take one slow breath?',
  'It\'s okay to sit with this feeling',
  'You don\'t have to fix anything right now',
  'Sometimes the smallest step is just staying present',
  'Rest is not laziness - it\'s recovery',
  'What would feel 1% easier right now?'
]

export const symptomTags = [
  'Racing heart',
  'Shortness of breath',
  'Chest tightness',
  'Dizziness',
  'Nausea',
  'Trembling',
  'Sweating',
  'Feeling detached',
  'Racing thoughts',
  'Difficulty concentrating',
  'Muscle tension',
  'Sleep difficulties'
]
