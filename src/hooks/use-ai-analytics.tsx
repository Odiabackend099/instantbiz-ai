import { useState, useEffect, useCallback } from 'react';

interface AIAnalytics {
  responseTime: number[];
  errorRate: number;
  userSatisfaction: number;
  conversionRate: number;
  totalInteractions: number;
  successfulResolutions: number;
}

interface AIMetrics {
  avgResponseTime: number;
  errorPercentage: number;
  userSatisfactionScore: number;
  conversionPercentage: number;
  resolutionRate: number;
  performance: 'excellent' | 'good' | 'needs-improvement' | 'poor';
}

export function useAIAnalytics() {
  const [analytics, setAnalytics] = useState<AIAnalytics>({
    responseTime: [],
    errorRate: 0,
    userSatisfaction: 0,
    conversionRate: 0,
    totalInteractions: 0,
    successfulResolutions: 0
  });

  const [metrics, setMetrics] = useState<AIMetrics>({
    avgResponseTime: 0,
    errorPercentage: 0,
    userSatisfactionScore: 0,
    conversionPercentage: 0,
    resolutionRate: 0,
    performance: 'good'
  });

  // Track AI interaction performance
  const trackInteraction = useCallback((data: {
    responseTime?: number;
    wasError?: boolean;
    userRating?: number;
    wasConverted?: boolean;
    wasResolved?: boolean;
  }) => {
    setAnalytics(prev => {
      const updated = { ...prev };
      
      // Track response time
      if (data.responseTime !== undefined) {
        updated.responseTime.push(data.responseTime);
        // Keep only last 100 measurements
        if (updated.responseTime.length > 100) {
          updated.responseTime.shift();
        }
      }
      
      // Track errors
      if (data.wasError) {
        updated.errorRate++;
      }
      
      // Track user satisfaction (1-5 scale)
      if (data.userRating !== undefined) {
        updated.userSatisfaction = (updated.userSatisfaction + data.userRating) / 2;
      }
      
      // Track conversions
      if (data.wasConverted) {
        updated.conversionRate++;
      }
      
      // Track resolutions
      if (data.wasResolved) {
        updated.successfulResolutions++;
      }
      
      updated.totalInteractions++;
      
      return updated;
    });
  }, []);

  // Calculate metrics from analytics data
  useEffect(() => {
    const calculateMetrics = () => {
      const avgResponseTime = analytics.responseTime.length > 0 
        ? analytics.responseTime.reduce((a, b) => a + b, 0) / analytics.responseTime.length 
        : 0;

      const errorPercentage = analytics.totalInteractions > 0 
        ? (analytics.errorRate / analytics.totalInteractions) * 100 
        : 0;

      const userSatisfactionScore = analytics.userSatisfaction;

      const conversionPercentage = analytics.totalInteractions > 0 
        ? (analytics.conversionRate / analytics.totalInteractions) * 100 
        : 0;

      const resolutionRate = analytics.totalInteractions > 0 
        ? (analytics.successfulResolutions / analytics.totalInteractions) * 100 
        : 0;

      // Determine overall performance
      let performance: AIMetrics['performance'] = 'good';
      
      if (avgResponseTime < 2000 && errorPercentage < 5 && userSatisfactionScore > 4) {
        performance = 'excellent';
      } else if (avgResponseTime < 5000 && errorPercentage < 10 && userSatisfactionScore > 3) {
        performance = 'good';
      } else if (avgResponseTime < 10000 && errorPercentage < 20 && userSatisfactionScore > 2) {
        performance = 'needs-improvement';
      } else {
        performance = 'poor';
      }

      setMetrics({
        avgResponseTime,
        errorPercentage,
        userSatisfactionScore,
        conversionPercentage,
        resolutionRate,
        performance
      });
    };

    calculateMetrics();
  }, [analytics]);

  // Get performance recommendations
  const getRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];

    if (metrics.avgResponseTime > 5000) {
      recommendations.push("Consider optimizing AI response time - aim for under 2 seconds");
    }

    if (metrics.errorPercentage > 10) {
      recommendations.push("High error rate detected - review AI training data and error handling");
    }

    if (metrics.userSatisfactionScore < 3) {
      recommendations.push("Low user satisfaction - improve AI response quality and personalization");
    }

    if (metrics.conversionPercentage < 10) {
      recommendations.push("Low conversion rate - optimize AI for sales-focused interactions");
    }

    if (metrics.resolutionRate < 80) {
      recommendations.push("Low resolution rate - enhance AI knowledge base and escalation protocols");
    }

    if (recommendations.length === 0) {
      recommendations.push("AI performance is optimal - maintain current standards");
    }

    return recommendations;
  }, [metrics]);

  // Industry benchmark comparison
  const getBenchmarkComparison = useCallback(() => {
    const benchmarks = {
      responseTime: 2000, // 2 seconds
      errorRate: 5, // 5%
      userSatisfaction: 4.0, // 4.0/5.0
      conversionRate: 15, // 15%
      resolutionRate: 85 // 85%
    };

    return {
      responseTime: {
        value: metrics.avgResponseTime,
        benchmark: benchmarks.responseTime,
        status: metrics.avgResponseTime <= benchmarks.responseTime ? 'above' : 'below'
      },
      errorRate: {
        value: metrics.errorPercentage,
        benchmark: benchmarks.errorRate,
        status: metrics.errorPercentage <= benchmarks.errorRate ? 'above' : 'below'
      },
      userSatisfaction: {
        value: metrics.userSatisfactionScore,
        benchmark: benchmarks.userSatisfaction,
        status: metrics.userSatisfactionScore >= benchmarks.userSatisfaction ? 'above' : 'below'
      },
      conversionRate: {
        value: metrics.conversionPercentage,
        benchmark: benchmarks.conversionRate,
        status: metrics.conversionPercentage >= benchmarks.conversionRate ? 'above' : 'below'
      },
      resolutionRate: {
        value: metrics.resolutionRate,
        benchmark: benchmarks.resolutionRate,
        status: metrics.resolutionRate >= benchmarks.resolutionRate ? 'above' : 'below'
      }
    };
  }, [metrics]);

  return {
    analytics,
    metrics,
    trackInteraction,
    getRecommendations,
    getBenchmarkComparison
  };
}
