import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Eye, Trophy } from "lucide-react";
import { getCategoryColor, getDifficultyColor, type Question } from "@/lib/game";

interface QuestionCardProps {
  question: Question;
  imageUrl?: string;
  videoUrl?: string;
  onNext: (answered: boolean) => void;
  isLoading?: boolean;
}

export default function QuestionCard({ question, onNext, isLoading }: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleShowHint = () => {
    setShowHint(true);
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };

  const handleNextQuestion = (answered: boolean) => {
    onNext(answered);
    setShowHint(false);
    setShowAnswer(false);
  };

  return (
    <Card>
      <CardContent className="p-8">
        {/* Category Badge */}
        <div className="flex items-center mb-6">
          <Badge className={getCategoryColor(question.category)}>
            {question.category}
          </Badge>
          <Badge className={`mr-2 ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </Badge>
        </div>

        {/* Question Text */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-800 leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Hint Button */}
          {!showHint && question.hint && (
            <Button 
              variant="outline" 
              className="w-full py-4 border-yellow-200 text-yellow-700 hover:bg-yellow-50"
              onClick={handleShowHint}
            >
              <Lightbulb className="ml-2 h-4 w-4" />
              عرض التلميح
            </Button>
          )}

          {/* Hint Display */}
          {showHint && question.hint && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-reverse space-x-3">
                <div className="flex-shrink-0">
                  <Lightbulb className="text-yellow-500 h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">التلميح:</h4>
                  <p className="text-yellow-700">{question.hint}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reveal Answer Button */}
          {!showAnswer && (
            <Button 
              className="w-full py-4" 
              onClick={handleRevealAnswer}
            >
              <Eye className="ml-2 h-4 w-4" />
              كشف الإجابة
            </Button>
          )}

          {/* Answer Display */}
          {showAnswer && (
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2">الإجابة الصحيحة</h3>
                <p className="text-2xl font-bold text-neutral-800">
                  {question.answer}
                </p>
              </div>

              {/* Explanation */}
              {question.explanation && (
                <div className="bg-white rounded-lg p-4 mt-4">
                  <h4 className="font-medium text-neutral-800 mb-2">شرح الإجابة:</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Next Question Buttons */}
          {showAnswer && (
            <div className="flex space-x-reverse space-x-4">
              <Button 
                variant="outline" 
                className="flex-1 py-4"
                onClick={() => handleNextQuestion(false)}
                disabled={isLoading}
              >
                إجابة خاطئة
              </Button>
              <Button 
                className="flex-1 py-4 bg-neutral-800 hover:bg-neutral-700"
                onClick={() => handleNextQuestion(true)}
                disabled={isLoading}
              >
                إجابة صحيحة
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
  