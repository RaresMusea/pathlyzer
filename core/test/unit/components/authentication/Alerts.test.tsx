import { render, screen, fireEvent } from '@testing-library/react';
import { AuthAlert, AlertType } from '@/components/authentication/Alerts';

describe('AuthAlert Component', () => {
    const testMessage = 'This is a test alert message';

    it('renders nothing when no message is provided', () => {
        const { container } = render(<AuthAlert type={AlertType.SUCCESS} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders success alert with correct styling and content', () => {
        render(
            <AuthAlert
                message={testMessage}
                type={AlertType.SUCCESS}
            />
        );

        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('border-green-600/50');
        expect(alert).toHaveClass('text-green-600');

        expect(screen.getByText('Success')).toBeInTheDocument();
        expect(screen.getByText(testMessage)).toBeInTheDocument();

        const icon = screen.getByTestId('alert-icon');
        expect(icon).toHaveClass('h-4');
        expect(icon).toHaveClass('w-4');
    });

    it('Renders error alert with correct styling and content', () => {
        render(
            <AuthAlert
                message={testMessage}
                type={AlertType.ERROR}
            />
        );

        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();

        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText(testMessage)).toBeInTheDocument();
    });

    it('Shows close button when hasCloseButton is true', () => {
        render(
            <AuthAlert
                message={testMessage}
                type={AlertType.SUCCESS}
                hasCloseButton={true}
            />
        );

        const closeButton = screen.getByRole('button');
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveTextContent('×');
    });

    it('Hides the alert when close button is clicked', () => {
        render(
            <AuthAlert
                message={testMessage}
                type={AlertType.SUCCESS}
                hasCloseButton={true}
            />
        );

        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('Becomes visible when message changes from empty to having content', () => {
        const { rerender } = render(
            <AuthAlert
                message=""
                type={AlertType.SUCCESS}
            />
        );
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        rerender(
            <AuthAlert
                message={testMessage}
                type={AlertType.SUCCESS}
            />
        );
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });
});