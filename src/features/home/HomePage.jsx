import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomePageComponent from '../../components/HomePage';

export default function HomePage({
  donations = [],
  isAdmin = false,
  onOpenAdminLogin,
  onSelectRequestItem
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

  const handleOpenApplyModal = (item) => {
    if (onSelectRequestItem) {
      onSelectRequestItem(item);
    }
    navigate(`/products?request=${item.id}`);
  };

  return (
    <HomePageComponent
      donations={donations}
      onNavigate={handleNavigate}
      onOpenApplyModal={handleOpenApplyModal}
      onOpenAdminLogin={onOpenAdminLogin || (() => navigate('/login'))}
      isAdmin={isAdmin}
    />
  );
}

