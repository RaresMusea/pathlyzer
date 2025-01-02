const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-[700px] items-center justify-center">
            {children}
        </div>
    );
}

export default AuthenticationLayout;