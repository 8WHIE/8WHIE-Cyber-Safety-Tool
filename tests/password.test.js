const { checkPasswordStrength } = require('../js/password.js');

describe('Password Strength Checker', () => {
  test('returns Weak for short passwords', () => {
    const result = checkPasswordStrength('abc12');
    expect(result.label).toBe('Weak');
  });

  test('returns Moderate for medium length but lacking complexity', () => {
    // 9 chars, no uppercase, no special
    const result = checkPasswordStrength('abcdefgh1');
    expect(result.label).toBe('Moderate');
  });

  test('returns Strong for long complex passwords', () => {
    const result = checkPasswordStrength('A1b!cdefghijk');
    expect(result.label).toBe('Strong');
    expect(result.score).toBeGreaterThanOrEqual(5);
  });

  test('handles empty password', () => {
    const result = checkPasswordStrength('');
    expect(result.label).toBe('None');
    expect(result.score).toBe(0);
  });
});
