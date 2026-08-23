import { describe, it, expect } from 'vitest'
import { formatVersion } from './version'

describe('formatVersion', () => {
  it('prefixes a plain semver with v', () => {
    expect(formatVersion('1.2.0')).toBe('v1.2.0')
  })

  it('does not double the prefix when the version already has one', () => {
    expect(formatVersion('v1.2.0')).toBe('v1.2.0')
    expect(formatVersion('V1.2.0')).toBe('v1.2.0')
  })

  it('trims surrounding whitespace', () => {
    expect(formatVersion('  1.2.0  ')).toBe('v1.2.0')
  })

  it('appends a build identifier when given one', () => {
    expect(formatVersion('1.2.0', '42')).toBe('v1.2.0 · build 42')
  })

  it('ignores an empty or whitespace-only build identifier', () => {
    expect(formatVersion('1.2.0', '')).toBe('v1.2.0')
    expect(formatVersion('1.2.0', '   ')).toBe('v1.2.0')
  })

  it('ignores a non-string build identifier', () => {
    expect(formatVersion('1.2.0', 42)).toBe('v1.2.0')
    expect(formatVersion('1.2.0', null)).toBe('v1.2.0')
  })

  it('returns empty string for a missing version rather than a stray "v"', () => {
    // The login page renders this behind a v-if. Returning 'v' or 'vundefined'
    // here would put build metadata noise on the one screen every user sees
    // before authenticating.
    expect(formatVersion(undefined)).toBe('')
    expect(formatVersion(null)).toBe('')
    expect(formatVersion('')).toBe('')
    expect(formatVersion('   ')).toBe('')
    expect(formatVersion(120)).toBe('')
  })

  it('passes through a non-semver version unchanged apart from the prefix', () => {
    expect(formatVersion('1.2.0-rc.1')).toBe('v1.2.0-rc.1')
    expect(formatVersion('2024.08.23')).toBe('v2024.08.23')
  })
})
