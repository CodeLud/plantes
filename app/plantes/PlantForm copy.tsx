"use client";

import { plantFormData, plantFormSchema } from "@/app/_schemas/plantForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import FormPlantFields from "./form/1-PlantFields";
import SubmitButton from "./form/SubmitButton";

export default function PlantForm() {
  const form = useForm<plantFormData>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      nom: "",
      espece: "",
      famille: "",
      mois_plantation: "",
      // moPlanting: ["id", "label"],
      mois_semis: "",
      ensoleillement: "",
      notes: "",
    },
  });

  const onSubmit = async (values: plantFormData) => {
    console.log(values);
    try {
      const response = await fetch("/api/plantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Plante ajoutée avec succès !");
        form.reset();
      } else {
        const errorData = await response.json();
        console.error("Erreur :", errorData.error);
      }

      if (!response.ok) throw new Error("Erreur lors de l'ajout du nom 1");
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
    }
  };

  // mon formulaire
  return (
    <FormProvider {...form}>
      <h1 className="font-bold">Ajouter une nouvelle plante</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mb-7 2xl:w-auto w-2/3 inline-grid"
      >
        <FormPlantFields />
        <SubmitButton />
      </form>
    </FormProvider>
  );
}
