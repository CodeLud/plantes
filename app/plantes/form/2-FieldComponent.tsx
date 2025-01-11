import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { plantFormData } from "../../_schemas/plantForm";
import { FormFieldWrapper } from "./3-FieldWrapper";
import { FormFieldComponentProps } from "./typesInterface"; // interface commune

/* interface FormInputComponentProps {
  dans le fichier  FieldTextarea
} */

/* export const FormCheckboxComponent = ({
  name,
  label,
  placeholder,
  description,
}: FormFieldComponentProps) => {
  const { control } = useFormContext<plantFormData>(); // Utilisez useFormContext pour accéder à `control`

  return (
    
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormFieldWrapper label={label} description={description}>
          <Input placeholder={placeholder} {...field} />
        </FormFieldWrapper>
      )}
    />
  );
};
 */
export const FormInputComponent = ({
  name,
  label,
  placeholder,
  description,
}: FormFieldComponentProps) => {
  const { control } = useFormContext<plantFormData>(); // Utilisez useFormContext pour accéder à `control`

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormFieldWrapper label={label} description={description}>
          <Input placeholder={placeholder} {...field} className="py-8" />
        </FormFieldWrapper>
      )}
    />
  );
};

export const FormTextareaComponent = ({
  name,
  label,
  placeholder,
  description,
}: FormFieldComponentProps) => {
  const { control } = useFormContext<plantFormData>(); // Utilisez useFormContext pour accéder à `control`

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormFieldWrapper label={label} description={description}>
          <Textarea
            placeholder={placeholder}
            {...field}
            className="resize-none peer h-full min-h-[400px] w-full "
          />
        </FormFieldWrapper>
      )}
    />
  );
};
