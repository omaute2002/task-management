import Image from "next/image";
import Navbar from "@/components/custom-components/Navbar";

export default function Home() {
  return (
    <>
    <Navbar />
   <div className="items-center bg-gray-200 max-h-full">
    <h1 className="text-center">Hello</h1>
   </div>
    </>
  );
}
