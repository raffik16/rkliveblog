# Vendored from teardown

These files come from [elvarofficial/teardown](https://github.com/elvarofficial/teardown) (MIT, see `LICENSE`) at
commit `a91262ac1109051e014662d42ecb0b7bc1f113b1`. The `/chaos` page runs the three example machines whole, from
their own math, inside its strange attractors. `/chaos/hotdog` builds its hot dogs the same way and uses the kit
(`util.js`, `warm.js`).

| Here | Upstream |
|---|---|
| `kit/util.js`, `kit/warm.js` | `sims/kit/` |
| `v8/kin.js`, `v8/engine.js` | `sims/v8-shared/` |
| `strandbeest/jansen.js`, `strandbeest/beast.js` | `sims/strandbeest-shared/` |
| `cessna/gear.js` | `sims/cessna-shared/` |

Every file is unchanged except `strandbeest/beast.js`, which gains an `explode` option in `update()` (marked in its
header comment) so the Strandbeest can come apart the way the V8 and the Cessna gear already do.

The folder is left out of ESLint and Prettier so it stays diffable against upstream.
