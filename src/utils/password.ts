import bcrypt from "bcryptjs";

// cost factor (calculate 2^SALT_ROUNDS iterations)
const SALT_ROUNDS = 10;


/**
 * Hashes a plain text password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
}


/**
 * Compares a plain text password with a stored hash.
 */
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}
