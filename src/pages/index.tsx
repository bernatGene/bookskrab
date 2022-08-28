import { inferMutationInput, inferMutationOutput, trpc } from "../utils/trpc"
import { getBookPair, getOptionsForVote } from "../utils/getRandomBook";
import { FormEvent, useEffect, useLayoutEffect, useState } from "react";
import { UseMutationResult, UseQueryResult } from "react-query";
import { BookInfo } from "../server/router/bookinfo";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const buttonClasses = "bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow disabled"
const underlineFormClasses = "w-full max-w-sm"
const underlineFormDivClasses = "flex items-center border-b border-teal-500 py-2"
const underlineFormInputClasses = "appearance-none bg-transparent border-none w-full text-gray-100 mr-3 py-1 px-2 leading-tight focus:outline-none"
const underlineFormButtonClasses1 = 'flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded'
const underlineFormButtonClasses2 = 'flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded'


const BookCardElement: React.FC<{ displaySearch: boolean, result: UseQueryResult<BookInfo> }> = ({
  displaySearch,
  result }) => {
  const [displayBanner, setDisplayBanner] = useState(false)
  const [currId, setCurrId] = useState("-1")
  const title = result.data?.title || "Loading...";
  const authors = result.data?.authors || "Loading...";
  const languageNames = new Intl.DisplayNames(['en'], {
    type: 'language'
  });
  const language = languageNames.of(result.data?.language || "zxx");
  const yearPublished = result.data?.publishedDate || "Loading...";
  const thumbnail = result.data?.thumbnail || "https://static.thenounproject.com/png/132226-200.png"
  const isbn = result.data?.identifier || "Error"
  const bookExists = trpc.useQuery(["book.is-book-in-db", { identifier: isbn }]);
  const storeMutation = trpc.useMutation(["book.store-book"]);
  const storeToLibrary = async () => {
    if (result.data) storeMutation.mutate({ ...result.data });
    setDisplayBanner(true)
    setCurrId(result.data?.identifier || "-1")
  }

  if (isbn == "Error") return <div>ISBN not found</div>
  if (!displaySearch) return <div></div>

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
      <InfoBanner display={displayBanner && currId === isbn} identifier={isbn} bookExists={bookExists.data == true}></InfoBanner>
    </div>
  );
}

const InfoBanner: React.FC<{ display: boolean, identifier: string, bookExists: boolean }> = ({
  display,
  identifier,
  bookExists
}) => {
  if (!display) return <></>;

  let message = ""
  let color = "black"
  if (!bookExists) {
    message = "Book was added to the library"
    color = "green"
  } else {
    message = "Book was already in the library"
    color = "red"
  }
  return (
    <div className="p-4">
      <div className={`p-4 ${bookExists ? "bg-red-200" : "bg-green-200"} text-black rounded px-4 py-3`} role="alert">
        <p className="text-center font-bold">{message}</p>
      </div>
    </div>
  )
}

function AddBook() {

  const [isbn, setIsbn] = useState("-1")
  // useEffect(() => {
  //   setIsbn(String(getBookPair()[0]) || "-1")
  // }, []);

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
    <div>
      <div className="p-8"></div>
      <div className="text-center text-sm">Enter an ISBN to add a new book</div>
      <div className="p-2"></div>
      <form className={underlineFormClasses} onSubmit={handleSearchISBN}>
        <div className={underlineFormDivClasses}>
          <label><b>ISBN:</b></label>
          <input className={underlineFormInputClasses} type="text" placeholder={isbn === "-1" ? "" : isbn} onChange={event => setIsbn(event.target.value)} name="ISBN"></input>
          <button className={underlineFormButtonClasses1} type="submit">
            Search
          </button>
          <button className={underlineFormButtonClasses2} onClick={randomISBN} type="button">
            Random
          </button>
        </div>
      </form>
      <BookCardElement displaySearch={bookCard} result={searchResults}></BookCardElement>
    </div>
  )
}


export function Header () {
  const loc = useRouter();
  const setBackground = (name: string) => {
    if (loc.asPath === name) {
      return "border-teal-500"
    }
  }
  const [isNavOpen, setIsNavOpen] = useState(false); // initiate isNavOpen state with false

  const toogleNav = () => {
    if (isNavOpen) setIsNavOpen(false);
    else setIsNavOpen(true);
  }
  return (
    <nav className="flex items-center justify-between flex-wrap  p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" /></svg>
          <span className="font-semibold text-xl tracking-tight">Škrbook</span>
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white" onClick={() => toogleNav()}>
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
          </button>
        </div>
        <div className={"w-full " + `${isNavOpen ? "block" : "hidden"}` + " flex-grow lg:flex lg:items-center lg:w-auto"}>
          <div className="text-sm lg:flex-grow">
            <Link href={"/"}>
            <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 border-spacing-2 border-teal-500">
              Add new
            </a>
            </Link>
            <Link href={"/browse"}>
            <a  className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Library
            </a>
            </Link>
            <Link href={"/"}>
            <a  className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
              Search
            </a>
            </Link>
          </div>
        </div>
      </nav>
  )
}




export default function Main() {

  const [mode, setMode] = useState(0)
  const componentByMode = (mode: number) => {
    switch (mode) {
      case 0:
        return <AddBook></AddBook>
    }
  }
  return (
    <div className="flex flex-col items-center">
      <Header></Header>
      <div>{componentByMode(mode)}</div>
      
    </div>

  )
}