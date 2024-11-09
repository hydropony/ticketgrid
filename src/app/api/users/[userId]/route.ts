// // app/users/[userId]/route.ts

// import { createClerkClient } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { env } from "process";

// async function getUserInfo(userId: string) {
//     const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
//     try {
//         const user = await clerkClient.users.getUser(userId);
//         return { userId: user.id, fullname: `${user.firstName} ${user.lastName}`, imageUrl: user.imageUrl, isAdmin: (user.publicMetadata?.isAdmin || false) };
//     } catch (error) {
//         console.error("Error fetching user data:", error);
//         return null; // Return null if user is not found
//     }
// }

// export async function GET(req: Request, { params }: { params: { userId: string } }) {
//     const user = await getUserInfo(params.userId);

//     if (!user) {
//         return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(user);
// }
