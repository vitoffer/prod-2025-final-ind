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
        description: 'Описание 1',
        difficulty: 'простое',
        sportsItems: ['скакалка'],
        tags: ['ноги'],
        units: ['мин'],
        goal: {
          time: 4,
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
          url: 'https://rutube.ru/play/embed/348d394918bfe218476abc144918f909',
        },
        photoUrlList: [],
        description: null,
        difficulty: 'среднее',
        sportsItems: ['штанга'],
        tags: ['бицепс', '12222', '22222', '22223', '42222', '522222222', '6', '7', '8', '0'],
        units: ['повт', 'кг'],
        goal: {
          repetitions: 20,
          weight: 20,
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
        units: ['повт', 'кг'],
        goal: {
          repetitions: 2,
          weight: 10,
        },
      },
      {
        id: 4,
        name: 'Случай 4',
        video: {
          type: 'iframe',
          url: 'https://www.youtube.com/embed/FqF11YdwxrQ',
        },
        photoUrlList: [
          'https://fitnessclub24.ru/public/images/gallery/section/thumbs/0/2-3-shragi.jpg',
          'https://avatars.dzeninfra.ru/get-zen_doc/1535103/pub_64dbaa4e73f157490e767716_64dbe7e2a9216a3544dafebe/scale_1200',
        ],
        description: 'Описание 2',
        difficulty: 'простое',
        sportsItems: [],
        tags: [],
        units: ['мин'],
        goal: {
          time: 3,
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
          url: 'https://rutube.ru/play/embed/348d394918bfe218476abc144918f909',
        },
        photoUrlList: [],
        description: null,
        difficulty: 'среднее',
        sportsItems: ['штанга'],
        tags: ['бицепс', '12222', '22222', '22223', '42222', '522222222', '6', '7', '8', '0'],
        units: ['повт', 'кг'],
        goal: {
          repetitions: 20,
          weight: 100,
        },
      },
      {
        id: 4,
        name: 'Случай 4',
        video: {
          type: 'iframe',
          url: 'https://www.youtube.com/embed/FqF11YdwxrQ',
        },
        photoUrlList: [
          'https://fitnessclub24.ru/public/images/gallery/section/thumbs/0/2-3-shragi.jpg',
          'https://avatars.dzeninfra.ru/get-zen_doc/1535103/pub_64dbaa4e73f157490e767716_64dbe7e2a9216a3544dafebe/scale_1200',
        ],
        description: 'Описание 2',
        difficulty: 'простое',
        sportsItems: [],
        tags: [],
        units: ['мин'],
        goal: {
          time: 5,
        },
      },
    ],
  },
]
