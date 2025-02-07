import { Config } from "@hey-api/client-axios";

export const apiClientConfig: Config = {
  baseURL: import.meta.env.SSR ? process.env.VITE_API_URL : import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.SSR ? process.env.VITE_API_TOKEN : import.meta.env.VITE_API_TOKEN}`,
  },
}