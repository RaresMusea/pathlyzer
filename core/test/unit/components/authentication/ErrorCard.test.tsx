import { render, screen } from '@testing-library/react';
import { ErrorCard } from '@/components/authentication/ErrorCard';

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

jest.mock('@/components/authentication/Header', () => ({
    Header: jest.fn(({ headerTitle }) => <h1>{headerTitle}</h1>),
}));

jest.mock('@/components/authentication/BackButton', () => ({
    BackButton: jest.fn(({ backButtonText, backButtonHref }) => (
        <a href={backButtonHref}>{backButtonText}</a>
    )),
}));

describe('ErrorCard Component', () => {
    it('Renders correctly with all elements', () => {
        render(<ErrorCard />);

        const card = screen.getByTestId('error-card');
        expect(card).toBeInTheDocument();
        expect(card).toHaveClass('w-[700px]');
        expect(card).toHaveClass('shadow-md');

        expect(screen.getByText('Something went wrong while trying to sign you in!')).toBeInTheDocument();

        const image = screen.getByRole('img', { name: 'Error image' });
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('width', '400');
        expect(image).toHaveAttribute('height', '400');

        const backButton = screen.getByRole('link', { name: 'Back to Login page' });
        expect(backButton).toBeInTheDocument();
        expect(backButton).toHaveAttribute('href', '/login');
    });
});