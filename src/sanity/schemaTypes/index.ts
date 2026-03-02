import { type SchemaTypeDefinition } from 'sanity'
import products from './products'
import category from './category'
import banner from './banner'
import testimonial from './testimonial'
import newsletter from './newsletter'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    products,
    category,
    banner,
    testimonial,
    newsletter,
  ],
}
