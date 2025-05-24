import { login } from '@/actions/Login';
import { signIn } from '@/auth';
import { getUserByEmail } from '@/persistency/data/User';
import { db } from '@/persistency/Db';
import { generateEmailVerifToken, generate2FAToken } from '@/lib/TokenGenerator';
import { sendVerificationEmail, send2FATokenEmail } from '@/lib/Email';
import { AuthError } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

jest.mock('@/auth', () => ({
    signIn: jest.fn(),
}));

jest.mock('@/persistency/data/User', () => ({
    getUserByEmail: jest.fn(),
    getTokenByEmail: jest.fn(),
    getTwoFactorConfirmationByUserId: jest.fn(),
}));

jest.mock('@/lib/TokenGenerator', () => ({
    generateEmailVerifToken: jest.fn(),
    generate2FAToken: jest.fn(),
}));

jest.mock('@/lib/Email', () => ({
    sendVerificationEmail: jest.fn(),
    send2FATokenEmail: jest.fn(),
}));

jest.mock('@/persistency/Db', () => ({
    db: {
        user: {
            update: jest.fn(),
        },
        twoFactorToken: {
            delete: jest.fn(),
            create: jest.fn(),
        },
        twoFactorConfirmation: {
            delete: jest.fn(),
            create: jest.fn(),
        },
    },
}));

jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn(),
    AuthError: class MockAuthError extends Error {
        constructor(public type: string) {
            super('Auth Error');
        }
    },
}));

jest.mock('next/dist/client/components/redirect-error', () => ({
    isRedirectError: jest.fn(),
}));

const mockCredentials = {
    email: 'test@example.com',
    password: 'password123',
    twoFactorOtp: '123456',
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Field Validation', () => {
    it('should return error for invalid email', async () => {
        const result = await login({
            email: 'invalid-email',
            password: 'password123',
        });
        expect(result).toEqual({ error: 'Invalid fields!' });
    });

    it('should return error for empty password', async () => {
        const result = await login({
            email: 'test@example.com',
            password: '',
        });
        expect(result).toEqual({ error: 'Invalid fields!' });
    });
});

describe('User Existence', () => {
    it('should return error if user does not exist', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(null);
        const result = await login(mockCredentials);
        expect(result).toEqual({ error: 'Email does not exist!' });
    });

    it('should return error if user has no password', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue({
            email: 'test@example.com',
            password: null,
        });
        const result = await login(mockCredentials);
        expect(result).toEqual({ error: 'Email does not exist!' });
    });
});