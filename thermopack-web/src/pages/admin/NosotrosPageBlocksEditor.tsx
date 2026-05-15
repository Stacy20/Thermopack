import type { ReactNode } from 'react'
import type { NosotrosPageConfig, NosotrosPillar } from '../../types/nosotrosPage'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'

function setPillar(list: NosotrosPillar[], i: number, field: keyof NosotrosPillar, v: string): NosotrosPillar[] {
  return list.map((row, j) => (j === i ? { ...row, [field]: v } : row))
}

function NosotrosBlockRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 mb-3 items-start">
      <Label className="md:text-right pt-2 text-muted-foreground text-sm">{label}</Label>
      <div>{children}</div>
    </div>
  )
}

export function NosotrosPageBlocksEditor({
  page,
  onChange,
  disabled,
}: {
  page: NosotrosPageConfig
  onChange: (next: NosotrosPageConfig) => void
  disabled: boolean
}) {
  const patch = (partial: Partial<NosotrosPageConfig>) => onChange({ ...page, ...partial })

  return (
    <div className="space-y-8">
      <div>
        <h5 className="font-semibold text-foreground mb-1">Hero superior</h5>
        <p className="text-xs text-muted-foreground mb-3">El título admite saltos de línea con Enter.</p>
        <NosotrosBlockRow label="Badge">
          <Input disabled={disabled} value={page.hero.badge} onChange={(e) => patch({ hero: { ...page.hero, badge: e.target.value } })} />
        </NosotrosBlockRow>
        <NosotrosBlockRow label="Título">
          <Textarea
            disabled={disabled}
            rows={3}
            value={page.hero.title}
            onChange={(e) => patch({ hero: { ...page.hero, title: e.target.value } })}
          />
        </NosotrosBlockRow>
      </div>

      <div>
        <h5 className="font-semibold text-foreground mb-1">Tarjeta sobre imagen — Misión</h5>
        <NosotrosBlockRow label="Título">
          <Input
            disabled={disabled}
            value={page.misionOverlay.title}
            onChange={(e) => patch({ misionOverlay: { ...page.misionOverlay, title: e.target.value } })}
          />
        </NosotrosBlockRow>
        <NosotrosBlockRow label="Texto">
          <Textarea
            disabled={disabled}
            rows={2}
            value={page.misionOverlay.body}
            onChange={(e) => patch({ misionOverlay: { ...page.misionOverlay, body: e.target.value } })}
          />
        </NosotrosBlockRow>
      </div>

      <div>
        <h5 className="font-semibold text-foreground mb-1">Bloque texto — Misión</h5>
        <NosotrosBlockRow label="Badge sección">
          <Input
            disabled={disabled}
            value={page.misionSection.badge}
            onChange={(e) => patch({ misionSection: { ...page.misionSection, badge: e.target.value } })}
          />
        </NosotrosBlockRow>
        <NosotrosBlockRow label="H2 — antes del color">
          <Input
            disabled={disabled}
            value={page.misionSection.h2Before}
            onChange={(e) => patch({ misionSection: { ...page.misionSection, h2Before: e.target.value } })}
          />
        </NosotrosBlockRow>
        <NosotrosBlockRow label="H2 — en color">
          <Input
            disabled={disabled}
            value={page.misionSection.h2Highlight}
            onChange={(e) => patch({ misionSection: { ...page.misionSection, h2Highlight: e.target.value } })}
          />
        </NosotrosBlockRow>
        <NosotrosBlockRow label="H2 — después del color">
          <Input
            disabled={disabled}
            value={page.misionSection.h2After}
            onChange={(e) => patch({ misionSection: { ...page.misionSection, h2After: e.target.value } })}
          />
        </NosotrosBlockRow>
        <p className="text-xs text-muted-foreground mt-2">
          El párrafo largo de misión se edita en <strong>Config → Inicio</strong> (campo Misión).
        </p>
      </div>

      <div>
        <h5 className="font-semibold text-foreground mb-2">Cuatro tarjetas — Misión</h5>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border border-border rounded-lg p-3 mb-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Input
              placeholder="Icono"
              disabled={disabled}
              value={page.misionPillars[i]?.icon ?? ''}
              onChange={(e) => patch({ misionPillars: setPillar(page.misionPillars, i, 'icon', e.target.value) })}
            />
            <Input
              placeholder="Título"
              disabled={disabled}
              value={page.misionPillars[i]?.title ?? ''}
              onChange={(e) => patch({ misionPillars: setPillar(page.misionPillars, i, 'title', e.target.value) })}
            />
            <Input
              placeholder="Descripción"
              disabled={disabled}
              value={page.misionPillars[i]?.desc ?? ''}
              onChange={(e) => patch({ misionPillars: setPillar(page.misionPillars, i, 'desc', e.target.value) })}
            />
          </div>
        ))}
      </div>

      <div>
        <h5 className="font-semibold text-foreground mb-1">Bloque — Visión</h5>
        <NosotrosBlockRow label="Badge sección">
          <Input
            disabled={disabled}
            value={page.visionSection.badge}
            onChange={(e) => patch({ visionSection: { ...page.visionSection, badge: e.target.value } })}
          />
        </NosotrosBlockRow>
        <NosotrosBlockRow label="H2 — antes del color">
          <Input
            disabled={disabled}
            value={page.visionSection.h2Before}
            onChange={(e) => patch({ visionSection: { ...page.visionSection, h2Before: e.target.value } })}
          />
        </NosotrosBlockRow>
        <NosotrosBlockRow label="H2 — en color">
          <Input
            disabled={disabled}
            value={page.visionSection.h2Highlight}
            onChange={(e) => patch({ visionSection: { ...page.visionSection, h2Highlight: e.target.value } })}
          />
        </NosotrosBlockRow>
        <NosotrosBlockRow label="H2 — después del color">
          <Input
            disabled={disabled}
            value={page.visionSection.h2After}
            onChange={(e) => patch({ visionSection: { ...page.visionSection, h2After: e.target.value } })}
          />
        </NosotrosBlockRow>
        <NosotrosBlockRow label="Texto si visión vacía">
          <Textarea
            disabled={disabled}
            rows={3}
            value={page.visionBodyFallback}
            onChange={(e) => patch({ visionBodyFallback: e.target.value })}
          />
        </NosotrosBlockRow>
        <p className="text-xs text-muted-foreground mt-2">
          Si en <strong>Config → Inicio</strong> el campo Visión tiene texto, sustituye al párrafo de respaldo.
        </p>
      </div>

      <div>
        <h5 className="font-semibold text-foreground mb-2">Cuatro tarjetas — Visión</h5>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border border-border rounded-lg p-3 mb-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Input
              placeholder="Icono"
              disabled={disabled}
              value={page.visionPillars[i]?.icon ?? ''}
              onChange={(e) => patch({ visionPillars: setPillar(page.visionPillars, i, 'icon', e.target.value) })}
            />
            <Input
              placeholder="Título"
              disabled={disabled}
              value={page.visionPillars[i]?.title ?? ''}
              onChange={(e) => patch({ visionPillars: setPillar(page.visionPillars, i, 'title', e.target.value) })}
            />
            <Input
              placeholder="Descripción"
              disabled={disabled}
              value={page.visionPillars[i]?.desc ?? ''}
              onChange={(e) => patch({ visionPillars: setPillar(page.visionPillars, i, 'desc', e.target.value) })}
            />
          </div>
        ))}
      </div>

      <div>
        <h5 className="font-semibold text-foreground mb-1">Tarjeta sobre imagen — Visión</h5>
        <NosotrosBlockRow label="Título">
          <Input
            disabled={disabled}
            value={page.visionOverlay.title}
            onChange={(e) => patch({ visionOverlay: { ...page.visionOverlay, title: e.target.value } })}
          />
        </NosotrosBlockRow>
        <NosotrosBlockRow label="Texto">
          <Textarea
            disabled={disabled}
            rows={2}
            value={page.visionOverlay.body}
            onChange={(e) => patch({ visionOverlay: { ...page.visionOverlay, body: e.target.value } })}
          />
        </NosotrosBlockRow>
      </div>

      <div>
        <h5 className="font-semibold text-foreground mb-1">Sección Valores (fondo azul)</h5>
        <NosotrosBlockRow label="Badge">
          <Input
            disabled={disabled}
            value={page.valoresHeading.badge}
            onChange={(e) => patch({ valoresHeading: { ...page.valoresHeading, badge: e.target.value } })}
          />
        </NosotrosBlockRow>
        <NosotrosBlockRow label="Título">
          <Input
            disabled={disabled}
            value={page.valoresHeading.title}
            onChange={(e) => patch({ valoresHeading: { ...page.valoresHeading, title: e.target.value } })}
          />
        </NosotrosBlockRow>
        <p className="text-xs text-muted-foreground mt-2">Las tarjetas de valores se editan abajo en &quot;Valores corporativos&quot;.</p>
      </div>

      <div>
        <h5 className="font-semibold text-foreground mb-1">Sección Historia / timeline</h5>
        <NosotrosBlockRow label="Badge">
          <Input
            disabled={disabled}
            value={page.historiaHeading.badge}
            onChange={(e) => patch({ historiaHeading: { ...page.historiaHeading, badge: e.target.value } })}
          />
        </NosotrosBlockRow>
        <NosotrosBlockRow label="Título">
          <Input
            disabled={disabled}
            value={page.historiaHeading.title}
            onChange={(e) => patch({ historiaHeading: { ...page.historiaHeading, title: e.target.value } })}
          />
        </NosotrosBlockRow>
        <p className="text-xs text-muted-foreground mt-2">Los hitos del timeline se editan en &quot;Historia&quot;.</p>
      </div>
    </div>
  )
}
