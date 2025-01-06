import { plantFormSchema } from "@/app/_schemas/plantForm";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import * as z from "zod";

const prisma = new PrismaClient();

/* const nameSchema = z.object({
  name: z.string().min(2),
}); */

export default async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = plantFormSchema.parse(json);

    const name = await prisma.plante.create({
      data: {
        nom: body.nom as string,
        espece: "espece",
        famille: "famille",
        mois_plantation: "mois_plantation",
        mois_semis: "mois_semis",
        ensoleillement: "ensoleillement",
        notes: "bla bla ....",
      },
    });

    return NextResponse.json(name, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
