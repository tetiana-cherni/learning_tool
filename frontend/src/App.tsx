import { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { Profile } from './components/Profile';
import { Quiz } from './components/Quiz';
import { QuizSkeleton } from './components/QuizSkeleton';
import { Results } from './components/Results';
import { ThemeProvider } from './components/ThemeProvider';
import { UrlInput } from './components/UrlInput';

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type QuizResult = {
  id: string;
  url: string;
  title: string;
  score: number;
  totalQuestions: number;
  date: string;
  timeSpent: number;
  subject: string;
  questions?: QuizQuestion[];
  selectedAnswers?: Record<string, number>;
};

export type QuizResponse = {
  success: boolean;
  data: {
    title: string;
    category: string;
    questions: QuizQuestion[];
  };
  questionCount: number;
}

export type ErrorResponse = {
  error: string;
  message: string;
}

export type GenerateQuizRequest = {
  url: string;
  questionAmount?: number;
}

type Page = 'home' | 'quiz' | 'results' | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUrl, setCurrentUrl] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentSubject, setCurrentSubject] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  // Load quiz results from localStorage on mount
  useEffect(() => {
    const savedResults = localStorage.getItem('quizResults');
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        // Ensure all results have a subject property for backwards compatibility
        const updatedResults = parsedResults.map((result: QuizResult) => ({
          ...result,
          subject: result.subject || 'Uncategorized'
        }));
        setQuizResults(updatedResults);
      } catch (error) {
        console.error('Error loading quiz results:', error);
        setQuizResults([]);
      }
    }
  }, []);

  // Save quiz results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
  }, [quizResults]);

  const fetchQuizFromApi = async (url: string, questionAmount: number): Promise<QuizResponse | undefined> => {
    // // Simulate API delay (2 seconds) - COMMENT OUT FOR REAL API
    // await new Promise(resolve => setTimeout(resolve, 3000));
    
    // // Mock response for testing
    // const mockQuestions: QuizQuestion[] = Array.from({ length: questionAmount }, (_, i) => ({
    //   id: String(i + 1),
    //   question: `Sample question ${i + 1} about the content`,
    //   options: [
    //     'Option A',
    //     'Option B',
    //     'Option C',
    //     'Option D'
    //   ],
    //   correctAnswer: 0,
    //   explanation: 'This is a sample explanation for the question.'
    // }));

    // const mockResponse: QuizResponse = {
    //   success: true,
    //   data: {
    //     title: 'Sample Quiz Title',
    //     category: 'General Knowledge',
    //     questions: mockQuestions
    //   },
    //   questionCount: mockQuestions.length
    // };
    
    // return mockResponse;

    try {
      const response = await fetch('http://localhost:3000/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          questionAmount
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: QuizResponse = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      return undefined;
    }
  };

  const startQuiz = async (url: string, questionCount: number) => {
    setCurrentUrl(url);
    setTotalQuestions(questionCount);

    setIsLoadingQuiz(true);
    setCurrentPage('quiz');
    const response: QuizResponse | undefined = await fetchQuizFromApi(url, questionCount);

    const title = response?.data.title ?? "";
    setCurrentTitle(title);

    const category = response?.data?.category ?? "";
    setCurrentSubject(category);

    const totalQuestions = response?.questionCount ?? 0;
    setTotalQuestions(totalQuestions);

    const questions = response?.data?.questions ?? [];
    setQuizQuestions(questions);
    setIsLoadingQuiz(false);
  };

  const handleQuizComplete = (score: number, timeSpent: number, selectedAnswers: Record<string, number>) => {
    const result: QuizResult = {
      id: Date.now().toString(),
      url: currentUrl,
      title: currentTitle,
      score,
      totalQuestions: totalQuestions,
      date: new Date().toISOString(),
      timeSpent,
      subject: currentSubject,
      questions: quizQuestions,
      selectedAnswers: selectedAnswers,
    };

    setCurrentResult(result);
    setQuizResults([result, ...quizResults]);
    setCurrentPage('results');
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleNewQuiz = () => {
    setCurrentUrl('');
    setCurrentSubject('');
    setQuizQuestions([]);
    setCurrentResult(null);
    setCurrentPage('home');
  };

  const handleViewResult = (result: QuizResult) => {
    setCurrentResult(result);
    setCurrentPage('results');
  };

  const handleRetryQuiz = async (url: string, questionCount: number, subject: string, title: string) => {
    setCurrentUrl(url);
    setCurrentSubject(subject);
    setCurrentTitle(title);
    setTotalQuestions(questionCount);
    setIsLoadingQuiz(true);
    setCurrentPage('quiz');
    const response: QuizResponse | undefined = await fetchQuizFromApi(url, questionCount);
    const questions = response?.data?.questions ?? [];
    setQuizQuestions(questions);
    setIsLoadingQuiz(false);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

        <main className={`container mx-auto px-4 py-8 ${currentPage === 'profile' ? 'max-w-6xl' : 'max-w-4xl'}`}>
          {currentPage === 'home' && (
            <UrlInput onSubmit={startQuiz} />
          )}

          {currentPage === 'quiz' && (
            isLoadingQuiz ? (
              <QuizSkeleton url={currentUrl} questionCount={totalQuestions} />
            ) : (
              <Quiz 
                questions={quizQuestions} 
                onComplete={handleQuizComplete}
                url={currentUrl}
              />
            )
          )}

          {currentPage === 'results' && currentResult && (
            <Results
              result={currentResult}
              onRetryQuiz={handleRetryQuiz}
              onNewQuiz={handleNewQuiz}
              onViewProfile={() => setCurrentPage('profile')}
            />
          )}

          {currentPage === 'profile' && (
            <Profile
              results={quizResults}
              onStartNewQuiz={handleNewQuiz}
              onUpdateResults={setQuizResults}
              onViewResult={handleViewResult}
              onRetryQuiz={handleRetryQuiz}
            />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
