import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

console.error("eeeeeeeeeeeeeeeeee");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { nom } = req.body as { nom?: string };

    if (!nom || typeof nom !== "string") {
      return res.status(400).json({ error: "Nom invalide" });
    }

    try {
      const nouveauNom = await prisma.plante.create({
        data: {
          nom,
          espece: "Espèce par défaut",
          famille: "Famille par défaut",
          mois_plantation: "Mois de plantation par défaut",
          mois_semis: "Mois de semis par défaut",
          ensoleillement: "soleil",
          notes: "bla bla ....",
          // Ajoutez les autres propriétés requises ici
        },
      });
      return res.status(201).json(nouveauNom);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Méthode ${req.method} non autorisée`);
}
