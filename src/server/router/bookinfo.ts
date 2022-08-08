import { createRouter } from "./context";
import { z } from "zod";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { resolve } from "path";
import { rejects } from "assert";


async function getInfo(): Promise<object> {
    const instance = axios.create({
        baseURL: "https://www.googleapis.com"
    });
    return new Promise<object>((resolve, reject) => {
        instance
        .get("/books/v1/volumes?q=isbn:9781853260025")
        .then((response: AxiosResponse) => resolve(response.data))
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
        return getInfo()
    }
  })


