//@ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useSession } from "@/context/SessionContext";
import Link from "next/link";
import { validateJWT } from "@/lib/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Navbar() {
  const router = useRouter();
  const { sessionInfo, setSessionInfo } = useSession();
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  // Simplified logout logic
  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
      // setSessionInfo(null); // Clear session info
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
      router.push("/login"); // Fallback redirect to login
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if(!token){
      router.push('/login')
    }
    
  }, [router]); // Only runs on initial load or router change

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center">
      <a className="text-white text-3xl font-bold" href="/">
        TaskFlow
      </a>

      {sessionInfo ? (
        <div className="flex ml-auto mr-8 space-x-7">
          <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="bg-white hover:bg-slate-400">
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <Link href="/login">
          <Button className="bg-white text-black px-4 py-2 rounded hover:bg-indigo-400 transition duration-300">
            Get Started
          </Button>
        </Link>
      )}
    </nav>
  );
}
