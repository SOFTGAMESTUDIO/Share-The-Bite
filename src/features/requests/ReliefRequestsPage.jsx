import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReceiverDashboardComponent from '../../components/ReceiverDashboard';

export default function ReliefRequestsPage({
  donations = [],
  onUpdateStatus,
  currentUser = null
}) {
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
      case 'requests':
        navigate('/requests');
        break;
      default:
        navigate(`/${routeId}`);
    }
  };

  return (
    <div className="space-y-6">
      <ReceiverDashboardComponent
        donations={donations}
        onUpdateStatus={onUpdateStatus}
        onNavigate={handleNavigate}
        currentUser={currentUser}
      />
    </div>
  );
}
