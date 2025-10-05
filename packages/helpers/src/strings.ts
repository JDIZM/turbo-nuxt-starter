/**
 * Convert string to camelCase
 *
 * @param str - Input string
 * @returns camelCase string
 *
 * @example
 * camelCase('hello world') // 'helloWorld'
 * camelCase('Hello World') // 'helloWorld'
 */
export const camelCase = (str: string): string => {
  return str
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join('')
}

/**
 * Capitalize first letter of string
 *
 * @param str - Input string
 * @returns Capitalized string
 *
 * @example
 * capitalize('hello') // 'Hello'
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert string to PascalCase
 *
 * @param str - Input string
 * @returns PascalCase string
 *
 * @example
 * pascalCase('hello world') // 'HelloWorld'
 */
export const pascalCase = (str: string): string => {
  return capitalize(camelCase(str))
}

/**
 * Convert string to Title Case
 *
 * @param str - Input string
 * @returns Title Case string
 *
 * @example
 * titleCase('hello world') // 'Hello World'
 */
export const titleCase = (str: string): string => {
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
}

/**
 * Convert string to snake_case
 *
 * @param str - Input string
 * @returns snake_case string
 *
 * @example
 * snakeCase('hello world') // 'hello_world'
 * snakeCase('helloWorld') // 'hello_world'
 * snakeCase('HelloWorld') // 'hello_world'
 * snakeCase('hello-world') // 'hello_world'
 */
export const snakeCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_') // Replace spaces and hyphens with underscore
}

/**
 * Convert string to kebab-case
 *
 * @param str - Input string
 * @returns kebab-case string
 *
 * @example
 * kebabCase('hello world') // 'hello-world'
 * kebabCase('helloWorld') // 'hello-world'
 * kebabCase('HelloWorld') // 'hello-world'
 * kebabCase('hello_world') // 'hello-world'
 */
export const kebabCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphen
}
