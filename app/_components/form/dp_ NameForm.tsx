// components/NameForm.tsx
import { Button } from "@/components/ui/button"; // Assurez-vous d'avoir shadcn configuré
import { Input } from "@/components/ui/input"; // Assurez-vous d'avoir shadcn configuré
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
});

type FormData = z.infer<typeof schema>;

interface NameFormProps {
  onSubmit: (data: FormData) => void;
}

const NameForm: React.FC<NameFormProps> = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Nom</label>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input {...field} id="name" placeholder="Entrez votre nom" />
          )}
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <Button type="submit">Ajouter</Button>
    </form>
  );
};

export default NameForm;
