
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Palette } from 'lucide-react';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { NewCategoryDialog } from './NewCategoryDialog';

export const CategoryManagement = () => {
  const tenantId = '00000000-0000-0000-0000-000000000001';
  const { data: categories, isLoading } = useServiceCategories(tenantId);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Manage Categories</CardTitle>
          </div>
          <NewCategoryDialog />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading categories...</p>
        ) : categories && categories.length > 0 ? (
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <h4 className="font-medium">{category.name}</h4>
                    {category.description && (
                      <p className="text-sm text-gray-600">{category.description}</p>
                    )}
                  </div>
                  <Badge variant="outline" style={{ borderColor: category.color, color: category.color }}>
                    {category.color}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No categories found</p>
            <p className="text-sm mt-2">Create your first category to organize your services</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
