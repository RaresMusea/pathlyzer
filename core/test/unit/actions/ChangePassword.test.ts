import { changePassword } from '@/actions/ChangePassword';
import { getPasswordResetToken } from '@/persistency/data/PasswordReset';
import { verifyUser } from '@/actions/globals/Generics';
import { db } from '@/persistency/Db';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
    hash: jest.fn()
}));

jest.mock('@/persistency/Db', () => ({
    db: {
        user: {
            update: jest.fn()
        },
        passwordResetToken: {
            delete: jest.fn()
        }
    }
}));

jest.mock('@/persistency/data/PasswordReset', () => ({
    getPasswordResetToken: jest.fn()
}));

jest.mock('@/actions/globals/Generics', () => ({
    verifyUser: jest.fn()
}));

describe('ChangePassword Server Action Unit Tests', () => {
    const validEmail = 'test@example.com';
    const validUser = { id: 'user-123', email: validEmail };

    const input = {
        password: 'SuperStrongPass123!',
        passwordConfirmation: 'SuperStrongPass123!'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Should return error if token is missing', async () => {
        const result = await changePassword(input, null);
        expect(result).toEqual({ error: 'The token is missing!' });
    });

    it('Should return error if token is invalid', async () => {
        (getPasswordResetToken as jest.Mock).mockResolvedValue(null);

        const result = await changePassword(input, 'invalid-token');
        expect(result).toEqual({
            error: 'The password already been changed or the verification link is invalid.'
        });
    });

    it('Should return error if token is expired', async () => {
        (getPasswordResetToken as jest.Mock).mockResolvedValue({
            expiresAt: new Date(Date.now() - 10000)
        });

        const result = await changePassword(input, 'expired-token');
        expect(result).toEqual({ error: 'The token has expired!' });
    });

    it('Should return error if user is not found', async () => {
        (getPasswordResetToken as jest.Mock).mockResolvedValue({
            id: 'token-123',
            email: validEmail,
            expiresAt: new Date(Date.now() + 10000)
        });

        (verifyUser as jest.Mock).mockResolvedValue({ error: 'User not found!' });

        const result = await changePassword(input, 'valid-token');
        expect(result).toEqual({ error: 'User not found!' });
    });

    it('Should hash the password and update user and delete token', async () => {
        (getPasswordResetToken as jest.Mock).mockResolvedValue({
            id: 'token-123',
            email: validEmail,
            expiresAt: new Date(Date.now() + 10000)
        });

        (verifyUser as jest.Mock).mockResolvedValue({ user: validUser });

        (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');

        const result = await changePassword(input, 'valid-token');

        expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
        expect(db.user.update).toHaveBeenCalledWith({
            where: { id: validUser.id },
            data: { password: 'hashed_pass' }
        });
        expect(db.passwordResetToken.delete).toHaveBeenCalledWith({
            where: { id: 'token-123' }
        });
        expect(result).toEqual({
            success: 'Password changed! Redirecting you to the login page...'
        });
    });
});
