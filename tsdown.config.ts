import { defineConfig } from "tsdown";
import {readdirSync, statSync} from "node:fs";
import { execSync } from "node:child_process";

export default defineConfig({
  entry: ["src/*.ts"],
  format: ["esm"],
  outDir: "dist",
  external: (id) => id.startsWith("gi://") || id.startsWith("resource:///"),
  banner: {
    js: [
      "// Copyright 2018 Bartosz Jaroszewski",
      "// SPDX-License-Identifier: GPL-2.0-or-later",
      "//",
      "// This program is free software: you can redistribute it and/or modify",
      "// it under the terms of the GNU General Public License as published by",
      "// the Free Software Foundation, either version 2 of the License, or",
      "// (at your option) any later version.",
      "//",
      "// This program is distributed in the hope that it will be useful,",
      "// but WITHOUT ANY WARRANTY; without even the implied warranty of",
      "// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the",
      "// GNU General Public License for more details.",
      "//",
      "// You should have received a copy of the GNU General Public License",
      "// along with this program.  If not, see <https://www.gnu.org/licenses/>.",
      "",
    ].join("\n"),
  },
  copy: {
    from: "./assets",
    to: "./dist",
  },
  onSuccess: async () => {
    if (process.argv.includes("--no-pack")) return;

    const files = (readdirSync("./dist"))
      .filter((f) => (statSync(`./dist/${f}`)).isFile())
      .map((file) => `--extra-source=./${file}`);
    execSync(`gnome-extensions pack -f ${files.join(" ")} -o ./`, { stdio: 'inherit', cwd: "./dist" });
  },
});
