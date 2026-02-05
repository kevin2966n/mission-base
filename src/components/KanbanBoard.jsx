import React from 'react'

const KanbanBoard = ({ tasks, agents }) => {
  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'slate' },
    { id: 'assigned', title: 'Assigned', color: 'yellow' },
    { id: 'in-progress', title: 'In Progress', color: 'blue' },
    { id: 'review', title: 'Review', color: 'purple' },
    { id: 'done', title: 'Done', color: 'green' }
  ]

  // Get agent info by ID
  const getAgent = (agentId) => {
    return agents.find(a => a.id === agentId) || { name: agentId, emoji: '👤' }
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

  // Get column header styling
  const getColumnStyle = (color) => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-900 border-yellow-700'
      case 'blue':
        return 'bg-blue-900 border-blue-700'
      case 'purple':
        return 'bg-purple-900 border-purple-700'
      case 'green':
        return 'bg-green-900 border-green-700'
      default:
        return 'bg-slate-800 border-slate-700'
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Task Kanban Board</h2>
      
      <div className="grid grid-cols-5 gap-4 h-[calc(100vh-200px)]">
        {columns.map((column) => {
          const columnTasks = tasks.filter(task => task.status === column.id)
          
          return (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div className={`p-3 rounded-t-lg border-b-2 ${getColumnStyle(column.color)}`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-white">{column.title}</h3>
                  <span className="text-sm text-slate-300 bg-slate-700 px-2 py-1 rounded">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="flex-1 bg-slate-800 p-3 space-y-3 overflow-y-auto rounded-b-lg">
                {columnTasks.map((task) => {
                  const agent = getAgent(task.assignee)
                  
                  return (
                    <div
                      key={task.id}
                      className="bg-slate-700 p-3 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors cursor-pointer"
                    >
                      {/* Task Title */}
                      <h4 className="font-medium text-white text-sm mb-2 line-clamp-2">
                        {task.title}
                      </h4>

                      {/* Task Meta */}
                      <div className="flex items-center justify-between mb-3">
                        {/* Assignee */}
                        <div className="flex items-center space-x-1">
                          <span className="text-xs">{agent.emoji}</span>
                          <span className="text-xs text-slate-300">{agent.name}</span>
                        </div>

                        {/* Priority Badge */}
                        <span className={`text-xs px-2 py-1 rounded border font-medium ${getPriorityBadge(task.priority)}`}>
                          {task.priority || 'medium'}
                        </span>
                      </div>

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

                      {/* Dates */}
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>
                          Created: {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                        {task.dueDate && (
                          <div className={`${
                            new Date(task.dueDate) < new Date() ? 'text-red-400' : ''
                          }`}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {/* Comments indicator */}
                      {task.comments && task.comments.length > 0 && (
                        <div className="mt-2 text-xs text-slate-400 flex items-center space-x-1">
                          <span>💬</span>
                          <span>{task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Empty state */}
                {columnTasks.length === 0 && (
                  <div className="text-center text-slate-500 py-8">
                    <div className="text-2xl mb-2">📭</div>
                    <div>No tasks</div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default KanbanBoard