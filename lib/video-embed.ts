export type VideoPlatform = "youtube" | "vimeo" | "other";

export interface VideoEmbedInfo {
  embedUrl: string;
  platform: VideoPlatform;
}

export function getVideoEmbedInfo(url: string): VideoEmbedInfo | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = parsed.pathname.startsWith("/shorts/")
      ? parsed.pathname.split("/shorts/")[1]
      : parsed.searchParams.get("v");
    if (id) return { embedUrl: `https://www.youtube.com/embed/${id}`, platform: "youtube" };
  }

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    if (id) return { embedUrl: `https://www.youtube.com/embed/${id}`, platform: "youtube" };
  }

  if (host === "vimeo.com") {
    const id = parsed.pathname.split("/").filter(Boolean)[0];
    if (id) return { embedUrl: `https://player.vimeo.com/video/${id}`, platform: "vimeo" };
  }

  return { embedUrl: trimmed, platform: "other" };
}
