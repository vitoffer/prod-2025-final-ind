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
]
