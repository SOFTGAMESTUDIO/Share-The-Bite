import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConclusionComponent from '../../components/Conclusion';

export default function EvaluationPage() {
  const navigate = useNavigate();

  const handleNavigate = (routeId) => {
    switch (routeId) {
      case 'home':
        navigate('/');
        break;
      case 'listings':
        navigate('/products');
        break;
      case 'donor':
        navigate('/donate');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'report':
        navigate('/report');
        break;
      default:
        navigate(`/${routeId}`);
    }
  };

  return (
    <div className="space-y-6">
      <ConclusionComponent onNavigate={handleNavigate} />
    </div>
  );
}

