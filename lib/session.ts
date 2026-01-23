import Cookies from 'js-cookie';

export function getBackendToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const token = Cookies.get('token_p');
  return token || null;
}

export function setBackendToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  Cookies.set('token_p', token, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: 7,
  });
  
  const verifyToken = Cookies.get('token_p');
  if (process.env.NODE_ENV === 'development') {
    console.log('[Session] Token set:', {
      hasToken: !!verifyToken,
      tokenLength: verifyToken?.length || 0,
    });
  }
}

export function removeBackendToken(): void {
  Cookies.remove('token_p', { path: '/' });
}
