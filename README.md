# @cf-worker/utils

[![JSR](https://jsr.io/badges/@cf-worker/utils)](https://jsr.io/@cf-worker/utils)
![Bun ready](https://img.shields.io/static/v1?label=&message=Bun+ready&color=%23000000&logo=bun)
![Deno ready](https://img.shields.io/static/v1?label=&message=Deno+ready&color=%23000000&logo=deno)
![ESM ready](https://img.shields.io/static/v1?label=&message=ESM+ready&color=%23000000&logo=javascript)
![100% Typed](https://img.shields.io/static/v1?label=&message=100%+Typed&color=%23000000&logo=typescript)

Fully typed utils for Cloudflare Workers and modern Javascript like Deno and Bun.

## VSCODE

To force vscode use the long import path instead of the short `@cf-worker/utils` add this to .vscode/settings.json:

```json
{
  "typescript.preferences.autoImportSpecifierExcludeRegexes": [
    "^@cf-worker/utils$"
  ],
  "javascript.preferences.autoImportSpecifierExcludeRegexes": [
    "^@cf-worker/utils$"
  ]
}
```

## TODO

- [ ] https://developers.cloudflare.com/workers/examples/signing-requests/

## Links

- https://github.com/cfworker/cfworker
- https://github.com/lowlighter/libs
- https://sindresorhus.com/blog/micro-benchmark-fallacy
- https://sinja.io/blog/build-typesafe-react-router-from-scratch#high-level-overview-of-api

## Development

Every new file need to run `deno run build:mod` to export it.

Check dependencies with `deno run check-deps`.

#### Testing

Works with both `bun test` and `deno run test`

#### Skip git-precommit

```shell
git commit -m "commit message" --no-verify
# -n for shorthand
```
