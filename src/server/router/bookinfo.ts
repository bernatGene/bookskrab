import { createRouter } from "./context";
import { z } from "zod";
import axios, { AxiosError, AxiosResponse } from 'axios';
import { BOOK_ID_TYPE } from "@prisma/client";
import { prisma } from "../db/client";


export interface BookInfo {
    title: string;
    language: string;
    publisher?: string;
    pusblishedDate?: string;
    authors: string[];
    thumbnail?: string;
    identifier: string;
    pageCount?: number;
    idType: BOOK_ID_TYPE
}

const unknownBook : BookInfo = {
    title: "Unknown",
    language: "Unknown",
    pusblishedDate: "Unknown",
    authors: ["unknown"],
    thumbnail: undefined,
    identifier: "error",
    idType: BOOK_ID_TYPE.ADHOC
};

function formatGoogleBooksResponse(response: AxiosResponse, identifier: string): BookInfo {
    if (! (response.data.totalItems > 0 )) {
        throw new AxiosError("Book not found")
    }
    const volumeInfo = response.data.items[0].volumeInfo;
    const title = volumeInfo.title || unknownBook.title;
    const language = volumeInfo.language || unknownBook.language;
    const pusblishedDate = volumeInfo.publishedDate || unknownBook.pusblishedDate;
    const authors = volumeInfo.authors || unknownBook.authors;
    const thumbnail = ("imageLinks" in volumeInfo) ? volumeInfo.imageLinks.thumbnail : unknownBook.thumbnail
    return {title: title,
            language: language,
            pusblishedDate: pusblishedDate,
            authors: authors,
            thumbnail: thumbnail,
            identifier: identifier,
            idType: BOOK_ID_TYPE.ISBN13
          }
}

async function getInfo(isbn: string): Promise<BookInfo> {
    const instance = axios.create({
        baseURL: "https://www.googleapis.com"
    });
    if (isbn === "Error") return unknownBook
    return new Promise<BookInfo>((resolve, reject) => {
        instance
        .get("/books/v1/volumes?q=isbn:" + isbn)
        .then((response: AxiosResponse) => resolve(formatGoogleBooksResponse(response, isbn)))
        .catch((error: AxiosError<string>) => reject(error));
    });
};

export const bookRouter = createRouter()
  .query("get-book-info-by-isbn", {
    input: z
      .object({
        identifier: z.string(),
      }),
    async resolve({ input }) {
        const bookInfo = await getInfo(input.identifier)
        return bookInfo
    }
  }).mutation("store-book", {
    input: z.object({
      identifier: z.string(),
      title: z.string(),
      authors: z.array(z.string()),
      publishedDate: z.string().nullish(),
      thumbnail: z.string().nullish(),
      language: z.string().nullish(),
    }),
    async resolve({input}) {
      const storeInDb = await prisma.book.create({
        data: {identifier: input.identifier,
              idType: BOOK_ID_TYPE.ISBN13,
              title: input.title,
              publishedDate: input?.publishedDate,
              thumbnailURL: input?.thumbnail,
              language: input?.language,
            }
      })
      return {success: true, store: storeInDb}
    }
  });


