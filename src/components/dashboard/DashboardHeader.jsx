'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DashboardHeader({ goal, stats }) {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'User';

  const progress = goal ? goal.current : 0;
  const target = goal ? goal.target : 20;
  const percentage = Math.min(100, Math.round((progress / target) * 100));

  const [isEditing, setIsEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(target);
  const [loading, setLoading] = useState(false);

  const handleUpdateGoal = async () => {
    if (!session?.user?.id || !session?.token) {
      toast.error('Session invalid. Please login again.');
      return;
    }

    setLoading(true);
    try {
      const payload = { target: parseInt(newTarget) };
      // console.log('Updating goal for:', session.user.id, payload);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}/goal`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Update goal failed:', res.status, errData);
        throw new Error(errData.message || 'Failed to update goal');
      }

      toast.success('Goal updated! Refreshing...');
      setIsEditing(false);
      window.location.reload(); // Refresh to show new progress immediately
    } catch (error) {
      console.error('Handle Update Goal Error:', error);
      toast.error(error.message || 'Failed to update goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative overflow-hidden rounded-3xl bg-primary/95 p-8 md:p-10 text-primary-foreground mb-8 shadow-xl border-b-2 border-primary/20'>
      {/* Background Decor */}
      <div className='absolute top-0 right-0 w-2/3 h-full opacity-10 pointer-events-none'>
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay blur-sm"></div>
      </div>

      <div className='relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8'>
        {/* Left: Content */}
        <div className='max-w-xl'>
          <span className='inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase bg-background/20 text-primary-foreground rounded-full backdrop-blur-sm border border-white/10'>
            2025 Reading Challenge
          </span>
          <h1 className='text-3xl md:text-5xl font-bold font-serif mb-4 tracking-tight'>
            Hi, {userName}!
          </h1>
          <p className='text-lg text-primary-foreground/80 mb-6 leading-relaxed'>
            You have read{' '}
            <span className='font-bold text-white text-xl'>{progress}</span>{' '}
            books this year. Only{' '}
            <span className='font-bold text-white'>
              {Math.max(0, target - progress)}
            </span>{' '}
            more to reach your goal!
          </p>

          <div className='flex flex-wrap gap-4'>
            <Button
              onClick={() => setIsEditing(true)}
              variant='outline'
              className='border-white/20 bg-white/5 hover:bg-white/10 text-primary-foreground backdrop-blur-md transition-all'>
              Edit Goal
            </Button>
          </div>
        </div>

        {/* Right: Circular Progress & Stats */}
        <div className='flex items-center gap-8'>
          {/* Circular Progress */}
          <div className='relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0'>
            <svg className='w-full h-full transform -rotate-90'>
              <circle
                cx='50%'
                cy='50%'
                r='45%'
                className='stroke-current text-background/20'
                strokeWidth='8'
                fill='none'
              />
              <circle
                cx='50%'
                cy='50%'
                r='45%'
                className='stroke-current text-white transition-all duration-1000 ease-out'
                strokeWidth='8'
                fill='none'
                strokeDasharray='283'
                strokeDashoffset={283 - (283 * percentage) / 100}
                strokeLinecap='round'
              />
            </svg>
            <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
              <span className='text-3xl font-bold'>{percentage}%</span>
              <span className='text-xs uppercase opacity-70'>Complete</span>
            </div>
          </div>

          {/* Mini Stats (Avg Rating) */}
          <div className='hidden md:flex flex-col gap-2 p-4 bg-background/10 rounded-2xl backdrop-blur-sm border border-white/5'>
            <div className='text-center'>
              <div className='flex justify-center mb-1 text-yellow-300'>
                <Star size={20} fill='currentColor' />
              </div>
              <span className='text-2xl font-bold'>
                {stats?.averageRating || 0}
              </span>
              <p className='text-[10px] uppercase tracking-widest opacity-70'>
                Avg Rating
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Goal Modal Overlay */}
      {isEditing && (
        <div className='absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-background text-foreground p-6 rounded-xl w-full max-w-sm shadow-2xl border border-border'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='font-bold text-lg'>Set Annual Goal</h3>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsEditing(false)}
                className='h-8 w-8 rounded-full'>
                <X size={18} />
              </Button>
            </div>
            <p className='text-sm text-muted-foreground mb-4'>
              How many books do you want to read in 2025?
            </p>
            <div className='flex gap-2'>
              <Input
                type='number'
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
                className='text-lg font-bold'
              />
              <Button
                onClick={handleUpdateGoal}
                disabled={loading}
                className='bg-primary text-primary-foreground font-bold'>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
