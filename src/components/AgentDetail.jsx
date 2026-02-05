import React from 'react'

const AgentDetail = ({ agent, tasks, activity, onBack }) => {
  // Get agent's tasks
  const agentTasks = tasks.filter(task => task.assignee === agent.id)
  
  // Get agent's recent activity
  const agentActivity = activity.filter(item => 
    item.agent.toLowerCase() === agent.name.toLowerCase()
  ).slice(0, 10)

  // Task status counts
  const taskStats = {
    total: agentTasks.length,
    completed: agentTasks.filter(t => t.status === 'done').length,
    inProgress: agentTasks.filter(t => t.status === 'in-progress').length,
    assigned: agentTasks.filter(t => t.status === 'assigned').length,
    review: agentTasks.filter(t => t.status === 'review').length,
    backlog: agentTasks.filter(t => t.status === 'backlog').length,
  }

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-900 text-red-300 border-red-700'
      case 'medium':
        return 'bg-yellow-900 text-yellow-300 border-yellow-700'
      case 'low':
        return 'bg-green-900 text-green-300 border-green-700'
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600'
    }
  }

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'done':
        return 'bg-green-900 text-green-300'
      case 'in-progress':
        return 'bg-blue-900 text-blue-300'
      case 'review':
        return 'bg-purple-900 text-purple-300'
      case 'assigned':
        return 'bg-yellow-900 text-yellow-300'
      case 'backlog':
        return 'bg-slate-700 text-slate-300'
      default:
        return 'bg-slate-700 text-slate-300'
    }
  }

  return (
    <div>
      {/* Header with back button */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold text-white">Agent Details</h2>
      </div>

      {/* Agent Info Card */}
      <div className="bg-slate-800 p-6 rounded-lg mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-4xl">{agent.emoji}</span>
          <div>
            <h3 className="text-2xl font-bold text-white">{agent.name}</h3>
            <p className="text-lg text-slate-400">{agent.role}</p>
            <p className="text-sm text-emerald-400">ID: {agent.id}</p>
          </div>
        </div>

        {/* Agent Stats */}
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-slate-700 p-3 rounded">
            <div className="text-xl font-bold text-white">{taskStats.total}</div>
            <div className="text-xs text-slate-400">Total Tasks</div>
          </div>
          <div className="bg-slate-700 p-3 rounded">
            <div className="text-xl font-bold text-green-400">{taskStats.completed}</div>
            <div className="text-xs text-slate-400">Completed</div>
          </div>
          <div className="bg-slate-700 p-3 rounded">
            <div className="text-xl font-bold text-blue-400">{taskStats.inProgress}</div>
            <div className="text-xs text-slate-400">In Progress</div>
          </div>
          <div className="bg-slate-700 p-3 rounded">
            <div className="text-xl font-bold text-purple-400">{taskStats.review}</div>
            <div className="text-xs text-slate-400">Review</div>
          </div>
          <div className="bg-slate-700 p-3 rounded">
            <div className="text-xl font-bold text-yellow-400">{taskStats.assigned}</div>
            <div className="text-xs text-slate-400">Assigned</div>
          </div>
          <div className="bg-slate-700 p-3 rounded">
            <div className="text-xl font-bold text-slate-400">{taskStats.backlog}</div>
            <div className="text-xs text-slate-400">Backlog</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks List */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Tasks ({agentTasks.length})</h3>
          <div className="space-y-3">
            {agentTasks.length === 0 ? (
              <div className="bg-slate-800 p-6 rounded-lg text-center text-slate-400">
                No tasks assigned
              </div>
            ) : (
              agentTasks.map((task) => (
                <div key={task.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white text-sm flex-1 pr-2">
                      {task.title}
                    </h4>
                    <div className="flex space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded border ${getPriorityBadge(task.priority)}`}>
                        {task.priority || 'medium'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                    {task.description}
                  </p>

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {task.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-slate-600 text-slate-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {task.tags.length > 3 && (
                        <span className="text-xs text-slate-400">
                          +{task.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                    {task.dueDate && (
                      <span className={new Date(task.dueDate) < new Date() ? 'text-red-400' : ''}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Recent Activity ({agentActivity.length})</h3>
          <div className="space-y-3">
            {agentActivity.length === 0 ? (
              <div className="bg-slate-800 p-6 rounded-lg text-center text-slate-400">
                No recent activity
              </div>
            ) : (
              agentActivity.map((item, index) => {
                const timestamp = new Date(item.timestamp)
                const timeString = timestamp.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })

                return (
                  <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 font-medium">
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-500">
                        {timeString}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentDetail