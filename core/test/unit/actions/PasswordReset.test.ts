import { resetPassword } from '@/actions/PasswordReset';
import { getUserByEmail } from '@/persistency/data/User';
import { generatePasswordResetToken } from '@/lib/TokenGenerator';
import { sendPasswordResetEmail } from '@/lib/Email';

jest.mock('@/persistency/data/User', () => ({
    getUserByEmail: jest.fn()
}));

jest.mock('@/lib/TokenGenerator', () => ({
    generatePasswordResetToken: jest.fn()
}));

jest.mock('@/lib/Email', () => ({
    sendPasswordResetEmail: jest.fn()
}));

describe('Reset Password server action unit tests', () => {
    const validEmail = 'test@example.com';
    const user = { email: validEmail, name: 'Test User' };
    const token = { email: validEmail, token: 'reset-token' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Should return error if email is invalid', async () => {
        const result = await resetPassword({ email: '' });
        expect(result).toEqual({ error: 'Invalid email!' });
    });

    it('Should return error if user is not found', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(null);
        const result = await resetPassword({ email: validEmail });
        expect(getUserByEmail).toHaveBeenCalledWith(validEmail);
        expect(result).toEqual({ error: 'User not found!' });
    });

    it('Should generate token and send email if user exists', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(user);
        (generatePasswordResetToken as jest.Mock).mockResolvedValue(token);

        const result = await resetPassword({ email: validEmail });

        expect(generatePasswordResetToken).toHaveBeenCalledWith(validEmail);
        expect(sendPasswordResetEmail).toHaveBeenCalledWith(validEmail, 'reset-token', 'Test User');
        expect(result).toEqual({ success: `A password reset email has been sent to ${validEmail}.` });
    });
});
