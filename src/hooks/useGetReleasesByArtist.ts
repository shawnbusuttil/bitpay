import { useEffect, useState } from 'react';
import axios from 'axios';
import { Release, Pagination, ReleasesResponse, Artist, ErrorResponse } from '@/types';

type Releases = {
  releases?: Release[];
  pagination?: Pagination;
}

type ReleasesState = {
  releases?: Releases;
  isLoading: boolean;
  error?: string;
}

const useGetReleasesByArtist = (artist?: string, page?: number): ReleasesState => {
  const [artistId, setArtistId] = useState<number | undefined>();
  const [releases, setReleases] = useState<Releases | undefined>(undefined);

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const getArtist = async () => {
    setLoading(true);
    setError(undefined);

    try {
      const { data: artistData } = await axios.get<Artist>('/api/search-artist', { params: { artist }});
      setArtistId(artistData.id);
    }
    catch (e: any) {
      clearResults();
      setError(e.response.data.message);
    }

    setLoading(false);
  }

  const getReleasesByArtist = async () => {
    setLoading(true);

    const { data: { releases, pagination } } = await axios.get<ReleasesResponse>('/api/get-releases-by-artist', { params: { artistId, page }});
    setReleases({ releases, pagination });
    
    setLoading(false);
  }

  const clearResults = () => {
    setArtistId(undefined);
    setReleases(undefined);
  }

  useEffect(() => {
    if (!artist) return;
    clearResults();
    getArtist();
  }, [artist]);

  useEffect(() => {
    if (!artistId) return;
    getReleasesByArtist();
  }, [artistId, page]);

  return { releases, isLoading, error };
};

export default useGetReleasesByArtist;