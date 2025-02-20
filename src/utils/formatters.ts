import type { GoalTime } from '@/types'

export function formattedSets(sets: number | undefined): string {
  if (sets === undefined) return ''

  return sets < 5 ? 'подхода' : 'подходов'
}

export function formattedReps(reps: number | undefined): string {
  if (reps === undefined) return ''

  return [11, 12, 13, 14].includes(reps)
    ? 'повторений'
    : reps % 10 === 1
      ? 'повторение'
      : 1 < reps % 10 && reps % 10 < 5
        ? 'повторения'
        : 'повторений'
}

export function formattedSeconds(seconds: number | undefined): string {
  if (seconds === undefined) return ''

  return [11, 12, 13, 14].includes(seconds)
    ? 'секунд'
    : seconds % 10 === 1
      ? 'секунда'
      : 1 < seconds % 10 && seconds % 10 < 5
        ? 'секунды'
        : 'секунд'
}

export function formattedMinutes(minutes: number | undefined): string {
  if (minutes === undefined) return ''

  return [11, 12, 13, 14].includes(minutes)
    ? 'минут'
    : minutes % 10 === 1
      ? 'минута'
      : 1 < minutes % 10 && minutes % 10 < 5
        ? 'минуты'
        : 'минут'
}

export function stringifyTime(timeObject: GoalTime | undefined): string {
  if (!timeObject) return ''

  const minutes = String(timeObject.minutes || 0).padStart(2, '0')
  const seconds = String(timeObject.seconds || 0).padStart(2, '0')
  return `${minutes}:${seconds}`
}

export function parseTime(input: string): GoalTime {
  if (input.length === 0) return { minutes: 0, seconds: 0 }

  const [minutes, seconds] = input.split(':').map(Number)
  return { minutes, seconds }
}

export function formattedStringTime(minutes: number, seconds: number): string {
  let resultString = ''
  if (minutes) {
    resultString += minutes + ' ' + formattedMinutes(minutes)
  }
  if (minutes && seconds) {
    resultString += ' '
  }
  if (seconds) {
    resultString += seconds + ' ' + formattedSeconds(seconds)
  }

  return resultString
}

export function formattedWorkoutData(
  elapsedTime: string,
  completedReps: number,
  maxWeightKg: number,
) {
  let resultString = ''

  if (elapsedTime !== '') {
    resultString += `На упражнения потрачено: ${elapsedTime}.\n`
  }
  if (completedReps !== 0) {
    resultString += `Повторений сделано: ${completedReps}.\n`
  }
  if (maxWeightKg !== 0) {
    resultString += `Максимальный вес: ${maxWeightKg} кг.\n`
  }

  return resultString
}
