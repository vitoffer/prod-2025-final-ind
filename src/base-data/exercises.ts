import type { Exercise } from '@/types'

export default <Exercise[]>[
  {
    id: 1,
    name: 'Упражнение 1',
    videoUrl: null,
    photoUrlList: [],
    description: 'Описание 1',
    difficulty: 'простое',
    sportsItems: ['скакалка'],
    tags: ['на ноги'],
  },
  {
    id: 2,
    name: 'Упражнение 2',
    videoUrl: 'https://rutube.ru/play/embed/348d394918bfe218476abc144918f909',
    photoUrlList: [],
    description: null,
    difficulty: 'среднее',
    sportsItems: ['штанга'],
    tags: ['на бицепс', '12222', '22222', '22223', '42222', '522222222', '6', '7', '8', '0'],
  },
  {
    id: 3,
    name: 'Упражнение 3',
    videoUrl: null,
    photoUrlList: [
      'https://fitnessclub24.ru/public/images/gallery/section/thumbs/0/2-3-shragi.jpg',
      'https://avatars.dzeninfra.ru/get-zen_doc/1535103/pub_64dbaa4e73f157490e767716_64dbe7e2a9216a3544dafebe/scale_1200',
    ],
    description: null,
    difficulty: 'сложное',
    sportsItems: ['гантели'],
    tags: ['на спину'],
  },
  {
    id: 4,
    name: 'Крайний случай',
    videoUrl: 'https://www.youtube.com/embed/FqF11YdwxrQ',
    photoUrlList: [
      'https://fitnessclub24.ru/public/images/gallery/section/thumbs/0/2-3-shragi.jpg',
      'https://avatars.dzeninfra.ru/get-zen_doc/1535103/pub_64dbaa4e73f157490e767716_64dbe7e2a9216a3544dafebe/scale_1200',
    ],
    description: 'Описание 2',
    difficulty: 'простое',
    sportsItems: [],
    tags: [],
  },
]
