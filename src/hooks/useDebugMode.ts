/** True when Leva debug UI is enabled (?debug or /debug). */
export function useDebugMode() {
  return (
    typeof window !== "undefined" &&
    (new URLSearchParams(window.location.search).has("debug") ||
      window.location.pathname.includes("debug"))
  );
}
