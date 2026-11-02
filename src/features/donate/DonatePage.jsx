import React from 'react';
import { useNavigate } from 'react-router-dom';
import DonorFormComponent from '../../components/DonorForm';

export default function DonatePage({ onAddDonation, currentUser }) {
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    if (onAddDonation) {
      await onAddDonation(formData);
    }
    navigate('/products');
  };

  return (
    <div className="space-y-6">
      <DonorFormComponent
        onSubmit={handleFormSubmit}
        currentUser={currentUser}
      />
    </div>
  );
}
