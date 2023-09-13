import { existsSync } from "node:fs";

export function needPath(folder, cmd) {
  if (!existsSync(folder)) {
    console.error(
      `\nPath does not exist:\n${folder}\n\nRun \`${cmd}\` first!\n\b`,
    );
    process.exit(1);
  }
}
