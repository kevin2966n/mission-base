import React, { useState } from 'react'

const ActivityLog = ({ activity, agents }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgent, setSelectedAgent] = useState('')

  // Filter activity based on search and agent selection
  const filteredActivity = activity.filter(item => {
    const matchesSearch = !searchTerm || 
      item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.agent.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAgent = !selectedAgent || 
      item.agent.toLowerCase() === selectedAgent.toLowerCase()
    
    return matchesSearch && matchesAgent
  })

  // Get unique agents from activity for filter dropdown
  const activityAgents = [...new Set(activity.map(item => item.agent))].sort()

  // Get type badge styling
  const getTypeBadge = (type) => {
    switch (type.toUpperCase()) {
      case 'TASK COMPLETED':
        return 'bg-green-900 text-green-300 border-green-700'
      case 'PIPELINE CHECK':
        return 'bg-blue-900 text-blue-300 border-blue-700'
      case 'SYSTEM UPDATE':
        return 'bg-purple-900 text-purple-300 border-purple-700'
      case 'ERROR':
        return 'bg-red-900 text-red-300 border-red-700'
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Activity Log</h2>
        <div className="text-sm text-slate-400">
          {filteredActivity.length} of {activity.length} activities
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 p-4 rounded-lg mb-6">
        <div className="flex space-x-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          
          {/* Agent Filter */}
          <div>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Agents</option>
              {activityAgents.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedAgent) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedAgent('')
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-2">
        {filteredActivity.length === 0 ? (
          <div className="bg-slate-800 p-8 rounded-lg text-center">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-slate-400 mb-2">No activities found</div>
            <div className="text-slate-500 text-sm">
              {searchTerm || selectedAgent 
                ? 'Try adjusting your search criteria'
                : 'No activity data available'
              }
            </div>
          </div>
        ) : (
          filteredActivity.map((item, index) => {
            const timestamp = new Date(item.timestamp)
            const timeString = timestamp.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
            
            return (
              <div
                key={index}
                className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {/* Timestamp */}
                  <div className="flex-shrink-0 text-sm text-slate-400 min-w-[100px]">
                    {timeString}
                  </div>

                  {/* Agent */}
                  <div className="flex-shrink-0 min-w-[80px]">
                    <div className="text-sm font-medium text-emerald-400">
                      {item.agent}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded border font-medium ${getTypeBadge(item.type)}`}>
                        {item.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Load More (placeholder for future pagination) */}
      {filteredActivity.length > 0 && filteredActivity.length === activity.length && (
        <div className="text-center mt-8">
          <div className="text-slate-500 text-sm">
            Showing all {activity.length} activities
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityLog