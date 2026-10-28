import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE_NAME = 'aerc_admin_session';
const DEFAULT_SECRET = 'aerc-secret-session-key-change-in-production-min-32-chars';
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET
);

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

/**
 * Hash a plain text password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify a plain text password against a bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign an encrypted session token with jose
 */
export async function signSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify and decode an encrypted session token
 */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return {
      id: Number(payload.id),
      email: String(payload.email),
      name: String(payload.name),
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}

/**
 * Retrieve the current authenticated admin session from cookies
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Set the admin session cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Destroy the admin session cookie (logout)
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Route protection guard for server components and actions
 */
export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
}
