import type { ServicesPageConfig } from '../types/data'
import {
  SERVICE_CARD_GRADIENT_SLOT_INDICES,
  SERVICE_PROCESS_STEP_INDICES,
} from '../constants/servicesPageLayout'

const DEFAULT_CARD_GRADIENTS: string[] = [
  'linear-gradient(135deg,#0a1f5c,#1d3bb8)',
  'linear-gradient(135deg,#064e3b,#059669)',
  'linear-gradient(135deg,#7c2d12,#ea580c)',
  'linear-gradient(135deg,#4a1d96,#7c3aed)',
  'linear-gradient(135deg,#0c4a6e,#0284c7)',
  'linear-gradient(135deg,#365314,#65a30d)',
]

const DEFAULT_PROCESS_STEPS: ServicesPageConfig['processSteps'] = [
  { step: '1', title: 'Consulta', desc: 'Nos contactas y nos describes tu necesidad.' },
  { step: '2', title: 'Propuesta', desc: 'Diseñamos una solución a tu medida.' },
  { step: '3', title: 'Ejecución', desc: 'Implementamos el servicio con precisión.' },
  { step: '4', title: 'Entrega', desc: 'Resultados garantizados en tiempo y forma.' },
]

function padGradients(raw: unknown): string[] {
  const list = Array.isArray(raw) ? raw.map((g) => (typeof g === 'string' ? g.trim() : '')) : []
  const out = [...list]
  while (out.length < SERVICE_CARD_GRADIENT_SLOT_INDICES.length) {
    out.push(DEFAULT_CARD_GRADIENTS[out.length] ?? DEFAULT_CARD_GRADIENTS[0])
  }
  return out.slice(0, SERVICE_CARD_GRADIENT_SLOT_INDICES.length)
}

function padProcessSteps(raw: unknown): ServicesPageConfig['processSteps'] {
  const list = Array.isArray(raw) ? raw : []
  const out: ServicesPageConfig['processSteps'] = []
  for (const stepIndex of SERVICE_PROCESS_STEP_INDICES) {
    const row = list[stepIndex] as Record<string, unknown> | undefined
    const fallback = DEFAULT_PROCESS_STEPS[stepIndex]
    out.push({
      step: typeof row?.step === 'string' && row.step.trim() ? row.step.trim() : fallback.step,
      title: typeof row?.title === 'string' && row.title.trim() ? row.title.trim() : fallback.title,
      desc: typeof row?.desc === 'string' && row.desc.trim() ? row.desc.trim() : fallback.desc,
    })
  }
  return out
}

export function mergeServicesPageConfig(fromDb: Partial<ServicesPageConfig> | null | undefined): ServicesPageConfig {
  const d = fromDb ?? {}
  return {
    cardGradients: padGradients(d.cardGradients),
    processSteps: padProcessSteps(d.processSteps),
  }
}
