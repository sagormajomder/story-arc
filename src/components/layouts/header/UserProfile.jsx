export default function UserProfile() {
  return (
    <div className='flex items-center gap-3'>
      <div className='hidden sm:flex flex-col items-end'>
        <span className='text-sm font-semibold text-foreground'>
          Admin User
        </span>
        <span className='text-xs text-muted-foreground'>Super Admin</span>
      </div>
      <div className='h-10 w-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border'>
        <div className='h-full w-full bg-muted animate-pulse' />{' '}
        {/* Placeholder for Avatar */}
      </div>
    </div>
  );
}
