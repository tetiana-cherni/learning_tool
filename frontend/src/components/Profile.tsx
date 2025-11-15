import { useState } from 'react';
import { Trophy, TrendingUp, Clock, Target, Plus, Trash2, Edit2, Tag, Filter, X, ExternalLink, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { QuizResult } from '../App';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type ProfileProps = {
  results: QuizResult[];
  onStartNewQuiz: () => void;
  onUpdateResults: (results: QuizResult[]) => void;
  onViewResult: (result: QuizResult) => void;
  onRetryQuiz: (url: string, questionCount: number, subject: string) => void;
};

export function Profile({ results, onStartNewQuiz, onUpdateResults, onViewResult, onRetryQuiz }: ProfileProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Get unique subjects for filtering
  const uniqueSubjects = Array.from(
    new Set(results.map(r => r.subject || 'Uncategorized').filter(Boolean))
  ).sort();

  // Filter results based on selected subject
  const filteredResults = filterSubject === 'all' 
    ? results 
    : results.filter(r => (r.subject || 'Uncategorized') === filterSubject);

  const totalQuizzes = filteredResults.length;
  const totalQuestions = filteredResults.reduce((acc, r) => acc + r.totalQuestions, 0);
  const totalCorrect = filteredResults.reduce((acc, r) => acc + r.score, 0);
  const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalTimeSpent = filteredResults.reduce((acc, r) => acc + r.timeSpent, 0);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const handleEdit = (id: string, currentSubject: string) => {
    setEditingId(id);
    setEditSubject(currentSubject);
  };

  const handleSaveEdit = () => {
    if (editingId && editSubject.trim()) {
      const updatedResults = results.map(r => 
        r.id === editingId ? { ...r, subject: editSubject.trim() } : r
      );
      onUpdateResults(updatedResults);
      setEditingId(null);
      setEditSubject('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditSubject('');
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const updatedResults = results.filter(r => r.id !== deleteId);
      onUpdateResults(updatedResults);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const getScorePercentage = (score: number, total: number) => {
    return Math.round((score / total) * 100);
  };

  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch {
      return 'source';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-gray-900 dark:text-gray-100 mb-2">Learning Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your progress and manage quiz history</p>
          </div>
          <Button onClick={onStartNewQuiz} className="gap-2">
            <Plus className="w-4 h-4" />
            New Quiz
          </Button>
        </div>
      </div>

      {results.length === 0 ? (
        <Card className="text-center py-12 dark:bg-gray-800 dark:border-gray-700">
          <CardContent>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <Trophy className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-gray-900 dark:text-gray-100 mb-2">No Quizzes Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start your learning journey by taking your first quiz!</p>
            <Button onClick={onStartNewQuiz} className="gap-2">
              <Plus className="w-4 h-4" />
              Start Your First Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <Trophy className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Quizzes</div>
                    <div className="text-gray-900 dark:text-gray-100">{totalQuizzes}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score</div>
                    <div className="text-gray-900 dark:text-gray-100">{averageScore}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Questions Answered</div>
                    <div className="text-gray-900 dark:text-gray-100">{totalQuestions}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Time Spent</div>
                    <div className="text-gray-900 dark:text-gray-100">{formatTime(totalTimeSpent)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900 dark:text-gray-100">Quiz History</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {uniqueSubjects.map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filterSubject !== 'all' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilterSubject('all')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <Card className="text-center py-12 dark:bg-gray-800 dark:border-gray-700">
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">No quizzes found for this subject</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredResults.map((result) => {
                const percentage = getScorePercentage(result.score, result.totalQuestions);
                const domain = extractDomain(result.url);

                return (
                  <Card 
                    key={result.id} 
                    className="group relative shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer rounded-xl border border-gray-200/60 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
                    onClick={() => onViewResult(result)}
                  >
                    <CardContent className="p-5 space-y-4">
                      {/* Top section: Tags and actions */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 px-2.5 py-0.5 rounded-md border-0">
                            {result.subject || 'Uncategorized'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(result.id, result.subject || 'Uncategorized');
                            }}
                            className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(result.id);
                            }}
                            className="h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900/30"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                          </Button>
                        </div>
                      </div>

                      {/* Main content: Title centered with percentage */}
                      <div className="space-y-3">
                        <h3 className="text-gray-900 dark:text-gray-100 text-lg leading-snug truncate text-center" title={result.title}>
                          {result.title}
                        </h3>
                        <div className="flex justify-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center">
                            <span className="text-indigo-600 dark:text-indigo-400 text-xl">{percentage}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Meta info: Date left, questions count right */}
                      <div className="flex items-center m-0 justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>{formatDate(result.date)}</span>
                        <span>Questions: {result.totalQuestions}</span>
                      </div>

                      {/* Actions: View original left, Retry right */}
                      <div className="flex items-center justify-between">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors"
                        >
                          <Badge variant="outline" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 px-2.5 py-0.5 rounded-md border-gray-200 dark:border-gray-600">
                            {domain}
                          </Badge>
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRetryQuiz(result.url, result.totalQuestions, result.subject);
                          }}
                          className="h-8 px-3 gap-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Retry quiz
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {averageScore >= 80 && (
            <Card className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-200 dark:border-indigo-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-full">
                    <Trophy className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-indigo-900 dark:text-indigo-200 mb-1">Excellent Performance! 🎉</h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                      You're maintaining an outstanding average score of {averageScore}%. Keep up the great work!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Edit Subject Dialog */}
      <Dialog open={editingId !== null} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Edit Subject Tag</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Update the subject tag for this quiz
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editSubject" className="dark:text-gray-200">Subject</Label>
              <Input
                id="editSubject"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                placeholder="e.g., Mathematics, History, Programming"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit} className="dark:border-gray-600 dark:hover:bg-gray-700">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editSubject.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && cancelDelete()}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Delete Quiz</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Are you sure you want to delete this quiz? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete} className="dark:border-gray-600 dark:hover:bg-gray-700">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
