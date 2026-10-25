# Public project notes

This directory contains the public-facing notes for the CCS-CoTFE release. The interactive website is built from `src/` and served with the static material in `public/`.

## Architecture

```text
src/
├── components/       navigation and Liquid Glass bridge
├── pages/            Idea, Benchmark, and Evidence chapters
└── styles/           global visual system
public/
├── paper-figures/    source figures from the paper
├── docs/arxiv/       paper PDF
└── code/             reproducibility archive entry point
scripts/               deterministic site verification
examples/              small interaction and reading examples
tests/                 validation scope and release contracts
.github/workflows/     GitHub Pages deployment
```

The public release does not include private experiment data, internal review notes, local archives, or the superseded nested website repository.

The original CCS-CoTFE materials are released under the Apache License 2.0. Third-party dependencies and bundled assets retain their own licenses; see the root [`LICENSE`](../LICENSE) and [`NOTICE`](../NOTICE) files.
