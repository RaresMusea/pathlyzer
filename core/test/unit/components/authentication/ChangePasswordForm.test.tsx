import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChangePasswordForm } from '@/components/authentication/ChangePasswordForm';
import { changePassword } from '@/actions/ChangePassword';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

jest.mock('@/actions/ChangePassword', () => ({ changePassword: jest.fn() }));
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn()
}));

describe('ChangePasswordForm components unit tests', () => {
    const pushMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
        (useSearchParams as jest.Mock).mockReturnValue({ get: () => 'mock-token' });
    });

    it('renders form fields correctly', () => {
        render(<ChangePasswordForm />);
        expect(screen.getByLabelText('New password')).toBeInTheDocument();
        expect(screen.getByLabelText('New password confirmation')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty submission', async () => {
        render(<ChangePasswordForm />);

        fireEvent.click(screen.getByRole('button', { name: /change password/i }));

        await waitFor(() => {
            // Verifică exact textele generate de schema ta Zod
            expect(screen.getByText('Minimum password length is 6 characters.')).toBeInTheDocument();
            expect(screen.getByText('The password confirmation cannot be empty')).toBeInTheDocument();
        });
    });


    it('submits valid data and shows success message', async () => {
        (changePassword as jest.Mock).mockResolvedValue({ success: 'Password changed!' });

        render(<ChangePasswordForm />);

        fireEvent.input(screen.getByLabelText('New password'), { target: { value: 'Password123!' } });
        fireEvent.input(screen.getByLabelText('New password confirmation'), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByRole('button', { name: /change password/i }));

        await waitFor(() => {
            expect(changePassword).toHaveBeenCalledWith(
                { password: 'Password123!', passwordConfirmation: 'Password123!' },
                'mock-token'
            );
            expect(screen.getByText('Password changed!')).toBeInTheDocument();
        });
    });

    it('shows error message when changePassword fails', async () => {
        (changePassword as jest.Mock).mockResolvedValue({ error: 'Invalid token!' });

        render(<ChangePasswordForm />);

        fireEvent.input(screen.getByLabelText('New password'), { target: { value: 'Password123!' } });
        fireEvent.input(screen.getByLabelText('New password confirmation'), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByRole('button', { name: /change password/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid token!')).toBeInTheDocument();
        });
    });
});
