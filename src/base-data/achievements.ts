import type { Achievement } from '@/types'

export default <Achievement[]>[
  {
    name: 'Новичок',
    description: 'Завершите 1 тренировку',
    requirements: {
      workoutsCount: 1,
    },
  },
  {
    name: 'Энтузиаст',
    description: 'Завершите 5 тренировок',
    requirements: {
      workoutsCount: 5,
    },
  },
  {
    name: 'Крепыш',
    description: 'Завершите 10 тренировок',
    requirements: {
      workoutsCount: 10,
    },
  },
  {
    name: 'Машина',
    description: 'Завершите 20 тренировок',
    requirements: {
      workoutsCount: 20,
    },
  },
  {
    name: '"Максимум 1 раз пропущу"',
    description: 'Пропустите 1 упражнение',
    requirements: {
      exercises: {
        count: 1,
        type: 'skipped',
      },
    },
  },
  {
    name: 'Ленивый',
    description: 'Пропустите 5 упражнений',
    requirements: {
      exercises: {
        count: 5,
        type: 'skipped',
      },
    },
  },
  {
    name: 'Сбился с пути',
    description: 'Пропустите 10 упражнений',
    requirements: {
      exercises: {
        count: 10,
        type: 'skipped',
      },
    },
  },
  {
    name: 'Начало пути',
    description: 'Завершите 100 повторений',
    requirements: {
      units: {
        repetitions: 100,
      },
    },
  },
  {
    name: 'Не пальцем деланный',
    description: 'Завершите 300 повторений',
    requirements: {
      units: {
        repetitions: 300,
      },
    },
  },
  {
    name: 'Сумасшедший',
    description: 'Завершите 1000 повторений',
    requirements: {
      units: {
        repetitions: 1000,
      },
    },
  },
]
