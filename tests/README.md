# Validation scope

The release contract is implemented in [`scripts/verify-site.mjs`](../scripts/verify-site.mjs).

It checks the public title and CoTsel identity, the three scroll chapters, Liquid Glass navigation, figure assets, interactive chart data, smooth observation behavior, GitHub Pages asset paths, and the absence of the retired night-mode and USTC abbreviation.

Run it with:

```bash
pnpm verify:site
```
