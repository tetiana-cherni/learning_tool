import { useState, useEffect } from 'react';
import { UrlInput } from './components/UrlInput';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { Profile } from './components/Profile';
import { Navigation } from './components/Navigation';
import { ThemeProvider } from './components/ThemeProvider';
import { Login } from './components/Login';

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

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

type Page = 'login' | 'home' | 'quiz' | 'results' | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentSubject, setCurrentSubject] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setCurrentPage('home');
    }
  }, []);

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

  const handleUrlSubmit = (url: string, questionCount: number, subject: string) => {
    setCurrentUrl(url);
    // If no subject is provided, try to extract from URL or use 'Uncategorized'
    const finalSubject = subject || extractSubjectFromUrl(url) || 'Uncategorized';
    setCurrentSubject(finalSubject);
    // Generate quiz questions from URL (mock implementation)
    const questions = generateQuizFromUrl(url, questionCount);
    setQuizQuestions(questions);
    setCurrentPage('quiz');
  };

  const handleQuizComplete = (score: number, timeSpent: number, selectedAnswers: Record<string, number>) => {
    const result: QuizResult = {
      id: Date.now().toString(),
      url: currentUrl,
      title: extractTitleFromUrl(currentUrl),
      score,
      totalQuestions: quizQuestions.length,
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

  const handleRetakeQuiz = () => {
    const questions = generateQuizFromUrl(currentUrl, quizQuestions.length);
    setQuizQuestions(questions);
    setCurrentPage('quiz');
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

  const handleRetryQuiz = (url: string, questionCount: number, subject: string) => {
    setCurrentUrl(url);
    setCurrentSubject(subject);
    const questions = generateQuizFromUrl(url, questionCount);
    setQuizQuestions(questions);
    setCurrentPage('quiz');
  };

  const handleLoginButton = () => {
    setCurrentPage('login');
  };

  const handleViewProfile = () => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'false') {
      setCurrentPage('login');
    }
	setCurrentPage('profile');
  };

  const handleLogin = ( isAnonymusUser: boolean ) => {
    setCurrentPage('home');
	if (!isAnonymusUser)
	{
		setIsAuthenticated(true);
		localStorage.setItem('isAuthenticated', 'true');
	}
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
    localStorage.setItem('isAuthenticated', 'false');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Navigation currentPage={currentPage} onLogout={handleLogout} onLogin={handleLoginButton} onNavigate={handleNavigate} isAuthenticated={isAuthenticated} />
        
        <main className={`container mx-auto px-4 py-8 ${currentPage === 'profile' ? 'max-w-6xl' : 'max-w-4xl'}`}>
          {currentPage === 'login' && (
            <Login onLogin={handleLogin} />
          )}

          {currentPage === 'home' && (
            <UrlInput onSubmit={handleUrlSubmit} />
          )}
          
          {currentPage === 'quiz' && (
            <Quiz 
              questions={quizQuestions} 
              onComplete={handleQuizComplete}
              url={currentUrl}
            />
          )}
          
          {currentPage === 'results' && currentResult && (
            <Results 
              result={currentResult}
              onRetake={handleRetakeQuiz}
              onNewQuiz={handleNewQuiz}
			  isAuth={isAuthenticated}
              onViewProfile={handleViewProfile}
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

// Mock function to generate quiz questions from URL
function generateQuizFromUrl(url: string, questionCount: number): QuizQuestion[] {
  const hostname = new URL(url).hostname;
  
  const questionTemplates = [
    {
      question: `What is the main topic of the article from ${hostname}?`,
      options: ['Technology', 'Science', 'History', 'Literature'],
      correctAnswer: 0,
      explanation: 'The article primarily focuses on technology and its applications.',
    },
    {
      question: 'Which of the following best describes the key concept discussed?',
      options: [
        'A fundamental principle',
        'An advanced technique',
        'A historical perspective',
        'A future prediction',
      ],
      correctAnswer: 1,
      explanation: 'The content emphasizes advanced techniques and methodologies in the field.',
    },
    {
      question: 'What is the primary purpose of the content?',
      options: ['To inform', 'To persuade', 'To entertain', 'To critique'],
      correctAnswer: 0,
      explanation: 'The content is designed to inform readers about the subject matter.',
    },
    {
      question: 'Which statement aligns with the article\'s conclusion?',
      options: [
        'Further research is needed',
        'The topic is fully resolved',
        'Multiple viewpoints exist',
        'The field is stagnant',
      ],
      correctAnswer: 2,
      explanation: 'The article acknowledges that multiple viewpoints and interpretations exist on this topic.',
    },
    {
      question: 'What methodology or approach is primarily used?',
      options: [
        'Empirical analysis',
        'Theoretical framework',
        'Case study',
        'Comparative analysis',
      ],
      correctAnswer: 0,
      explanation: 'The article primarily relies on empirical analysis and data-driven approaches.',
    },
    {
      question: 'How does the author support their main argument?',
      options: [
        'Through statistical evidence',
        'With personal anecdotes',
        'Using expert opinions',
        'By citing historical events',
      ],
      correctAnswer: 0,
      explanation: 'The author strengthens their argument with statistical evidence and research data.',
    },
    {
      question: 'What is the intended audience for this content?',
      options: [
        'General public',
        'Subject matter experts',
        'Students and educators',
        'Policy makers',
      ],
      correctAnswer: 2,
      explanation: 'The content is tailored for students and educators seeking to understand the topic.',
    },
    {
      question: 'Which aspect of the topic receives the most attention?',
      options: [
        'Practical applications',
        'Theoretical foundations',
        'Historical development',
        'Future implications',
      ],
      correctAnswer: 0,
      explanation: 'The article dedicates significant coverage to practical applications and real-world use cases.',
    },
    {
      question: 'What limitation or challenge is discussed in the article?',
      options: [
        'Technical constraints',
        'Ethical considerations',
        'Resource availability',
        'Implementation complexity',
      ],
      correctAnswer: 1,
      explanation: 'The article addresses important ethical considerations and their implications.',
    },
    {
      question: 'How is the information in the article structured?',
      options: [
        'Chronologically',
        'By importance',
        'Problem-solution format',
        'Comparison-contrast',
      ],
      correctAnswer: 2,
      explanation: 'The article follows a problem-solution structure to present the information clearly.',
    },
    {
      question: 'What type of evidence is most frequently cited?',
      options: [
        'Academic research',
        'Industry reports',
        'News articles',
        'Government publications',
      ],
      correctAnswer: 0,
      explanation: 'The article predominantly cites academic research and peer-reviewed studies.',
    },
    {
      question: 'Which perspective does the author primarily adopt?',
      options: [
        'Objective and neutral',
        'Critical and analytical',
        'Supportive and promotional',
        'Skeptical and questioning',
      ],
      correctAnswer: 1,
      explanation: 'The author maintains a critical and analytical perspective throughout the article.',
    },
    {
      question: 'What recommendation does the author make?',
      options: [
        'Continue current practices',
        'Adopt new approaches',
        'Wait for more information',
        'Reject the concept entirely',
      ],
      correctAnswer: 1,
      explanation: 'The author recommends adopting new approaches based on recent findings.',
    },
    {
      question: 'How does this topic relate to current trends?',
      options: [
        'It\'s at the forefront',
        'It\'s becoming obsolete',
        'It\'s gaining momentum',
        'It\'s controversial',
      ],
      correctAnswer: 2,
      explanation: 'The topic is gaining momentum and attracting increased attention in the field.',
    },
    {
      question: 'What context does the article provide?',
      options: [
        'Historical background',
        'Global perspective',
        'Industry-specific details',
        'Comparative analysis',
      ],
      correctAnswer: 0,
      explanation: 'The article provides essential historical background to help readers understand the context.',
    },
    {
      question: 'Which stakeholder group is most affected?',
      options: [
        'End users',
        'Developers',
        'Administrators',
        'Researchers',
      ],
      correctAnswer: 0,
      explanation: 'End users are identified as the primary stakeholder group most affected by these developments.',
    },
    {
      question: 'What is the article\'s stance on future developments?',
      options: [
        'Optimistic',
        'Cautiously optimistic',
        'Neutral',
        'Pessimistic',
      ],
      correctAnswer: 1,
      explanation: 'The article takes a cautiously optimistic stance, acknowledging both potential and challenges.',
    },
    {
      question: 'How does the author establish credibility?',
      options: [
        'Through credentials',
        'By citing sources',
        'With data visualization',
        'Using case examples',
      ],
      correctAnswer: 1,
      explanation: 'The author establishes credibility by citing reputable sources and research.',
    },
    {
      question: 'What gap in knowledge does the article address?',
      options: [
        'Lack of awareness',
        'Misconceptions',
        'Limited research',
        'Practical guidance',
      ],
      correctAnswer: 3,
      explanation: 'The article fills a gap by providing practical guidance for implementation.',
    },
    {
      question: 'Which conclusion can be drawn from the content?',
      options: [
        'The field is rapidly evolving',
        'More studies are unnecessary',
        'The topic is well understood',
        'No consensus exists',
      ],
      correctAnswer: 0,
      explanation: 'A key conclusion is that the field is rapidly evolving with ongoing developments.',
    },
  ];
  
  // Return the requested number of questions
  const selectedQuestions = questionTemplates.slice(0, Math.min(questionCount, questionTemplates.length));
  
  // Add IDs to the selected questions
  return selectedQuestions.map((q, index) => ({
    ...q,
    id: (index + 1).toString(),
  }));
}

function extractTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const lastSegment = pathname.split('/').filter(Boolean).pop() || urlObj.hostname;
    return lastSegment.replace(/-/g, ' ').replace(/_/g, ' ');
  } catch {
    return 'Quiz';
  }
}

function extractSubjectFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();
    
    // Try to detect subject from domain or path
    if (hostname.includes('wikipedia') || pathname.includes('wiki')) {
      return 'General Knowledge';
    } else if (hostname.includes('stackoverflow') || hostname.includes('github')) {
      return 'Programming';
    } else if (hostname.includes('medium') || hostname.includes('blog')) {
      return 'Technology';
    } else if (hostname.includes('news') || hostname.includes('bbc') || hostname.includes('cnn')) {
      return 'Current Events';
    } else if (hostname.includes('edu')) {
      return 'Education';
    }
    
    return 'Uncategorized';
  } catch {
    return 'Uncategorized';
  }
}