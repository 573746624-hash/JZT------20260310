import React from 'react';
import { Card, Badge } from 'antd';
import './CategoryGrid.scss';

interface Category {
  id: string;
  name: string;
  icon: string;
  count?: number;
  description?: string;
}

interface CategoryGridProps {
  categories: Category[];
  onCategoryClick?: (category: Category) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onCategoryClick
}) => {
  return (
    <div className="category-grid">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="category-card"
          hoverable
          onClick={() => onCategoryClick?.(category)}
        >
          <div className="category-content">
            <div className="category-icon">
              <span className="icon-emoji">{category.icon}</span>
            </div>
            <div className="category-info">
              <h4 className="category-name">{category.name}</h4>
              {category.description && (
                <p className="category-description">{category.description}</p>
              )}
              {category.count !== undefined && (
                <Badge 
                  count={category.count} 
                  className="category-count"
                  showZero
                />
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CategoryGrid;
