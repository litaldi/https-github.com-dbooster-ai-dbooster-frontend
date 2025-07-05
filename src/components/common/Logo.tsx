
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center space-x-3 ${className}`}>
      <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg">
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 3l3.5 6.5L21 10l-3.5 6.5L13 20l-3.5-6.5L5 13l3.5-6.5L13 3z"/>
        </svg>
      </div>
      {showText && (
        <div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            DBooster
          </span>
        </div>
      )}
    </Link>
  );
}
