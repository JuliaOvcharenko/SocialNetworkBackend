import { createTransport } from "nodemailer";
import { env } from "../../config/env";


const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: env.HOST_EMAIL_ADDRESS,
        pass: env.HOST_EMAIL_PASSWORD,
    },
});

export const MailService = {
    async sendVerificationCode(email: string, code: string) {
        await transporter.sendMail({
            from: `"SocialMedia" <${env.HOST_EMAIL_ADDRESS}>`,
            to: email,
            subject: "Email verification",
            text: `Your verification code: ${code}`,
        });
    },
};
