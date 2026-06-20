'use client';

import React, { useState } from 'react';
import { 
  BarChart as RechartsBarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Eye, Bookmark, MessageSquare, Star, 
  Calendar, BarChart2, TrendingUp, LockKeyhole 
} from 'lucide-react';
import Link from 'next/link';

interface ViewNode {
  date: string;
  views: number;
}

interface Props {
  initialDailyViews: ViewNode[];
  stats: {
    totalViews: number;
    shortlists: number;
    enquiries: number;
    reviews: number;
  };
  isPremium: boolean;
  instituteId: string;
}

export default function AnalyticsDashboardClient({ initialDailyViews, stats, isPremium, instituteId }: Props) {
  // Cool Toggles States
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Filter data based on cool days toggle
  const filteredData = timeRange === '7' 
    ? initialDailyViews.slice(-7) 
    : initialDailyViews;

  return (
    <div className="space-y-6">
      
      {/* ===================================================
          🔥 METRICS STATS GRID
          =================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Views */}
        <div className="p-5 bg-white border rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Total Profile Views</p>
            <p className="text-3xl font-black text-gray-900">{stats.totalViews}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Shortlists (Ultra Feature Mock Lock Hint) */}
        <div className="p-5 bg-white border rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">User Shortlists</p>
            <p className="text-3xl font-black text-gray-900">{stats.shortlists}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Bookmark className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Enquiries */}
        <div className="p-5 bg-white border rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Total Enquiries</p>
            <p className="text-3xl font-black text-gray-900">{stats.enquiries}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-xl text-green-600">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Reviews */}
        <div className="p-5 bg-white border rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Student Reviews</p>
            <p className="text-3xl font-black text-gray-900">{stats.reviews}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
            <Star className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ===================================================
          📊 VISUAL CHART PANEL + CONTROLS
          =================================================== */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-6 relative">
        
        {/* Header Controls (Cool Interactive Button Group Toggles) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-6 text-amber-600" />
            <h3 className="text-lg font-bold text-gray-900">Traffic Analysis Graph</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Toggle 1: Time Frame Switcher */}
            <div className="bg-gray-100 p-1 rounded-xl flex items-center border shadow-inner">
              <button
                onClick={() => setTimeRange('7')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  timeRange === '7' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> 7 Days
              </button>
              <button
                onClick={() => setTimeRange('30')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  timeRange === '30' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> 30 Days
              </button>
            </div>

            {/* Toggle 2: Style Switcher (Line vs Bar) */}
            <div className="bg-gray-100 p-1 rounded-xl flex items-center border shadow-inner">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  chartType === 'line' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> Line
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  chartType === 'bar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" /> Bar
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================
            🔒 CONDITION STATE: LOCKED/BLURRED IF BASIC TIER
            =================================================== */}
        {!isPremium ? (
          <div className="relative">
            {/* Blurred Mock Graph */}
            <div className="h-80 w-full bg-gray-50 rounded-xl filter blur-md opacity-20 flex items-center justify-center pointer-events-none select-none">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{date: '1', views: 20}, {date: '2', views: 60}, {date: '3', views: 40}]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Line type="monotone" dataKey="views" stroke="#d97706" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sexy Lock Glass Overlay */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6">
              <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl mb-4 shadow-md animate-bounce">
                <LockKeyhole className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-gray-900">Traffic Trend Analytics are Locked</h4>
              <p className="text-gray-600 text-sm mt-2 max-w-md">
                Upgrade to Premium to access real-time daily charts, monitor conversion optimization indices, and observe when students view your content the most.
              </p>
              <Link 
                href={`/manager/upgrade/${instituteId}`} 
                className="mt-6 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-black rounded-xl shadow-md transition-all hover:scale-105"
              >
                Unlock Professional Tools
              </Link>
            </div>
          </div>
        ) : (
          /* ===================================================
              🔓 ACTIVE RENDERING: REAL DATA FOR PREMIUMS
              =================================================== */
          <div className="h-80 w-full pt-2">
            {filteredData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No view metrics available for this cycle yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#e5e7eb" />
                    <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#e5e7eb" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      name="Page Views"
                      stroke="#d97706" 
                      strokeWidth={3} 
                      activeDot={{ r: 6 }} 
                      dot={{ strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                ) : (
                  <RechartsBarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#e5e7eb" />
                    <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#e5e7eb" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                    />
                    <Bar 
                      dataKey="views" 
                      name="Page Views"
                      fill="#f59e0b" 
                      radius={[6, 6, 0, 0]} 
                    />
                  </RechartsBarChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>

    </div>
  );
}