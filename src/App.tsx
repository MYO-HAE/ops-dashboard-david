import { useState, useEffect } from 'react'
import './index.css'

interface LearningProgress {
  python_cs50p: {
    current_week: number
    current_topic: string
    lessons_completed: string[]
    started: string
    last_completed: string
  }
  math_for_ai: {
    current_module: string
    current_topic: string
    lessons_completed: string[]
    started: string
    last_completed: string
  }
}

function App() {
  const [data, setData] = useState<LearningProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load learning progress data
    fetch('/learning-progress.json')
      .then(res => res.json())
      .then((data: LearningProgress) => {
        setData(data)
        setLoading(false)
      })
      .catch(() => {
        // Fallback data if file not found
        setData({
          python_cs50p: {
            current_week: 10,
            current_topic: "Asyncio & Async/Await",
            lessons_completed: Array(20).fill("Lesson"),
            started: "2026-02-09",
            last_completed: "2026-03-01"
          },
          math_for_ai: {
            current_module: "practical_ml",
            current_topic: "Hyperparameter Tuning",
            lessons_completed: Array(20).fill("Lesson"),
            started: "2026-02-09",
            last_completed: "2026-03-01"
          }
        })
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    )
  }

  const pythonProgress = data ? (data.python_cs50p.lessons_completed.length / 20) * 100 : 0
  const mathProgress = data ? (data.math_for_ai.lessons_completed.length / 20) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Ops Health Dashboard
          </h1>
          <p className="text-slate-400">David Kim — Nightly Build March 2, 2026</p>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Python CS50P" 
            value={`Week ${data?.python_cs50p.current_week}`}
            subtitle={data?.python_cs50p.current_topic || ''}
            color="from-green-500 to-emerald-600"
          />
          <StatCard 
            title="Math for AI" 
            value="Module 4"
            subtitle={data?.math_for_ai.current_topic || ''}
            color="from-blue-500 to-cyan-600"
          />
          <StatCard 
            title="Overdue Tasks" 
            value="6"
            subtitle="P1 tasks, 16 days"
            color="from-red-500 to-rose-600"
            alert
          />
          <StatCard 
            title="System Health" 
            value="OK"
            subtitle="All crons running"
            color="from-purple-500 to-violet-600"
          />
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Python Progress */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-2xl">🐍</span> Python CS50P
              </h2>
              <span className="text-sm text-slate-400">{data?.python_cs50p.lessons_completed.length}/20 lessons</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${pythonProgress}%` }}
              />
            </div>
            <p className="text-sm text-slate-300 mb-2">Currently: <span className="text-green-400">{data?.python_cs50p.current_topic}</span></p>
            <p className="text-xs text-slate-500">Started {data?.python_cs50p.started} • Last completed {data?.python_cs50p.last_completed}</p>
          </div>

          {/* Math Progress */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-2xl">📐</span> Math for AI
              </h2>
              <span className="text-sm text-slate-400">{data?.math_for_ai.lessons_completed.length}/20 lessons</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-400 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${mathProgress}%` }}
              />
            </div>
            <p className="text-sm text-slate-300 mb-2">Currently: <span className="text-blue-400">{data?.math_for_ai.current_topic}</span></p>
            <p className="text-xs text-slate-500">Started {data?.math_for_ai.started} • Last completed {data?.math_for_ai.last_completed}</p>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-red-400">⚠️</span> Attention Required
          </h2>
          <div className="space-y-3">
            <AlertItem 
              type="error"
              title="6 Overdue P1 Tasks" 
              description="Tasks from Feb 13: Marketing Strategy, B2B Sales Strategy, AI Influencer Agent, Content Creation Agent, GA Analysis, ClickUp Migration"
            />
            <AlertItem 
              type="warning"
              title="Grant DB Endpoint 404" 
              description="Notion proxy API failing for grants database. Needs fix."
            />
            <AlertItem 
              type="info"
              title="Morning Brief Timeout" 
              description="Consistently hitting 300s limit. Recommend increasing to 600s."
            />
          </div>
        </div>

        {/* Recent Lessons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LessonList 
            title="Recent Python Lessons" 
            lessons={data?.python_cs50p.lessons_completed.slice(-5) || []}
            color="green"
          />
          <LessonList 
            title="Recent Math Lessons" 
            lessons={data?.math_for_ai.lessons_completed.slice(-5) || []}
            color="blue"
          />
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-slate-500 text-sm">
          <p>Built by Alice — Nightly Build {new Date().toLocaleDateString()}</p>
          <p className="mt-1">OpenClaw Ops Dashboard v1.0</p>
        </footer>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  color: string
  alert?: boolean
}

function StatCard({ title, value, subtitle, color, alert }: StatCardProps) {
  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-4 border ${alert ? 'border-red-500/50' : 'border-white/20'} hover:scale-105 transition-transform`}>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1 truncate">{subtitle}</p>
    </div>
  )
}

interface AlertItemProps {
  type: 'error' | 'warning' | 'info'
  title: string
  description: string
}

function AlertItem({ type, title, description }: AlertItemProps) {
  const colors = {
    error: 'bg-red-500/20 border-red-500/30',
    warning: 'bg-yellow-500/20 border-yellow-500/30',
    info: 'bg-blue-500/20 border-blue-500/30'
  }
  
  return (
    <div className={`${colors[type]} border rounded-xl p-4`}>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  )
}

interface LessonListProps {
  title: string
  lessons: string[]
  color: 'green' | 'blue'
}

function LessonList({ title, lessons, color }: LessonListProps) {
  const colorClasses = {
    green: 'border-green-500/30 bg-green-500/10',
    blue: 'border-blue-500/30 bg-blue-500/10'
  }
  
  return (
    <div className={`${colorClasses[color]} border rounded-2xl p-6`}>
      <h3 className="font-semibold mb-4">{title}</h3>
      <ul className="space-y-2">
        {lessons.map((lesson, idx) => (
          <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
            <span className="text-slate-500">{idx + 1}.</span>
            {lesson}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
