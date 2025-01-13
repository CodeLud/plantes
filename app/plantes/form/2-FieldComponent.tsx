import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { plantFormData } from "../../_schemas/plantForm";
import { FormFieldWrapper } from "./3-FieldWrapper";
import { FormFieldComponentProps } from "./typesInterface";

export const FormFieldComponent = ({
  name,
  label,
  placeholder,
  description,
  type = "input",
}: FormFieldComponentProps) => {
  const { control } = useFormContext<plantFormData>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        let FieldComponent;

        switch (type) {
          case "input":
            FieldComponent = <Input placeholder={placeholder} {...field} />;
            break;
          case "textarea":
            FieldComponent = (
              <Textarea
                placeholder={placeholder}
                {...field}
                className="resize-none"
              />
            );
            break;
          default:
            FieldComponent = null; // Gérer un cas par défaut si nécessaire
        }

        return (
          <FormFieldWrapper label={label} description={description}>
            {FieldComponent}
          </FormFieldWrapper>
        );
      }}
    />
  );
};
