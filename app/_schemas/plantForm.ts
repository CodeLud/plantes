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

const FILENAME_REGEX = /^[a-zA-Z0-9_\-.]+$/; // Expression régulière pour valider le nom de fichier

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
    .any(FileList)
    .optional()
    .refine(
      (fileList) => {
        // Si aucun fichier n'est sélectionné, la validation passe
        if (!fileList || fileList.length === 0) return true;

        // Vérifier que tous les fichiers respectent la taille maximale
        return Array.from(fileList).every((file) => file.size <= MAX_FILE_SIZE);
      },
      {
        message: `La taille maximale autorisée pour un fichier est de ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB.`,
      }
    )
    .refine(
      (fileList) => {
        // Si aucun fichier n'est sélectionné, la validation passe
        if (!fileList || fileList.length === 0) return true;

        // Vérifier que tous les fichiers ont un nom valide
        return Array.from(fileList).every((file) =>
          FILENAME_REGEX.test(file.name)
        );
      },
      {
        message:
          "Le nom du fichier ne peut contenir que des lettres, des chiffres, des tirets, des underscores et des points.",
      }
    ),
});

export type plantFormData = z.infer<typeof plantFormSchema>;