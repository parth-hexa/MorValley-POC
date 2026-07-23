import { useEffect, useState } from "react";

export function useLeva() {
  const [isDebug, setIsDebug] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsDebug(params.has("debug"));
  }, []);

  return isDebug;
}
