import { Router } from 'express'
import DataModel from '../collections/data.collection'
import ContactModel from '../collections/contact.collection'
import { listEnrichedProducts } from '../services/enrichedProducts.service'

const router = Router()

router.get('/public', async (_req, res) => {
  try {
    const [dataDoc, contactDoc, { products }] = await Promise.all([
      DataModel.findOne({}).lean().exec(),
      ContactModel.findOne({}, 'whatsappLink').lean().exec(),
      listEnrichedProducts({}, 0, 6),
    ])

    res.status(200).json({
      slogan: dataDoc?.slogan ?? '',
      description: dataDoc?.description ?? '',
      logo: dataDoc?.logo ?? null,
      homeHero: dataDoc?.homeHero ?? null,
      whatsappLink: contactDoc?.whatsappLink ?? '',
      featuredProducts: products,
    })
  } catch (error) {
    console.error('Error GET /home/public:', error)
    res.status(500).json({ message: 'Error al cargar el inicio' })
  }
})

export default router
