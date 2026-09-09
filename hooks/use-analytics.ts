/**
 * Analytics Data Hooks
 *
 * React hooks for fetching analytics data with auto-refresh.
 */

import { useState, useEffect, useCallback } from 'react'
import {
  analyticsApi,
  SystemHealthMetrics,
  BusinessMetrics,
  GoalMetrics,
  EmotionData,
  EmotionCountData,
  SentimentData,
  SentimentCountData,
  EmotionalUnderstandingData,
  NewUserGrowthData,
  UserEngagementData,
  UserListItem,
  ApiError,
} from '@/lib/api-client'

/**
 * Hook state interface
 */
interface UseAnalyticsState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook for system health metrics (operational dashboard)
 *
 * @param timeRange - Time range: '1h', '24h', '7d', '30d'
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 60000 = 1 minute)
 * @returns System health metrics with loading/error state
 */
export function useSystemHealth(
  timeRange: string = '24h',
  refreshInterval: number = 60000
): UseAnalyticsState<SystemHealthMetrics> {
  const [data, setData] = useState<SystemHealthMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const metrics = await analyticsApi.getSystemHealth(timeRange)
      setData(metrics)
      setError(null)
    } catch (err) {
      console.error('Error fetching system health metrics:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    // Initial fetch
    fetchData()

    // Set up auto-refresh
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook for business metrics (business intelligence dashboard)
 *
 * @param timeRange - Time range: '7d', '30d', '90d'
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 300000 = 5 minutes)
 * @returns Business metrics with loading/error state
 */
export function useBusinessMetrics(
  timeRange: string = '30d',
  refreshInterval: number = 300000
): UseAnalyticsState<BusinessMetrics> {
  const [data, setData] = useState<BusinessMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const metrics = await analyticsApi.getBusinessMetrics(timeRange)
      setData(metrics)
      setError(null)
    } catch (err) {
      console.error('Error fetching business metrics:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    // Initial fetch
    fetchData()

    // Set up auto-refresh
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook for platform health score
 *
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 300000 = 5 minutes)
 * @returns Platform health score with loading/error state
 */
export function usePlatformHealthScore(
  refreshInterval: number = 300000
): UseAnalyticsState<{
  score: number
  components: Record<string, { score: number; weight: number }>
  trend: { current: number; previous: number; change: number; direction: 'up' | 'down' }
}> {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const score = await analyticsApi.getPlatformHealthScore()
      setData(score)
      setError(null)
    } catch (err) {
      console.error('Error fetching platform health score:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial fetch
    fetchData()

    // Set up auto-refresh
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook for goal engagement metrics
 *
 * @param timeRange - Time range: '7d', '30d', '90d'
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 300000 = 5 minutes)
 * @returns Goal metrics with loading/error state
 */
export function useGoalMetrics(
  timeRange: string = '30d',
  refreshInterval: number = 300000
): UseAnalyticsState<GoalMetrics> {
  const [data, setData] = useState<GoalMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const metrics = await analyticsApi.getGoalMetrics(timeRange)
      setData(metrics)
      setError(null)
    } catch (err) {
      console.error('Error fetching goal metrics:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchData()
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook for average emotion weights (Phase 3)
 *
 * @param timeRange - Time range: '7d', '30d', '90d', 'daily', 'weekly', 'monthly'
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 300000 = 5 minutes)
 * @returns Average emotion weights with loading/error state
 */
export function useEmotionAverage(
  timeRange: string = '30d',
  refreshInterval: number = 300000
): UseAnalyticsState<EmotionData> {
  const [data, setData] = useState<EmotionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const metrics = await analyticsApi.getAverageEmotions(timeRange)
      setData(metrics)
      setError(null)
    } catch (err) {
      console.error('Error fetching average emotions:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchData()
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook for emotion message counts (Phase 3)
 *
 * @param timeRange - Time range: '7d', '30d', '90d', 'daily', 'weekly', 'monthly'
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 300000 = 5 minutes)
 * @returns Emotion message counts with loading/error state
 */
export function useEmotionCount(
  timeRange: string = '30d',
  refreshInterval: number = 300000
): UseAnalyticsState<EmotionCountData> {
  const [data, setData] = useState<EmotionCountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const metrics = await analyticsApi.getEmotionMessageCounts(timeRange)
      setData(metrics)
      setError(null)
    } catch (err) {
      console.error('Error fetching emotion counts:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchData()
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook for average sentiment weights (Phase 3)
 *
 * @param timeRange - Time range: '7d', '30d', '90d', 'daily', 'weekly', 'monthly'
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 300000 = 5 minutes)
 * @returns Average sentiment weights with loading/error state
 */
export function useSentimentAverage(
  timeRange: string = '30d',
  refreshInterval: number = 300000
): UseAnalyticsState<SentimentData> {
  const [data, setData] = useState<SentimentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const metrics = await analyticsApi.getAverageSentiments(timeRange)
      setData(metrics)
      setError(null)
    } catch (err) {
      console.error('Error fetching average sentiments:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchData()
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook for sentiment message counts (Phase 3)
 *
 * @param timeRange - Time range: '7d', '30d', '90d', 'daily', 'weekly', 'monthly'
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 300000 = 5 minutes)
 * @returns Sentiment message counts with loading/error state
 */
export function useSentimentCount(
  timeRange: string = '30d',
  refreshInterval: number = 300000
): UseAnalyticsState<SentimentCountData> {
  const [data, setData] = useState<SentimentCountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const metrics = await analyticsApi.getSentimentMessageCounts(timeRange)
      setData(metrics)
      setError(null)
    } catch (err) {
      console.error('Error fetching sentiment counts:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchData()
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook for multi-dimensional emotional understanding (Phase 3)
 *
 * @param timeRange - Time range: '7d', '30d', '90d', 'daily', 'weekly', 'monthly'
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 300000 = 5 minutes)
 * @returns Emotional understanding metrics with loading/error state
 */
export function useEmotionalUnderstanding(
  timeRange: string = '30d',
  refreshInterval: number = 300000
): UseAnalyticsState<EmotionalUnderstandingData> {
  const [data, setData] = useState<EmotionalUnderstandingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const metrics = await analyticsApi.getEmotionalUnderstanding(timeRange)
      setData(metrics)
      setError(null)
    } catch (err) {
      console.error('Error fetching emotional understanding:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchData()
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook for new user growth with time series data
 *
 * @param timeRange - Time range: '7d', '30d', '90d'
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 300000 = 5 minutes)
 * @returns New user growth metrics with loading/error state
 */
export function useNewUserGrowth(
  timeRange: string = '30d',
  refreshInterval: number = 300000
): UseAnalyticsState<NewUserGrowthData> {
  const [data, setData] = useState<NewUserGrowthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const metrics = await analyticsApi.getNewUserGrowth(timeRange)
      setData(metrics)
      setError(null)
    } catch (err) {
      console.error('Error fetching new user growth:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchData()
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook for user engagement (DAU/WAU/MAU) with time series data
 *
 * @param timeRange - Time range: '7d', '30d', '90d'
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 300000 = 5 minutes)
 * @returns User engagement metrics with loading/error state
 */
export function useUserEngagement(
  timeRange: string = '30d',
  refreshInterval: number = 300000
): UseAnalyticsState<UserEngagementData> {
  const [data, setData] = useState<UserEngagementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const metrics = await analyticsApi.getUserEngagement(timeRange)
      setData(metrics)
      setError(null)
    } catch (err) {
      console.error('Error fetching user engagement:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchData()
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

/**
 * Hook for fetching the list of all users with activity data
 *
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 300000 = 5 minutes)
 * @returns User list with loading/error state
 */
export function useUserList(
  refreshInterval: number = 300000
): UseAnalyticsState<UserListItem[]> {
  const [data, setData] = useState<UserListItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const users = await analyticsApi.getUserList()
      setData(users)
      setError(null)
    } catch (err) {
      console.error('Error fetching user list:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
