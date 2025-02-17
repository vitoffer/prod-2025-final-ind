import type { Workout } from '@/types'

export default <Workout[]>[
  {
    id: 1,
    name: 'Тренировка 1',
    exercises: [
      {
        id: 1,
        goal: {
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
        goal: {
          repetitions: 20,
          weight: 20,
        },
      },
      {
        id: 3,
        goal: {
          repetitions: 2,
          weight: 10,
        },
      },
      {
        id: 4,
        goal: {
          time: 100,
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
        goal: {
          repetitions: 20,
          weight: 100,
        },
      },
      {
        id: 4,
        goal: {
          time: 5,
        },
      },
    ],
  },
]
