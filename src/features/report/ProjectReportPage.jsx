import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectReportComponent from '../../components/ProjectReport';

export default function ProjectReportPage({ stats }) {
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
      case 'conclusion':
        navigate('/evaluation');
        break;
      default:
        navigate(`/${routeId}`);
    }
  };

  return (
    <ProjectReportComponent
      onNavigate={handleNavigate}
      stats={stats}
    />
  );
}
