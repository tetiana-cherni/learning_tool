import { Home, User, BookOpen, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';

type Page = 'login' | 'home' | 'quiz' | 'results' | 'profile';

type NavigationProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout?: () => void;
  onLogin?: () => void;
  isAuthenticated?: boolean;
};

export function Navigation({ currentPage, onNavigate, onLogout, onLogin, isAuthenticated  }: NavigationProps) {
  const { theme, toggleTheme } = useTheme();

	if (currentPage === 'login') {
		return null;
	}

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span className="text-gray-900 dark:text-gray-100">LearnQuiz</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
			{
				isAuthenticated && (
				<Button
				variant={currentPage === 'profile' ? 'default' : 'ghost'}
				onClick={() => onNavigate('profile')}
				className="gap-2"
				>
				<User className="w-4 h-4" />
				Profile
				</Button>
				)
			}

            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="gap-2"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>

			  {isAuthenticated && onLogout && (
              <Button
                variant="ghost"
                onClick={onLogout}
                className="gap-2"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}

			 {!isAuthenticated && (
              <Button
                variant="ghost"
                onClick={onLogin}
                className="gap-2"
                aria-label="Logout"
              >
                Login
              </Button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}
