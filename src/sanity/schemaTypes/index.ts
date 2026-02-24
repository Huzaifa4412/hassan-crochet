import { type SchemaTypeDefinition } from 'sanity'
import products from './products'
import category from './category'
import collection from './collection'
import banner from './banner'
import testimonial from './testimonial'
import newsletter from './newsletter'
import navigationMenu from './navigationMenu'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    products,
    category,
    collection,
    banner,
    testimonial,
    newsletter,
    navigationMenu,
  ],
}
