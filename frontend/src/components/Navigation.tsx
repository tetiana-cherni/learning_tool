import { Home, User, BookOpen, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';

type Page = 'home' | 'quiz' | 'results' | 'profile';

type NavigationProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-medium no-underline cursor-pointer"
            >
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>LearnQuiz</span>
            </button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
              className="gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            
            <Button
              variant={currentPage === 'profile' ? 'default' : 'ghost'}
              onClick={() => onNavigate('profile')}
              className="gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>

            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="gap-2 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
