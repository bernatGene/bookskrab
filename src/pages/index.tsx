import { inferMutationInput, inferMutationOutput, trpc } from "../utils/trpc"
import { getBookPair, getOptionsForVote } from "../utils/getRandomBook";
import { FormEvent, useEffect, useLayoutEffect, useState } from "react";
import { UseMutationResult, UseQueryResult } from "react-query";
import { BookInfo } from "../server/router/bookinfo";
import Image from "next/image";
import Link from "next/link";
import { set } from "zod";
import { type } from "os";

const buttonClasses = "bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow disabled"
const underlineFormClasses = "w-full max-w-sm"
const underlineFormDivClasses = "flex items-center border-b border-teal-500 py-2"
const underlineFormInputClasses = "appearance-none bg-transparent border-none w-full text-gray-100 mr-3 py-1 px-2 leading-tight focus:outline-none"
const underlineFormButtonClasses1 = 'flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded'
const underlineFormButtonClasses2 = 'flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded'


const BookCardElement: React.FC<{displaySearch: boolean, result: UseQueryResult<BookInfo>}> =({
  displaySearch,
  result}) => {
  if (!displaySearch) return <div>Nothing yet</div>
  const title = result.data?.title || "Loading...";
  const authors = result.data?.authors || "Loading...";
  const languageNames = new Intl.DisplayNames(['en'], {
    type: 'language'
  });
  const language = languageNames.of(result.data?.language || "zxx");
  const yearPublished = result.data?.pusblishedDate || "Loading...";
  const thumbnail = result.data?.thumbnail || "https://static.thenounproject.com/png/132226-200.png"
  const isbn = result.data?.identifier || "Error"
  const storeMutation = trpc.useMutation(["book.store-book"]);
  
  const storeToLibrary = async () => {
    if (result.data) storeMutation.mutate({ ...result.data });
  }
  if (isbn == "Error") return <div>ISBN not found</div>

  return (
    <div className="p-4 border rounded flex flex-col">
      <div className="flex flex-row items-center">
        <div className="p-4 rounded w-32 h-32 relative">
          <Image src={thumbnail} layout={"fill"} objectFit={"contain"} alt="No Image available" />
        </div>
        <div className="p-8">
          <div>{"Title: " + title}</div>
          <div>{"Author: " + authors}</div>
          <div>{"Language: " + language}</div>
          <div>{"Year: " + yearPublished}</div>
          <div>{"ISBN: " + isbn}</div>
        </div>
      </div>
      <button className={buttonClasses} onClick={storeToLibrary} type="button"> Add book to library</button>
    </div>
  );
}


export default function AddBook() {

  const [isbn, setIsbn] = useState("-1")
  useEffect(() => {
    setIsbn(String(getBookPair()[0]) || "-1")
  }, []);

  const [bookCard, setBookCard] = useState(false);
  const searchResults = trpc.useQuery(["book.get-book-info-by-isbn", { identifier: (String(isbn)) }])
  
  const handleSearchISBN = async (event: FormEvent) => {
    event.preventDefault();
    setBookCard(true)
  };
  const randomISBN = () => {
    setIsbn(String(getBookPair()[0]))
    setBookCard(false)
  };
  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center">
      <div className="p-8"></div>
      <h3 className="font-medium leading-tight text-3xl mt-0 mb-2 text-white">BookŠkrab</h3>
      <div className="p-8"></div>
      <div className="text-center">Add new book</div>
      <div className="p-2"></div>
      <form className={underlineFormClasses} onSubmit={handleSearchISBN}>
        <div className={underlineFormDivClasses}>
          <label>ISBN</label>
          <input className={underlineFormInputClasses} type="text" placeholder={isbn} onChange={event => setIsbn(event.target.value)} name="ISBN"></input>
          <button className={underlineFormButtonClasses1} type="submit">
            Search
          </button>
          <button className={underlineFormButtonClasses2} onClick={randomISBN} type="button">
            Random
          </button>
        </div>
      </form>
      <BookCardElement displaySearch={bookCard} result={searchResults}></BookCardElement>
      <div className="w-full text-xl text-center pb-2">
        <Link href="/browse">
          <a>Browse</a>
        </Link>
        <span className="p-4">{"-"}</span>
        <Link href="/about">
          <a>About</a>
        </Link>
      </div>
    </div>
  )
}