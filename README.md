# CCS-CoTFE

## Correctness Conditioning as Selection in Chain-of-Thought Faithfulness Evaluation

<img src="public/paper-cotsel-logo-gradient.png" alt="CoTsel" width="96" />

**The faithful trace can still be the wrong evidence.** CCS-CoTFE is a causal research exhibit for studying how correctness conditioning changes chain-of-thought faithfulness estimates.

**[Open the website](https://ccs-cotfe.github.io/CCS-CoTFE/)** · **[Read the paper](https://ccs-cotfe.github.io/CCS-CoTFE/docs/arxiv/main_arxiv.pdf)** · **[Browse the code archive](https://ccs-cotfe.github.io/CCS-CoTFE/code/index.html)**

The exhibit connects the paper's structural causal model to its evidence in a continuous scroll:

- **Idea** — the claim and the measured conditional shift.
- **Benchmark** — an interactive causal graph with selectable paths.
- **Evidence** — benchmark bars, coverage, decomposition, response curves, evidence matrix, and full source figures.

## Run locally

Node.js 20+ and pnpm are recommended.

```bash
pnpm install
pnpm dev
```

Validate the production build and exhibit contracts:

```bash
pnpm build
pnpm verify:site
```

The `main` branch deploys automatically to GitHub Pages through `.github/workflows/deploy-pages.yml`.

## Repository map

| Path | Purpose |
| --- | --- |
| `src/` | TypeScript React exhibit and interaction logic |
| `public/` | Paper figures, logo, code archive, and published paper PDF |
| `scripts/verify-site.mjs` | Structural checks for the exhibit |
| `.github/workflows/` | GitHub Pages deployment |

The website uses the Glass-HQ Liquid Glass package for the navigation capsule and keeps research cards on a quieter paper surface so figures remain legible.

## Citation

```bibtex
@misc{pan2026ccscotfe,
  title = {Correctness Conditioning as Selection in Chain-of-Thought Faithfulness Evaluation},
  author = {Pan, Yueer and Pan, Yuexi},
  year = {2026},
  url = {https://ccs-cotfe.github.io/CCS-CoTFE/}
}
```

## License

Licensing for the manuscript, figures, and code will be specified by the authors in a subsequent release.
