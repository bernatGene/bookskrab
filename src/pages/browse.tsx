
import  { prisma } from "../server/db/client"
import Head from "next/head";
import { GetServerSideProps } from "next";
import Link from "next/link";


export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;

const getBookList =  async () => {
    const books = await prisma.book.findMany({
        orderBy: {
            lastModified: 'desc'
        }
    });
    return books
}

type BookDbResult = AsyncReturnType<typeof getBookList>

const BookListing: React.FC<{result: BookDbResult[number], index: number}> = ({
        result, 
        index
    }) => { 
    const isbn = String(result.identifier)
    return (
        <div className="relative flex flex-row items-center">
            <div className="p-4">{index}</div>
            <div className="p-4">{isbn}</div>
            <div className="p-4">{result.title}</div>
        </div>      
    );
};

const BrowsePage: React.FC<{
    books: BookDbResult;
  }> = (props) => {
    if (! props.books) {
        return <h2> No books found </h2>
    }
    return (
      <div className="flex flex-col items-center">
        <Head>
          <title>browse</title>
        </Head>
        <h2 className="text-2xl p-4">Results</h2>
        <Link href="/">
            <a>Back to main</a>
          </Link>
        <div className="flex flex-col w-full max-w-2xl border">
          {props.books
            .map((currentBook, index) => {
              return <BookListing result={currentBook} key={index} index={index + 1} />;
            })}
        </div>
      </div>
    );
  };

export default BrowsePage

export const getStaticProps: GetServerSideProps = async () => {
    const booksOrdered  = await getBookList();
    // console.log(booksOrdered)
    return {props: {books: JSON.parse(JSON.stringify(booksOrdered))}, revalidate: 5}
}