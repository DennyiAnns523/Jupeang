import { type SchemaTypeDefinition } from 'sanity'
import product from '../schemas/product'
import category from '../schemas/category'
import order from '../schemas/order'
import gardenPost from '../schemas/gardenPost'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, order, gardenPost],
}
