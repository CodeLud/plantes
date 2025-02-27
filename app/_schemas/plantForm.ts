"use client";

import { MAX_FILE_SIZE } from "@/app/_constantes";
import { z } from "zod";

const FILENAME_REGEX = /^[a-zA-Z0-9_\-.]+$/; // Expression régulière pour valider le nom de fichier

export const plantFormSchema = z.object({
  nom: z
    .string()
    .min(2, { message: "Nom doit contenir au moins 2 characters." })
    .max(50, { message: "Nom ne doit pas excéder 50 characters." })
    .transform((val) => val.toLowerCase()), // Conversion en minuscules
  espece: z
    .string()
    .optional()
    .transform((val) => val?.toLowerCase()),
  famille: z
    .string()
    .optional()
    .transform((val) => val?.toLowerCase()),
  mois_plantation: z.array(z.string()).optional(), // Tableau optionnel
  mois_semis: z.array(z.string()).optional(), // Tableau optionnel
  ensoleillement: z.array(z.string()).optional(), // Tableau optionnel
  //ensoleillement: z.string().optional(),
  notes: z.string().optional(), // Champ optionnel
  imageUrl: z
    .custom<File[]>()
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
