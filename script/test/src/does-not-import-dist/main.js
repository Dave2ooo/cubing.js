import { join, resolve } from "node:path";
import { cwd, exit, stderr } from "node:process";
import { execPromise } from "../../../lib/execPromise.js";
import { needPath } from "../../../lib/need-folder.js";
import { readFile } from "fs/promises";
import { build } from "esbuild";
import { esmOptions } from "../../../build/targets.js";
import { allowedImports } from "./allowedImports.js";

const metafilePath = new URL(
  "../../../../.temp/esbuild-metafile.json",
  import.meta.url,
).pathname;
needPath(metafilePath, "make build-js");

// const INPUT_FOLDERS = ["src/cubing/kpuzzle"];

const absoluteCwd = resolve(cwd());
// const absoluteInputFolders = INPUT_FOLDERS.map((folder) =>
//   join(absoluteCwd, folder),
// );
// const entryPoints = INPUT_FOLDERS.map((folder) => join(folder, "**/*.ts"));

// From https://github.com/evanw/esbuild/issues/619#issuecomment-1504100390
const plugin = {
  name: "mark-bare-imports-as-external",
  setup(build) {
    const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/; // Must not start with "/" or "./" or "../"
    build.onResolve({ filter }, (args) => ({
      path: args.path,
      external: true,
    }));
  },
};

const { metafile } = await build({
  entryPoints: [
    // TODO: does `esbuild` not support `src/cubing/*/index.ts`?
    "src/cubing/alg/index.ts",
    "src/cubing/bluetooth/index.ts",
    "src/cubing/kpuzzle/index.ts",
    "src/cubing/notation/index.ts",
    "src/cubing/protocol/index.ts",
    "src/cubing/puzzle-geometry/index.ts",
    "src/cubing/puzzles/index.ts",
    "src/cubing/scramble/index.ts",
    "src/cubing/search/index.ts",
    "src/cubing/stream/index.ts",
    "src/cubing/twisty/index.ts",
    "src/bin/**/*.ts",
  ],
  outdir: ".temp/unused",
  format: "esm",
  write: false,
  bundle: true,
  splitting: true,
  plugins: [plugin],
  metafile: true,
  platform: "node",
});

let failure = false;

// Starts with the path and then keeps chopping off from the right.
function* pathPrefixes(path) {
  const pathParts = path.split("/");
  const prefixes = [];
  for (let n = pathParts.length; n > 0; n--) {
    yield pathParts.slice(0, n).join("/");
  }
}

function matchingPathPrefix(matchPrefixes, path) {
  for (const pathPrefix of pathPrefixes(path)) {
    if (matchPrefixes.includes(pathPrefix)) {
      return pathPrefix;
    }
  }
  return false;
}

function checkImport(sourcePath, importInfo, allowedImports) {
  const importKind = {
    "import-statement": "static",
    "dynamic-import": "dynamic",
  }[importInfo.kind];
  for (const sourcePathPrefix of pathPrefixes(sourcePath)) {
    const matchingSourcePathPrefix = matchingPathPrefix(
      Object.keys(allowedImports),
      sourcePathPrefix,
    );
    if (
      matchingSourcePathPrefix &&
      matchingPathPrefix(
        [
          matchingSourcePathPrefix, // allow importing from any source group to itself.
          ...(allowedImports[matchingSourcePathPrefix][importKind] ?? []),
        ],
        importInfo.path,
      )
    ) {
      process.stdout.write(".");
      return;
    }
  }
  failure = true;
  console.error(`\n❌ File has disallowed ${importKind} import:`);
  console.error(`From file: ${sourcePath}`);
  console.error(`Import: ${importInfo.path}`);
}

async function checkImports(metafile, allowedImports) {
  console.log("/ means a new file");
  console.log(". means a valid import for that file");

  for (const [filePath, importInfoList] of Object.entries(metafile.inputs)) {
    process.stdout.write("/");
    for (const importInfo of importInfoList.imports) {
      checkImport(filePath, importInfo, allowedImports);
    }
  }
}

await checkImports(metafile, allowedImports);

if (failure) {
  exit(1);
}
