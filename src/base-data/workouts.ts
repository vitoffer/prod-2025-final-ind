import type { Workout } from '@/types'

export default <Workout[]>[
  {
    id: 1,
    name: 'Тренировка 1',
    exercises: [
      {
        id: 1,
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
        goal: {
          repetitions: 20,
          weightKg: 20,
        },
      },
      {
        id: 3,
        goal: {
          repetitions: 2,
          weightKg: 10,
        },
      },
      {
        id: 4,
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
        goal: {
          repetitions: 20,
          weightKg: 100,
        },
      },
      {
        id: 4,
        goal: {
          time: {
            seconds: 5,
          },
        },
      },
    ],
  },
]
