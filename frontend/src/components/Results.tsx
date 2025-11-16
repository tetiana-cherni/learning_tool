import { useState } from 'react';
import { Trophy, Clock, Target, TrendingUp, RotateCcw, Plus, User, Tag, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { QuizResult } from '../App';

type ResultsProps = {
  result: QuizResult;
  onRetryQuiz: (url: string, questionCount: number, subject: string, title: string) => void;
  onNewQuiz: () => void;
  onViewProfile: () => void;
  isAuth: boolean;
};

export function Results({ result, onRetryQuiz, onNewQuiz, onViewProfile, isAuth }: ResultsProps) {
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const isPerfect = percentage === 100;
  const isGood = percentage >= 70;
  const isPass = percentage >= 50;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getMessage = () => {
    if (isPerfect) return 'Perfect Score! 🎉';
    if (isGood) return 'Great Job! 🌟';
    if (isPass) return 'Well Done! 👍';
    return 'Keep Practicing! 💪';
  };

  const getDescription = () => {
    if (isPerfect) return 'You demonstrated excellent understanding of the material!';
    if (isGood) return 'You have a strong grasp of the concepts!';
    if (isPass) return 'You understood the key points. Review to improve further!';
    return 'Consider reviewing the material and trying again.';
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 mb-4">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-gray-900 dark:text-gray-100 mb-2 text-3xl">{getMessage()}</h1>
        <p className="text-gray-600 dark:text-gray-400">{getDescription()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Button onClick={(e) => {
                            e.stopPropagation();
                            onRetryQuiz(result.url, result.totalQuestions, result.subject, result.title);
                          }} variant="outline" className="gap-2 dark:border-gray-600 dark:hover:bg-gray-800">
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </Button>
        
        <Button onClick={onNewQuiz} className="gap-2">
          <Plus className="w-4 h-4" />
          New Quiz
        </Button>
        
        <Button onClick={onViewProfile} variant="outline" className="gap-2 dark:border-gray-600 dark:hover:bg-gray-800">
          <User className="w-4 h-4" />
		  {
			isAuth
			? "View Profile"
			: "Create profile"
		  }
        </Button>
      </div>

      <Card className="shadow-lg mb-6 dark:bg-gray-800 dark:border-gray-700 gap-0">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-gray-900 dark:text-gray-100">{result.title}</CardTitle>
          <CardDescription className="break-all dark:text-gray-400">{result.url}</CardDescription>
          {result.subject && (
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <Tag className="w-4 h-4" />
              <span>{result.subject}</span>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Correct Answers</div>
                  <div className="text-blue-900 dark:text-blue-200">
                    {result.score} / {result.totalQuestions}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-100 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Time Spent</div>
                  <div className="text-purple-900 dark:text-purple-200">{formatTime(result.timeSpent)}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-green-600 dark:text-green-400">Accuracy</div>
                  <div className="text-green-900 dark:text-green-200">{percentage}%</div>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Button 
          onClick={() => setShowDetailedResults(!showDetailedResults)}
          variant="outline"
          className="gap-2 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          {showDetailedResults ? 'Hide results' : 'Show result'}
        </Button>
      </div>

      {showDetailedResults && result.questions && result.selectedAnswers && (
        <div className="mt-6 space-y-4">
          <h2 className="text-gray-900 dark:text-gray-100 text-center mb-4">Detailed Results</h2>
          {result.questions.map((question, index) => {
            const userAnswer = result.selectedAnswers![question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <Card key={question.id} className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-gray-900 dark:text-gray-100 text-base flex items-start gap-3">
                    <span className="text-gray-500 dark:text-gray-400">Q{index + 1}.</span>
                    <span className="flex-1">{question.question}</span>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const isUserAnswer = userAnswer === optionIndex;
                    const isCorrectAnswer = optionIndex === question.correctAnswer;
                    
                    let className = 'p-3 rounded-lg border-2 ';
                    if (isCorrectAnswer) {
                      className += 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-200';
                    } else if (isUserAnswer && !isCorrect) {
                      className += 'border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-200';
                    } else {
                      className += 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400';
                    }
                    
                    return (
                      <div key={optionIndex} className={className}>
                        <div className="flex items-center gap-2">
                          {isCorrectAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                          )}
                          {isUserAnswer && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                          )}
                          <span>{option}</span>
                          {isUserAnswer && (
                            <span className="ml-auto text-xs">(Your answer)</span>
                          )}
                          {isCorrectAnswer && (
                            <span className="ml-auto text-xs">(Correct)</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      <span className="font-medium">Explanation: </span>
                      {question.explanation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
