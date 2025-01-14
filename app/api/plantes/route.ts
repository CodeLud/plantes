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

    //const plantData = plantFormSchema.parse(json); // Valider les données

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
    /*  const newPlant = await prisma.plante.create({
      data: {
        nom,
        espece,
        famille,
        mois_plantation,
        mois_semis,
        ensoleillement,
        notes,
      },
    }); */

    // Renvoyer une réponse réussie
    return NextResponse.json(newPlant, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la plante :", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite côté serveur" },
      { status: 500 }
    );
  }
}
