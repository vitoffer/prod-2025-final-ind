import type { Achievement } from '@/types'

export default <Achievement[]>[
  {
    id: 1,
    name: 'Новичок',
    description: 'Завершите 1 тренировку',
    xpReward: 20,
  },
  {
    id: 2,
    xpReward: 50,
    name: 'Энтузиаст',
    description: 'Завершите 5 тренировок',
  },
  {
    id: 3,
    xpReward: 100,
    name: 'Крепыш',
    description: 'Завершите 10 тренировок',
  },
  {
    id: 4,
    xpReward: 200,
    name: 'Машина',
    description: 'Завершите 20 тренировок',
  },
  {
    id: 5,
    xpReward: 10,
    name: '"Максимум 1 раз пропущу"',
    description: 'Пропустите 1 упражнение',
  },
  {
    id: 6,
    xpReward: 25,
    name: 'Ленивый',
    description: 'Пропустите 5 упражнений',
  },
  {
    id: 7,
    xpReward: 50,
    name: 'Сбился с пути',
    description: 'Пропустите 10 упражнений',
  },
  {
    id: 8,
    xpReward: 30,
    name: 'Начало пути',
    description: 'Завершите 100 повторений',
  },
  {
    id: 9,
    xpReward: 100,
    name: 'Не пальцем деланный',
    description: 'Завершите 300 повторений',
  },
  {
    id: 10,
    xpReward: 300,
    name: 'Сумасшедший',
    description: 'Завершите 1000 повторений',
  },
]
