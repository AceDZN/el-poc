export const tools = [
  {
    type: 'function' as const,
    name: 'presentLessonWords',
    description:
      "Present lesson words to the user related to the user's interests at the beginning of the lesson",
    parameters: {
      type: 'object' as const,
      properties: {
        words: {
          type: 'array' as const,
          description: 'The list of words to present',
          items: {
            type: 'string' as const,
            description: 'The word to present',
          },
        },
      },
      required: ['words'] as const,
    },
  },
  {
    type: 'function' as const,
    name: 'presentQuiz',
    description: 'Present a quiz question to the user and wait for their answer',
    parameters: {
      type: 'object' as const,
      properties: {
        question: {
          type: 'string' as const,
          description: 'The question to ask',
        },
        options: {
          type: 'array' as const,
          description: 'The possible answers',
          items: {
            type: 'string' as const,
            description: 'A possible answer',
          },
        },
        correctAnswer: {
          type: 'string' as const,
          description: 'The correct answer',
        },
      },
      required: ['question', 'options', 'correctAnswer'] as const,
    },
  },
  {
    type: 'function' as const,
    name: 'presentCloze',
    description:
      'Present a fill-in-the-blank exercise to the user. Use ___ (three underscores) to indicate where the blank should be.',
    parameters: {
      type: 'object' as const,
      properties: {
        sentence: {
          type: 'string' as const,
          description: 'The sentence with ___ where the blank should be',
        },
        answer: {
          type: 'string' as const,
          description: 'The correct answer',
        },
        hint: {
          type: 'string' as const,
          description: 'Optional hint to help the user',
        },
      },
      required: ['sentence', 'answer'] as const,
    },
  },
  {
    type: 'function' as const,
    name: 'presentPhotoQuiz',
    description: 'Present a photo quiz to the user with image options',
    parameters: {
      type: 'object' as const,
      properties: {
        question: {
          type: 'string' as const,
          description: 'The question to ask',
        },
        options: {
          type: 'array' as const,
          description: 'The possible answers with their image search queries',
          items: {
            type: 'object' as const,
            properties: {
              text: {
                type: 'string' as const,
                description: 'The text of the option',
              },
              imageSearchQuery: {
                type: 'string' as const,
                description: 'The search query to find an image for this option',
              },
            },
            required: ['text', 'imageSearchQuery'] as const,
          },
        },
        correctAnswer: {
          type: 'string' as const,
          description: 'The correct answer (must match one of the option texts)',
        },
      },
      required: ['question', 'options', 'correctAnswer'] as const,
    },
  },
  {
    type: 'function' as const,
    name: 'presentDragTrueOrFalse',
    description: 'Present a drag and drop true/false game to the user',
    parameters: {
      type: 'object' as const,
      properties: {
        statements: {
          type: 'array' as const,
          description: 'The statements to classify as true or false',
          items: {
            type: 'object' as const,
            properties: {
              word: {
                type: 'string' as const,
                description: 'The statement text',
              },
              isTrue: {
                type: 'boolean' as const,
                description: 'Whether the statement is true or false',
              },
            },
            required: ['word', 'isTrue'] as const,
          },
        },
      },
      required: ['statements'] as const,
    },
  },
  {
    type: 'function' as const,
    name: 'presentWord',
    description:
      'You must call this tool to introduce a new word to learn with its definition and examples',
    parameters: {
      type: 'object' as const,
      properties: {
        word: {
          type: 'string' as const,
          description: 'The word to be learned',
        },
        definition: {
          type: 'string' as const,
          description: 'The definition or meaning of the word',
        },
        examples: {
          type: 'array' as const,
          description: 'Examples of how to use the word in sentences',
          items: {
            type: 'string' as const,
            description: 'An example sentence using the word',
          },
        },
      },
      required: ['word', 'definition', 'examples'] as const,
    },
  },
] as const;
