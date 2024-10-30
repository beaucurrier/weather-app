// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/mongoose";
import User from "../../../models/User";
// import { getServerSession } from "next-auth";
// import authOptions  from "../../../lib/auth";

export async function GET(req: NextRequest) {
  // Parse the query parameters (for the initial page load when clicking the link)
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.json(
      { message: "Invalid request. Missing token or email." },
      { status: 400 }
    );
  }

  // Return a response indicating the reset page can load
  return NextResponse.redirect(new URL(`/auth/reset-password?email=${email}&token=${token}`, process.env.NEXTAUTH_URL).toString());
}

export async function POST(req: NextRequest) {
  // const session = await getServerSession(authOptions);
  // const { searchParams } = new URL(req.url);
  // const token = searchParams.get("token");
  // console.log('token', token)
  // let email = searchParams.get("email");
  // console.log('email', email)
  // if(email){
  // email = email.replace(/ /g, "+");
  // }

  // if (!token || !email) {
  //   return NextResponse.json(
  //     { message: "Invalid request. Missing token or email." },
  //     { status: 400 }
  //   );
  // }

  try {
    const { newPassword, email, token } = await req.json();
    console.log('email', email)
    console.log('token', token)
    if (!newPassword || !token || !email ) {
      return NextResponse.json(
        { message: "New password is required." },
        { status: 400 }
      );
    }
    console.log(email, token)
    const updatedEmail = email.replace(/ /g, '+')

    await dbConnect();
  
    const user = await User.findOne({ updatedEmail });

    if (!user || !user.tokenExpiry || new Date() > user.tokenExpiry) {
      return NextResponse.json(
        { message: "Invalid or expired reset link." },
        { status: 400 }
      );
    }
  
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the token fields
    user.password = hashedPassword;
    user.token = null;
    user.tokenExpiry = null;
    await user.save();
  
    console.log(`Password reset successful for user: ${email}`);

    // Redirect to the sign-in page after successful reset
    return NextResponse.redirect(
      new URL("/auth/signin", process.env.NEXTAUTH_URL).toString()
    );
  } catch (error) {
    console.error("Error during password reset:", error);
    return NextResponse.json(
      { message: "Password reset failed. Please try again." },
      { status: 500 }
    );
  }
}