import { useState } from 'react';
import { Link2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type UrlInputProps = {
  onSubmit: (url: string, questionCount: number, subject: string) => void;
};

export function UrlInput({ onSubmit }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [questionCount, setQuestionCount] = useState('5');
  const [showInfo, setShowInfo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
      onSubmit(url, parseInt(questionCount), '');
    } catch {
      setError('Please enter a valid URL');
    }
  };

  const handleTryExample = () => {
    const exampleUrl = 'https://en.wikipedia.org/wiki/Artificial_intelligence';
    setUrl(exampleUrl);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-2xl shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <CardTitle className="text-3xl text-gray-900 dark:text-gray-100">Automated Learning Quiz</CardTitle>
        </CardHeader>
        
        <CardContent  className="flex flex-col space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url" className="dark:text-gray-200">Article URL</Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <Input
                  id="url"
                  type="text"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionCount" className="dark:text-gray-200">Number of Questions</Label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger id="questionCount" className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                  <SelectValue placeholder="Select number of questions" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectItem value="3" className="dark:text-gray-100 dark:focus:bg-gray-600">3 Questions</SelectItem>
                  <SelectItem value="5" className="dark:text-gray-100 dark:focus:bg-gray-600">5 Questions</SelectItem>
                  <SelectItem value="10" className="dark:text-gray-100 dark:focus:bg-gray-600">10 Questions</SelectItem>
                  <SelectItem value="15" className="dark:text-gray-100 dark:focus:bg-gray-600">15 Questions</SelectItem>
                  <SelectItem value="20" className="dark:text-gray-100 dark:focus:bg-gray-600">20 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <Button type="submit" className="w-full bg-indigo-550 hover:bg-indigo-550 cursor-pointer">
              Generate Quiz
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 dark:bg-gray-800 text-gray-500 dark:text-gray-400">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleTryExample}
              className="w-full dark:border-gray-600 dark:hover:bg-blue-850 cursor-pointer"
            >
              Try Example URL
            </Button>
          </form>

          <Button
              type="button"
              variant="outline"
              onClick={() => setShowInfo(!showInfo)}
              className="w-full dark:border-gray-600 dark:hover:bg-blue-850 cursor-pointer"
            >
              How it works
            </Button>

             <div
            className={`overflow-hidden transition-all duration-300 ease-in-out
              ${showInfo ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
            {showInfo && (
              <div className="p-4 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                  <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                    <li>Enter the URL of an article you want to learn from</li>
                    <li>Choose how many questions you want in your quiz</li>
                    <li>Our system extracts and analyzes the content</li>
                    <li>Take the automatically generated quiz</li>
                    <li>View your results and track your progress</li>
                  </ol>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}