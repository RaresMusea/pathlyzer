import { Resend } from 'Resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const logoUrl: string = "https://i.imgur.com/5jDoLFE.png";

export const sendVerificationEmail = async (email: string, token: string, name: string) => {
    const confirmLink = `http://localhost:3000/email-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Pathlyzer: Please confirm your email",
        html: `
            <img src="${logoUrl}" alt="Detailed Logo" style="display: block; margin: 0 auto;" />
            <h1 style="text-align:center">Hello, ${name}!</h1>
            <p style="text-align:center;font-size:1.2em;">
                Thanks for signing up for Pathlyzer!
                In order to keep your account secure, please confirm your email by clicking the link below:
            </p>
                <div style="width:55%; margin: 0 auto;">
                    <a href="${confirmLink}" style="display: block; margin: 0 auto; background-color: #233dff; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; font-size: 1.3em; margin: 4px 2px; cursor: pointer; font-weight: bolder;">
                        Confirm Email
                    </a>
                </div>
            <p style="margin-top:4em;">If you did not sign up for Pathlyzer, please ignore this email.</p>
            <p>Best regards, <br/> Pathlyzer Team</p>
            <br>`
    });
};

export const sendPasswordResetEmail = async (email: string, token: string, name: string) => {
    const resetLink = `http://localhost:3000/change-password?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Pathlyzer Password Reset",
        html: `
            <img src="${logoUrl}" alt="Detailed Logo" style="display: block; margin: 0 auto;" />
            <h1 style="text-align:center">Hello, ${name}!</h1>
            <p style="text-align:center;font-size:1.2em;">
                We received a request to reset your password. Click the link below in order to reset your password:
            </p>
                <div style="width:55%; margin: 0 auto;">
                    <a href="${resetLink}" style="display: block; margin: 0 auto; background-color: #233dff; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; font-size: 1.3em; margin: 4px 2px; cursor: pointer; font-weight: bolder;">
                        Reset password
                    </a>
                </div>
            <p style="margin-top:4em;">If you did not requested a password reset, please ignore this email.</p>
            <p>Best regards, <br/> Pathlyzer Team</p>
            <br>`
    });
};