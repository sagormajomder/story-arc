import { ShieldCheck, Users } from 'lucide-react';

export default function UserStats({ activeUsers, adminRoles }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {/* Active Users Card */}
      <div className='bg-card border border-border rounded-xl p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='p-3 bg-secondary rounded-lg'>
            <Users className='text-primary w-6 h-6' />
          </div>
        </div>
        <div>
          <p className='text-sm font-medium text-muted-foreground'>
            Active Users
          </p>
          <h3 className='text-3xl font-bold font-serif text-foreground mt-1'>
            {activeUsers.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Admin Roles Card */}
      <div className='bg-card border border-border rounded-xl p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='p-3 bg-secondary rounded-lg'>
            <ShieldCheck className='text-primary w-6 h-6' />
          </div>
        </div>
        <div>
          <p className='text-sm font-medium text-muted-foreground'>
            Admin Roles
          </p>
          <h3 className='text-3xl font-bold font-serif text-foreground mt-1'>
            {adminRoles.toLocaleString()}
          </h3>
        </div>
      </div>
    </div>
  );
}
