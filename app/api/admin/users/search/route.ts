import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const { search } = Object.fromEntries(new URL(req.url).searchParams);

    if (!search) return NextResponse.json([]);

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { email: { contains: search, mode: "insensitive" } },
                { name: { contains: search, mode: "insensitive" } },
            ]
        },
        take: 20
    });

    return NextResponse.json(users);
}
