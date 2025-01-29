import prisma from "@/lib/db";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

// Liste des types MIME autorisés
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export async function POST(request: Request) {
  try {
    /* const json = await request.json(); // Parser le corps de la requête
    console.log("Corps de la requête :", json);

    if (!json) {
      return NextResponse.json(
        { error: "Le corps de la requête est manquant ou invalide" },
        { status: 400 }
      );
    } */
    // Lire les données du formulaire
    const formData = await request.formData();

    // Extraire les champs textuels
    const nom = formData.get("nom") as string;
    const espece = formData.get("espece") as string | null;
    const famille = formData.get("famille") as string | null;
    const mois_semis = formData.get("mois_semis") as string | null;
    const ensoleillement = formData.get("ensoleillement") as string | null;
    const mois_plantation = formData.get("mois_plantation") as string | null;
    const notes = formData.get("notes") as string | null;

    // Extraire le fichier image
    const imageFile = formData.get("imageUrl") as File | null;

    // Stocker l'image sur le système de fichiers
    let imageUrl = null;
    if (imageFile) {
      // Valider le type MIME du fichier
      if (!ALLOWED_MIME_TYPES.includes(imageFile.type)) {
        return NextResponse.json(
          {
            error:
              "Type de fichier non autorisé. Seules les images sont acceptées.",
          },
          { status: 400 }
        );
      }

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      const fileBuffer = await imageFile.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(fileBuffer));
      // imageUrl = `/uploads/${fileName}`; // Chemin relatif pour l'accès public
      imageUrl = `${fileName}`;
    }

    // Valider les données (optionnel, avec Zod par exemple)
    /* const {
      nom,
      espece,
      famille,
      mois_plantation, // Chaîne de caractères
      mois_semis,
      ensoleillement,
      notes,
    } = json; */

    //const plantData = plantFormSchema.parse(json); // Valider les données

    // Ajouter la plante dans la base de données
    const newPlant = await prisma.plante.create({
      data: {
        nom,
        espece,
        famille,
        mois_plantation: mois_plantation || null, // Convertir en null si vide// Gérer le cas où c'est vide
        mois_semis,
        ensoleillement,
        notes,
        imageUrl,
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
