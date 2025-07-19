
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new auth page
    navigate('/auth', { replace: true });
  }, [navigate]);

  return null;
}
