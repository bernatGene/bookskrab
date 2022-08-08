import { trpc } from "../utils/trpc"
// import { getBookPair } from "../utils/getRandomBook";
import { getBookPair } from "../utils/getRandomBook";
import { useEffect, useState } from "react";

export default function Home() {
  
  const [options, setOptions] = useState([-1, -1])
  useEffect(() => setOptions(getBookPair()),[])
  const [first, second] = options
  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center"> 
      <div className="p-8"></div>
      <div className="text-xl text-center">Books</div>
      <div className="p-2"></div>
      <div className="p-8 border rounded flex max-w-2xl text-center items-center">
        <div className="w-32 h-8">{first == -1 ? "..." : first}</div>
        <div className="w-8 h-8 p16">or</div>
        <div className="w-32 h-8">{second == -1 ? "..." : second}</div>
      </div>
    </div>
  );
} 