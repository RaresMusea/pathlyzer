import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/authentication/LoginForm';
import { login } from '@/actions/Login';

jest.mock('next-auth/react', () => ({
    signIn: jest.fn(),
    useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
}));

jest.mock('@/actions/Login', () => ({
    login: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
    useSearchParams: () => new URLSearchParams(),
}));

describe('LoginForm component unit tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Shows validation errors for empty submission', async () => {
        render(<LoginForm />);
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
            expect(screen.getByText(/the password cannot be empty!/i)).toBeInTheDocument();
        });
    });

    it('calls login with correct values', async () => {
        (login as jest.Mock).mockResolvedValue({ success: 'Welcome!' });

        render(<LoginForm />);

        fireEvent.change(screen.getByPlaceholderText(/enter your email address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
            target: { value: 'Password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'Password123',
            });
        });
    });

    it('Shows 2FA field if login responds with twoFactor', async () => {
        (login as jest.Mock).mockResolvedValue({ twoFactor: true });

        render(<LoginForm />);

        fireEvent.change(screen.getByPlaceholderText(/enter your email address/i), {
            target: { value: 'twofa@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
            target: { value: 'Secret123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/enter the otp code sent via email/i)).toBeInTheDocument();
        });
    });

    it('Shows error message if login fails', async () => {
        (login as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });

        render(<LoginForm />);
        fireEvent.change(screen.getByPlaceholderText(/enter your email address/i), {
            target: { value: 'wrong@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
            target: { value: 'wrongpass' },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });
});