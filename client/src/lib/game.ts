export interface Question {
  id: number;
  question: string;
  answer: string;
  category: string;
  difficulty: string;
  hint?: string;
  explanation?: string;
  imageUrl?: string;
  videoUrl?: string | null;  // <-- Add this line
}

export interface GameSession {
  id: number;
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  isCompleted: boolean;
}

export interface GameState {
  gameSession: GameSession;
  currentQuestion: Question;
  showHint: boolean;
  showAnswer: boolean;
  completed: boolean;
}

export const getCategoryColor = (category: string) => {
  const colors = {
    "التاريخ": "bg-blue-100 text-blue-800",
    "الجغرافيا": "bg-green-100 text-green-800",
    "الدين": "bg-purple-100 text-purple-800",
    "الرياضة": "bg-orange-100 text-orange-800",
    "الثقافة العامة": "bg-pink-100 text-pink-800",
    "العلوم": "bg-indigo-100 text-indigo-800",
  };
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const getDifficultyColor = (difficulty: string) => {
  const colors = {
    "سهل": "bg-green-100 text-green-800",
    "متوسط": "bg-yellow-100 text-yellow-800",
    "صعب": "bg-red-100 text-red-800",
  };
  return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800";
};
