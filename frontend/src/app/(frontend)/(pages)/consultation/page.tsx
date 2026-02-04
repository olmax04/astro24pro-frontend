'use client'

import React, { useState, useEffect } from 'react'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import '@livekit/components-styles'
import { Sparkles, Video, ShieldCheck, Zap, UserCircle } from 'lucide-react'

export default function VideoTestPage() {
  const [token, setToken] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<{ id: number; email: string; name?: string } | null>(null)

  // Проверка авторизации через Payload CMS при загрузке страницы
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/users/me')
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
        }
      } catch (err) {
        console.error('Ошибка проверки авторизации:', err)
      }
    }
    checkAuth()
  }, [])

  // Получение токена из вашего ConsultationVideoController
  const fetchToken = async () => {
    if (!user) {
      alert('Пожалуйста, войдите в систему, чтобы начать звонок.')
      return
    }

    setIsLoading(true)
    try {
      // Динамически подставляем ID текущего пользователя из сессии Payload
      const resp = await fetch(
        `/api/v1/video/join?roomName=test-room&userId=${user.id}`
      )

      if (!resp.ok) throw new Error('Ошибка сервера при генерации токена')

      const data = await resp.json()
      setToken(data.token)
    } catch (e) {
      console.error('Ошибка получения токена:', e)
      alert('Не удалось получить токен. Проверьте соединение с Backend.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white relative flex flex-col items-center justify-center overflow-hidden p-4">
      {/* Декоративный фон */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
      </div>

      {!token ? (
        <div className="relative z-10 w-full max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            Техническая лаборатория
          </div>

          <h1 className="text-4xl md:text-5xl font-serif mb-6 text-white">
            Проверка <span className="text-amber-500">Видеосвязи</span>
          </h1>

          {/* Отображение статуса пользователя */}
          <div className="flex items-center justify-center gap-3 mb-8 text-slate-300">
            <UserCircle size={20} className={user ? "text-green-500" : "text-red-500"} />
            {user ? (
              <span>Вы вошли как: <strong>{user.name || user.email}</strong> (ID: {user.id})</span>
            ) : (
              <span className="text-red-400">Пользователь не авторизован</span>
            )}
          </div>

          <p className="text-slate-400 text-lg mb-12 max-w-lg mx-auto">
            Используйте это пространство для настройки вашего оборудования перед началом консультации.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            <TestFeature icon={<ShieldCheck className="text-amber-500" />} title="Безопасно" desc="Индивидуальный токен" />
            <TestFeature icon={<Video className="text-amber-500" />} title="Авторизация" desc="Payload CMS Sync" />
            <TestFeature icon={<Zap className="text-amber-500" />} title="LiveKit" desc="Real-time WebRTC" />
          </div>

          <button
            onClick={fetchToken}
            disabled={isLoading || !user}
            className="group relative px-10 py-4 bg-amber-500 text-slate-950 font-bold rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? 'Генерация токена...' : 'Установить соединение'}
            </span>
            <div className="absolute inset-0 rounded-full bg-amber-400 blur-lg opacity-0 group-hover:opacity-40 transition-opacity"></div>
          </button>
        </div>
      ) : (
        <div className="relative z-10 w-full h-full max-h-[85vh] flex flex-col">
          <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-slate-300 italic">Эфир активен • {user?.name}</span>
            </div>
            <button
              onClick={() => setToken('')}
              className="text-xs uppercase tracking-widest text-slate-500 hover:text-red-400 transition-colors"
            >
              Прервать тест
            </button>
          </div>

          <div className="flex-1 rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
            <LiveKitRoom
              video={true}
              audio={true}
              token={token}
              serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
              onDisconnected={() => setToken('')}
              data-lk-theme="default"
              style={{ height: '100%' }}
            >
              <VideoConference />
            </LiveKitRoom>
          </div>
        </div>
      )}
    </main>
  )
}

function TestFeature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
      <div className="mb-2">{icon}</div>
      <div className="text-sm font-bold text-white">{title}</div>
      <div className="text-xs text-slate-500">{desc}</div>
    </div>
  )
}