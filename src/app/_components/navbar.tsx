"use client";

import { useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { api } from "~/trpc/react";
import Link from "next/link";

const NavBar = () => {
    return (
        <nav>
            <div className="container mx-auto px-4 py-5 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-red-600">
                    Ticketgrid
                </Link>
                <div className="content-center">
                    <SignedOut>

                        <SignInButton>
                            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500">
                                Login
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                    <Link href="/create-ticket">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 mr-5">
                            Create ticket
                            </button>
                            </Link>
                        
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;
