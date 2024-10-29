"use server";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongoose";
import User, { IUser } from "../../../../models/User";
import { getServerSession } from "next-auth";
import authOptions from "../../../../lib/auth";
// @ts-ignore
import City, { ICity } from "../../../../models/City";

export async function POST(req: NextRequest): Promise<NextResponse> {
  await dbConnect();
  const body = await req.json();
  const { cityId }: { cityId: number } = body;
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  const user: IUser | null = await User.findOne({
    email: session.user?.email,
  }).populate<{ favoriteCities: ICity[] }>("favoriteCities");
  if (!user)
    return NextResponse.json({ message: "User Not Found" }, { status: 404 });

  // Remove city from favorites
  user.favoriteCities = user.favoriteCities?.filter(
    (fav: ICity) => fav.id.toString() !== cityId.toString()
  );
  await user.save();
  return NextResponse.json(user.favoriteCities, { status: 200 });
}