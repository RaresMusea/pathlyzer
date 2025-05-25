import { render, screen } from '@testing-library/react';
import { BackButton } from '@/components/authentication/BackButton';

jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => {
        return <a href={href}>{children}</a>;
    };
});

describe('BackButton Component', () => {
    const testProps = {
        backButtonText: 'Back to Login',
        backButtonHref: '/login'
    };

    it('Renders with correct text and href', () => {
        render(<BackButton {...testProps} />);

        const link = screen.getByRole('link', { name: testProps.backButtonText });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', testProps.backButtonHref);
    });

    it('Wraps the Link component properly', () => {
        render(<BackButton {...testProps} />);

        const link = screen.getByRole('link');
        expect(link.tagName).toBe('A');
        expect(link).toHaveTextContent(testProps.backButtonText);
    });

    it('Matches snapshot', () => {
        const { asFragment } = render(<BackButton {...testProps} />);
        expect(asFragment()).toMatchSnapshot();
    });
});