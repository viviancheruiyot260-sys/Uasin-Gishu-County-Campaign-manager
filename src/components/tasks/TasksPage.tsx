import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  Trash2,
  CheckCircle2,
  X
} from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { Task, TaskPriority, TaskStatus, TaskCategory, SUB_COUNTIES, SubCounty } from '../../types/campaign';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';

export const TasksPage: React.FC = () => {
  const { tasks, addTask, updateTaskStatus, deleteTask, openQuickAction } = useCampaign();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TaskStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Task filtering
  const filteredTasks = tasks.filter((task) => {
    const matchesTab = activeTab === 'All' || task.status === activeTab;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesPriority && matchesCategory && matchesSearch;
  });

  const handleToggleTask = (task: Task) => {
    const nextStatus: TaskStatus =
      task.status === 'Completed'
        ? 'Todo'
        : task.status === 'Todo'
        ? 'In Progress'
        : 'Completed';

    updateTaskStatus(task.id, nextStatus);
    showToast(
      `Task "${task.title.slice(0, 24)}..." marked as ${nextStatus}.`,
      nextStatus === 'Completed' ? 'success' : 'info'
    );
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete task "${title}"?`)) {
      deleteTask(id);
      showToast('Task removed from board.', 'info');
    }
  };

  const todoCount = tasks.filter((t) => t.status === 'Todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  const tabsConfig = [
    { id: 'All' as const, label: 'All Tasks', count: tasks.length },
    { id: 'Todo' as const, label: 'To Do', count: todoCount },
    { id: 'In Progress' as const, label: 'In Progress', count: inProgressCount },
    { id: 'Completed' as const, label: 'Completed', count: completedCount }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Field Tasks &amp; Logistics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Operational action items, sound equipment, volunteer dispatches, and branding assignments.
          </p>
        </div>

        <Button
          variant="default"
          size="md"
          onClick={() => openQuickAction('task')}
          className="bg-emerald-800 text-white hover:bg-emerald-900"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Task
        </Button>
      </div>

      {/* Tabs & Search controls */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <Tabs
            tabs={tabsConfig}
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab)}
          />

          <div className="flex flex-wrap items-center gap-2">
            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'All')}
              aria-label="Filter by priority"
              className="text-xs h-9 px-2.5 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as TaskCategory | 'All')}
              aria-label="Filter by category"
              className="text-xs h-9 px-2.5 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Logistics & Sound">Logistics & Sound</option>
              <option value="Volunteer Mobilization">Volunteer Mobilization</option>
              <option value="Communications & Media">Communications & Media</option>
              <option value="Security & Protocol">Security & Protocol</option>
              <option value="Materials & Branding">Materials & Branding</option>
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tasks by title, instructions, or assigned personnel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
          <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No tasks in this view</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            All items are cleared or match no filters. Create a new task to keep field operations moving.
          </p>
          <div className="mt-4">
            <Button
              variant="default"
              size="sm"
              onClick={() => openQuickAction('task')}
              className="bg-emerald-800 text-white"
            >
              Create New Task
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isInProgress = task.status === 'In Progress';
            const isUrgent = task.priority === 'Urgent';

            return (
              <Card
                key={task.id}
                className={`transition-all border hover:border-slate-300 ${
                  isCompleted ? 'bg-slate-50/60 opacity-80' : 'bg-white'
                }`}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Checkbox trigger */}
                    <button
                      onClick={() => handleToggleTask(task)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer shrink-0"
                      title={
                        isCompleted
                          ? 'Click to reopen task'
                          : isInProgress
                          ? 'Click to mark completed'
                          : 'Click to start task'
                      }
                      aria-label="Toggle task status"
                    >
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded bg-emerald-800 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : isInProgress ? (
                        <div className="w-5 h-5 rounded border-2 border-amber-600 bg-amber-50 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-amber-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded border-2 border-slate-300 hover:border-slate-500 bg-white" />
                      )}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      {/* Meta header */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-800">{task.category}</span>
                        {task.subCounty && (
                          <>
                            <span>·</span>
                            <span>{task.subCounty}</span>
                          </>
                        )}
                        {task.ward && (
                          <>
                            <span>·</span>
                            <span>{task.ward}</span>
                          </>
                        )}
                        <span>·</span>
                        <Badge
                          variant={
                            isUrgent
                              ? 'danger'
                              : task.priority === 'High'
                              ? 'warning'
                              : 'neutral'
                          }
                          className="text-[10px]"
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-sm sm:text-base font-semibold text-slate-900 leading-snug ${
                          isCompleted ? 'line-through text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {task.description}
                      </p>

                      {/* Footer Info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Assignee: <strong>{task.assignedTo}</strong>
                        </span>

                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Due: {formatDate(task.dueDate)}
                        </span>

                        <span className="text-[11px] font-medium">
                          Status:{' '}
                          <button
                            onClick={() => handleToggleTask(task)}
                            className="font-semibold text-emerald-800 underline ml-0.5 cursor-pointer"
                          >
                            {task.status}
                          </button>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="shrink-0 flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(task.id, task.title)}
                        className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
