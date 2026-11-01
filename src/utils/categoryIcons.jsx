import React from 'react';
import { 
  Utensils, 
  Apple, 
  Wheat, 
  Package, 
  Boxes, 
  Salad, 
  Coffee,
  ShoppingBag
} from 'lucide-react';

export function getCategoryIcon(category, size = 18, className = '') {
  switch (category?.toLowerCase()) {
    case 'cooked meals':
      return <Utensils size={size} className={className || 'text-emerald-700'} />;
    case 'fresh produce':
      return <Apple size={size} className={className || 'text-emerald-700'} />;
    case 'bakery':
      return <Wheat size={size} className={className || 'text-amber-700'} />;
    case 'dairy':
      return <Coffee size={size} className={className || 'text-blue-700'} />;
    case 'packaged & canned':
    case 'packaged':
      return <Boxes size={size} className={className || 'text-indigo-700'} />;
    case 'beverages':
      return <Coffee size={size} className={className || 'text-teal-700'} />;
    default:
      return <Package size={size} className={className || 'text-emerald-700'} />;
  }
}

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
      {getCategoryIcon(category, 13, 'text-slate-600')}
      <span>{category || 'Food'}</span>
    </span>
  );
}

