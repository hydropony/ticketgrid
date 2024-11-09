"use client";

import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import Link from "next/link";
const NavBar = () => {
    return (
        <nav>
            <div className="container mx-auto px-4 py-5 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-red-600" style={{ marginLeft: "-65px" }}>
                    Ticketgrid
                </Link>

                <div className="flex items-center gap-4">
                    <SignedOut>
                        <SignInButton>
                            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500">
                                Login
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <Link href="/create-ticket">
                            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 px-4 py-1">
                                Create ticket
                            </button>
                        </Link>
                        
                        {/* Aligns UserButton with the Create ticket button */}
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;