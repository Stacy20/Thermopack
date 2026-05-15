import type { HomeHeroConfig } from '../types/home'

export const DEFAULT_SLOGAN = 'Innovación en cada Blíster Pack, pasión en cada producto'

export const DEFAULT_HOME_HERO: HomeHeroConfig = {
  badge: 'Importadores líderes en Europa',
  spotlight: {
    title: 'Distribución masiva',
    body: 'Llevamos los mejores productos hasta sus puntos de venta con cobertura nacional e internacional.',
    stats: [
      { value: '+200', label: 'Productos' },
      { value: '7', label: 'Categorías' },
      { value: '100%', label: 'Calidad' },
    ],
  },
  tiles: [
    {
      icon: '🌍',
      title: 'Europa',
      body: 'Marcas líderes importadas directamente',
    },
    {
      icon: '✅',
      title: 'Certificados',
      body: 'Respaldo internacional en todos los productos',
    },
  ],
  statsBar: [
    { value: '+200', label: 'Productos disponibles' },
    { value: '7', label: 'Categorías' },
    { value: '100%', label: 'Compromiso calidad' },
    { value: '🌍', label: 'Alcance internacional' },
  ],
}

export function mergeHomeHero(fromDb: Partial<HomeHeroConfig> | null | undefined): HomeHeroConfig {
  const d = fromDb ?? {}
  const spot: Partial<HomeHeroConfig['spotlight']> = d.spotlight ?? {}
  const defaultSpot = DEFAULT_HOME_HERO.spotlight
  return {
    badge: d.badge?.trim() || DEFAULT_HOME_HERO.badge,
    spotlight: {
      title: spot.title?.trim() || defaultSpot.title,
      body: spot.body?.trim() || defaultSpot.body,
      stats:
        Array.isArray(spot.stats) && spot.stats.length >= 3
          ? spot.stats.slice(0, 3).map((statRow, statIndex) => ({
              value: (statRow?.value ?? defaultSpot.stats[statIndex]?.value ?? '').trim(),
              label: (statRow?.label ?? defaultSpot.stats[statIndex]?.label ?? '').trim(),
            }))
          : defaultSpot.stats,
    },
    tiles:
      Array.isArray(d.tiles) && d.tiles.length >= 2
        ? d.tiles.slice(0, 2).map((tileRow, tileIndex) => ({
            icon: (tileRow?.icon ?? DEFAULT_HOME_HERO.tiles[tileIndex]?.icon ?? '').trim(),
            title: (tileRow?.title ?? DEFAULT_HOME_HERO.tiles[tileIndex]?.title ?? '').trim(),
            body: (tileRow?.body ?? DEFAULT_HOME_HERO.tiles[tileIndex]?.body ?? '').trim(),
          }))
        : DEFAULT_HOME_HERO.tiles,
    statsBar:
      Array.isArray(d.statsBar) && d.statsBar.length >= 4
        ? d.statsBar.slice(0, 4).map((barRow, barIndex) => ({
            value: (barRow?.value ?? DEFAULT_HOME_HERO.statsBar[barIndex]?.value ?? '').trim(),
            label: (barRow?.label ?? DEFAULT_HOME_HERO.statsBar[barIndex]?.label ?? '').trim(),
          }))
        : DEFAULT_HOME_HERO.statsBar,
  }
}
