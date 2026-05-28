import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Jupeang')
    .items([
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
