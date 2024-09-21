"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useSession } from "@/context/SessionContext";
import Link from "next/link";
import { User, CreditCard, LogOut } from "lucide-react";
import { validateJWT } from "@/lib/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Token {
  token: String;
}

export default function Navbar() {
  const router = useRouter();

  const { sessionInfo, setSessionInfo } = useSession();

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setSessionInfo(null);
    router.push("/");
  };
  console.log(sessionInfo);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/");
    } else {
      const isValid = validateJWT(token);
      if (!isValid) {
        handleLogout(); // Token is invalid or expired
      }
    }
  }, []);
  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center">
      <a className="text-white text-3xl font-bold" href="/">
        TaskFlow
      </a>

      {sessionInfo ? (
        <>
          <div className="flex ml-auto mr-8 space-x-7">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="bg-white hover:bg-slate-400">Logout</Button>
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
        </>
      ) : (
        <>
          <Link href="/login">
            <Button className="bg-white text-black px-4 py-2 rounded hover:bg-indigo-400 transition duration-300">
              Get Started
            </Button>
          </Link>
        </>
      )}
    </nav>
  );
}
