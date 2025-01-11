import {
  FormControl,
  FormDescription,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
interface FormFieldWrapperProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

export const FormFieldWrapper = ({
  // label,
  description,
  children,
}: FormFieldWrapperProps) => {
  return (
    <FormItem className="px-9 py-2  border rounded-md">
      {/* <FormLabel>{label}</FormLabel> */}
      <FormControl>{children}</FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
