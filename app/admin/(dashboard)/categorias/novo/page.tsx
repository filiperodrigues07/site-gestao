import { CategoryForm } from "@/components/admin/category-form";

export default function NovaCategoriaPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Nova categoria</h1>
      <div className="mt-6">
        <CategoryForm />
      </div>
    </div>
  );
}
