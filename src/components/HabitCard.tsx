//project\src\components\HabitCard.tsx
import React from 'react';
import { CheckCircle2, Circle, Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    description: string;
    streak: number;
    completed_today: boolean;
  };
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
//whada li glt lik dyal sbah b express w mysql
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{habit.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(habit.id)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{habit.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggle(habit.id)}
            className={`p-2 rounded-full transition-colors ${
              habit.completed_today
                ? 'text-green-600 hover:text-green-700'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {habit.completed_today ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </button>
          <span className="text-sm text-gray-600">
            {habit.completed_today ? t('completed') : t('notCompleted')}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <span className="text-2xl font-bold text-indigo-600">{habit.streak}</span>
          <span className="text-sm text-gray-600">{t('days')}</span>
        </div>
      </div>
    </div>
  );
};