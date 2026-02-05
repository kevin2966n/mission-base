import React from 'react'

const Dashboard = ({ tasks, activity, agents, onAgentClick }) => {
  // Calculate quick stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    inReview: tasks.filter(t => t.status === 'review').length,
    backlog: tasks.filter(t => t.status === 'backlog').length,
    assigned: tasks.filter(t => t.status === 'assigned').length
  }

  // Get recent activity (last 20 items)
  const recentActivity = activity.slice(0, 20)

  // Determine agent status based on recent activity
  const getAgentStatus = (agentId) => {
    const agent = agents.find(a => a.id === agentId)
    if (!agent) return 'idle'
    
    // Check if agent has activity in last 4 hours
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000)
    const hasRecentActivity = activity.some(act => {
      const activityTime = new Date(act.timestamp)
      return act.agent.toLowerCase() === agent.name.toLowerCase() && activityTime > fourHoursAgo
    })
    
    return hasRecentActivity ? 'active' : 'idle'
  }

  // Get agent's task count
  const getAgentTaskCount = (agentId) => {
    return tasks.filter(t => t.assignee === agentId && t.status !== 'done').length
  }

  // Get agent's last activity
  const getAgentLastActivity = (agentId) => {
    const agent = agents.find(a => a.id === agentId)
    if (!agent) return null
    
    const lastActivity = activity.find(act => 
      act.agent.toLowerCase() === agent.name.toLowerCase()
    )
    
    if (!lastActivity) return null
    
    const activityTime = new Date(lastActivity.timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now - activityTime) / (1000 * 60))
    
    if (diffMinutes < 0) return 'just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-slate-400">Total Tasks</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
          <div className="text-slate-400">Completed</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">{stats.inProgress}</div>
          <div className="text-slate-400">In Progress</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">{stats.inReview}</div>
          <div className="text-slate-400">In Review</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-400">{stats.assigned}</div>
          <div className="text-slate-400">Assigned</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-2xl font-bold text-slate-400">{stats.backlog}</div>
          <div className="text-slate-400">Backlog</div>
        </div>
      </div>

      {/* Agent Status Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-white">Agent Status</h2>
        <div className="grid grid-cols-3 gap-4">
          {agents.slice(0, 9).map((agent) => {
            const status = getAgentStatus(agent.id)
            const taskCount = getAgentTaskCount(agent.id)
            const lastActivity = getAgentLastActivity(agent.id)
            
            return (
              <div
                key={agent.id}
                onClick={() => onAgentClick(agent)}
                className={`bg-slate-800 p-4 rounded-lg cursor-pointer transition-all hover:bg-slate-700 border-l-4 ${
                  status === 'active' ? 'border-green-500' : 'border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{agent.emoji}</span>
                  <div>
                    <div className="font-medium text-white">{agent.name}</div>
                    <div className="text-sm text-slate-400">{agent.role}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    status === 'active' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {status}
                  </div>
                  <div className="text-slate-400">{taskCount} tasks</div>
                </div>
                {lastActivity && (
                  <div className="text-xs text-slate-500 mt-1">
                    Last: {lastActivity}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-white">Recent Activity</h2>
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          {recentActivity.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              No recent activity
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {recentActivity.map((item, index) => {
                const timeAgo = new Date(item.timestamp).toLocaleString()
                
                return (
                  <div key={index} className="p-4 hover:bg-slate-750">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-sm font-medium text-slate-300">
                          {item.agent}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 font-medium">
                            {item.type}
                          </span>
                          <span className="text-xs text-slate-500">
                            {timeAgo}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard