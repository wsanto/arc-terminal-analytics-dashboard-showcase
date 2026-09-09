/**
 * Analytics API Client
 *
 * Provides typed API calls to the ANIMA AgentKit analytics backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

/**
 * System Health Metrics (Operational Dashboard)
 * Updated to match actual API response structure
 */
export interface SystemHealthMetrics {
  systemHealthScore: number
  activeConnections: number
  errorRate: number
  avgResponseTime: number
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  databaseHealth: {
    neo4j: string
    timescaledb: string
    supabase: string
  }
  apiHealth: {
    synapse: string
    llm: string
    snag: string
  }
  recentErrors: any[]
  uptimePercentage: number
  lastIncident: string | null
}

/**
 * Business Metrics (Business Intelligence Dashboard)
 */
export interface BusinessMetrics {
  platformHealthScore: number
  dauMauRatio: {
    dau: number
    wau: number
    mau: number
  }
  totalBreakthroughs: {
    daily: number
    weekly: number
    monthly: number
  }
  userGrowthData: Array<{
    date: string
    dau: number
    wau: number
    mau: number
  }>
  loyaltyPointsData: Array<{
    rule: string
    points: number
  }>
  goalCompletionRate: number
  avgWonderIndex: number
  costPerUser: number
  goalFunnelData: Array<{
    stage: string
    count: number
    color: string
  }>
  dominantEmotionsData: Array<{
    name: string
    value: number
    color: string
  }>
  emotionalGrowthData: {
    regulation: number
    awareness: number
    vulnerability: number
    resilience: number
    complexity: number
  }
  featureAdoptionData: Array<{
    feature: string
    adoption: number
  }>
  retentionCohortData: Array<{
    period: string
    day1: number
    day7: number
    day30: number
  }>
}

/**
 * API Error Response
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Fetch with error handling
 */
async function fetchWithErrorHandling<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new ApiError(
        errorText || `HTTP ${response.status}`,
        response.status,
        endpoint
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Network error or parse error
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error',
      0,
      endpoint
    )
  }
}

/**
 * Phase 2: Engagement Intelligence Metrics
 */

export interface WonderIndexTrends {
  current_avg: number
  previous_avg: number
  change_percent: number
  time_series: Array<{
    date: string
    value: number
    label: string
    count?: number
  }>
  distribution: {
    high: number
    medium: number
    low: number
  }
}

export interface DiscoveryLevels {
  distribution: Array<{
    level: string
    count: number
    percentage: number
  }>
  total_interactions: number
}

export interface BeliefMetrics {
  beliefs_created: {
    total: number
    daily_avg: number
    by_category: Array<{ category: string; count: number }>
  }
  user_confirmation_rate: number
  belief_evolution: {
    updated_count: number
    evolution_rate: number
  }
  active_beliefs_count: number
}

export interface GoalMetrics {
  goals_created: {
    total: number
    daily_avg: number
    by_status: Array<{ status: string; count: number }>
  }
  completion_rate: number
  avg_progress_updates: number
  avg_days_to_completion: number
}

export interface SessionMetrics {
  avg_session_duration_minutes: number
  avg_messages_per_session: number
  total_sessions: number
  active_users: number
  sessions_by_duration: Record<string, number>
}

/**
 * Emotion data for average emotion weights (Phase 3)
 */
export interface EmotionData {
  data: Array<{
    emotion: string
    averageWeight: number
  }>
}

/**
 * Emotion count data with percentages (Phase 3)
 */
export interface EmotionCountData {
  data: Array<{
    emotion: string
    messageCount: number
    percentageOfTotal: number
  }>
}

/**
 * Sentiment data for average sentiment weights (Phase 3)
 */
export interface SentimentData {
  data: Array<{
    sentiment: string
    averageWeight: number
  }>
}

/**
 * Sentiment count data with percentages (Phase 3)
 */
export interface SentimentCountData {
  data: Array<{
    sentiment: string
    messageCount: number
    percentageOfTotal: number
  }>
}

/**
 * Multi-dimensional emotional understanding data (Phase 3)
 */
export interface EmotionalUnderstandingData {
  data: Array<{
    dimension: string
    averageValue: number
  }>
}

/**
 * New user growth data
 */
export interface NewUserGrowthData {
  daily: number
  weekly: number
  monthly: number
  time_series: Array<{
    date: string
    count: number
    label: string
  }>
}

/**
 * User engagement data (DAU/WAU/MAU)
 */
export interface UserEngagementData {
  dau: number
  wau: number
  mau: number
  time_series: Array<{
    date: string
    dau: number
    wau: number
    mau: number
  }>
}

/**
 * User list item for the users table
 */
export interface UserListItem {
  id: string
  email: string
  display_name: string | null
  created_at: string
  last_login: string | null
  last_api_call: string | null
  total_api_calls: number
  project_count: number
  status: 'new' | 'active' | 'at_risk' | 'churned' | 'inactive'
}

/**
 * User list response
 */
export interface UserListData {
  users: UserListItem[]
}

/**
 * Analytics API Client
 */
export const analyticsApi = {
  /**
   * Get system health metrics for operational dashboard
   *
   * @param timeRange - Time range: '1h', '24h', '7d', '30d'
   * @returns System health metrics
   */
  async getSystemHealth(timeRange: string = '24h'): Promise<SystemHealthMetrics> {
    return fetchWithErrorHandling<SystemHealthMetrics>(
      `/api/v1/analytics/system-health?time_range=${timeRange}`
    )
  },

  /**
   * Get business metrics for business intelligence dashboard
   *
   * @param timeRange - Time range: '7d', '30d', '90d'
   * @returns Business metrics
   */
  async getBusinessMetrics(timeRange: string = '30d'): Promise<BusinessMetrics> {
    return fetchWithErrorHandling<BusinessMetrics>(
      `/api/v1/analytics/business-metrics?time_range=${timeRange}`
    )
  },

  /**
   * Get platform health score
   *
   * @returns Platform health score with components and trend
   */
  async getPlatformHealthScore(): Promise<{
    score: number
    components: Record<string, { score: number; weight: number }>
    trend: {
      current: number
      previous: number
      change: number
      direction: 'up' | 'down'
    }
  }> {
    return fetchWithErrorHandling(
      '/api/v1/analytics/platform/health-score'
    )
  },

  // =========================================================================
  // PHASE 2: Engagement Intelligence Endpoints
  // =========================================================================

  /**
   * Get Wonder Index trends over time
   *
   * Wonder Index measures user curiosity and openness to discovery (0.0-1.0).
   * Higher values indicate more engaged, curious users.
   *
   * @param timeRange - Time range: '30d' (daily), '13w' (weekly), '12m' (monthly)
   * @returns Wonder Index trends with time-series data
   */
  async getWonderIndexTrends(timeRange: string = '30d'): Promise<WonderIndexTrends> {
    return fetchWithErrorHandling<WonderIndexTrends>(
      `/api/v1/analytics/engagement/wonder-index?time_range=${timeRange}`
    )
  },

  /**
   * Get Discovery Level distribution
   *
   * Discovery Levels: routine → normal → significant → breakthrough → transcendent
   * Measures the depth and meaningfulness of user conversations.
   *
   * @param timeRange - Time range: '7d', '30d', '90d'
   * @returns Discovery level distribution
   */
  async getDiscoveryLevels(timeRange: string = '30d'): Promise<DiscoveryLevels> {
    return fetchWithErrorHandling<DiscoveryLevels>(
      `/api/v1/analytics/engagement/discovery-levels?time_range=${timeRange}`
    )
  },

  /**
   * Get Belief formation metrics
   *
   * Tracks creation, evolution, and user confirmation of core beliefs.
   *
   * @param timeRange - Time range: '7d', '30d', '90d'
   * @returns Belief formation metrics
   */
  async getBeliefMetrics(timeRange: string = '30d'): Promise<BeliefMetrics> {
    return fetchWithErrorHandling<BeliefMetrics>(
      `/api/v1/analytics/beliefs/formation-metrics?time_range=${timeRange}`
    )
  },

  /**
   * Get Goal engagement metrics
   *
   * Tracks goal creation, completion rates, and progress.
   *
   * @param timeRange - Time range: '7d', '30d', '90d'
   * @returns Goal engagement metrics
   */
  async getGoalMetrics(timeRange: string = '30d'): Promise<GoalMetrics> {
    return fetchWithErrorHandling<GoalMetrics>(
      `/api/v1/analytics/goals/engagement-metrics?time_range=${timeRange}`
    )
  },

  /**
   * Get Session engagement metrics (Phase 1)
   *
   * Tracks session duration and message count patterns.
   *
   * @param timeRange - Time range: '7d', '30d', '90d'
   * @returns Session engagement metrics
   */
  async getSessionMetrics(timeRange: string = '30d'): Promise<SessionMetrics> {
    return fetchWithErrorHandling<SessionMetrics>(
      `/api/v1/analytics/engagement/session-metrics?time_range=${timeRange}`
    )
  },

  // =========================================================================
  // Emotion & Sentiment Analytics Methods
  // =========================================================================

  /**
   * Get average emotion weights across Plutchik's 8 primary emotions
   *
   * @param timeRange - Time range: '7d', '30d', '90d', 'daily', 'weekly', 'monthly'
   * @returns Average emotion weights
   */
  async getAverageEmotions(timeRange: string = '30d'): Promise<EmotionData> {
    return fetchWithErrorHandling<EmotionData>(
      `/api/v1/analytics/emotions/average?time_range=${timeRange}`
    )
  },

  /**
   * Get total message counts and percentages for each emotion
   *
   * @param timeRange - Time range: '7d', '30d', '90d', 'daily', 'weekly', 'monthly'
   * @returns Emotion message counts with percentages
   */
  async getEmotionMessageCounts(timeRange: string = '30d'): Promise<EmotionCountData> {
    return fetchWithErrorHandling<EmotionCountData>(
      `/api/v1/analytics/emotions/count?time_range=${timeRange}`
    )
  },

  /**
   * Get average sentiment weights (positive, negative, neutral)
   *
   * @param timeRange - Time range: '7d', '30d', '90d', 'daily', 'weekly', 'monthly'
   * @returns Average sentiment weights
   */
  async getAverageSentiments(timeRange: string = '30d'): Promise<SentimentData> {
    return fetchWithErrorHandling<SentimentData>(
      `/api/v1/analytics/sentiments/average?time_range=${timeRange}`
    )
  },

  /**
   * Get total message counts and percentages for each sentiment
   *
   * @param timeRange - Time range: '7d', '30d', '90d', 'daily', 'weekly', 'monthly'
   * @returns Sentiment message counts with percentages
   */
  async getSentimentMessageCounts(timeRange: string = '30d'): Promise<SentimentCountData> {
    return fetchWithErrorHandling<SentimentCountData>(
      `/api/v1/analytics/sentiments/count?time_range=${timeRange}`
    )
  },

  /**
   * Get average values for multi-dimensional emotional analysis
   *
   * Returns averages for: Valence, Arousal, Intensity, Complexity, Wonder Index
   *
   * @param timeRange - Time range: '7d', '30d', '90d', 'daily', 'weekly', 'monthly'
   * @returns Multi-dimensional emotional understanding metrics
   */
  async getEmotionalUnderstanding(timeRange: string = '30d'): Promise<EmotionalUnderstandingData> {
    return fetchWithErrorHandling<EmotionalUnderstandingData>(
      `/api/v1/analytics/emotional-understanding/average?time_range=${timeRange}`
    )
  },

  /**
   * Get new user growth metrics with time series data
   *
   * @param timeRange - Time range: '7d', '30d', '90d'
   * @returns New user growth metrics with historical data
   */
  async getNewUserGrowth(timeRange: string = '30d'): Promise<NewUserGrowthData> {
    return fetchWithErrorHandling<NewUserGrowthData>(
      `/api/v1/analytics/new-users?time_range=${timeRange}`
    )
  },

  /**
   * Get user engagement metrics (DAU/WAU/MAU) with time series data
   *
   * @param timeRange - Time range: '7d', '30d', '90d'
   * @returns User engagement metrics with historical data
   */
  async getUserEngagement(timeRange: string = '30d'): Promise<UserEngagementData> {
    return fetchWithErrorHandling<UserEngagementData>(
      `/api/v1/analytics/users/engagement?time_range=${timeRange}`
    )
  },

  /**
   * Get list of all users with their activity data
   *
   * @returns List of users with last login and last API call dates
   */
  async getUserList(): Promise<UserListItem[]> {
    const response = await fetchWithErrorHandling<{ data: UserListItem[] }>(
      `/users/list`
    )
    return response.data
  },
}

/**
 * Check if API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    return response.ok
  } catch {
    return false
  }
}
