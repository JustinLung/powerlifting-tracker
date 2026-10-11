"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/dashboard/icons";
import { cn } from "@/lib/cn";
import { formatFileSize } from "@/lib/domain/format";
import { videoFileError, VIDEO_TYPES } from "@/lib/programs/video";
import type { SetVideo } from "@/lib/programs/types";

type SetVideoControlProps = {
  setNumber: number;
  video: SetVideo | null;
  /** Called with the new video, or null to remove. */
  onChange: (video: SetVideo | null) => void;
  onError: (message: string | null) => void;
  playing: boolean;
  onTogglePlay: () => void;
};

/** Per-set video slot: an empty dashed picker, or a play button with a remove badge. */
export function SetVideoControl({ setNumber, video, onChange, onError, playing, onTogglePlay }: SetVideoControlProps) {
  const inputId = useId();

  function pick(file: File | undefined) {
    if (!file) return;
    const error = videoFileError(file);
    onError(error);
    if (error) return;
    onChange({ name: file.name, sizeBytes: file.size, url: URL.createObjectURL(file) });
  }

  if (video === null) {
    return (
      <label
        htmlFor={inputId}
        className="grid size-11 cursor-pointer place-items-center rounded-md border border-dashed border-border-input text-muted transition-colors duration-(--motion-fast) ease-standard hover:border-foreground/60 hover:text-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground"
      >
        <Icon name="videos" className="size-5" />
        <span className="sr-only">Attach video to set {setNumber}</span>
        <input
          id={inputId}
          type="file"
          accept={VIDEO_TYPES.join(",")}
          className="sr-only"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = ""; // lets the same file be picked again after a rejection
          }}
        />
      </label>
    );
  }

  return (
    <span className="relative">
      <button
        type="button"
        aria-pressed={playing}
        aria-label={`${playing ? "Hide" : "Play"} video for set ${setNumber}`}
        onClick={onTogglePlay}
        className="grid size-11 place-items-center rounded-md border border-success/40 bg-success-subtle text-success"
      >
        <Icon name="play" className="size-4" />
      </button>
      <button
        type="button"
        aria-label={`Remove video from set ${setNumber}`}
        onClick={() => {
          onError(null);
          onChange(null);
        }}
        className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-danger text-on-danger"
      >
        <Icon name="close" className="size-3" />
      </button>
    </span>
  );
}

/** Inline player. Browsers that cannot decode the file (often HEVC .mov) get a message instead of a blank box. */
export function SetVideoPlayer({ video, className }: { video: SetVideo; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn("space-y-1", className)}>
      {failed ? (
        <p className="rounded-md bg-surface p-3 text-small text-muted">This browser can’t play this video. The file is still attached.</p>
      ) : (
        <video src={video.url} controls playsInline preload="metadata" onError={() => setFailed(true)} className="max-h-64 w-full rounded-md bg-black" />
      )}
      <p className="truncate text-caption text-muted">
        {video.name} · {formatFileSize(video.sizeBytes)}
      </p>
    </div>
  );
}
