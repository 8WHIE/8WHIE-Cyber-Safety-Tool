const { analyzeURL } = require('../js/url.js');

describe('URL Analyzer', () => {
  test('handles empty input', () => {
    const result = analyzeURL('');
    expect(result.valid).toBe(false);
  });

  test('flags HTTP as suspicious', () => {
    const result = analyzeURL('http://example.com');
    expect(result.valid).toBe(true);
    expect(result.isSuspicious).toBe(true);
    expect(result.feedback.join(' ')).toMatch(/HTTP/);
  });

  test('flags IP addresses', () => {
    const result = analyzeURL('http://192.168.1.1');
    expect(result.isSuspicious).toBe(true);
    expect(result.feedback.join(' ')).toMatch(/IP address/);
  });

  test('validates standard HTTPS URLs as not suspicious by default', () => {
    const result = analyzeURL('https://example.com');
    expect(result.isSuspicious).toBe(false);
  });

  test('flags common phishing keywords', () => {
    const result = analyzeURL('https://secure.login.example.com');
    expect(result.feedback.join(' ')).toMatch(/keywords common in phishing/);
  });

  test('prepends protocol if missing', () => {
    const result = analyzeURL('example.com');
    expect(result.valid).toBe(true);
    expect(result.domain).toBe('example.com');
    expect(result.feedback.join(' ')).toMatch(/No protocol provided/);
  });
});
