"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
//import { plantFormInputs, plantFormSchema } from "../app/_schemas/plantForm";

export function sendForm() {
  return (
    <>
      <h1>fffffffffff</h1>
    </>
  );
}

export async function createPlante(formData: FormData) {
  await prisma.plante.create({
    data: {
      nom: formData.get("nom") as string,
      espece: "Petroselinum crispum",
      famille: "Apiacées",
      mois_plantation: "mars",
      mois_semis: "février, mars,avril",
      ensoleillement: "",
      notes: "bla bla ....",
    },
  });
  revalidatePath("plantes");
}
