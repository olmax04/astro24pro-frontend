'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic' // <--- 1. Импортируем dynamic
import { Briefcase, Save, Loader2, DollarSign } from 'lucide-react'

// <--- 2. Динамический импорт редактора (отключает SSR)
const LexicalEditor = dynamic(
  () => import('@/components/ui/LexicalEditor').then((mod) => mod.LexicalEditor),
  {
    ssr: false, // Главный фикс: не рендерить на сервере
    loading: () => (
      // Заглушка пока грузится редактор
      <div className="h-[200px] w-full bg-slate-950 border border-white/10 rounded-xl animate-pulse flex items-center justify-center text-slate-600 text-sm">
        Загрузка редактора...
      </div>
    ),
  },
)

interface SpecialistTabProps {
  user: any
}

export const SpecialistTab = ({ user }: SpecialistTabProps) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Инициализация состояния данными из базы
  const [formData, setFormData] = useState({
    specialization: user.specialistDetails?.specialization || '',
    experience: user.specialistDetails?.experience || 0,
    serviceCostAmount: user.specialistDetails?.serviceCost?.amount || 0,
    serviceCostCurrency: user.specialistDetails?.serviceCost?.currency || 'RUB',
    // Биография приходит как JSON объект. Если пусто — undefined
    biography: user.specialistDetails?.biography || undefined,
  })

  // --- ЛОГИКА СОХРАНЕНИЯ ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Формируем объект для обновления
      const payload = {
        specialistDetails: {
          ...user.specialistDetails,
          specialization: formData.specialization,
          experience: Number(formData.experience),
          serviceCost: {
            amount: Number(formData.serviceCostAmount),
            currency: formData.serviceCostCurrency,
          },
          // Lexical Editor возвращает готовый JSON
          biography: formData.biography,
        },
      }

      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.errors?.[0]?.message || 'Ошибка сохранения')
      }

      router.refresh()
      alert('Данные специалиста успешно обновлены!')
    } catch (err: any) {
      console.error(err)
      alert(`Ошибка: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Заголовок */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Briefcase className="text-amber-500" size={24} />
        <div>
          <h2 className="text-xl font-serif text-white">Анкета специалиста</h2>
          <p className="text-sm text-slate-400">Эта информация будет видна клиентам</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Секция 1: Основные данные */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup
            label="Специализация"
            placeholder="Например: Таролог, Астролог, Рунолог"
            value={formData.specialization}
            onChange={(v: string) => setFormData({ ...formData, specialization: v })}
          />
          <InputGroup
            label="Опыт работы (лет)"
            type="number"
            value={formData.experience}
            onChange={(v: string) => setFormData({ ...formData, experience: v })}
          />
        </div>

        {/* Секция 2: Стоимость услуг */}
        <div className="bg-slate-950/50 p-5 rounded-xl border border-white/5">
          <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <DollarSign size={16} className="text-amber-500" />
            Базовая стоимость консультации
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Сумма"
              type="number"
              value={formData.serviceCostAmount}
              onChange={(v: string) => setFormData({ ...formData, serviceCostAmount: v })}
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-400">Валюта</label>
              <div className="relative">
                <select
                  value={formData.serviceCostCurrency}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceCostCurrency: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 appearance-none cursor-pointer transition-colors hover:bg-white/5"
                >
                  <option value="RUB">RUB (₽) - Российский рубль</option>
                  <option value="USD">USD ($) - Доллар США</option>
                  <option value="EUR">EUR (€) - Евро</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  ▼
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Секция 3: Lexical Rich Text Editor (Динамический) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-400 flex justify-between">
            <span>Биография / О себе</span>
            <span className="text-xs text-slate-600">Rich Text</span>
          </label>

          <LexicalEditor
            value={formData.biography}
            onChange={(jsonState: any) => setFormData({ ...formData, biography: jsonState })}
          />

          <p className="text-xs text-slate-500">Расскажите о своих методах, философии и опыте.</p>
        </div>

        {/* Кнопка сохранения */}
        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            Сохранить анкету
          </button>
        </div>
      </form>
    </div>
  )
}

const InputGroup = ({ label, type = 'text', value, onChange, placeholder }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-slate-400">{label}</label>
    <input
      type={type}
      className="bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-colors hover:bg-white/5"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
)
