import bcrypt from 'bcrypt';

/**
 * Hashes a plaintext password using bcrypt with a default salt factor of 10.
 * @param password Plaintext password to hash
 * @returns Promise resolving to the hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compares a plaintext password against a hashed record.
 * @param password Plaintext password to evaluate
 * @param hash Previously stored hashed password
 * @returns Promise resolving to a boolean representing match status
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
