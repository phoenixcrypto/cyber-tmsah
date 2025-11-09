'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, BookOpen, CheckSquare, Clock, MapPin, User, Loader2, LogOut } from 'lucide-react'
import { authenticatedFetch, getValidAccessToken } from '@/lib/auth/tokenRefresh'
import { offlineManager } from '@/lib/storage/offline-manager'

interface UserData {
  id: string
  username: string
  email: string
  fullName: string
  sectionNumber: number | null
  groupName: string | null
  role: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'materials'>('schedule')
  const [stats, setStats] = useState({
    tasks: 0,
    materials: 0,
  })
  const [schedule, setSchedule] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [loadingSchedule, setLoadingSchedule] = useState(false)
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [loadingMaterials, setLoadingMaterials] = useState(false)

  useEffect(() => {
    // Register sync listener for automatic sync when back online
    offlineManager.registerSyncListener(async () => {
      await Promise.all([loadSchedule(), loadTasks(), loadMaterials()])
    })

    // Check authentication with token refresh
    const checkAuth = async () => {
      const token = await getValidAccessToken(() => router.push('/login'))
      if (!token) {
        return
      }

      // Decode token to get user info (simple decode, not verification - for display only)
      try {
        const tokenPart = token?.split('.')?.[1]
        if (!tokenPart) {
          router.push('/login')
          return
        }
        const payload = JSON.parse(atob(tokenPart))
        const userRole = payload.role || 'student'
        
        // If user is admin, redirect to admin page
        if (userRole === 'admin') {
          router.push('/admin')
          return
        }
        
        setUser({
          id: payload.userId,
          username: payload.username,
          email: payload.email || '',
          fullName: payload.fullName || '',
          sectionNumber: payload.sectionNumber || null,
          groupName: payload.groupName || null,
          role: userRole,
        })

        // Load stats and initial data in parallel
        await Promise.all([
          loadStats(),
          activeTab === 'schedule' ? loadSchedule() : Promise.resolve(),
          activeTab === 'tasks' ? loadTasks() : Promise.resolve(),
          activeTab === 'materials' ? loadMaterials() : Promise.resolve(),
        ])
      } catch (err) {
        console.error('Error decoding token:', err)
        router.push('/login')
        return
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, activeTab])

  useEffect(() => {
    // Load data when tab changes (only if not already loaded)
    if (activeTab === 'schedule' && schedule.length === 0) {
      loadSchedule()
    } else if (activeTab === 'tasks' && tasks.length === 0) {
      loadTasks()
    } else if (activeTab === 'materials' && materials.length === 0) {
      loadMaterials()
    }
  }, [activeTab, schedule.length, tasks.length, materials.length])

  const loadStats = async () => {
    try {
      const response = await authenticatedFetch(
        '/api/dashboard/stats',
        { method: 'GET' },
        () => router.push('/login')
      )
      
      if (!response) return
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/login')
          return
        }
        throw new Error(`Failed to load stats: ${response.status}`)
      }
      
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Error loading stats:', err)
      // Don't show error to user, just log it
    }
  }

  const loadSchedule = async () => {
    setLoadingSchedule(true)
    try {
      // Try to load from offline storage first if offline
      if (!offlineManager.isConnected()) {
        const offlineSchedule = await offlineManager.getSchedule()
        if (offlineSchedule) {
          console.log('[Dashboard] Loaded schedule from offline storage')
          setSchedule(offlineSchedule)
          setLoadingSchedule(false)
          return
        }
      }

      const response = await authenticatedFetch(
        '/api/dashboard/schedule',
        { method: 'GET' },
        () => router.push('/login')
      )
      
      if (!response) {
        // If offline and no cached data, try to load from offline storage
        const offlineSchedule = await offlineManager.getSchedule()
        if (offlineSchedule) {
          setSchedule(offlineSchedule)
        }
        setLoadingSchedule(false)
        return
      }
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/login')
          return
        }
        // If network error, try offline storage
        const offlineSchedule = await offlineManager.getSchedule()
        if (offlineSchedule) {
          setSchedule(offlineSchedule)
        }
        throw new Error(`Failed to load schedule: ${response.status}`)
      }
      
