import React from 'react';

interface QuestionCardProps {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
  selected: string | null;
  showFeedback: boolean;
  isCorrect: boolean;
  correctAnswer: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  options,
  onSelect,
  selected,
  showFeedback,
  isCorrect,
  correctAnswer,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{question}</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showFeedback && onSelect(option)}
            disabled={showFeedback}
            className={`w-full p-3 text-left rounded-lg font-medium transition-all duration-300 ${
              selected === option
                ? isCorrect && showFeedback
                  ? 'bg-green-500 text-white'
                  : !isCorrect && showFeedback
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'
                : option === correctAnswer && showFeedback
                ? 'bg-green-100 border-2 border-green-500'
                : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {showFeedback && (
        <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
