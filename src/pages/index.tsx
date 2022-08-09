import { trpc } from "../utils/trpc"
import { getBookPair } from "../utils/getRandomBook";
import { useEffect, useState } from "react";
import { UseQueryResult } from "react-query";
import { BookInfo } from "../server/router/bookinfo";


function bookCard(result: UseQueryResult<BookInfo>) {
    const title = result.data?.title || "Loading...";
    const author = result.data?.authors || "Loading...";
    const languageNames = new Intl.DisplayNames(['en'], {
      type: 'language'
    });    
    const language = languageNames.of(result.data?.language || "zxx");
    const yearPublished = result.data?.pusblishedDate || "Loading...";
    const thumbnail = result.data?.thumbnail || "Thumbnail"
    return (  
    <div className="p-4 border rounded">
      <div className="flex flex-row items-center">
        <div className="p-4 border rounded">
          <img src={thumbnail} alt="Unknown cover"/>
        </div>
        <div className="p-8">
          <div>{"Title: " + title}</div>
          <div>{"Author: " + author}</div>
          <div>{"Language: " + language}</div>
          <div>{"Year: " + yearPublished}</div>
        </div>
      </div>
    </div>
    );
}

export default function Home() {
  
  const [options, setOptions] = useState([-1, -1])
  useEffect(() => setOptions(getBookPair()),[])
  const [first, second] = options;
  console.log(first, second)
  const firstInfo = trpc.useQuery(["book.get-book-info-by-isbn", {isbn: (first || 0)}])
  const secondInfo = trpc.useQuery(["book.get-book-info-by-isbn", {isbn: (second || 0)}])

  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center"> 
      <div className="p-8"></div>
      <div className="text-center">Books</div>
      <div className="p-2"></div>
      <div className="p-8 border rounded flex w-max-w-6xl items-center">
        <div className="max-w-3xl">{bookCard(firstInfo)}</div>
        <div className="w-8 h-8 p-4">or</div>
        <div className="max-w-3xl">{bookCard(secondInfo)}</div>
      </div>
    </div>
  );
} 