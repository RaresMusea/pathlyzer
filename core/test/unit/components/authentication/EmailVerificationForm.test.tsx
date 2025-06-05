import { render, screen, waitFor, act } from '@testing-library/react';
import { EmailVerificationForm } from '@/components/authentication/EmailVerificationForm';
import { useSearchParams } from 'next/navigation';
import { verifiyEmail } from '@/actions/EmailVerification';
import { BeatLoader } from 'react-spinners';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

// Mock actions
jest.mock('@/actions/EmailVerification', () => ({
  verifiyEmail: jest.fn(),
}));

// Mock components
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

  it('renders loading state initially', async () => {
    // Never resolving promise to keep loading state
    mockVerifiyEmail.mockReturnValue(new Promise(() => {}));
    
    await act(async () => {
      render(<EmailVerificationForm />);
    });
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the correct header and description', async () => {
    mockVerifiyEmail.mockResolvedValue({});
    
    await act(async () => {
      render(<EmailVerificationForm />);
    });
    
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('Email verification check')).toBeInTheDocument();
  });

  it('shows error when token is missing', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(''),
    });

    await act(async () => {
      render(<EmailVerificationForm />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('The token is missing!')).toBeInTheDocument();
    });
  });

  it('shows success message when verification succeeds', async () => {
    mockVerifiyEmail.mockResolvedValue({ success: 'Email verified successfully!' });

    await act(async () => {
      render(<EmailVerificationForm />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Email verified successfully!')).toBeInTheDocument();
    });
  });

  it('shows error message when verification fails', async () => {
    mockVerifiyEmail.mockResolvedValue({ error: 'Invalid token' });

    await act(async () => {
      render(<EmailVerificationForm />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Invalid token')).toBeInTheDocument();
    });
  });

  it('shows error when verification throws an exception', async () => {
    mockVerifiyEmail.mockRejectedValue(new Error('Network error'));

    await act(async () => {
      render(<EmailVerificationForm />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong while attempting to verify your email/i)).toBeInTheDocument();
    });
  });

  it('renders back to login link', async () => {
    mockVerifiyEmail.mockResolvedValue({});

    await act(async () => {
      render(<EmailVerificationForm />);
    });
    
    expect(screen.getByText('Back to login')).toBeInTheDocument();
    expect(screen.getByText('Back to login')).toHaveAttribute('href', '/login');
  });
});