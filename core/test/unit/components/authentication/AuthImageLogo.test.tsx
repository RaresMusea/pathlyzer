import { render, screen } from '@testing-library/react';
import { AuthImageLogo } from '@/components/authentication/AuthImageLogo';
import { useTheme } from 'next-themes';

jest.mock('next-themes', () => ({
    useTheme: jest.fn(),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        return <img {...props} />;
    },
}));

jest.mock('@/exporters/LogoExporter', () => ({
    logoDetailedDark: '/mocked-dark-logo.png',
    logoDetailedLight: '/mocked-light-logo.png',
}));

describe('AuthImageLogo Component', () => {
    const mockUseTheme = useTheme as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Renders nothing on mobile screens (hidden on md:block)', () => {
        mockUseTheme.mockReturnValue({ theme: 'light' });
        const { container } = render(<AuthImageLogo />);
        expect(container.firstChild).toHaveClass('hidden');
    });

    it('Renders light logo when theme is light', () => {
        mockUseTheme.mockReturnValue({ theme: 'light' });
        render(<AuthImageLogo />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', '/mocked-light-logo.png');
        expect(image).toHaveClass('h-full w-full');
    });

    it('Renders dark logo when theme is dark', () => {
        mockUseTheme.mockReturnValue({ theme: 'dark' });
        render(<AuthImageLogo />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', '/mocked-dark-logo.png');
    });

    it('Renders light logo when theme is system but prefers light', () => {
        mockUseTheme.mockReturnValue({ theme: 'system', systemTheme: 'light' });
        render(<AuthImageLogo />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', '/mocked-light-logo.png');
    });

    it('Has correct accessibility attributes', () => {
        mockUseTheme.mockReturnValue({ theme: 'light' });
        render(<AuthImageLogo />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('alt', 'Image');
    });

    it('Has correct layout classes', () => {
        mockUseTheme.mockReturnValue({ theme: 'light' });
        const { container } = render(<AuthImageLogo />);

        expect(container.firstChild).toHaveClass('relative');
        expect(container.firstChild).toHaveClass('bg-muted');
        expect(container.firstChild).toHaveClass('hidden');
        expect(container.firstChild).toHaveClass('md:block');
        expect(container.firstChild).toHaveClass('xl:block');
    });
});