import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import nodemailer from "nodemailer"
import dotenv from 'dotenv'

dotenv.config();
// 1. Initialize Resend here (Upar top level pe)
const resend = new Resend(process.env.RESEND_API_KEY!);
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
    },
})

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    // Map your custom columns so Better Auth exposes them to your sessions
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "USER",
            },
            phone: {
                type: "string",
                required: false,
            },
            onboardingCompleted: {
                type: "boolean",
                required: false,
                defaultValue: false,
            },
            isActive: {
                type: "boolean",
                required: false,
                defaultValue: true,
            },
        },
    },
    // Optional: Boost performance by allowing Better Auth to use SQL joins (v1.4+)
    experimental: {
        joins: true, 
    },
    emailAndPassword: {  
        enabled: true,
        requireEmailVerification: true,
    },

    plugins:[
        emailOTP({
            async sendVerificationOTP({email, otp, type}){
                let subject = "";
                let htmlContent = "";

                // 2. Type ke hisaab se Email ka Text aur Subject set karo
                if(type === "sign-in"){
                    subject = "Your Login Code - AcademyFind";
                    htmlContent = `<p>Welcome back! Use the following code to sign in:</p>`;
                } else if(type === "email-verification"){
                    subject = "Verify Your Email - AcademyFind";
                    htmlContent = `<p>Welcome to AcademyFind! Please verify your email address using this code:</p>`;
                } else if(type === "forget-password"){
                    subject = "Reset Your Password - AcademyFind";
                    htmlContent = `<p>We received a request to reset your password. Use this code to proceed:</p>`;
                }

                // 3. Resend ko bolkar Email Bhejo
                try {
                    await transporter.sendMail({
                        from: `"AcademyFind" <${process.env.EMAIL_USER}>`, // Dev testing ke liye Resend ka default
                        to: email,
                        subject: subject,
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                                <h2 style="color: #f59e0b;">AcademyFind</h2>
                                ${htmlContent}
                                <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
                                    <strong style="font-size: 28px; letter-spacing: 4px; color: #1f2937;">${otp}</strong>
                                </div>
                                <p style="font-size: 14px; color: #6b7280;">This code is valid for a limited time. Please do not share it with anyone.</p>
                            </div>
                        `,
                    });

                        console.log(`✅ Successfully sent ${type} OTP to ${email}`);
                    
                } catch (err) {
                    console.error(`❌ Failed to send ${type} email:`, err);
                }
            }
        })
    ]
});