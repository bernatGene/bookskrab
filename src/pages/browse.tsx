
import { prisma } from "../server/db/client"
import Head from "next/head";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Header } from ".";


export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;

const getBookList = async () => {
  const books = await prisma.book.findMany({
    orderBy: {
      lastModified: 'desc'
    },
    include: {
      authors: true
    }
  });
  return books
}

type BookDbResult = AsyncReturnType<typeof getBookList>

const BookListing: React.FC<{ result: BookDbResult[number], index: number }> = ({
  result,
  index
}) => {
  const isbn = String(result.identifier)
  return (
    <tr className="border-b">
      <td className="px-6 py-2 whitespace-nowrap text-sm font-medium ">{index}</td>
      <td className="text-sm font-light px-6 py-2 whitespace-nowrap">
        <Link href={"/browse/" + isbn} className="p-4"><a className="no-underline hover:underline">{result.title}</a></Link>
      </td>
      <td className="text-sm font-light px-6 py-2 whitespace-nowrap">
        <div className="p-4">{result.authors[0]?.name || "?"}</div>
      </td>
      <td className="text-sm font-light px-6 py-2 whitespace-nowrap">
        {result.lastModified.toString()}
      </td>
    </tr>
  );
};

const BrowsePage: React.FC<{
  books: BookDbResult;
}> = (props) => {
  if (!props.books) {
    return <h2> No books found </h2>
  }
  return (
    <div className="flex flex-col items-center">
      <Header></Header>
      <h2 className="text-2xl p-4">Results</h2>
      <Link href="/">
       <a className="no-underline hover:underline">Back to main</a> 
      </Link>
      <div className="flex flex-col w-full max-w-3xl border p-4">
        <table className="table-auto p-4">
        </table>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-center">
                  <thead className="border-b ">
                    <tr>
                      <th scope="col" className="text-sm font-medium px-6 py-2">
                        #
                      </th>
                      <th scope="col" className="text-sm font-medium px-6 py-2">
                        Title
                      </th>
                      <th scope="col" className="text-sm font-medium px-6 py-2">
                        Author(s)
                      </th>
                      <th scope="col" className="text-sm font-medium px-6 py-2">
                        Modified
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {props.books
                      .map((currentBook, index) => {
                        return <BookListing result={currentBook} key={index} index={index + 1} />;
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BrowsePage

export const getStaticProps: GetServerSideProps = async () => {
  const booksOrdered = await getBookList();
  // console.log(booksOrdered)
  return { props: { books: JSON.parse(JSON.stringify(booksOrdered)) }, revalidate: 5 }
}