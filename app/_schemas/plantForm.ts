"use client";

import { z } from "zod";

/* export const plantFormSchema = z.object({
  nom: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(50),
}); */
/* validation Zod schema creation  */
export const plantFormSchema = z.object({
  nom: z
    .string()
    .min(2, { message: "Nom doit contenier au moins 2 characters." })
    .max(5, { message: "Nom ne doit pas excéder 5 characters." }),
});

export type plantFormData = z.infer<typeof plantFormSchema>;
