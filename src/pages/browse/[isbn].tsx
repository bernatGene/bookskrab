import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { prisma } from "../../server/db/client"
import { GetServerSideProps, GetStaticPaths } from "next";
import Image from "next/image";



export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const bookInfo = await prisma.book.findUnique({
    where: {
      identifier: String(params?.isbn),
    },
    include: {
      authors: true,
      tags: true
    }
  });
  return {
    props: {
      title: bookInfo?.title,
      publishedDate: bookInfo?.publishedDate,
      language: bookInfo?.language,
      thumbnailURL: bookInfo?.thumbnailURL || "https://static.thenounproject.com/png/132226-200.png",
      authors: bookInfo?.authors,
      tags: bookInfo?.tags,
      isTranslation: bookInfo?.isTranslation,
      copies: bookInfo?.copies,
      bookShelfShortName: bookInfo?.bookShelfShortName,
      pageCount: bookInfo?.pageCount,
      description: bookInfo?.description,
      publisher: bookInfo?.publisher,
    },
  };
};


export type BookProps = {
  title: string
  publisher: string
  publishedDate: string
  language: string
  thumbnailURL: string
  authors: string[]
  tags: string[]
  isTranslation: boolean
  copies: number
  bookShelfShortName: string
  pageCount: number
  description: string
}


const Post: React.FC<BookProps> = (props) => {
  return (
    <div className="p-8 flex flex-col items-center">
      <div className="p-4 fcenter lex flex-col max-w-2xl border">
        <div className="flex flex-row justify-items-end">
          <div className="flex flex-col">
            <h2 className="text-xl">Title: {props?.title}</h2>
            <div>By {props?.authors[0] || "Unknown author"}</div>
            <div>Language: {props?.language || "Unknown"}</div>
          </div>
          <div className="p-8 rounded w-32 h-32 relative">
            <Image className="object-justify-end" src={props?.thumbnailURL} layout={"fill"} objectFit={"contain"} alt="No Image available" />
          </div>
        </div>
        <div className="p-4">
          <p>Published: {props?.publishedDate || "Unknown date"}, by: {props?.publisher || "Unknown publisher"}</p>
          <p>Page count: {props?.pageCount || "Unknown"}</p>
          <p>Bookshelf: {props?.bookShelfShortName || "Unknown location"}</p>
          <p>Description: {props?.description || "Empty"}</p>
          <p>Copies: {props?.copies || "Empty"}</p>
          <p>Tags: {props?.tags || "Empty"}</p>
        </div>
      </div>
    </div>
  )
};

export default Post