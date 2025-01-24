import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import { Artist, ArtistResponse, ErrorResponse } from "@/types";
import { ACCESS_TOKEN, ERROR_404, ERROR_500 } from "./config";

const API_URL = 'https://api.discogs.com/database/search';

const searchForArtist = async (
    req: NextApiRequest,
    res: NextApiResponse<Artist | ErrorResponse>
  ) => {
    const { artist } = req.query;
  
    try {
      const encodedUrl = `${API_URL}?q=${artist}&type=artist&token=${ACCESS_TOKEN}`;

      const response = await axios.get<ArtistResponse | ErrorResponse>(encodedUrl);

      const data = response.data as ArtistResponse;

      const matchingArtist = data.results?.find((item: Artist) => {
        return item.title.localeCompare(artist as string, undefined, { sensitivity: 'base' }) === 0;
      });

      if (!matchingArtist) {
        res.status(404).json({ error: ERROR_404, message: 'No matching artists found.' })
      }

      res.status(200).json(matchingArtist as Artist);
    } catch (error) {
      res.status(500).json({ error: ERROR_500 });
    }
  }

  export default searchForArtist;