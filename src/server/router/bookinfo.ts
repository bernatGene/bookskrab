import { createRouter } from "./context";
import { z } from "zod";
import axios, { AxiosError, AxiosResponse } from 'axios';



export interface BookInfo {
    title: string;
    language: string;
    pusblishedDate: string;
    authors: string[];
}

const unknownBook : BookInfo = {
    title: "Unknown",
    language: "Unknown",
    pusblishedDate: "Unknown",
    authors: ["unknown"],
};

function formatGoogleBooksResponse(response: AxiosResponse): BookInfo {
    if (! (response.data.totalItems > 0 )) return unknownBook;
    const volumeInfo = response.data.items[0].volumeInfo;
    const title = volumeInfo.title || unknownBook.title;
    const language = volumeInfo.language || unknownBook.language;
    const pusblishedDate = volumeInfo.publishedDate || unknownBook.pusblishedDate;
    const authors = volumeInfo.authors || unknownBook.authors;
    return {title: title, language: language, pusblishedDate: pusblishedDate, authors: authors}
}

async function getInfo(isbn: number): Promise<BookInfo> {
    const instance = axios.create({
        baseURL: "https://www.googleapis.com"
    });
    if (isbn === 0) return unknownBook
    return new Promise<BookInfo>((resolve, reject) => {
        instance
        .get("/books/v1/volumes?q=isbn:" + isbn)
        .then((response: AxiosResponse) => resolve(formatGoogleBooksResponse(response)))
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
  })


