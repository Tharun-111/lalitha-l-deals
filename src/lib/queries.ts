import { queryOptions } from "@tanstack/react-query";
import { getCatalog } from "./shop.functions";

export const catalogQuery = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => getCatalog(),
  staleTime: 30_000,
});

export type Catalog = Awaited<ReturnType<typeof getCatalog>>;
export type Product = Catalog["products"][number];
export type Offer = Catalog["offers"][number];
