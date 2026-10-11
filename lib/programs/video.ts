/** Client-side checks for a set video. The server must repeat them when F-06 lands; these only save a round trip. */

/** BR-VID-004 (proposed). Q-016 also proposes a 3 minute cap, which needs the server to read the file. */
export const VIDEO_TYPES = ["video/mp4", "video/quicktime"] as const;
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

export function videoFileError(file: Pick<File, "type" | "size" | "name">): string | null {
  if (!(VIDEO_TYPES as readonly string[]).includes(file.type)) return `${file.name} isn’t supported. Use an MP4 or MOV video.`;
  if (file.size > MAX_VIDEO_BYTES) return `${file.name} is too large. The limit is 500 MB.`;
  if (file.size === 0) return `${file.name} is empty.`;
  return null;
}
