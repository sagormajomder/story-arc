'use client';

import TutorialForm from '@/components/tutorials/TutorialForm';
import TutorialList from '@/components/tutorials/TutorialList';
import { useState } from 'react';

export default function ManageTutorialsClient({ data }) {
  const [editingTutorial, setEditingTutorial] = useState(null);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
      {/* Left Column: Form & Stats */}
      <div className='space-y-8'>
        <TutorialForm
          editingTutorial={editingTutorial}
          onCancel={() => setEditingTutorial(null)}
          onSuccess={() => setEditingTutorial(null)}
        />

        {/* Quick Stats */}
        <div className='bg-card border border-border rounded-xl p-6'>
          <p className='text-secondary-foreground font-bold tracking-wider text-xs uppercase mb-4'>
            Quick Stats
          </p>
          <div className='flex items-center gap-4'>
            <div>
              <h2 className='text-3xl font-bold font-serif'>
                {data.totalTutorials}
              </h2>
              <p className='text-sm text-muted-foreground'>Active Videos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: List */}
      <div className='lg:col-span-2'>
        <TutorialList
          tutorials={data.tutorials}
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          totalTutorials={data.totalTutorials}
          onEdit={setEditingTutorial}
        />
      </div>
    </div>
  );
}
