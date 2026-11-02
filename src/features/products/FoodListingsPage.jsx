import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FoodListingsComponent from '../../components/FoodListings';

export default function FoodListingsPage({
  donations = [],
  onApplyRequest,
  onClaim,
  currentUser = null
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestIdParam = searchParams.get('request');

  const initialItem = useMemo(() => {
    if (!requestIdParam || !Array.isArray(donations)) return null;
    return donations.find((d) => String(d.id) === String(requestIdParam)) || null;
  }, [requestIdParam, donations]);

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
      default:
        navigate(`/${routeId}`);
    }
  };

  const handleApplyWrapper = async (id, application) => {
    if (onApplyRequest) {
      await onApplyRequest(id, application);
    }
    // Navigate to relief requests pipeline to view progress
    navigate('/requests');
  };

  return (
    <div className="space-y-6">
      <FoodListingsComponent
        donations={donations}
        onApplyRequest={handleApplyWrapper}
        onClaim={onClaim || handleApplyWrapper}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        initialRequestItem={initialItem}
      />
    </div>
  );
}
