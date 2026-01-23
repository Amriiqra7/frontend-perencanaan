'use server';

import { cookies } from 'next/headers';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

interface DecryptedPayload {
    token: string;
    user: Record<string, unknown>;
}

export async function decryptPayload(encryptedData: string): Promise<{
    success: boolean;
    token?: string;
    user?: Record<string, unknown>;
    message?: string;
}> {
    const secretKey = process.env.SSO_SECRET_KEY;

    if (!secretKey) {
        return { success: false, message: "Konfigurasi Server (SSO_SECRET_KEY) belum lengkap" };
    }

    try {
        const sanitizedEncryptedData = encryptedData.replace(/ /g, '+');

        const bytes = AES.decrypt(sanitizedEncryptedData, secretKey);
        const decryptedString = bytes.toString(encUtf8).trim();

        console.log("DATA YANG UDAH DI DECRYPT:", decryptedString);

        if (!decryptedString) {
            return { success: false, message: "Gagal dekripsi: Data rusak atau kunci salah" };
        }

        const payload: DecryptedPayload = JSON.parse(decryptedString);

        if (!payload.token || !payload.user) {
            return { success: false, message: "Payload tidak valid: token atau user tidak ditemukan" };
        }

        const cookieStore = await cookies();
        cookieStore.set('token_p', payload.token, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
            sameSite: 'lax',
            path: '/',
        });

        return {
            success: true,
            token: payload.token,
            user: payload.user
        };

    } catch (error) {
        console.error("SSO Decrypt Error:", error);
        return { success: false, message: "Terjadi kesalahan internal saat memproses data" };
    }
}

export async function processEncryptedToken(encryptedData: string) {
    const secretKey = process.env.SSO_SECRET_KEY;
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!secretKey || !backendApiUrl) {
        return { success: false, message: "Konfigurasi Server (Env) belum lengkap" };
    }

    try {
        const sanitizedEncryptedData = encryptedData.replace(/ /g, '+');

        const bytes = AES.decrypt(sanitizedEncryptedData, secretKey);
        const originalToken = bytes.toString(encUtf8).trim();

        console.log("TOKEN YANG UDAH DI DECRYPT:", originalToken);

        if (!originalToken) {
            return { success: false, message: "Gagal dekripsi: Token rusak atau kunci salah" };
        }

        const res = await fetch(`${backendApiUrl}/api/auth/validate-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${originalToken}`
            },
            cache: 'no-store'
        });

        // Cek jika status tidak OK (Bukan 2xx)
        if (!res.ok) {
            console.error("Validasi Gagal, Status:", res.status);
            return { success: false, message: "Token sudah kadaluarsa atau tidak valid" };
        }

        const cookieStore = await cookies();

        cookieStore.set('token_p', originalToken, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
            sameSite: 'lax',
            path: '/',
        });

        const responseData = await res.json();
        return { success: true, user: responseData.user || responseData.data };

    } catch (error) {
        console.error("SSO Error:", error);
        return { success: false, message: "Terjadi kesalahan internal saat memproses token" };
    }
}