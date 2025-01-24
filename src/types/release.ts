export type Release = {
    id: number;
    title: string;
    thumb: string;
    year: number;
    released: string;
    artists_sort: string;
    genres: string[];
    community?: {
        have: number;
        want: number;
    }
}