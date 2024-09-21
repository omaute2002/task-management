"use client"
import Image from "next/image";
import Navbar from "@/components/custom-components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to TaskFlow</h1>
        <p className="text-lg text-center mb-4">Your ultimate task management application.</p>
        
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
          <h2 className="text-2xl font-semibold mb-4">Get Started with these credentails</h2>
          <Label className="text-right">Email:</Label>
          <Input className="mb-2" value="test@gmail.com" />
          <Label className="text-right">Password:</Label>
          <Input className="mb-6" value="test123" />
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => router.push('/login')}
          >
           Go to Log In
          </Button>
        </div>
      </div>
    </>
  );
}
