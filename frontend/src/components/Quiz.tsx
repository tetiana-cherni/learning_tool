import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, ExternalLink, XCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { QuizQuestion } from '../App';

type QuizProps = {
  questions: QuizQuestion[];
  onComplete: (score: number, timeSpent: number, selectedAnswers: Record<string, number>) => void;
  url: string;
};

export function Quiz({ questions, onComplete, url }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasSelected = selectedAnswers[currentQuestion.id] !== undefined;
  const hasSubmitted = submittedAnswers[currentQuestion.id] === true;
  const selectedAnswer = selectedAnswers[currentQuestion.id];
  const isCorrect = hasSubmitted && selectedAnswer === currentQuestion.correctAnswer;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleSelectAnswer = (optionIndex: number) => {
    // Only allow selection if not yet submitted
    if (!hasSubmitted) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion.id]: optionIndex,
      });
    }
  };

  const handleSubmitAnswer = () => {
    setSubmittedAnswers({
      ...submittedAnswers,
      [currentQuestion.id]: true,
    });
    
    // Automatically navigate to next question or complete quiz
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 100);
    } else {
      // All questions answered, submit quiz
      setTimeout(() => {
        const score = questions.reduce((acc, question) => {
          if (selectedAnswers[question.id] === question.correctAnswer) {
            return acc + 1;
          }
          return acc;
        }, 0);

        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        onComplete(score, timeSpent, selectedAnswers);
      }, 100);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const score = questions.reduce((acc, question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onComplete(score, timeSpent);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allQuestionsSubmitted = questions.every(q => submittedAnswers[q.id] === true);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <ExternalLink className="w-4 h-4" />
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
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="dark:bg-gray-700" />
        </div>
      </div>

      <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            {currentQuestion.question}
          </CardTitle>
          <CardDescription className="dark:text-gray-400">Select the best answer</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion.id] === index;
            const isCorrectOption = index === currentQuestion.correctAnswer;
            
            let buttonStyle = '';
            let iconComponent = <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />;
            let textStyle = 'text-gray-700';

            if (hasSubmitted) {
              // After submission, show correct answer in green
              if (isCorrectOption) {
                buttonStyle = 'border-green-600 bg-green-50 dark:bg-green-900/30 dark:border-green-500';
                iconComponent = <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />;
                textStyle = 'text-green-900 dark:text-green-200';
              } 
              // Show user's incorrect answer in red
              else if (isSelected) {
                buttonStyle = 'border-red-600 bg-red-50 dark:bg-red-900/30 dark:border-red-500';
                iconComponent = <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />;
                textStyle = 'text-red-900 dark:text-red-200';
              }
              // Other options stay neutral
              else {
                buttonStyle = 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50';
                iconComponent = <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />;
                textStyle = 'text-gray-600 dark:text-gray-400';
              }
            } else {
              // Before submission, just show selection state
              if (isSelected) {
                buttonStyle = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400';
                iconComponent = <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />;
                textStyle = 'text-indigo-900 dark:text-indigo-200';
              } else {
                buttonStyle = 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-indigo-500 dark:hover:bg-gray-600';
              }
            }
            
            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={hasSubmitted}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${buttonStyle} ${hasSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  {iconComponent}
                  <span className={textStyle}>
                    {option}
                  </span>
                </div>
              </button>
            );
          })}


        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={handleSubmitAnswer}
            disabled={!hasSelected}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Submit
          </Button>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {questions.map((q, index) => {
          const isSubmitted = submittedAnswers[q.id] === true;
          const isAnswerCorrect = selectedAnswers[q.id] === q.correctAnswer;
          
          return (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                isSubmitted && isAnswerCorrect
                  ? 'bg-green-600 dark:bg-green-500 text-white'
                  : isSubmitted && !isAnswerCorrect
                  ? 'bg-red-600 dark:bg-red-500 text-white'
                  : index === currentQuestionIndex
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}