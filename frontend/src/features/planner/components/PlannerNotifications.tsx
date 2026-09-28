import React from 'react';
import { Bell, Clock, AlertTriangle, Repeat } from 'lucide-react';
import { PlannerTask } from '../../../core/types';

interface PlannerNotificationsProps {
    upcomingTasks: PlannerTask[];
    overdueTasks: PlannerTask[];
    recurringReminders: PlannerTask[];
}

const PlannerNotifications: React.FC<PlannerNotificationsProps> = ({
    upcomingTasks,
    overdueTasks,
    recurringReminders,
}) => {
    const totalNotifications = upcomingTasks.length + overdueTasks.length + recurringReminders.length;

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-cyan-500/10 text-cyan-400 rounded-lg flex items-center justify-center relative">
                        <Bell size={18} />
                        {totalNotifications > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                                {totalNotifications > 9 ? '9+' : totalNotifications}
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-100">Notifications</h3>
                        <p className="text-xs text-slate-500">Task reminders</p>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {totalNotifications === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <Bell size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No notifications</p>
                        <p className="text-xs mt-1">You're all caught up!</p>
                    </div>
                ) : (
                    <>
                        {/* Overdue Tasks */}
                        {overdueTasks.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1">
                                    <AlertTriangle size={12} />
                                    Overdue ({overdueTasks.length})
                                </h4>
                                {overdueTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg mb-2"
                                    >
                                        <p className="text-sm text-slate-200 font-medium">{task.title}</p>
                                        <p className="text-xs text-red-400 mt-1">
                                            {task.date} at {task.startTime}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upcoming Tasks */}
                        {upcomingTasks.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1">
                                    <Clock size={12} />
                                    Upcoming ({upcomingTasks.length})
                                </h4>
                                {upcomingTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg mb-2"
                                    >
                                        <p className="text-sm text-slate-200 font-medium">{task.title}</p>
                                        <p className="text-xs text-cyan-400 mt-1">
                                            {task.startTime} - {task.endTime} ({task.duration} min)
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Recurring Reminders */}
                        {recurringReminders.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-1">
                                    <Repeat size={12} />
                                    Recurring ({recurringReminders.length})
                                </h4>
                                {recurringReminders.map(task => (
                                    <div
                                        key={task.id}
                                        className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg mb-2"
                                    >
                                        <p className="text-sm text-slate-200 font-medium">{task.title}</p>
                                        <p className="text-xs text-purple-400 mt-1">
                                            {task.startTime} - {task.endTime}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PlannerNotifications;
