import { useEffect, useState } from "react";
import axios from "axios";

import { Release, ReleaseResponse } from "@/types";

type ReleaseState = {
    release?: Release;
    isLoading: boolean;
    error?: string;
}

const useGetRelease = (releaseId: string): ReleaseState => {
    const [release, setRelease] = useState<Release | undefined>();
  
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
  
    const getRelease = async () => {
      setLoading(true);

      try {
        const { data: releaseData } = await axios.get<ReleaseResponse>('/api/get-release', { params: { releaseId }});
        setRelease(releaseData);
      } catch (e: any) {
        setError(e.response.data.message);
      }

      setLoading(false);
    }
  
    useEffect(() => {
      if (!releaseId) return;
      getRelease();
    }, [releaseId]);
  
    return { release, isLoading, error };
  };
  
  export default useGetRelease;