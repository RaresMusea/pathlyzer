import { register } from '@/actions/Register';
import { getUserByEmail } from '@/persistency/data/User';
import { generateEmailVerifToken } from '@/lib/TokenGenerator';
import { sendVerificationEmail } from '@/lib/Email';
import { db } from '@/persistency/Db';
import bcrypt from 'bcryptjs';
import { createUserStats } from '@/app/service/user/userStatsService';

jest.mock('@/persistency/data/User', () => ({ getUserByEmail: jest.fn() }));
jest.mock('@/lib/TokenGenerator', () => ({ generateEmailVerifToken: jest.fn() }));
jest.mock('@/lib/Email', () => ({ sendVerificationEmail: jest.fn() }));
jest.mock('@/persistency/Db', () => ({
    db: {
        user: { create: jest.fn() }
    }
}));
jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
jest.mock('@/app/service/user/userStatsService', () => ({ createUserStats: jest.fn() }));

describe('Register server action unit tests', () => {
    const input = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
        username: 'testuser',
        passwordConfirmation: 'Password123!'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPass');
    });
    it('should return error if fields are invalid', async () => {
        const result = await register({ ...input, email: '', passwordConfirmation: input.password });
        expect(result).toEqual({ error: 'Invalid fields!' });
    });

    it('should return error if user already exists', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue({});
        const result = await register(input);
        expect(result).toEqual({ error: 'The provided email address is already associated to another account!' });
    });

    it('should return error if userStats creation fails', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(null);
        (db.user.create as jest.Mock).mockResolvedValue({ id: 'user-123' });
        (createUserStats as jest.Mock).mockRejectedValue(new Error('fail'));

        const result = await register(input);
        expect(result).toEqual({ error: 'The user already exists!' });
    });

    it('should return success after creating user and sending verification email', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(null);
        (db.user.create as jest.Mock).mockResolvedValue({ id: 'user-123', email: input.email });
        (createUserStats as jest.Mock).mockResolvedValue({});
        (generateEmailVerifToken as jest.Mock).mockResolvedValue({ email: input.email, token: 'verify-token' });

        const result = await register(input);

        expect(generateEmailVerifToken).toHaveBeenCalledWith(input.email);
        expect(sendVerificationEmail).toHaveBeenCalledWith(input.email, 'verify-token', input.name);
        expect(result).toEqual({ success: `A verification email was successfully sent to ${input.email}!` });
    });
});