      const data = await response.json()
      if (data.success) {
        const scheduleData = data.schedule || []
        setSchedule(scheduleData)
        // Save to offline storage
        await offlineManager.saveSchedule(scheduleData)
      }
    } catch (err) {
      console.error('Error loading schedule:', err)
      // Try to load from offline storage as fallback
      try {
        const offlineSchedule = await offlineManager.getSchedule()
        if (offlineSchedule) {
          setSchedule(offlineSchedule)
        }
      } catch (offlineErr) {
        console.error('Error loading from offline storage:', offlineErr)
      }
    } finally {
      setLoadingSchedule(false)
    }
  }

  const loadTasks = async () => {
    setLoadingTasks(true)
    try {
      // Try to load from offline storage first if offline
      if (!offlineManager.isConnected()) {
        const offlineTasks = await offlineManager.getTasks()
        if (offlineTasks) {
          console.log('[Dashboard] Loaded tasks from offline storage')
          setTasks(offlineTasks)
          setLoadingTasks(false)
          return
        }
      }

      const response = await authenticatedFetch(
        '/api/dashboard/tasks',
        { method: 'GET' },
        () => router.push('/login')
      )
      
      if (!response) {
        // If offline and no cached data, try to load from offline storage
        const offlineTasks = await offlineManager.getTasks()
        if (offlineTasks) {
          setTasks(offlineTasks)
        }
        setLoadingTasks(false)
        return
      }
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/login')
          return
        }
        // If network error, try offline storage
        const offlineTasks = await offlineManager.getTasks()
        if (offlineTasks) {
          setTasks(offlineTasks)
        }
        throw new Error(`Failed to load tasks: ${response.status}`)
      }
      
      const data = await response.json()
      if (data.success) {
        const tasksData = data.tasks || []
        setTasks(tasksData)
        // Save to offline storage
        await offlineManager.saveTasks(tasksData)
      }
    } catch (err) {
      console.error('Error loading tasks:', err)
      // Try to load from offline storage as fallback
      try {
        const offlineTasks = await offlineManager.getTasks()
        if (offlineTasks) {
          setTasks(offlineTasks)
        }
      } catch (offlineErr) {
        console.error('Error loading from offline storage:', offlineErr)
      }
    } finally {
      setLoadingTasks(false)
    }
  }

  const loadMaterials = async () => {
    setLoadingMaterials(true)
    try {
      // Try to load from offline storage first if offline
      if (!offlineManager.isConnected()) {
        const offlineMaterials = await offlineManager.getMaterials()
        if (offlineMaterials) {
          console.log('[Dashboard] Loaded materials from offline storage')
          setMaterials(offlineMaterials)
          setLoadingMaterials(false)
          return
        }
      }

      const response = await authenticatedFetch(
        '/api/dashboard/materials',
        { method: 'GET' },
        () => router.push('/login')
      )
      
      if (!response) {
        // If offline and no cached data, try to load from offline storage
        const offlineMaterials = await offlineManager.getMaterials()
        if (offlineMaterials) {
          setMaterials(offlineMaterials)
        }
        setLoadingMaterials(false)
        return
      }
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/login')
          return
        }
        // If network error, try offline storage
        const offlineMaterials = await offlineManager.getMaterials()
        if (offlineMaterials) {
          setMaterials(offlineMaterials)
        }
        throw new Error(`Failed to load materials: ${response.status}`)
      }
      
      const data = await response.json()
      if (data.success) {
        const materialsData = data.materials || []
        setMaterials(materialsData)
        // Save to offline storage
        await offlineManager.saveMaterials(materialsData)
      }
    } catch (err) {
      console.error('Error loading materials:', err)
      // Try to load from offline storage as fallback
      try {
        const offlineMaterials = await offlineManager.getMaterials()
        if (offlineMaterials) {
          setMaterials(offlineMaterials)
        }
      } catch (offlineErr) {
        console.error('Error loading from offline storage:', offlineErr)
      }
    } finally {
      setLoadingMaterials(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      })
      // Clear all cookies client-side
      document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax'
      document.cookie = 'refresh_token=; path=/; max-age=0; SameSite=Strict'
      document.cookie = 'admin-token=; path=/; max-age=0; SameSite=Strict'
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
      // Even if API fails, clear cookies and redirect
      document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax'
      document.cookie = 'refresh_token=; path=/; max-age=0; SameSite=Strict'
      document.cookie = 'admin-token=; path=/; max-age=0; SameSite=Strict'
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyber-neon animate-spin mx-auto mb-4" />
          <p className="text-dark-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100 mb-2">
                Dashboard
              </h1>
              <p className="text-dark-300">
                Welcome back, {user?.fullName || user?.username}
              </p>
              {user?.sectionNumber && (
                <p className="text-sm text-dark-400 mt-1">
                  Section {user.sectionNumber} • {user.groupName}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2 self-start md:self-auto"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards - Fixed height to prevent CLS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <div className="enhanced-card p-6 min-h-[180px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-dark-100" />
              </div>
              <span className="text-2xl font-bold text-cyber-neon">Today</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-100 mb-2">Schedule</h3>
              <p className="text-dark-300 text-sm">View your classes and schedule</p>
            </div>
          </div>

          <div className="enhanced-card p-6 min-h-[180px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyber-violet to-cyber-blue rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-dark-100" />
              </div>
              <span className="text-2xl font-bold text-cyber-violet">{stats.tasks}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-100 mb-2">Tasks</h3>
              <p className="text-dark-300 text-sm">Pending assignments</p>
            </div>
          </div>

          <div className="enhanced-card p-6 min-h-[180px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyber-green to-cyber-neon rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-dark-100" />
              </div>
              <span className="text-2xl font-bold text-cyber-green">{stats.materials}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-100 mb-2">Materials</h3>
              <p className="text-dark-300 text-sm">Available resources</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 animate-slide-up">
          <div className="flex gap-2 border-b border-cyber-neon/20">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'schedule'
                  ? 'text-cyber-neon border-b-2 border-cyber-neon'
                  : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'tasks'
                  ? 'text-cyber-neon border-b-2 border-cyber-neon'
                  : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Tasks
                {stats.tasks > 0 && (
                  <span className="bg-cyber-violet text-dark-100 text-xs px-2 py-0.5 rounded-full">
                    {stats.tasks}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'materials'
                  ? 'text-cyber-neon border-b-2 border-cyber-neon'
                  : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Materials
                {stats.materials > 0 && (
                  <span className="bg-cyber-green text-dark-100 text-xs px-2 py-0.5 rounded-full">
                    {stats.materials}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-slide-up">
          {activeTab === 'schedule' && (
            <div className="enhanced-card p-6">
              <h2 className="text-2xl font-semibold text-dark-100 mb-6">Today's Schedule</h2>
              {loadingSchedule ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-cyber-neon animate-spin" />
                </div>
              ) : schedule.length > 0 ? (
                <div className="space-y-4">
                  {schedule.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-cyber-dark/50 rounded-lg border border-cyber-neon/20 hover:border-cyber-neon/40 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-4 h-4 text-cyber-neon" />
                            <span className="text-cyber-neon font-semibold">{item.time}</span>
                            {item.type === 'Lecture' && (
                              <span className="bg-cyber-violet/20 text-cyber-violet text-xs px-2 py-1 rounded">
                                Lecture
                              </span>
                            )}
                            {item.type === 'Lab' && (
                              <span className="bg-cyber-green/20 text-cyber-green text-xs px-2 py-1 rounded">
                                Lab
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-dark-100 mb-1">{item.subject}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-dark-300">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {item.instructor}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {item.room}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark-300 text-center py-12">
                  No classes scheduled for today.
                </p>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="enhanced-card p-6">
              <h2 className="text-2xl font-semibold text-dark-100 mb-6">Your Tasks</h2>
              {loadingTasks ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-cyber-neon animate-spin" />
                </div>
              ) : tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-cyber-dark/50 rounded-lg border border-cyber-violet/20 hover:border-cyber-violet/40 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-dark-100">{task.title}</h3>
                            {task.submitted && (
                              <span className="bg-cyber-green/20 text-cyber-green text-xs px-2 py-1 rounded">
                                Submitted
                              </span>
                            )}
                          </div>
                          <p className="text-dark-300 mb-2">{task.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-dark-400">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark-300 text-center py-12">
                  No tasks assigned yet.
                </p>
              )}
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="enhanced-card p-6">
              <h2 className="text-2xl font-semibold text-dark-100 mb-6">Learning Materials</h2>
              {loadingMaterials ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-cyber-neon animate-spin" />
                </div>
              ) : materials.length > 0 ? (
                <div className="space-y-4">
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className="p-4 bg-cyber-dark/50 rounded-lg border border-cyber-green/20 hover:border-cyber-green/40 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-dark-100">{material.title}</h3>
                            {material.viewed && (
                              <span className="bg-cyber-green/20 text-cyber-green text-xs px-2 py-1 rounded">
                                Viewed
                              </span>
                            )}
                          </div>
                          <p className="text-dark-300 text-sm mb-2 line-clamp-2">
                            {material.content?.substring(0, 200)}...
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-dark-400">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {new Date(material.published_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark-300 text-center py-12">
                  No materials available yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

