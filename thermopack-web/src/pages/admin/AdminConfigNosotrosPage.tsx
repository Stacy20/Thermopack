import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNosotrosData, useUpdateNosotros } from '../../hooks/useData'
import { useAuth } from '../../auth/AuthContext'
import { showAlert, showConfirmationAlert } from '../../lib/sweetAlert'
import type { HistoriaItem, ValorItem } from '../../types/data'
import type { NosotrosPageConfig } from '../../types/nosotrosPage'
import { mergeNosotrosPage } from '../../constants/nosotrosPageDefaults'
import { NosotrosPageBlocksEditor } from './NosotrosPageBlocksEditor'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Separator } from '../../components/ui/separator'

function NosotrosConfigSection({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 mb-6">
      <h5 className="font-semibold text-card-foreground mb-1">{title}</h5>
      <p className="text-xs text-muted-foreground mb-4">{hint}</p>
      {children}
    </div>
  )
}

export function AdminConfigNosotrosPage() {
  const navigate = useNavigate()
  const { isLoggedIn, userLoggedIn, authReady } = useAuth()
  const canEdit = userLoggedIn?.privileges?.[1] === 1

  const { data: nosotrosData } = useNosotrosData()
  const updateNosotros = useUpdateNosotros()

  const [nosotrosDescription, setNosotrosDescription] = useState('')
  const [historiaList, setHistoriaList] = useState<HistoriaItem[]>([])
  const [valoresList, setValoresList] = useState<ValorItem[]>([])
  const [pageCfg, setPageCfg] = useState<NosotrosPageConfig>(() => mergeNosotrosPage(null))
  const [savedJson, setSavedJson] = useState('')

  useEffect(() => {
    if (!authReady) return
    if (!isLoggedIn) navigate('/login')
  }, [authReady, isLoggedIn, navigate])

  useEffect(() => {
    if (!nosotrosData) return
    const desc = nosotrosData.nosotrosDescription ?? ''
    const historia = nosotrosData.historiaList ?? []
    const valores = nosotrosData.valoresList ?? []
    const page = mergeNosotrosPage(nosotrosData.nosotrosPage)
    setNosotrosDescription(desc)
    setHistoriaList(historia)
    setValoresList(valores)
    setPageCfg(page)
    setSavedJson(JSON.stringify({ desc, historia, valores, page }))
  }, [nosotrosData])

  const hasChanged = () =>
    JSON.stringify({ desc: nosotrosDescription, historia: historiaList, valores: valoresList, page: pageCfg }) !==
    savedJson

  const handleSave = () => {
    if (nosotrosDescription.trim().length > 0 && nosotrosDescription.trim().length < 5) {
      void showAlert('Error', 'La descripción debe tener al menos 5 caracteres.', 'error'); return
    }
    showConfirmationAlert('Confirmación', '¿Está seguro que desea guardar los cambios?', () => {
      updateNosotros.mutate(
        { nosotrosDescription, historiaList, valoresList, nosotrosPage: pageCfg },
        {
          onSuccess: () => {
            setSavedJson(
              JSON.stringify({
                desc: nosotrosDescription,
                historia: historiaList,
                valores: valoresList,
                page: pageCfg,
              })
            )
            void showAlert('Éxito', 'Cambios guardados correctamente.', 'success')
          },
        }
      )
    })
  }

  const addHistoria = () => setHistoriaList((prev) => [...prev, { year: '', title: '', desc: '' }])
  const updateHistoria = (i: number, field: keyof HistoriaItem, value: string) =>
    setHistoriaList((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  const removeHistoria = (i: number) => setHistoriaList((prev) => prev.filter((_, idx) => idx !== i))

  const addValor = () => setValoresList((prev) => [...prev, { icon: '', title: '', desc: '' }])
  const updateValor = (i: number, field: keyof ValorItem, value: string) =>
    setValoresList((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  const removeValor = (i: number) => setValoresList((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Configuración — Nosotros</h2>
      <Separator className="mb-6" />

      <NosotrosConfigSection
        title="Bloques de la página (hero, misión, visión, títulos)"
        hint="Textos que antes estaban fijos en la web pública."
      >
        <NosotrosPageBlocksEditor page={pageCfg} onChange={setPageCfg} disabled={!canEdit} />
      </NosotrosConfigSection>

      <NosotrosConfigSection title="Descripción principal" hint='Texto que aparece en el hero de la sección "Quiénes somos".'>
        <Label className="mb-2">Descripción</Label>
        <Textarea rows={3} disabled={!canEdit} value={nosotrosDescription} onChange={(e) => setNosotrosDescription(e.target.value)} />
      </NosotrosConfigSection>

      <NosotrosConfigSection title="Historia (línea de tiempo)" hint='Cada entrada aparece como un hito en la sección "Nuestra trayectoria".'>
        {historiaList.map((item, i) => (
          <div key={i} className="border border-border rounded-lg p-4 mb-3">
            <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_2fr] gap-3">
              <div className="space-y-1"><Label>Año</Label><Input disabled={!canEdit} value={item.year} onChange={(e) => updateHistoria(i, 'year', e.target.value)} /></div>
              <div className="space-y-1"><Label>Título</Label><Input disabled={!canEdit} value={item.title} onChange={(e) => updateHistoria(i, 'title', e.target.value)} /></div>
              <div className="space-y-1"><Label>Descripción</Label><Input disabled={!canEdit} value={item.desc} onChange={(e) => updateHistoria(i, 'desc', e.target.value)} /></div>
            </div>
            {canEdit && <Button size="sm" variant="destructive" className="mt-3" onClick={() => removeHistoria(i)}>Eliminar</Button>}
          </div>
        ))}
        {canEdit && <Button variant="outline" className="border-brand-700 text-brand-700 hover:bg-brand-50" onClick={addHistoria}>+ Agregar entrada</Button>}
      </NosotrosConfigSection>

      <NosotrosConfigSection title="Valores corporativos" hint='Cada tarjeta aparece en la sección "Nuestros valores corporativos". Use un emoji como ícono.'>
        {valoresList.map((item, i) => (
          <div key={i} className="border border-border rounded-lg p-4 mb-3">
            <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_2fr] gap-3">
              <div className="space-y-1"><Label>Ícono</Label><Input disabled={!canEdit} value={item.icon} onChange={(e) => updateValor(i, 'icon', e.target.value)} /></div>
              <div className="space-y-1"><Label>Título</Label><Input disabled={!canEdit} value={item.title} onChange={(e) => updateValor(i, 'title', e.target.value)} /></div>
              <div className="space-y-1"><Label>Descripción</Label><Input disabled={!canEdit} value={item.desc} onChange={(e) => updateValor(i, 'desc', e.target.value)} /></div>
            </div>
            {canEdit && <Button size="sm" variant="destructive" className="mt-3" onClick={() => removeValor(i)}>Eliminar</Button>}
          </div>
        ))}
        {canEdit && <Button variant="outline" className="border-brand-700 text-brand-700 hover:bg-brand-50" onClick={addValor}>+ Agregar valor</Button>}
      </NosotrosConfigSection>

      {canEdit && (
        <Button
          className="mt-2 mb-8 bg-brand-800 hover:bg-brand-700 text-white"
          disabled={!hasChanged() || updateNosotros.isPending}
          onClick={handleSave}
        >
          {updateNosotros.isPending ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      )}
    </div>
  )
}
