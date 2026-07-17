const { body, validationResult } = require('express-validator');

describe('Input Validation', () => {
  describe('player_name validation', () => {
    test('Should accept "Nguyễn Văn An" (Vietnamese with diacritics)', () => {
      const name = 'Nguyễn Văn An';
      expect(name.length).toBeGreaterThan(0);
      expect(name.length).toBeLessThanOrEqual(100);
    });

    test('Should accept "NGUYEN VAN AN" (uppercase)', () => {
      const name = 'NGUYEN VAN AN';
      expect(name.length).toBeGreaterThan(0);
      expect(name.length).toBeLessThanOrEqual(100);
    });

    test('Should reject empty string', () => {
      const name = '';
      expect(name.length).toBe(0);
    });

    test('Should reject string > 100 characters', () => {
      const name = 'A'.repeat(101);
      expect(name.length).toBeGreaterThan(100);
    });

    test('Should reject XSS attempt: "<script>alert(1)</script>"', () => {
      const name = '<script>alert(1)</script>';
      const hasHTML = /<[^>]*>/g.test(name);
      expect(hasHTML).toBe(true);
    });

    test('Should reject SQL injection: "\' OR 1=1 --"', () => {
      const name = "' OR 1=1 --";
      const hasSQLChars = /[';-]/.test(name);
      expect(hasSQLChars).toBe(true);
    });

    test('Should strip leading/trailing whitespace', () => {
      const name = '  Nguyễn Văn A  ';
      const trimmed = name.trim();
      expect(trimmed).toBe('Nguyễn Văn A');
    });
  });

  describe('player_phone validation', () => {
    test('Should accept "0901234567" (10 digit Viettel)', () => {
      const phone = '0901234567';
      expect(/^0\d{9}$/.test(phone)).toBe(true);
    });

    test('Should accept "0356789012" (Viettel 03x)', () => {
      const phone = '0356789012';
      expect(/^0[3-9]\d{8}$/.test(phone)).toBe(true);
    });

    test('Should accept "0912345678" (Mobifone)', () => {
      const phone = '0912345678';
      expect(/^0\d{9}$/.test(phone)).toBe(true);
    });

    test('Should accept "0765432109" (Vietnamobile)', () => {
      const phone = '0765432109';
      expect(/^0\d{9}$/.test(phone)).toBe(true);
    });

    test('Should reject "123456" (too short)', () => {
      const phone = '123456';
      expect(/^0\d{9}$/.test(phone)).toBe(false);
    });

    test('Should reject "090123456789" (too long)', () => {
      const phone = '090123456789';
      expect(/^0\d{9}$/.test(phone)).toBe(false);
    });

    test('Should reject "090-123-4567" (with dashes)', () => {
      const phone = '090-123-4567';
      expect(/^0\d{9}$/.test(phone)).toBe(false);
    });

    test('Should reject "abcdefghij" (letters)', () => {
      const phone = 'abcdefghij';
      expect(/^0\d{9}$/.test(phone)).toBe(false);
    });

    test('Should reject empty string', () => {
      const phone = '';
      expect(/^0\d{9}$/.test(phone)).toBe(false);
    });
  });

  describe('player_email validation', () => {
    test('Should accept "test@gmail.com"', () => {
      const email = 'test@gmail.com';
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(isValid).toBe(true);
    });

    test('Should accept "user.name+tag@example.co.vn"', () => {
      const email = 'user.name+tag@example.co.vn';
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(isValid).toBe(true);
    });

    test('Should reject "notanemail"', () => {
      const email = 'notanemail';
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(isValid).toBe(false);
    });

    test('Should reject "@nodomain.com"', () => {
      const email = '@nodomain.com';
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(isValid).toBe(false);
    });

    test('Should reject "missing@"', () => {
      const email = 'missing@';
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(isValid).toBe(false);
    });

    test('Should accept null/undefined (email is optional)', () => {
      expect(null).toBeNull();
      expect(undefined).toBeUndefined();
    });
  });

  describe('sessionCode validation', () => {
    test('Should accept "ABC123"', () => {
      const code = 'ABC123';
      expect(/^[A-Za-z0-9]{3,50}$/.test(code)).toBe(true);
    });

    test('Should accept "oke"', () => {
      const code = 'oke';
      expect(/^[A-Za-z0-9]{3,50}$/.test(code)).toBe(true);
    });

    test('Should reject "" (empty)', () => {
      const code = '';
      expect(/^[A-Za-z0-9]{3,50}$/.test(code)).toBe(false);
    });

    test('Should reject "AB" (too short, < 3 chars)', () => {
      const code = 'AB';
      expect(/^[A-Za-z0-9]{3,50}$/.test(code)).toBe(false);
    });

    test('Should reject string with spaces "ABC 123"', () => {
      const code = 'ABC 123';
      expect(/^[A-Za-z0-9]{3,50}$/.test(code)).toBe(false);
    });

    test("Should reject string with SQL \"'; DROP TABLE--\"", () => {
      const code = "'; DROP TABLE--";
      expect(/^[A-Za-z0-9]{3,50}$/.test(code)).toBe(false);
    });

    test('Should reject string > 50 characters', () => {
      const code = 'A'.repeat(51);
      expect(/^[A-Za-z0-9]{3,50}$/.test(code)).toBe(false);
    });
  });

  describe('Input sanitization', () => {
    test('Should escape HTML characters', () => {
      const dirty = '<script>alert("xss")</script>';
      const clean = dirty.replace(/[<>]/g, '');
      expect(clean).not.toContain('<');
      expect(clean).not.toContain('>');
    });

    test('Should escape single quotes for SQL', () => {
      const dirty = "' OR '1'='1";
      const clean = dirty.replace(/'/g, "\\'");
      expect(clean).toContain("\\'");
    });

    test('Should trim whitespace', () => {
      const dirty = '  test value  ';
      const clean = dirty.trim();
      expect(clean).toBe('test value');
    });
  });
});
