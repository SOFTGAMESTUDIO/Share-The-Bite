import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanelComponent from '../../components/AdminPanel';

export default function AdminPage({
  donations = [],
  onRefreshData,
  showToast,
  currentUser = null,
  onSwitchUser,
  onOpenLogin
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
      case 'report':
        navigate('/report');
        break;
      case 'conclusion':
        navigate('/evaluation');
        break;
      default:
        navigate(`/${routeId}`);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPanelComponent
        donations={donations}
        onRefreshData={onRefreshData}
        showToast={showToast}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onSwitchUser={onSwitchUser}
        onOpenLogin={onOpenLogin || (() => navigate('/login'))}
      />
    </div>
  );
}

