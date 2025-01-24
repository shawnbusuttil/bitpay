import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { ACCESS_TOKEN, ERROR_400 } from "./config";
import { ErrorResponse, ReleaseResponse } from "@/types";

const API_URL = 'https://api.discogs.com/releases';

const getRelease = async (
    req: NextApiRequest,
    res: NextApiResponse<ReleaseResponse | ErrorResponse>
  ) => {
    const { releaseId } = req.query;
  
    try {
      const encodedUrl = encodeURI(`${API_URL}/${releaseId}?token=${ACCESS_TOKEN}`);

      const response = await axios.get<ReleaseResponse>(
        encodedUrl
      );

      res.status(200).json(response.data);
    } catch (error) {
      res.status(400).json({ error: ERROR_400, message: 'Bad request or invalid release.' });
    }
  }

  export default getRelease;