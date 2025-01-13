import { plantFormData } from "../../_schemas/plantForm";

export interface FormFieldComponentProps {
  name: keyof plantFormData;
  label: string;
  placeholder: string;
  description?: string;
  type?: "input" | "textarea" | "checkbox";
  options?: { id: string; label: string }[]; // Options pour les Checkbox
}
