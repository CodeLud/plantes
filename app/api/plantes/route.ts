import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const json = await request.json(); // Parser le corps de la requête
    console.log("Corps de la requête :", json);

    if (!json) {
      return NextResponse.json(
        { error: "Le corps de la requête est manquant ou invalide" },
        { status: 400 }
      );
    }

    // Valider les données (optionnel, avec Zod par exemple)
    const {
      nom,
      espece,
      famille,
      mois_plantation,
      mois_semis,
      ensoleillement,
      notes,
    } = json;

    // Ajouter la plante dans la base de données
    const newPlant = await prisma.plante.create({
      data: {
        nom,
        espece,
        famille,
        mois_plantation,
        mois_semis,
        ensoleillement,
        notes,
      },
    });

    // Renvoyer une réponse réussie
    return NextResponse.json(newPlant, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erreur lors de l'ajout de la plante :", error.message);
      return NextResponse.json(
        {
          error: "Une erreur s'est produite côté serveur",
          details: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error("Erreur inconnue :", error);
      return NextResponse.json(
        { error: "Une erreur inconnue s'est produite côté serveur" },
        { status: 500 }
      );
    }
  }
}
