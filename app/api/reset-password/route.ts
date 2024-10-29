"use server";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/mongoose";
import User from "../../../models/User";

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log("[Password Reset] Request received.");

  // Parse the URL to get query parameters
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  let email = searchParams.get("email");

  if (!token || !email) {
    console.warn("[Password Reset] Missing token or email in request.");
    return NextResponse.json(
      { message: "Invalid request. Missing token or email." },
      { status: 400 }
    );
  }

  // Clean up email if necessary
  email = email.replace(/ /g, "+");
  console.log(`[Password Reset] Token and email received. Email: ${email}, Token: ${token}`);

  try {
    // Parse the request body for the new password
    const { newPassword } = await req.json();
    if (!newPassword) {
      console.warn("[Password Reset] New password is missing in request.");
      return NextResponse.json(
        { message: "New password is required." },
        { status: 400 }
      );
    }

    console.log("[Password Reset] Connecting to the database...");
    await dbConnect();
    console.log("[Password Reset] Database connection successful.");

    // Find the user with the provided email and reset token
    const user = await User.findOne({ email, token });
    const currentTime = new Date();
    console.log(`[Password Reset] User search result: ${user ? "User found" : "User not found or invalid token"}`);

    // Check if user and token exist, and if the token has expired
    if (!user || !user.tokenExpiry || currentTime > user.tokenExpiry) {
      console.warn("[Password Reset] Invalid or expired reset token.");
      return NextResponse.json(
        { message: "Invalid or expired reset link." },
        { status: 400 }
      );
    }

    console.log("[Password Reset] Valid reset token. Proceeding to hash the new password...");

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("[Password Reset] New password hashed successfully.");

    // Update the user's password and clear the token fields
    user.password = hashedPassword;
    user.token = null;
    user.tokenExpiry = null;
    await user.save();
    console.log(`[Password Reset] Password reset successful for user: ${email}`);

    // Redirect to the sign-in page after successful reset
    return NextResponse.redirect(
      new URL("/auth/signin", process.env.NEXTAUTH_URL).toString()
    );
  } catch (error) {
    console.error("[Password Reset] Error during password reset:", error);
    return NextResponse.json(
      { message: "Password reset failed. Please try again." },
      { status: 500 }
    );
  }
}