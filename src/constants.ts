import type { Exercise, ExerciseDifficulty, ExerciseUnit } from './types'

export const nullExercise: Omit<Exercise, 'id'> = {
  name: '',
  video: {
    type: 'video',
    url: '',
  },
  photoUrlList: [''],
  description: '',
  difficulty: 'простое',
  sportsItems: [],
  tags: [],
  unitsList: [],
}

export const difficultyOptions: ExerciseDifficulty[] = ['простое', 'среднее', 'сложное']
export const unitsOptions: ExerciseUnit[] = ['время', 'подходы', 'повторения', 'вес']
