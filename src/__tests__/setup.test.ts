import { describe, it, expect } from 'vitest'

describe('Project Setup', () => {
  it('should run vitest correctly', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have fast-check available', async () => {
    const fc = await import('fast-check')
    expect(fc.integer).toBeDefined()
  })
})
