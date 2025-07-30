import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import { transporter, mailOptions } from "@/lib/nodemailer";
import { z } from "zod";
import logger from "@/lib/logger";
import User from "@/app/models/User";
import connectMongo from "@/lib/mongoose";

const requestOtpSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = requestOtpSchema.parse(body);

    await connectMongo();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis with expiry (10 minutes)
    await redis.set(`otp:${email}`, otp, "EX", 600);

    // Send email
    await transporter.sendMail({
      ...mailOptions,
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    });

    logger.info(`OTP sent to ${email}`);
    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      {
        message: "Failed to send OTP",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
