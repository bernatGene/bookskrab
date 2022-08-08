import { trpc } from "../utils/trpc"
// import { getBookPair } from "../utils/getRandomBook";
import { getBookPair } from "../utils/getRandomBook";
import { useEffect, useState } from "react";

export default function Home() {
  
  const [options, setOptions] = useState([-1, -1])
  useEffect(() => setOptions(getBookPair()),[])
  const [first, second] = options;
  const urlPrefix = "https://openlibrary.org/isbn/";
  const urlPrefix2 = "https://www.google.com/search?tbm=bks&q=isbn:"
  const urlSuffix = ".html"

  const staticBook = trpc.useQuery(["book.get-book-info-by-isbn", {isbn: first || 0}])
  // const bullshit = fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:9781853260025").then(result => result.text)
  // console.log(staticBook.data)
  console.log("RESPONSE", staticBook.data)
  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center"> 
      <div className="p-8"></div>
      <div className="text-xl text-center">Books</div>
      <div className="p-2"></div>
      <div className="p-8 border rounded flex w-max-w-6xl text-center items-center">
        <div className="max-w-3xl h-8">
          <a href={urlPrefix2 + first}>{first == -1 ? "..." : first}</a> 
        </div>
        <div className="w-8 h-8 p16">or</div>
        <div className="max-w-3xl h-8">
          <a href={urlPrefix + second}>{second == -1 ? "..." : second}</a> 
        </div>
      </div>
    </div>
  );
} 