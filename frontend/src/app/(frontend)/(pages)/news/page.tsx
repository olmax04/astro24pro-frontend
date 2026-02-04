import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config' // Проверь путь к конфигу
import { BlogFeed } from '@/components/BlogFeed' // Путь к компоненту выше
import { BlogPost } from '@/components/cards/BlogCard'

export const dynamic = 'force-dynamic' // Чтобы новости обновлялись сразу (или используй revalidate)

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  // 1. Забираем новости
  const { docs: newsItems } = await payload.find({
    collection: 'news',
    limit: 100, // Лимит статей на странице
    sort: '-publishedDate', // Свежие сверху
  })

  // 2. Преобразуем данные Payload -> данные Карточки
  const posts: (BlogPost & { categoryId: string })[] = newsItems.map((item) => {
    // Получаем URL картинки
    const imageUrl =
      item.image && typeof item.image === 'object' && 'url' in item.image
        ? (item.image.url as string)
        : undefined

    // Красивая дата
    const formattedDate = item.publishedDate
      ? new Date(item.publishedDate).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : new Date(item.createdAt).toLocaleDateString('ru-RU')

    // Красивое название категории для карточки
    const categoryLabels: Record<string, string> = {
      forecast: 'Прогноз',
      education: 'Обучение',
      esoterics: 'Эзотерика',
    }

    return {
      id: item.id,
      slug: item.slug || String(item.id),
      title: item.title,
      // Сохраняем "сырой" ID категории для фильтрации (forecast, education...)
      categoryId: item.category,
      // А это красивый текст для отображения на карточке
      category: categoryLabels[item.category] || 'Новости',
      publishDate: formattedDate,
      imageUrl: imageUrl,
    }
  })

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-24">
        {/* Заголовок страницы */}
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">Звездный Журнал</h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Погрузитесь в мир астрологии и эзотерики. Здесь мы публикуем еженедельные гороскопы,
            обучающие материалы по Таро и секреты лунной магии.
          </p>
        </div>

        {/* Клиентская часть с фильтрами */}
        <BlogFeed posts={posts} />
      </div>
    </main>
  )
}
