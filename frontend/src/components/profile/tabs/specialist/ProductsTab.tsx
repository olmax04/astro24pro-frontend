// src/components/profile/tabs/ProductsTab.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Edit, Trash2, Package, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner' // Опционально: для красивых уведомлений
import { AddProductDialog } from '@/components/dialog/AddProductDialog'
import { EditProductDialog } from '@/components/dialog/EditProductDialog'

// --- Типы (желательно вынести в @/types/payload-types) ---
interface ProductImage {
  id?: string
  url?: string
  alt?: string
}

interface Product {
  id: string
  title: string
  price: number
  currency: 'RUB' | 'USD'
  stock: number
  status: 'draft' | 'pending' | 'published'
  images?: ProductImage[]
  updatedAt?: string
}

interface ProductsTabProps {
  user: {
    id: string | number
    [key: string]: any
  }
}

export const ProductsTab = ({ user }: ProductsTabProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // 1. Получение данных из Payload CMS
  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!user?.id) return

      try {
        // Формируем запрос к REST API Payload
        // where[owner][equals]=USER_ID - фильтр только моих товаров
        // depth=1 - чтобы подтянулись картинки (media)
        const res = await fetch(
          `/api/products?where[owner][equals]=${user.id}&depth=1&sort=-createdAt`,
        )

        if (!res.ok) throw new Error('Ошибка загрузки товаров')

        const data = await res.json()
        setProducts(data.docs)
      } catch (error) {
        console.error(error)
        toast.error('Не удалось загрузить ваши товары')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMyProducts()
  }, [user.id])

  // 2. Логика создания
  const handleAddProduct = () => {
    setIsCreateOpen(true)
  }

  // 3. Логика удаления
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm('Вы уверены, что хотите удалить этот товар безвозвратно?')) return

    // Оптимистичное обновление интерфейса (сразу убираем карточку)
    const previousProducts = [...products]
    setProducts((prev) => prev.filter((p) => p.id !== id))

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Ошибка удаления')
      toast.success('Товар удален')
    } catch (error) {
      console.error(error)
      toast.error('Ошибка при удалении')
      // Возвращаем как было, если ошибка
      setProducts(previousProducts)
    }
  }

  // --- Рендер: Состояние загрузки ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 animate-in fade-in">
        <Loader2 size={32} className="animate-spin mb-4 text-amber-500" />
        <p>Загрузка ваших товаров...</p>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <AddProductDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(created) => setProducts((prev) => [created, ...prev])}
      />
      <EditProductDialog
        open={Boolean(editingProduct)}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onUpdated={(updated) =>
          setProducts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        }
      />
      {/* Заголовок */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-serif text-white">Мои товары</h2>
          <p className="text-sm text-slate-400">Управляйте ассортиментом и остатками</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-lg transition-colors shadow-lg shadow-amber-500/10"
        >
          <Plus size={16} />
          <span>Добавить</span>
        </button>
      </div>

      {/* Сетка товаров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Карточка создания */}
        <button
          onClick={handleAddProduct}
          className="group relative min-h-[320px] h-full border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-500 hover:bg-slate-900/40 hover:border-amber-500/50 transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mb-4 group-hover:bg-slate-800 group-hover:scale-110 transition-all">
            <Plus
              size={32}
              className="text-slate-400 group-hover:text-amber-500 transition-colors"
            />
          </div>
          <span className="text-base font-medium text-slate-400 group-hover:text-white transition-colors">
            Создать новый товар
          </span>
        </button>

        {/* Список загруженных товаров */}
        {products.map((product) => (
          <ManagerProductCard
            key={product.id}
            product={product}
            onEdit={() => setEditingProduct(product)}
            onDelete={(e) => handleDelete(e, product.id)}
          />
        ))}

        {/* Если пусто */}
        {products.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            <p>У вас пока нет созданных товаров.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Компонент карточки (без изменений логики, только типы) ---
interface ManagerCardProps {
  product: Product
  onEdit: () => void
  onDelete: (e: React.MouseEvent) => void
}

const ManagerProductCard = ({ product, onEdit, onDelete }: ManagerCardProps) => {
  const { id, title, price, currency, stock, status, images } = product

  // В Payload images приходят как объекты, если depth >= 1
  // Проверяем, является ли image объектом или ID (на всякий случай)
  const mainImage = images?.[0] && typeof images[0] === 'object' ? images[0].url : null

  const formattedPrice = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency || 'RUB',
    maximumFractionDigits: 0,
  }).format(price)

  const statusConfig = {
    draft: {
      label: 'Черновик',
      bg: 'bg-slate-700',
      text: 'text-slate-200',
      border: 'border-slate-600',
    },
    pending: {
      label: 'На проверке',
      bg: 'bg-blue-900/60',
      text: 'text-blue-200',
      border: 'border-blue-700/50',
    },
    published: {
      label: 'Активен',
      bg: 'bg-emerald-900/60',
      text: 'text-emerald-200',
      border: 'border-emerald-700/50',
    },
  }

  // Безопасный фоллбек статуса
  const currentStatus = statusConfig[status] || statusConfig.draft

  return (
    <div className="group relative bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-4/3 bg-slate-800 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2">
            <Package size={32} />
            <span className="text-xs">Нет фото</span>
          </div>
        )}

        {/* Кнопки управления */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onEdit()
            }}
            className="p-2 bg-slate-950/90 backdrop-blur-sm rounded-lg text-slate-300 hover:text-white hover:bg-amber-600 border border-white/10 transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-slate-950/90 backdrop-blur-sm rounded-lg text-red-400 hover:text-white hover:bg-red-600 border border-white/10 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Бейдж статуса */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border backdrop-blur-md ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}
          >
            {currentStatus.label}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col grow">
        <h4 className="text-white font-medium text-lg leading-snug mb-1 line-clamp-1">{title}</h4>

        <div className="mt-auto pt-4 flex items-end justify-between border-t border-white/5">
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Цена</div>
            <div className="text-amber-400 font-bold font-mono text-lg">{formattedPrice}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-0.5 flex items-center justify-end gap-1">
              Остаток
              {stock < 3 && stock > 0 && <AlertCircle size={10} className="text-red-400" />}
            </div>
            <div className={`font-medium ${stock === 0 ? 'text-red-400' : 'text-slate-300'}`}>
              {stock > 0 ? `${stock} шт.` : 'Нет в наличии'}
            </div>
          </div>
        </div>
      </div>

      {/* Ссылка на просмотр (z-index 0, под кнопками) */}
      <Link
        href={`/shop/${id}`}
        className="absolute inset-0 z-0"
        aria-label="Открыть страницу товара"
      />
    </div>
  )
}
