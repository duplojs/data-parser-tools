<a name="top"></a>

<p align="center">
  <img src="https://utils.duplojs.dev/images/logo.png" alt="logo" width="250px" />
</p>
<p align="center">
  <span style="font-size: 24px; font-weight: bold;">DataParser Tools</span>
</p>
<p align="center">
  <a href='#'>
    <img src='https://img.shields.io/badge/types-TypeScript-blue?logo=typescript&style=plastic' alt='coverage' />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/coverage-100%25-green?style=plastic" alt="lang">
  </a>
  <a href="https://www.npmjs.com/package/@duplojs/data-parser-tools">
    <img src="https://img.shields.io/npm/v/@duplojs/data-parser-tools" alt="lang">
  </a>
</p>

`@duplojs/data-parser-tools` is a library that convert `dataParser` schema to choice format (typescript, jsonSchema)

## Installation

To consume `@duplojs/data-parser-tools`, you need to install the npm package and zod.
```bash
npm install @duplojs/data-parser-tools@0 @duplojs/utils@1 @duplojs/server-utils@0
```

## Usage

The library exposes two converters:
- `@duplojs/data-parser-tools/toTypescript`
- `@duplojs/data-parser-tools/toJsonSchema`

### 1) Generate a TypeScript type with `render`

```ts
import { DPE } from "@duplojs/utils";
import { render, defaultTransformers } from "@duplojs/data-parser-tools/toTypescript";

const userSchema = DPE.object({
	id: DPE.number(),
	name: DPE.string(),
}).addIdentifier("User");

const tsType = render(userSchema, {
	identifier: "User",
	mode: "out",
	transformers: defaultTransformers,
});

console.log(tsType);
// export type User = { id: number; name: string; };
```

`identifier` is the final exported name.  
`mode` can be:
- `"out"`: output format (strict)
- `"in"`: input format (includes accepted input variants, for example date/time)

### 2) Generate a JSON Schema

```ts
import { DPE } from "@duplojs/utils";
import { render, defaultTransformers } from "@duplojs/data-parser-tools/toJsonSchema";

const userSchema = DPE.object({
	id: DPE.number(),
	name: DPE.string(),
}).addIdentifier("User");

const jsonSchema = render(userSchema, {
	identifier: "User",
	mode: "out",
	transformers: defaultTransformers,
	version: "jsonSchema7", // jsonSchema4 | jsonSchema7 | jsonSchema202012 | openApi3 | openApi31
});

console.log(jsonSchema.$ref); // "#/definitions/User"
```

### 3) Add an identifier to a schema (`addIdentifier`)

`addIdentifier` clones the schema and attaches an internal reusable name during rendering.

```ts
const base = DPE.object({ value: DPE.string() });
const named = base.addIdentifier("MyNamedSchema");
```

If the name passed to `render({ identifier })` differs from the schema identifier, an alias is generated (for example: `export type PublicName = MyNamedSchema;`).

### 4) Use hooks

Hooks let you intercept/replace a schema before transformation.
- `output("next", schema)`: continue the hook chain
- `output("stop", schema)`: stop the chain and transform this schema

```ts
import { DPE } from "@duplojs/utils";
import { render, defaultTransformers, type TransformerHook } from "@duplojs/data-parser-tools/toTypescript";

const forceStringHook: TransformerHook = ({ output }) => output("stop", DPE.string());

const result = render(DPE.number(), {
	identifier: "HookExample",
	mode: "out",
	transformers: defaultTransformers,
	hooks: [forceStringHook],
});

console.log(result);
// export type HookExample = string;
```

### 5) Recursive schemas

Recursive references are supported through `DPE.lazy(...)`.

```ts
import { DPE } from "@duplojs/utils";
import { render, defaultTransformers } from "@duplojs/data-parser-tools/toTypescript";

type Node = { children: Node[] };

const nodeSchema: DPE.Contract<Node> = DPE.object({
	children: DPE.array(DPE.lazy(() => nodeSchema)),
}).addIdentifier("Node");

const result = render(nodeSchema, {
	identifier: "Node",
	mode: "out",
	transformers: defaultTransformers,
});
```

### 6) Custom types: `date`, `time`, `file`

```ts
import { DPE } from "@duplojs/utils";
import { SDP } from "@duplojs/server-utils";
import { render, defaultTransformers } from "@duplojs/data-parser-tools/toTypescript";

const schema = DPE.object({
	createdAt: DPE.date(),
	startAt: DPE.time(),
	avatar: SDP.file(),
});

const outType = render(schema, {
	identifier: "PayloadOut",
	mode: "out",
	transformers: defaultTransformers,
});

const inType = render(schema, {
	identifier: "PayloadIn",
	mode: "in",
	transformers: defaultTransformers,
});
```

In practice:
- `date` / `time` in `"out"` produce template-literals (`date...`, `time...`)
- `date` / `time` in `"in"` also accept additional input variants
- `file` maps to `FileInterface` (imported from `@duplojs/server-utils/file`)
