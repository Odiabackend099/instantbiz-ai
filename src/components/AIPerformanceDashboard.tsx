import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Users, Target, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAIAnalytics } from '@/hooks/use-ai-analytics';
import { useEffect } from 'react';

export function AIPerformanceDashboard() {
  const { metrics, getRecommendations, getBenchmarkComparison, trackInteraction } = useAIAnalytics();

  // Simulate some AI interactions for demo
  useEffect(() => {
    const simulateInteractions = () => {
      // Simulate various AI interactions
      trackInteraction({ responseTime: 1200, wasResolved: true });
      trackInteraction({ responseTime: 800, wasConverted: true, userRating: 5 });
      trackInteraction({ responseTime: 2100, wasResolved: true, userRating: 4 });
      trackInteraction({ responseTime: 950, wasConverted: true, wasResolved: true, userRating: 5 });
    };

    simulateInteractions();
  }, [trackInteraction]);

  const recommendations = getRecommendations();
  const benchmarks = getBenchmarkComparison();

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'good': return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'needs-improvement': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'poor': return <TrendingDown className="h-5 w-5 text-red-600" />;
      default: return <Zap className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Overall Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">AI Performance Overview</h3>
          <div className="flex items-center gap-2">
            {getPerformanceIcon(metrics.performance)}
            <span className={`font-medium ${getPerformanceColor(metrics.performance)}`}>
              {metrics.performance.charAt(0).toUpperCase() + metrics.performance.slice(1).replace('-', ' ')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Clock className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(metrics.avgResponseTime)}ms
            </div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Target className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(metrics.resolutionRate)}%
            </div>
            <div className="text-sm text-gray-600">Resolution Rate</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Users className="h-6 w-6 mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {metrics.userSatisfactionScore.toFixed(1)}/5
            </div>
            <div className="text-sm text-gray-600">User Satisfaction</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="h-6 w-6 mx-auto text-orange-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(metrics.conversionPercentage)}%
            </div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
        </div>
      </Card>

      {/* Industry Benchmarks */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry Benchmark Comparison</h3>
        <div className="space-y-4">
          {Object.entries(benchmarks).map(([key, data]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${data.status === 'above' ? 'text-green-600' : 'text-red-600'}`}>
                  {data.status === 'above' ? '✓' : '✗'} {
                    key === 'responseTime' ? `${Math.round(data.value)}ms` :
                    key === 'userSatisfaction' ? `${data.value.toFixed(1)}/5` :
                    `${Math.round(data.value)}%`
                  }
                </span>
                <span className="text-gray-500 text-sm">
                  vs {
                    key === 'responseTime' ? `${data.benchmark}ms` :
                    key === 'userSatisfaction' ? `${data.benchmark}/5` :
                    `${data.benchmark}%`
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Optimization Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-blue-800">{recommendation}</span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Best Practices */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Industry Best Practices</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Response Time Standards</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Instant acknowledgment (&lt;0.5s)</li>
              <li>• Simple queries (&lt;2s)</li>
              <li>• Complex queries (&lt;5s)</li>
              <li>• Escalation trigger (&gt;10s)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">User Experience</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Contextual responses</li>
              <li>• Natural language processing</li>
              <li>• Personalization</li>
              <li>• Graceful error handling</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Performance Metrics</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 85%+ resolution rate</li>
              <li>• 4.0+ satisfaction score</li>
              <li>• &lt;5% error rate</li>
              <li>• 15%+ conversion rate</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Security & Privacy</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• End-to-end encryption</li>
              <li>• Data anonymization</li>
              <li>• GDPR compliance</li>
              <li>• Regular security audits</li>
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}