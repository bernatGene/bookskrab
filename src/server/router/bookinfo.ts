import { createRouter } from "./context";
import { z } from "zod";
import axios, { AxiosError, AxiosResponse } from 'axios';
import { resolve } from "path";
import { prisma } from  "../db/client"


export interface BookInfo {
    title: string;
    language: string;
    pusblishedDate: string;
    authors: string[];
    thumbnail: string;
    isbn: number;
}

const unknownBook : BookInfo = {
    title: "Unknown",
    language: "Unknown",
    pusblishedDate: "Unknown",
    authors: ["unknown"],
    thumbnail: "",
    isbn: 0,
};

function formatGoogleBooksResponse(response: AxiosResponse, isbn: number): BookInfo {
    if (! (response.data.totalItems > 0 )) {
        return {title: unknownBook.title,
                language: unknownBook.language,
                pusblishedDate: unknownBook.pusblishedDate,
                authors: unknownBook.authors,
                thumbnail: unknownBook.thumbnail,
                isbn: isbn}
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
            isbn: isbn,
          }
}

async function getInfo(isbn: number): Promise<BookInfo> {
    const instance = axios.create({
        baseURL: "https://www.googleapis.com"
    });
    if (isbn === 0) return unknownBook
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
        isbn: z.number(),
      }),
    async resolve({ input }) {
        const bookInfo = await getInfo(input.isbn)
        return bookInfo
    }
  }).mutation("store-book", {
    input: z.object({
      isbn: z.number(),
      title: z.string(),
      authors: z.array(z.string()),
      publishedDate: z.string().nullish(),
      thumbnail: z.string().nullish(),
      language: z.string().nullish(),
    }),
    async resolve({input}) {
      const storeInDb = await prisma.bookInfo.create({
        data: {isbn: input.isbn,
              title: input.title,
              authors: input?.authors ?  input?.authors[0] : null,
              publishedDate: input?.publishedDate,
              thumbnail: input?.thumbnail,
              language: input?.language,
            }
      })
      return {success: true, store: storeInDb}
    },
  });


