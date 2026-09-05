import { mkdir, copyFile } from "node:fs/promises";
await mkdir("dist/marketplace", {recursive: true});
await copyFile("dist/index.html", "dist/marketplace/index.html");
await copyFile("dist/index.html", "dist/404.html");
