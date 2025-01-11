import { plantFormData } from "../../_schemas/plantForm";

export interface FormFieldComponentProps {
  name: keyof plantFormData;
  label: string;
  placeholder: string;
  description?: string;
}
