import { Clock, ExternalLink, Circle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

type QuizSkeletonProps = {
  url: string;
  questionCount?: number;
};

export function QuizSkeleton({ url, questionCount = 5 }: QuizSkeletonProps) {
  const MAX_VISIBLE_PAGES = 5;
  const visibleQuestionCount = Math.min(questionCount, MAX_VISIBLE_PAGES);
  const showChevrons = questionCount > MAX_VISIBLE_PAGES;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <ExternalLink style={{ width: '16px', height: '16px' }} />
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 truncate max-w-md"
            >
              {url}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock style={{ width: '16px', height: '16px' }} />
            <Skeleton style={{ height: '16px', width: '40px' }} />
          </div>
        </div>
	
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <Skeleton style={{ height: '16px', width: '80px' }} />
            <Skeleton style={{ height: '16px', width: '64px' }} />
          </div>
          <Progress value={0} className="opacity-50 dark:bg-gray-700" />
        </div>
      </div>

      <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            <div className="space-y-2">
              <Skeleton style={{ height: '24px', width: '100%' }} />
              <Skeleton style={{ height: '24px', width: '80%' }} />
            </div>
          </CardTitle>
          <div className="mt-2">
            <Skeleton style={{ height: '16px', width: '144px' }} />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="w-full p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
            >
              <div className="flex items-center gap-3">
                <Circle style={{ width: '20px', height: '20px' }} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <Skeleton style={{ height: '20px', width: '100%' }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button disabled variant="outline">
          Previous
        </Button>

        <div className="flex gap-2">
          <Button disabled className="bg-indigo-600 hover:bg-indigo-600">
            Submit
          </Button>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Loader2 style={{ width: '20px', height: '20px' }} className="animate-spin" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Generating quiz questions...</span>
        </div>
      </div>

      <div style={{ marginTop: '16px' }} className="flex justify-center gap-2">
        {showChevrons && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 opacity-40">
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
        )}
        
        {Array.from({ length: visibleQuestionCount }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"
          >
            <Skeleton className="h-4 w-4" />
          </div>
        ))}
        
        {showChevrons && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
