import { trpc } from "../utils/trpc"
import { getBookPair } from "../utils/getRandomBook";
import { useEffect, useState } from "react";
import { UseQueryResult } from "react-query";
import { BookInfo } from "../server/router/bookinfo";
import Image from "next/image";
import Link from "next/link";

const buttonClasses = "bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"


function bookCard(result: UseQueryResult<BookInfo>) {
    const title = result.data?.title || "Loading...";
    const authors = result.data?.authors || "Loading...";
    const languageNames = new Intl.DisplayNames(['en'], {
      type: 'language'
    });    
    const language = languageNames.of(result.data?.language || "zxx");
    const yearPublished = result.data?.pusblishedDate || "Loading...";
    const thumbnail = result.data?.thumbnail ||"https://static.thenounproject.com/png/132226-200.png"
    const isbn = result.data?.identifier || "Error"
    return (  
    <div className="p-4 border rounded">
      <div className="flex flex-row items-center">
        <div className="p-4 rounded w-32 h-32 relative">
          <Image src={thumbnail} layout={"fill"} objectFit={"contain"} alt="No Image available"/>
        </div>
        <div className="p-8">
          <div>{"Title: " + title}</div>
          <div>{"Author: " + authors}</div>
          <div>{"Language: " + language}</div>
          <div>{"Year: " + yearPublished}</div>
          <div>{"ISBN: " + isbn}</div>
        </div>
      </div>
    </div>
    );
}

export default function Home() {
  
  const [options, setOptions] = useState([-1, -1])
  useEffect(() => setOptions(getBookPair()),[])
  const [first, second] = options;
  const firstInfo = trpc.useQuery(["book.get-book-info-by-isbn", {identifier: (String(first) || "Error")}])
  const secondInfo = trpc.useQuery(["book.get-book-info-by-isbn", {identifier: (String(second) || "Error")}])

  const storeMutation = trpc.useMutation(["book.store-book"]);

  const storeToLibrary = (isbn: number) => {
    if (isbn === first && firstInfo.data) {
      storeMutation.mutate({...firstInfo.data})
    } else if (isbn === second && secondInfo.data) {
      storeMutation.mutate({...secondInfo.data})
    }
    setOptions(getBookPair())
  }
  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center"> 
      <div className="p-8"></div>
      <div className="text-center">Books</div>
      <div className="p-2"></div>
      <div className="p-8 border rounded flex w-max-w-6xl items-center">
        <div className="flex flex-col items-center">
          <div className="max-w-3xl">{bookCard(firstInfo)}</div>
          <div className="p-4"></div>
          <button className={buttonClasses} onClick={() => storeToLibrary(first || 0)}> Store to library</button>
        </div>
        <div className="flex flex-col items-center">
          <div className="max-w-3xl">{bookCard(secondInfo)}</div>
          <div className="p-4"></div>
          <button className={buttonClasses} onClick={() => storeToLibrary(second || 0)}> Store to library</button>
        </div>
        <div className="w-full text-xl text-center pb-2">
          <a href="https://twitter.com/t3dotgg">Twitter</a>
          <span className="p-4">{"-"}</span>
          <Link href="/browse">
            <a>Browse</a>
          </Link>
          <span className="p-4">{"-"}</span>
          <Link href="/about">
            <a>About</a>
          </Link>
          </div>
        </div>
      </div>
  );
} 