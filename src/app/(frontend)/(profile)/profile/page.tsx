import React from 'react'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { ProfileTabs } from '@/components/profile/ProfileTabs'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/login')
  }

  // Получаем актуальные данные пользователя (на случай, если кука старая)
  const freshUser = await payload.findByID({
    collection: 'users',
    id: user.id,
  })

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-8">Личный кабинет</h1>

        {/* Передаем пользователя в клиентский компонент */}
        <ProfileTabs user={freshUser} />
      </div>
    </main>
  )
}
