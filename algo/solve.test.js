const solve = require('./solve')

test('wordList type is not Array', () => {
  expect(solve(0, '')).toBe('None')
  expect(solve(null, '')).toBe('None')
  expect(solve(undefined, '')).toBe('None')
  expect(solve({}, '')).toBe('None')
  expect(solve(new Date(), '')).toBe('None')
})

test('length of wordList not greater than or equal 2', () => {
  expect(solve([], '')).toBe('None')
  expect(solve([''], '')).toBe('None')
  expect(solve(['', ''], '')).toBe('None')
  expect(solve(['ab', '', ''], '')).toBe('None')
})

test('target is not to be string', () => {
  expect(solve(['a', 'b'], 0)).toBe('None')
  expect(solve(['a', 'b'], null)).toBe('None')
  expect(solve(['a', 'b'], undefined)).toBe('None')
  expect(solve(['a', 'b'], {})).toBe('None')
  expect(solve(['a', 'b'], new Date())).toBe('None')
})

test('length of target word is not enough to use pairing', () => {
  expect(solve(['a', 'b'], '')).toBe('None')
  expect(solve(['a', 'b'], 'a')).toBe('None')
})

test('wordList to be ["ab", "bc", "cd"] and target to be "abcd" then result must be ("ab", "cd")', () => {
  expect(solve(['ab', 'bc', 'cd'], 'abcd')).toBe('("ab", "cd")')
})

test('wordList to be ["ab", "bc", "cd"] and target to be "cdab" then result must be ("cd", "ab")', () => {
  expect(solve(['ab', 'bc', 'cd'], 'cdab')).toBe('("cd", "ab")')
})

test('wordList to be ["ab", "bc", "cd"] and target to be "abab" then result must be None', () => {
  expect(solve(['ab', 'bc', 'cd'], 'abab')).toBe('None')
})

test('wordList to be ["ab", "bc", "ab"] and target to be "abab" then result must be ("ab", "ab")', () => {
  expect(solve(['ab', 'bc', 'ab'], 'abab')).toBe('("ab", "ab")')
})

test('wordList to be ["ab", "bc", "cd"] and target to be "abcde" then result must be ("ab", "cd")', () => {
  expect(solve(['ab', 'bc', 'cd'], 'abcde')).toBe('("ab", "cd")')
})

test('wordList to be ["ab", "bc", "cde"] and target to be "abcde" then result must be ("ab", "cde")', () => {
  expect(solve(['ab', 'bc', 'cde'], 'abcde')).toBe('("ab", "cde")')
})

test('wordList to be ["a", "b"] and target to be "ab" then result must be ("a", "b")', () => {
  expect(solve(['a', 'b'], 'ab')).toBe('("a", "b")')
})

test('wordList to be ["a", "b"] and target to be "abc" then result must be ("a", "b")', () => {
  expect(solve(['a', 'b'], 'abc')).toBe('("a", "b")')
})

test('wordList to be ["a", "b"] and target to be "ba" then result must be ("b", "a")', () => {
  expect(solve(['a', 'b'], 'ba')).toBe('("b", "a")')
})

test('wordList to be ["a", "bc"] and target to be "abc" then result must be ("a", "bc")', () => {
  expect(solve(['a', 'bc'], 'abc')).toBe('("a", "bc")')
})

test('wordList to be ["a", "bc"] and target to be "bca" then result must be ("bc", "a")', () => {
  expect(solve(['a', 'bc'], 'bca')).toBe('("bc", "a")')
})

test('wordList to be ["ab", "bc"] and target to be "abbc" then result must be ("ab", "bc")', () => {
  expect(solve(['ab', 'bc'], 'abbc')).toBe('("ab", "bc")')
})
