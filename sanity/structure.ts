import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Üli')
    .items([
      S.listItem()
        .title('🏡  Home page')
        .child(S.document().schemaType('homePage').documentId('homePage').title('Home page')),
      S.listItem()
        .title('📷  Album')
        .child(S.document().schemaType('album').documentId('album').title('Album')),
      S.divider(),
      S.listItem()
        .title('🌸  Shop')
        .child(
          S.list().title('Shop').items([
            S.documentTypeListItem('product').title('Products'),
            S.documentTypeListItem('category').title('Categories'),
            S.documentTypeListItem('order').title('Orders'),
          ])
        ),
      S.divider(),
      S.listItem()
        .title('🌱  Garden Journal')
        .child(
          S.list().title('Garden Journal').items([
            S.documentTypeListItem('gardenPost').title('Posts'),
          ])
        ),
    ])
