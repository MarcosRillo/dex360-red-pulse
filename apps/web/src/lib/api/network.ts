import "server-only";
import { cache } from "react";
import { DealersResponseSchema, KpisResponseSchema } from "@red-pulse/contracts";
import { apiGet, getSessionUser } from "./server";

// `cache` dedupes within one render, so the header, the summary and the cards share a single request.
export const getKpis = cache(() => apiGet("/api/network/kpis", KpisResponseSchema));
export const getDealers = cache(() => apiGet("/api/network/dealers", DealersResponseSchema));
export const getUser = cache(getSessionUser);
