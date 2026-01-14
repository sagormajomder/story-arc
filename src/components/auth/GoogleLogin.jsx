import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../ui/button';

export default function GoogleLogin() {
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/admin/dashboard' });
  };

  return (
    <Button
      variant='outline'
      className='w-full h-11 border-input/50 hover:bg-muted/50 hover:text-foreground transition-colors'
      onClick={handleGoogleLogin}>
      <FcGoogle className='mr-2 text-xl' />
      Continue with Google
    </Button>
  );
}
