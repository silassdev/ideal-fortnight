import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
if (!JWT_SECRET) {
    throw new Error('Please set JWT_SECRET or NEXTAUTH_SECRET in your environment variables.');
}

export type JwtPayload = {
    sub: string; // user id
    email?: string;
    iat?: number;
    exp?: number;
};

export function signJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>, options?: { expiresIn?: string | number }) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }
    const exp = options?.expiresIn ?? '7d';
    return jwt.sign(payload, JWT_SECRET, { expiresIn: exp } as jwt.SignOptions);
}

export function verifyJwt(token: string): JwtPayload | null {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (err) {
        return null;
    }
}
