import type { Workout } from '@/types'

export default <Workout[]>[
  {
    id: 1,
    name: 'Тренировка на ноги',
    exercises: [
      {
        id: 13,
        goal: {
          time: {
            minutes: 1,
            seconds: 20,
          },
        },
      },
      {
        id: 8,
        goal: {
          repetitions: 8,
          weightKg: 120,
        },
      },
      {
        id: 6,
        goal: {
          repetitions: 10,
          weightKg: 20,
          sets: 3,
        },
      },
    ],
  },
  {
    id: 2,
    name: 'Тренировка на выносливость',
    exercises: [
      {
        id: 13,
        goal: {
          time: {
            minutes: 2,
            seconds: 0,
          },
        },
      },
      {
        id: 15,
        goal: {
          time: {
            minutes: 0,
            seconds: 20,
          },
          sets: 3,
        },
      },
    ],
  },
  {
    id: 3,
    name: 'Пустая тренировка',
    exercises: [],
  },
  {
    id: 4,
    name: 'Тренировка с гантелями',
    exercises: [
      {
        id: 2,
        goal: {
          repetitions: 10,
          weightKg: 40,
        },
      },
      {
        id: 4,
        goal: {
          repetitions: 15,
          weightKg: 60,
          sets: 3,
        },
      },
      {
        id: 6,
        goal: {
          repetitions: 15,
          weightKg: 60,
          sets: 3,
        },
      },
      {
        id: 10,
        goal: {
          repetitions: 12,
          weightKg: 20,
        },
      },
      {
        id: 12,
        goal: {
          repetitions: 14,
          weightKg: 40,
        },
      },
    ],
  },
]
