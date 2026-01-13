import { FcGoogle } from 'react-icons/fc';
import { Button } from '../ui/button';
export default function GoogleLogin() {
  return (
    <Button
      variant='outline'
      className='w-full h-11 border-input/50 hover:bg-muted/50 hover:text-foreground transition-colors'
      onClick={() => console.log('Google login')}>
      <FcGoogle />
      Continue with Google
    </Button>
  );
}
