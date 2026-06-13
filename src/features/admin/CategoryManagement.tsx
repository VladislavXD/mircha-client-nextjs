import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  useCategories,
  useCreateCategory,
} from "@/src/features/forum/hooks/useForum";

const CategoryManagement: React.FC = () => {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();

  const [newCategory, setNewCategory] = useState("");

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    const slug = newCategory.trim().toLowerCase().replace(/\s+/g, "-");

    await createCategory.mutateAsync({ name: newCategory, slug });
    setNewCategory("");
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <h2 className="text-lg font-semibold">Управление категориями</h2>

        {isLoading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <ul className="space-y-1">
            {categories?.map((category) => (
              <li key={category.id} className="text-sm">
                {category.name}
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Название новой категории"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button onClick={handleCreateCategory}>Создать категорию</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;