import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import  { prisma } from "../../server/db/client"
import { GetServerSideProps, GetStaticPaths } from "next";



export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.book.findUnique({
    where: {
      identifier: String(params?.isbn),
    },
  });
  return {
    props: {title: post?.title || "Database error"},
  };
};

export type BookProps = {
  title: string;
  author: {name: string};
  published: string;
}

const Post: React.FC<BookProps> = (props) => {
  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }

  return (
    <div className="flex flex-col w-full max-w-2xl border">
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
      </div>
  )
}

export default Post