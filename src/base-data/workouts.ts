import type { Workout } from '@/types'

export default <Workout[]>[
  {
    id: 1,
    name: 'Тренировка 1',
    exercises: [
      {
        id: 1,
        name: 'Упражнение 1',
        video: null,
        photoUrlList: [],
        description: null,
        difficulty: 'простое',
        sportsItems: ['скакалка'],
        tags: ['ноги'],
        unitsList: ['повторения', 'подходы'],
        goal: {
          sets: 2,
          repetitions: 20,
        },
      },
    ],
  },
  {
    id: 2,
    name: 'Тренировка 2',
    exercises: [
      {
        id: 2,
        name: 'Упражнение 2',
        video: {
          type: 'iframe',
          url: 'https://www.youtube.com/embed/FqF11YdwxrQ',
        },
        photoUrlList: [],
        description: null,
        difficulty: 'среднее',
        sportsItems: ['штанга'],
        tags: ['бицепс', '12222', '22222', '22223', '42222', '522222222', '6', '7', '8', '0'],
        unitsList: ['повторения', 'вес'],
        goal: {
          repetitions: 20,
          weightKg: 20,
        },
      },
      {
        id: 3,
        name: 'Упражнение 3',
        video: null,
        photoUrlList: [
          'https://fitnessclub24.ru/public/images/gallery/section/thumbs/0/2-3-shragi.jpg',
          'https://avatars.dzeninfra.ru/get-zen_doc/1535103/pub_64dbaa4e73f157490e767716_64dbe7e2a9216a3544dafebe/scale_1200',
        ],
        description: null,
        difficulty: 'сложное',
        sportsItems: ['гантели'],
        tags: ['спина'],
        unitsList: ['повторения', 'вес'],
        goal: {
          repetitions: 2,
          weightKg: 10,
        },
      },
      {
        id: 4,
        name: 'Случай 4',
        video: {
          type: 'iframe',
          url: 'https://rutube.ru/play/embed/348d394918bfe218476abc144918f909',
        },
        photoUrlList: [
          'https://fitnessclub24.ru/public/images/gallery/section/thumbs/0/2-3-shragi.jpg',
          'https://avatars.dzeninfra.ru/get-zen_doc/1535103/pub_64dbaa4e73f157490e767716_64dbe7e2a9216a3544dafebe/scale_1200',
        ],
        description: 'Описание 2',
        difficulty: 'простое',
        sportsItems: [],
        tags: [],
        unitsList: ['время'],
        goal: {
          time: {
            seconds: 3,
          },
        },
      },
    ],
  },
  {
    id: 3,
    name: 'Тренировка 3',
    exercises: [
      {
        id: 2,
        name: 'Упражнение 2',
        video: {
          type: 'iframe',
          url: 'https://www.youtube.com/embed/FqF11YdwxrQ',
        },
        photoUrlList: [],
        description: null,
        difficulty: 'среднее',
        sportsItems: ['штанга'],
        tags: ['бицепс', '12222', '22222', '22223', '42222', '522222222', '6', '7', '8', '0'],
        unitsList: ['повторения', 'вес'],
        goal: {
          repetitions: 20,
          weightKg: 100,
        },
      },
      {
        id: 4,
        name: 'Случай 4',
        video: {
          type: 'iframe',
          url: 'https://rutube.ru/play/embed/348d394918bfe218476abc144918f909',
        },
        photoUrlList: [
          'https://fitnessclub24.ru/public/images/gallery/section/thumbs/0/2-3-shragi.jpg',
          'https://avatars.dzeninfra.ru/get-zen_doc/1535103/pub_64dbaa4e73f157490e767716_64dbe7e2a9216a3544dafebe/scale_1200',
        ],
        description: 'Описание 2',
        difficulty: 'простое',
        sportsItems: [],
        tags: [],
        unitsList: ['время'],
        goal: {
          time: {
            seconds: 5,
          },
        },
      },
    ],
  },
]
