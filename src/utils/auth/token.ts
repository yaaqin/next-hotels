// import { cookies } from 'next/headers';
'use client';
import { getCookie } from "cookies-next";
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role?: string;
  sub?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

// Untuk Server Components & Server Actions
// export const getAccessToken = async (): Promise<string | null> => {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get('accessToken');
//     return token?.value ?? null;
//   } catch (error) {
//     console.error('Error getting access token:', error);
//     return null;
//   }
// }

// Untuk Client Components
export const getAccessTokenClient = (): string | null => {

  const allCookies = document.cookie;

  const token = getCookie('access_token');

  return token ? String(token) : null;

}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error('Gagal mendecode token:', error);
    return null;
  }
};

// Helper untuk cek apakah token expired
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;

  return Date.now() >= decoded.exp * 1000;
};

// Helper untuk get token dan langsung decode
// export const getDecodedToken = async (): Promise<DecodedToken | null> => {
//   const token = await getAccessToken();
//   if (!token) return null;

//   return decodeToken(token);
// };

// Untuk Client Components
export const getDecodedTokenClient = (): DecodedToken | null => {
  const token = getAccessTokenClient();
  if (!token) return null;

  return decodeToken(token);
};