interface Exercise {
  name: string
  videoUrl?: string | null
  photoUrlList: string[]
  description?: string | null
  difficulty: Difficulty
  sportsItems: string[]
  tags: string[]
}

type Difficulty = 'простое' | 'среднее' | 'сложное'

export default <Exercise[]>[
  {
    name: 'Упражнение 1',
    videoUrl: null,
    photoUrlList: [],
    description: 'Описание 1',
    difficulty: 'простое',
    sportsItems: ['скакалка'],
    tags: ['на ноги'],
  },
  {
    name: 'Упражнение 2',
    videoUrl: 'https://rutube.ru/video/348d394918bfe218476abc144918f909/',
    photoUrlList: [],
    description: null,
    difficulty: 'среднее',
    sportsItems: ['штанга'],
    tags: ['на бицепс'],
  },
  {
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
    name: 'Крайний случай',
    videoUrl: 'https://rutube.ru/video/348d394918bfe218476abc144918f909/',
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
