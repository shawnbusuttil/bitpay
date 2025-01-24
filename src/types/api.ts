import { Artist } from "./artist";
import { Release } from "./release";
import { Pagination } from "./pagination";

export type ArtistResponse = {
    results?: Artist[];
    pagination?: Pagination;
}

export type ReleaseResponse = Release;

export type ReleasesResponse = {
    releases?: Release[];
    pagination?: Pagination;
}

export type ErrorResponse = {
    error: string;
    message?: string;
}