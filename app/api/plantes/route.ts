import { MAX_FILE_SIZE } from "@/app/_constantes";
import prisma from "@/lib/db";
import { fileTypeFromBuffer } from "file-type";
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
      const buffer = await imageFile.arrayBuffer();
      const fileType = await fileTypeFromBuffer(buffer);

      // Valider le type MIME du fichier
      if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType.mime)) {
        return NextResponse.json(
          {
            error:
              "Type de fichier non autorisé. Seules les images sont acceptées.",
          },
          { status: 400 }
        );
      }
      // Afficher le poids du fichier dans la console
      console.log(`Poids du fichier reçu : ${imageFile.size} bytes`);

      if (imageFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error:
              "Fichier trop volumineux. La taille maximale autorisée est de 5MB.",
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

    // Créer une nouvelle entrée dans m_multiplication avec des valeurs par défaut
    const nouvelleMultiplication = await prisma.m_multiplication.create({
      data: {
        methode: null,
        saison: null,
        observation: null,
        plantes: {
          connect: { id: newPlant.id }, // Relier à la nouvelle plante
        },
      },
    });

    // Renvoyer une réponse réussie
    return NextResponse.json(
      { plante: newPlant, multiplication: nouvelleMultiplication },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout de la plante :", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite côté serveur" },
      { status: 500 }
    );
  }
}
