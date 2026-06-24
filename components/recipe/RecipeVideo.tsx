import { PlayCircle } from "lucide-react";
import { getVideoEmbedInfo } from "@/lib/video-embed";

interface RecipeVideoProps {
  videoUrl: string;
}

export function RecipeVideo({ videoUrl }: RecipeVideoProps) {
  const info = getVideoEmbedInfo(videoUrl);
  if (!info) return null;

  return (
    <div className="mb-8">
      <h2
        className="mb-4 flex items-center gap-2"
        style={{ fontFamily: "'Dancing Script', cursive", fontSize: "20px", color: "var(--ce-text)", fontWeight: 700 }}
      >
        <PlayCircle size={20} style={{ color: "#FF8C42" }} />
        Video Tutorial
      </h2>

      {info.platform === "other" ? (
        <a
          href={info.embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm"
          style={{ backgroundColor: "var(--ce-text)", color: "var(--ce-bg)", fontWeight: 700 }}
        >
          <PlayCircle size={16} />
          Watch Tutorial
        </a>
      ) : (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(255,199,44,0.3)" }}>
          <iframe
            src={info.embedUrl}
            title="Recipe video tutorial"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
