import { useMemo, useRef, useState } from "react";
import { speak } from "@/lib/ttsClient";

export function useTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const play = useMemo(() => {
    return async (text: string, voice = "en-NG-EzinneNeural") => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      try {
        // Fetch MP3
        const { objectUrl } = await speak({
          text,
          voice,
          rate: "+0%",
          volume: "+0%",
          signal: abortRef.current.signal,
        });

        // Revoke the previous blob url to avoid leaks
        if (lastUrl) URL.revokeObjectURL(lastUrl);
        setLastUrl(objectUrl);

        // Create the audio element lazily
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }

        // iOS/Chrome autoplay policy: play must be triggered by a user gesture
        audioRef.current.src = objectUrl;
        audioRef.current.currentTime = 0;

        await audioRef.current.play();
      } finally {
        setLoading(false);
      }
    };
  }, [lastUrl]);

  return { play, isLoading };
}