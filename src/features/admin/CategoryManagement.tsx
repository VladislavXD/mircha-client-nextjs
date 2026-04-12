import React, { useState } from "react";
import { Button, Input, Card, CardBody, Spinner } from "@heroui/react";

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
      <CardBody>
        <h2>Управление категориями</h2>
        {isLoading ? (
          <Spinner />
        ) : (
          <ul>
            {categories?.map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>
        )}
        <div>
          <Input
            placeholder="Название новой категории"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button onClick={handleCreateCategory}>Создать категорию</Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default CategoryManagement;
