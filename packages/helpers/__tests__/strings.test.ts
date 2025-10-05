import { describe, it, expect } from 'vitest'
import { camelCase, capitalize, pascalCase, titleCase, snakeCase, kebabCase } from '../src/strings'

describe('String Utilities', () => {
  describe('camelCase', () => {
    it('should convert space-separated words to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld')
      expect(camelCase('Hello World')).toBe('helloWorld')
    })

    it('should handle single words', () => {
      expect(camelCase('hello')).toBe('hello')
      expect(camelCase('Hello')).toBe('hello')
    })

    it('should handle multiple spaces', () => {
      expect(camelCase('hello world test')).toBe('helloWorldTest')
    })
  })

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('world')).toBe('World')
    })

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('')
    })
  })

  describe('pascalCase', () => {
    it('should convert to PascalCase', () => {
      expect(pascalCase('hello world')).toBe('HelloWorld')
      expect(pascalCase('Hello World')).toBe('HelloWorld')
    })

    it('should handle single words', () => {
      expect(pascalCase('hello')).toBe('Hello')
    })
  })

  describe('titleCase', () => {
    it('should convert to Title Case', () => {
      expect(titleCase('hello world')).toBe('Hello World')
      expect(titleCase('hello world test')).toBe('Hello World Test')
    })

    it('should handle already titled strings', () => {
      expect(titleCase('Hello World')).toBe('Hello World')
    })
  })

  describe('snakeCase', () => {
    it('should convert space-separated words to snake_case', () => {
      expect(snakeCase('hello world')).toBe('hello_world')
    })

    it('should convert camelCase to snake_case', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world')
      expect(snakeCase('helloWorldTest')).toBe('hello_world_test')
    })

    it('should convert PascalCase to snake_case', () => {
      expect(snakeCase('HelloWorld')).toBe('hello_world')
    })

    it('should convert kebab-case to snake_case', () => {
      expect(snakeCase('hello-world')).toBe('hello_world')
    })

    it('should handle mixed formats', () => {
      expect(snakeCase('hello-world test')).toBe('hello_world_test')
    })
  })

  describe('kebabCase', () => {
    it('should convert space-separated words to kebab-case', () => {
      expect(kebabCase('hello world')).toBe('hello-world')
    })

    it('should convert camelCase to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world')
      expect(kebabCase('helloWorldTest')).toBe('hello-world-test')
    })

    it('should convert PascalCase to kebab-case', () => {
      expect(kebabCase('HelloWorld')).toBe('hello-world')
    })

    it('should convert snake_case to kebab-case', () => {
      expect(kebabCase('hello_world')).toBe('hello-world')
    })

    it('should handle mixed formats', () => {
      expect(kebabCase('hello_world test')).toBe('hello-world-test')
    })
  })
})
