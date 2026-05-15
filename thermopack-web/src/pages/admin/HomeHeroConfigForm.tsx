import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Data } from '../../types/data'
import type { HomeHeroConfig } from '../../types/home'
import { mergeHomeHero } from '../../lib/mergeHomeHero'
import {
  HOME_HERO_SPOTLIGHT_STAT_INDICES,
  HOME_HERO_STATSBAR_INDICES,
  HOME_HERO_TILE_INDICES,
} from '../../constants/homeHeroLayout'
import { useUpdateHomeHero } from '../../hooks/useData'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Separator } from '../../components/ui/separator'

function cloneHero(h: HomeHeroConfig): HomeHeroConfig {
  return JSON.parse(JSON.stringify(h)) as HomeHeroConfig
}

function HeroConfigRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 mb-4 items-start">
      <Label className="md:text-right pt-2 text-muted-foreground">{label}</Label>
      <div>{children}</div>
    </div>
  )
}

export function HomeHeroConfigForm({ siteData, canEdit }: { siteData: Data | undefined; canEdit: boolean }) {
  const updateHomeHero = useUpdateHomeHero()
  const [hero, setHero] = useState<HomeHeroConfig>(() => mergeHomeHero(null))
  const [saved, setSaved] = useState<HomeHeroConfig>(() => mergeHomeHero(null))

  useEffect(() => {
    const m = mergeHomeHero((siteData?.homeHero as Partial<HomeHeroConfig>) ?? null)
    setHero(cloneHero(m))
    setSaved(cloneHero(m))
  }, [siteData])

  const changed = JSON.stringify(hero) !== JSON.stringify(saved)

  const setSpotlight = (patch: Partial<HomeHeroConfig['spotlight']>) => {
    setHero((h) => ({ ...h, spotlight: { ...h.spotlight, ...patch } }))
  }

  const setSpotlightStat = (statIndex: number, field: 'value' | 'label', v: string) => {
    setHero((h) => ({
      ...h,
      spotlight: {
        ...h.spotlight,
        stats: h.spotlight.stats.map((row, rowIndex) =>
          rowIndex === statIndex ? { ...row, [field]: v } : row
        ),
      },
    }))
  }

  const setTile = (tileIndex: number, field: 'icon' | 'title' | 'body', v: string) => {
    setHero((h) => ({
      ...h,
      tiles: h.tiles.map((row, rowIndex) => (rowIndex === tileIndex ? { ...row, [field]: v } : row)),
    }))
  }

  const setBarStat = (barColumnIndex: number, field: 'value' | 'label', v: string) => {
    setHero((h) => ({
      ...h,
      statsBar: h.statsBar.map((row, rowIndex) => (rowIndex === barColumnIndex ? { ...row, [field]: v } : row)),
    }))
  }

  const save = () => {
    if (!changed) {
      showAlert('Información', 'No hay cambios por guardar', 'info')
      return
    }
    showConfirmationAlert('Confirmación', '¿Guardar el contenido del hero del inicio?', () => {
      updateHomeHero.mutate(hero, {
        onSuccess: () => {
          setSaved(cloneHero(hero))
          showAlert('Éxito', 'Contenido del inicio actualizado', 'success')
        },
        onError: () => showAlert('Error', 'No se pudo guardar', 'error'),
      })
    })
  }

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-foreground mb-2">Hero del inicio (página pública)</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Badge, tarjeta principal con tres cifras, dos tarjetas inferiores y la barra blanca de cuatro estadísticas.
      </p>
      <Separator className="mb-6" />

      <HeroConfigRow label="Badge (pill verde)">
        <Input value={hero.badge} onChange={(e) => setHero((h) => ({ ...h, badge: e.target.value }))} />
      </HeroConfigRow>

      <h3 className="text-lg font-semibold mb-3">Tarjeta grande (derecha)</h3>
      <HeroConfigRow label="Título">
        <Input value={hero.spotlight.title} onChange={(e) => setSpotlight({ title: e.target.value })} />
      </HeroConfigRow>
      <HeroConfigRow label="Descripción">
        <Textarea rows={3} value={hero.spotlight.body} onChange={(e) => setSpotlight({ body: e.target.value })} />
      </HeroConfigRow>
      {HOME_HERO_SPOTLIGHT_STAT_INDICES.map((statIndex) => (
        <div key={statIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 md:ml-[200px]">
          <div>
            <Label className="text-xs text-muted-foreground">Cifra {statIndex + 1}</Label>
            <Input
              value={hero.spotlight.stats[statIndex]?.value ?? ''}
              onChange={(e) => setSpotlightStat(statIndex, 'value', e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Etiqueta {statIndex + 1}</Label>
            <Input
              value={hero.spotlight.stats[statIndex]?.label ?? ''}
              onChange={(e) => setSpotlightStat(statIndex, 'label', e.target.value)}
            />
          </div>
        </div>
      ))}

      <h3 className="text-lg font-semibold mb-3 mt-6">Tarjetas pequeñas (2)</h3>
      {HOME_HERO_TILE_INDICES.map((tileIndex) => (
        <div key={tileIndex} className="border border-border rounded-lg p-4 mb-4 space-y-3">
          <p className="text-sm font-medium">Tarjeta {tileIndex + 1}</p>
          <Input placeholder="Emoji / icono" value={hero.tiles[tileIndex]?.icon ?? ''} onChange={(e) => setTile(tileIndex, 'icon', e.target.value)} />
          <Input placeholder="Título" value={hero.tiles[tileIndex]?.title ?? ''} onChange={(e) => setTile(tileIndex, 'title', e.target.value)} />
          <Textarea placeholder="Texto" rows={2} value={hero.tiles[tileIndex]?.body ?? ''} onChange={(e) => setTile(tileIndex, 'body', e.target.value)} />
        </div>
      ))}

      <h3 className="text-lg font-semibold mb-3 mt-6">Barra blanca (4 columnas)</h3>
      {HOME_HERO_STATSBAR_INDICES.map((barColumnIndex) => (
        <div key={barColumnIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <Label className="text-xs text-muted-foreground">Columna {barColumnIndex + 1} — valor</Label>
            <Input value={hero.statsBar[barColumnIndex]?.value ?? ''} onChange={(e) => setBarStat(barColumnIndex, 'value', e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Columna {barColumnIndex + 1} — texto</Label>
            <Input value={hero.statsBar[barColumnIndex]?.label ?? ''} onChange={(e) => setBarStat(barColumnIndex, 'label', e.target.value)} />
          </div>
        </div>
      ))}

      {canEdit && (
        <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white" onClick={save} disabled={updateHomeHero.isPending}>
          {updateHomeHero.isPending ? 'Guardando…' : 'Guardar hero del inicio'}
        </Button>
      )}
    </div>
  )
}
