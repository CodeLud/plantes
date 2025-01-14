"use client";

import { z } from "zod";
// Semis
/* const items  = [
  {
    id: "janvier",
    label: "j",
  },
  {
    id: "février",
    label: "fév",
  },
  {
    id: "Mars",
    label: "m",
  },
  {
    id: "Avril",
    label: "a",
  },
  {
    id: "mai",
    label: "m",
  },
  {
    id: "juin",
    label: "j",
  },
  {
    id: "juillet",
    label: "juil",
  },
  {
    id: "aout",
    label: "août",
  },
  {
    id: "septembre",
    label: "sept",
  },
  {
    id: "octobre",
    label: "oct",
  },
  {
    id: "novembre",
    label: "nov",
  },
  {
    id: "décembre",
    label: "déc",
  },
] as const */
/* validation Zod schema creation  */
export const plantFormSchema = z.object({
  nom: z
    .string()
    .min(2, { message: "Nom doit contenier au moins 2 characters." })
    .max(5, { message: "Nom ne doit pas excéder 5 characters." }),
  espece: z.string().optional(),
  famille: z.string().optional(),
  // mois_plantation: z.string().optional(),
  mois_plantation: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "Vous devez sélectionner au moins un élément.",
    }),
  mois_semis: z.string().optional(),
  ensoleillement: z.string().optional(),
  notes: z.string().optional(), // Champ optionnel
});

export type plantFormData = z.infer<typeof plantFormSchema>;
