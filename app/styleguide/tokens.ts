import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Reads the `:root` custom properties from globals.css so the styleguide
 * shows the real values and cannot drift from them.
 */
export async function readTokens(): Promise<Record<string, string>> {
  "use cache";
  const css = await readFile(path.join(process.cwd(), "app/globals.css"), "utf8");
  const root = css.match(/:root\s*{([^}]*)}/)?.[1] ?? "";
  const tokens: Record<string, string> = {};
  for (const [, name, value] of root.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    tokens[name] = value.trim();
  }
  return tokens;
}
