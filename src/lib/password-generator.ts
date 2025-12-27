/**
 * Generate a secure random password
 * @param length - Length of the password (default: 16)
 * @param includeSymbols - Whether to include symbols (default: true)
 * @returns A randomly generated password
 */
export function generatePassword(length: number = 16, includeSymbols: boolean = true): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  let characters = lowercase + uppercase + numbers
  if (includeSymbols) {
    characters += symbols
  }

  let password = ''

  // Ensure at least one character from each required set
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  if (includeSymbols) {
    password += symbols[Math.floor(Math.random() * symbols.length)]
  }

  // Fill the rest randomly
  const remainingLength = length - password.length
  for (let i = 0; i < remainingLength; i++) {
    password += characters[Math.floor(Math.random() * characters.length)]
  }

  // Shuffle the password to avoid predictable patterns
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}
