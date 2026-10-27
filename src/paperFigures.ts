import { assetPath } from './site'

export type PaperFigure = {
  id: string
  number: number
  label: string
  meta: string
  src: string
  caption: string
  href: string
}

const pageForFigure: Record<number, number> = {
  1: 1, 2: 4, 3: 5, 4: 7, 5: 8, 6: 9, 7: 10, 8: 11, 9: 11, 10: 17, 11: 22, 12: 23, 13: 25, 14: 27,
}

const figureCopy: Array<[string, string, string]> = [
  ['CoTsel overview', 'Conceptual intervention and measured selection gaps', 'The overview pairs a deterministic intervention with the observed faithfulness and selection gaps.'],
  ['Response rules', 'Figure 02 · intervention response', 'Correct factual answers can conceal different responses to an intervention.'],
  ['Structural causal model', 'Figure 03 · causal structure', 'The structural causal model separates difficulty, shortcut, trace, correctness, intervention, and answer change.'],
  ['Protocol landscape', 'Figure 04 · evaluation populations', 'The audit distinguishes answer-correctness restrictions from agreement-based selection and data construction.'],
  ['Task atlas', 'Figure 05 · task families', 'The task families pair the original instance with an intervention and a deterministic counterfactual answer.'],
  ['Evaluation protocol', 'Figure 06 · all-trace intervention', 'The protocol records factual correctness, intervention response, and the counterfactual oracle.'],
  ['Deployment gaps', 'Figure 07 · four deployments', 'Open and selected-trace estimates show positive gaps across the four sub-ceiling deployments.'],
  ['Operation-count decomposition', 'Figure 08 · descriptive split', 'The operation-count split assigns 42.8 percent of the GLM-5.3 gap to between-stratum variation; the rest remains unattributed.'],
  ['Robustness checks', 'Figure 09 · response handling', 'Weighted selected estimates and null-response conventions provide sensitivity checks for the measured gap.'],
  ['Bias surface', 'Figure 10 · closed form', 'The closed-form surface shows how selection changes across response and shortcut propensities.'],
  ['Worked selection calculation', 'Figure 11 · joint counts', 'The worked example connects oracle compliance to all-trace and correctness-selected estimates.'],
  ['Ranking reversal', 'Figure 12 · phase diagram', 'The phase diagram marks settings where conditioning can reverse a faithfulness ranking.'],
  ['Forest plot', 'Figure 13 · pooled odds', 'Deployment-level odds ratios and the pooled Mantel–Haenszel estimate summarize the selection gap.'],
  ['Selection gap versus accuracy', 'Figure 14 · accuracy sweep', 'Confidence intervals show how the measured gap changes across factual-accuracy levels.'],
]

export const paperFigures: PaperFigure[] = figureCopy.map(([label, meta, caption], index) => {
  const number = index + 1
  const key = String(number).padStart(2, '0')
  return {
    id: `figure-${key}`,
    number,
    label,
    meta,
    src: assetPath(`/paper-figures/final/figure-${key}.png`),
    caption,
    href: assetPath(`/docs/arxiv/main_arxiv.pdf#page=${pageForFigure[number]}`),
  }
})
