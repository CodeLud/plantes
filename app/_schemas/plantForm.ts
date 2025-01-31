"use client";

import { MAX_FILE_SIZE } from "@/app/_constantes";
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
  mois_plantation: z.array(z.string()).optional(), // Tableau optionnel
  /* mois_plantation: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "Vous devez sélectionner au moins un élément.",
    }), */
  mois_semis: z.string().optional(),
  ensoleillement: z.string().optional(),
  notes: z.string().optional(), // Champ optionnel
  //imageUrl: z.instanceof(FileList).optional(), // Champ image optionnel
  imageUrl: z
    .instanceof(FileList)
    .optional()
    .refine(
      (fileList) => {
        // Si aucun fichier n'est sélectionné, la validation passe
        if (!fileList || fileList.length === 0) return true;

        // Vérifier la taille de chaque fichier
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].size > MAX_FILE_SIZE) {
            return false; // La validation échoue si un fichier est trop volumineux
          }
        }
        return true; // Tous les fichiers sont valides
      },
      {
        message: `La taille maximale autorisée pour un fichier est de ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB.`,
      }
    ),
});

export type plantFormData = z.infer<typeof plantFormSchema>;
