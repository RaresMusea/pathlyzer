import { render, screen, waitFor } from '@testing-library/react';
import { EmailVerificationForm } from '@/components/authentication/EmailVerificationForm';
import { useSearchParams } from 'next/navigation';
import { verifiyEmail } from '@/actions/EmailVerification';

jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
}));

jest.mock('@/actions/EmailVerification', () => ({
    verifiyEmail: jest.fn(),
}));

jest.mock('react-spinners', () => ({
    BeatLoader: jest.fn(() => <div>Loading...</div>),
}));

jest.mock('@/components/authentication/Alerts', () => ({
    AuthAlert: jest.fn(({ message }) => message ? <div>{message}</div> : null),
    AlertType: {
        SUCCESS: 'success',
        ERROR: 'error',
    }
}));

describe('EmailVerificationForm Component', () => {
    const mockVerifiyEmail = verifiyEmail as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue('test-token'),
        });
    });

    it('Renders loading state initially', async () => {
        mockVerifiyEmail.mockImplementation(() => new Promise(() => { }));

        render(<EmailVerificationForm />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(mockVerifiyEmail).toHaveBeenCalledWith('test-token');
        });
    });

    it('Renders the correct header and description', () => {
        render(<EmailVerificationForm />);
        expect(screen.getByText('Welcome!')).toBeInTheDocument();
        expect(screen.getByText('Email verification check')).toBeInTheDocument();
    });

    it('Shows error when token is missing', async () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue(''),
        });

        mockVerifiyEmail.mockImplementation(() => {
            throw new Error('verifiyEmail should not be called');
        });

        render(<EmailVerificationForm />);

        await waitFor(() => {
            expect(screen.getByText('The token is missing!')).toBeInTheDocument();
            expect(mockVerifiyEmail).not.toHaveBeenCalled();
        });
    });

    it('Shows success message when verification succeeds', async () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue('valid-token'),
        });
        mockVerifiyEmail.mockResolvedValue({ success: 'Email verified successfully!' });

        render(<EmailVerificationForm />);

        await waitFor(() => {
            expect(screen.getByText('Email verified successfully!')).toBeInTheDocument();
        });
    });

    it('Shows error message when verification fails', async () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue('invalid-token'),
        });
        mockVerifiyEmail.mockResolvedValue({ error: 'Invalid token' });

        render(<EmailVerificationForm />);

        await waitFor(() => {
            expect(screen.getByText('Invalid token')).toBeInTheDocument();
        });
    });

    it('Shows error when verification throws an exception', async () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue('error-token'),
        });
        mockVerifiyEmail.mockRejectedValue(new Error('Network error'));

        render(<EmailVerificationForm />);

        await waitFor(() => {
            expect(screen.getByText(/Something went wrong while attempting to verify your email/i)).toBeInTheDocument();
        });
    });

    it('Renders back to login link', () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue('test-token'),
        });

        render(<EmailVerificationForm />);
        expect(screen.getByText('Back to login')).toBeInTheDocument();
        expect(screen.getByText('Back to login')).toHaveAttribute('href', '/login');
    });
});