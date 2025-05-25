import { verifiyEmail } from '@/actions/EmailVerification';
import { getVerificationByToken } from '@/persistency/data/EmailVerification';
import { verifyUser } from '@/actions/globals/Generics';
import { db } from '@/persistency/Db';

jest.mock('@/persistency/data/EmailVerification', () => ({
    getVerificationByToken: jest.fn()
}));

jest.mock('@/actions/globals/Generics', () => ({
    verifyUser: jest.fn()
}));

jest.mock('@/persistency/Db', () => ({
    db: {
        user: {
            update: jest.fn()
        },
        verificationToken: {
            delete: jest.fn()
        }
    }
}));

describe('VerifiyEmail server action unit tests', () => {
    const validToken = 'valid-token';
    const tokenData = {
        id: 'token-123',
        email: 'test@example.com',
        expiresAt: new Date(Date.now() + 10000)
    };
    const userData = {
        user: {
            id: 'user-123',
            email: 'test@example.com'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Shoud return error if token is invalid', async () => {
        (getVerificationByToken as jest.Mock).mockResolvedValue(null);

        const result = await verifiyEmail('bad-token');
        expect(result).toEqual({
            error: "This email address has already been verified or the verification link is invalid."
        });
    });

    it('Shoud return error if token is expired', async () => {
        (getVerificationByToken as jest.Mock).mockResolvedValue({
            ...tokenData,
            expiresAt: new Date(Date.now() - 10000)
        });

        const result = await verifiyEmail(validToken);
        expect(result).toEqual({
            error: "The token has expired!"
        });
    });

    it('Shoud return error if user is not found', async () => {
        (getVerificationByToken as jest.Mock).mockResolvedValue(tokenData);
        (verifyUser as jest.Mock).mockResolvedValue({ error: 'User not found' });

        const result = await verifiyEmail(validToken);
        expect(result).toEqual({ error: 'User not found' });
    });

    it('Shoud verify email and delete token on success', async () => {
        (getVerificationByToken as jest.Mock).mockResolvedValue(tokenData);
        (verifyUser as jest.Mock).mockResolvedValue(userData);

        const result = await verifiyEmail(validToken);

        expect(db.user.update).toHaveBeenCalledWith({
            where: { id: userData.user.id },
            data: {
                emailVerified: expect.any(Date),
                email: userData.user.email
            }
        });

        expect(db.verificationToken.delete).toHaveBeenCalledWith({
            where: { id: tokenData.id }
        });

        expect(result).toEqual({
            success: "Email verified successfully!"
        });
    });
});
