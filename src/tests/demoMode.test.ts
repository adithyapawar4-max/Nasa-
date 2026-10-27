import { describe, expect, it } from 'vitest'
import { resolveDemoMode } from '../demo/demoModeStorage'

describe('resolveDemoMode', () => {
  it('uses the saved preference when present', () => {
    expect(resolveDemoMode('true', undefined)).toBe(true)
    expect(resolveDemoMode('false', 'true')).toBe(false)
    expect(resolveDemoMode('false', undefined)).toBe(false)
  })

  it('falls back to the build-time default when nothing is saved', () => {
    expect(resolveDemoMode(null, 'true')).toBe(true)
    expect(resolveDemoMode(null, 'false')).toBe(false)
    expect(resolveDemoMode(null, undefined)).toBe(false)
  })

  it('ignores unrecognized saved values', () => {
    expect(resolveDemoMode('yes', 'true')).toBe(true)
    expect(resolveDemoMode('', 'false')).toBe(false)
  })
})
