import type { CollectionConfig } from 'payload'
import { ROLES } from '@/constants'
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // TODO: Обновить права доступа для ролей
    read: () => true,
    // @ts-ignore
    create: () => ({ req: { user } }) =>
      Boolean(user && (user.role === ROLES.SPECIALIST || user.role === ROLES.MODERATOR || user.role === ROLES.MODERATOR)),
    update: () => true,
    delete: ({ req: { user } }) =>
      Boolean(user && user.role === ROLES.MODERATOR)
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'mobile', // Для телефонов
        width: 768,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'tablet', // Для планшетов
        width: 1024,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'desktop', // Для ноутбуков
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
