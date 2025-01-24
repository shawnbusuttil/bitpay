import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { ACCESS_TOKEN, ERROR_500 } from "./config";
import { ErrorResponse, ReleasesResponse } from "@/types";

const API_URL = 'https://api.discogs.com/artists';

const getReleasesByArtist = async (
    req: NextApiRequest,
    res: NextApiResponse<ReleasesResponse | ErrorResponse>
  ) => {
    const { artistId, page = '1', limit = '5' } = req.query;
  
    try {
      const encodedUrl = encodeURI(`${API_URL}/${artistId}/releases?page=${page}&per_page=${limit}&token=${ACCESS_TOKEN}`);

      const response = await axios.get<ReleasesResponse>(
        encodedUrl
      );

      if (response.status !== 200) {
        res.status(response.status).json({ error: 'Failed to fetch payment status.' });
        return;
      }

      const data = response.data;

      res.status(200).json({ releases: [...data.releases!], pagination: data.pagination });
    } catch (error) {
      res.status(500).json({ error: ERROR_500 });
    }
  }

  export default getReleasesByArtist;