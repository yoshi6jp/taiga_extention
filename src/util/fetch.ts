import { fromFetch } from "rxjs/fetch";
import { mergeMap } from "rxjs/operators";
const baseUrl = (url: string, path: string) => `${url.replace(/[¥/]$/, "")}/api/v1/${path}`;
export const fetchData = <T>(url: string, path: string, config?: RequestInit) => fromFetch(baseUrl(url, path), config).pipe<T>(
  mergeMap(res => res.json())
)