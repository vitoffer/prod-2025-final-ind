export type Option<T extends object, K extends keyof T> = T & { [key in K]: string }

export function getFilteredSelectSuggestions<T extends object, K extends keyof T>(
  options: Option<T, K>[],
  field: K,
  value: string,
): string[] {
  return options
    .filter((option) => option[field].toLowerCase().includes(value.toLowerCase()))
    .map((option) => option[field])
}
