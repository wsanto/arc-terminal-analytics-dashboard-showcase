"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoTooltip } from "@/components/info-tooltip"
import { useUserList } from "@/hooks/use-analytics"
import { Users, RefreshCw } from "lucide-react"

function formatDate(dateString: string | null): string {
  if (!dateString) return "Never"
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusBadge(status: string) {
  const statusStyles: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-500",
    active: "bg-green-500/10 text-green-500",
    at_risk: "bg-yellow-500/10 text-yellow-500",
    churned: "bg-red-500/10 text-red-500",
    inactive: "bg-gray-500/10 text-gray-500",
  }

  const statusLabels: Record<string, string> = {
    new: "New",
    active: "Active",
    at_risk: "At Risk",
    churned: "Churned",
    inactive: "Inactive",
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.inactive}`}>
      {statusLabels[status] || status}
    </span>
  )
}

interface UserListTableProps {
  refreshInterval?: number
}

export function UserListTable({ refreshInterval = 300000 }: UserListTableProps) {
  const { data: users, loading, error, refetch } = useUserList(refreshInterval)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Users
              <InfoTooltip content="Complete list of all users in the system with their last login date and last API call timestamp." />
            </CardTitle>
            <CardDescription>
              {users ? `${users.length} users in system` : 'Loading users...'}
            </CardDescription>
          </div>
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="p-2 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
            <p className="text-sm">Failed to load users: {error.message}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">User</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Last Login</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Last API Call</th>
                <th className="text-right py-3 px-2 font-medium text-muted-foreground">API Calls</th>
                <th className="text-right py-3 px-2 font-medium text-muted-foreground">Projects</th>
              </tr>
            </thead>
            <tbody>
              {loading && !users ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Loading users...
                  </td>
                </tr>
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2">
                      <div>
                        <div className="font-medium text-foreground">
                          {user.display_name || 'No name'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {formatDate(user.last_login)}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {formatDate(user.last_api_call)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono">
                      {user.total_api_calls.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right font-mono">
                      {user.project_count}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
