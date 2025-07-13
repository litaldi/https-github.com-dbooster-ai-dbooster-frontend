
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd is held
      if (!(event.ctrlKey || event.metaKey)) return;

      switch (event.key) {
        case '1':
          event.preventDefault();
          navigate('/app');
          break;
        case '2':
          event.preventDefault();
          navigate('/app/analytics');
          break;
        case '3':
          event.preventDefault();
          navigate('/app/queries');
          break;
        case 'h':
          event.preventDefault();
          navigate('/');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
}
