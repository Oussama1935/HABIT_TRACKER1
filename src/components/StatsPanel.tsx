import React from 'react';
import { useTranslation } from 'react-i18next';
import { Award, CheckCircle2, ListTodo } from 'lucide-react';

interface StatsPanelProps {
  stats: {
    total: number;
    completed: number;
    streaks: number;
  };
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3">
          <ListTodo className="text-indigo-600" size={24} />
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t('totalHabits')}</h3>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3">
          <CheckCircle2 className="text-green-600" size={24} />
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t('completedToday')}</h3>
            <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3">
          <Award className="text-yellow-600" size={24} />
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t('totalStreaks')}</h3>
            <p className="text-2xl font-semibold text-gray-900">{stats.streaks}</p>
          </div>
        </div>
      </div>
    </div>
  );
};