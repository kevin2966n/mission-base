import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import KanbanBoard from './components/KanbanBoard'
import ActivityLog from './components/ActivityLog'
import AgentDetail from './components/AgentDetail'
import './App.css'

const API_URL = import.meta.env.PROD 
  ? 'https://mission-base.srv1193525.hstgr.cloud/api' 
  : 'http://localhost:4800/api'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [tasks, setTasks] = useState([])
  const [activity, setActivity] = useState([])
  const [agents, setAgents] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data from API
  const fetchData = async () => {
    try {
      setError(null)
      
      const [tasksRes, activityRes, agentsRes] = await Promise.all([
        fetch(`${API_URL}/tasks`),
        fetch(`${API_URL}/activity`),
        fetch(`${API_URL}/agents`)
      ])

      if (!tasksRes.ok || !activityRes.ok || !agentsRes.ok) {
        throw new Error('Failed to fetch data from API')
      }

      const [tasksData, activityData, agentsData] = await Promise.all([
        tasksRes.json(),
        activityRes.json(),
        agentsRes.json()
      ])

      setTasks(tasksData.tasks || [])
      setActivity(activityData || [])
      setAgents(agentsData || [])
      setLastUpdated(new Date())
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [])

  // Poll for updates every 15 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  // Calculate time since last update
  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return 'Never'
    const seconds = Math.floor((new Date() - lastUpdated) / 1000)
    if (seconds < 60) return `${seconds} seconds ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    return `${hours} hours ago`
  }

  // Navigation functions
  const showDashboard = () => {
    setCurrentView('dashboard')
    setSelectedAgent(null)
  }

  const showKanban = () => {
    setCurrentView('kanban')
    setSelectedAgent(null)
  }

  const showActivityLog = () => {
    setCurrentView('activity')
    setSelectedAgent(null)
  }

  const showAgentDetail = (agent) => {
    setSelectedAgent(agent)
    setCurrentView('agent-detail')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Mission Base...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-emerald-400">Mission Base</h1>
            <nav className="flex space-x-6">
              <button
                onClick={showDashboard}
                className={`px-3 py-1 rounded transition-colors ${
                  currentView === 'dashboard' || currentView === 'agent-detail'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={showKanban}
                className={`px-3 py-1 rounded transition-colors ${
                  currentView === 'kanban'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Kanban Board
              </button>
              <button
                onClick={showActivityLog}
                className={`px-3 py-1 rounded transition-colors ${
                  currentView === 'activity'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Activity Log
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {error && (
              <div className="text-red-400 text-sm">Error: {error}</div>
            )}
            <div className="text-sm text-slate-400">
              Last updated: {getTimeSinceUpdate()}
            </div>
            <div className="text-sm text-emerald-400 font-medium">
              AutomAI Innovations
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {currentView === 'dashboard' && (
          <Dashboard
            tasks={tasks}
            activity={activity}
            agents={agents}
            onAgentClick={showAgentDetail}
          />
        )}
        {currentView === 'kanban' && (
          <KanbanBoard tasks={tasks} agents={agents} />
        )}
        {currentView === 'activity' && (
          <ActivityLog activity={activity} agents={agents} />
        )}
        {currentView === 'agent-detail' && selectedAgent && (
          <AgentDetail
            agent={selectedAgent}
            tasks={tasks}
            activity={activity}
            onBack={showDashboard}
          />
        )}
      </main>
    </div>
  )
}

export default App