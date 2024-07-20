# @cf-worker/utils

Fully typed utils for Cloudflare Workers and Javascript in general.

run git pre-commit:

`git hook run pre-commit`
`bash .githooks/pre-commit`

## TODO

- [x] Create script to make sure that all functions are exported by mod.ts
- [x] Remove biome, too many errors in VsCode
- [x] Finish localStorageTests
- [x] Test elapsed(label) and elapsed.log
- [ ] Make more tests compatible with bun like strings/stringByteLength.test.ts
- [ ] Fix Deno localStorage https://github.com/denoland/deno/blob/f6fd6619e708a515831f707438368d81b0c9aa56/ext/webstorage/lib.rs#L166
- [x] Write script to check for files without tests (running in mod.test.ts)
- [x] Test MemoryStorage
- [x] Test array functions
- [x] Test mod actually exports all functions
- [ ] Document all methods
- [ ] Add changelog
- [ ] Get 100% score on https://jsr.io/@cf-worker/utils/score
- [x] Find new linting tool (using Deno)
- [ ] Add deno badge
- [ ] https://github.com/dsherret/jsr-publish-on-tag
- [ ] check deno.json dependencies
- [ ] Add compatibility tests with cf, bun, node, browser and deno
- [ ] Link test coverage on README
- [ ] Create github ci to test, check, and coverage report
- [ ] Add git pre-commit hooks
- [ ] Generate stats about lines of code, number of functions, etc
- [ ] Add donation link
- [ ] https://docs.deno.com/runtime/manual/basics/testing/documentation/
- [ ] Add to project: https://docs.tea.xyz/tea/i-want-to.../begin-earning-tea-and-interact-with-the-protocol/registering-an-oss-project#what-is-the-tea.yaml-file-and-why-does-my-project-need-it
- [ ] try different reports https://docs.deno.com/runtime/manual/basics/testing/coverage/#:~:text=Deno%20will%20collect%20test%20coverage,V8)%20which%20is%20very%20accurate.
