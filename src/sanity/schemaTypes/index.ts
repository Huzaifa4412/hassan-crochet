import { type SchemaTypeDefinition } from 'sanity'
import products from './products'
import category from './category'
import banner from './banner'
import testimonial from './testimonial'
import newsletter from './newsletter'
import order from './order'
import post from './post'
import author from './author'
import { emailDispatch, emailRateLimit } from './emailDelivery'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    products,
    category,
    banner,
    testimonial,
    newsletter,
    order,
    // Blog types
    post,
    author,
    emailDispatch,
    emailRateLimit,
  ],
}
