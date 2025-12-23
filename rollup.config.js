import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import tscAlias from "rollup-plugin-tsc-alias";
import { defineConfig } from "rollup";

/**
 * @type {import("rollup").RollupOptions[]}
 */
const outputs = [
	{
		dir: "dist",
		format: "esm",
		preserveModules: true,
		preserveModulesRoot: "scripts",
		entryFileNames: "[name].mjs",
	},
	{
		dir: "dist",
		format: "cjs",
		preserveModules: true,
		preserveModulesRoot: "scripts",
		entryFileNames: "[name].cjs",
	},
];

// mandatory because it removes the previously built tool
const delPlugin = del({ targets: "dist", runOnce: true })

/**
 * @param {string} input 
 * @returns {import("rollup").RollupOptions}
 */
function createConfig(input) { 
	return {
		input,
		output: outputs,
		plugins: [
			delPlugin,
			typescript({ tsconfig: "tsconfig.build.json" }),
			tscAlias({ configFile: "tsconfig.build.json" }),
		],
	}
};

export default defineConfig([
	createConfig("scripts/toTypescript/index.ts"),
	createConfig("scripts/toJsonSchema/index.ts"),
]);
