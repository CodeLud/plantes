"use client";

import { plantFormData, plantFormSchema } from "@/app/_schemas/plantForm";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


// Données pour les cases à cocher
const mois_plantation = [
  {
    id: "janvier",
    label: "janv",
  },
  {
    id: "fevrier",
    label: "fév",
  },
  {
    id: "mars",
    label: "mars",
  },
] as const;

export default function PlantForm() {
  const form = useForm<plantFormData>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      nom: "",
      espece: "",
      famille: "",
      mois_plantation: [], // Tableau vide par défaut,
      // moPlanting: ["id", "label"],
      mois_semis: "",
      ensoleillement: "",
      notes: "",
    },
  });

  const onSubmit = async (values: plantFormData) => {
    console.log("Données du formulaire :", values);
    // Convertir le tableau des mois de plantation en une chaîne de caractères
    const moisPlantationString = values.mois_plantation?.join(", ") || ""; // Chaîne vide si undefined ou tableau vide

    // Créer un nouvel objet avec les données formatées
    const formattedValues = { ...values, mois_plantation: moisPlantationString || null, };

    console.log("Données formatées :", formattedValues);

    try {
      const response = await fetch("/api/plantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedValues),
      });

      if (response.ok) {
        console.log("Plante ajoutée avec succès !");
        form.reset();
      } else {
        const errorData = await response.json();
        console.error("Erreur 2:", errorData.error);
      }

      if (!response.ok) throw new Error("Erreur lors de l'ajout du nom 1");
      if (!response.ok) {
        console.error(
          "Erreur du serveur 3 :",
          response.status,
          response.statusText
        );
        return;
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire PlantForm:", error);
    }
  };

  // mon formulaire
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-col  space-y-8 border-2 p-4 w-2/3"
      >
        {/* Champ Nom */}
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Nom de la plante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Espèce */}
        <FormField
          control={form.control}
          name="espece"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Espèce de la plante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Famille */}
        <FormField
          control={form.control}
          name="famille"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Famille de la plante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Mois de plantation */}
        {/*   <FormField
          control={form.control}
          name="mois_plantation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Mois de plantation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* Cases à cocher */}
        <FormField
          control={form.control}
          name="mois_plantation"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Éléments à afficher</FormLabel>
                <FormDescription>
                  Sélectionnez les éléments que vous souhaitez afficher.
                </FormDescription>
              </div>
              {mois_plantation.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="mois_plantation"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...(field.value ?? []),
                                    item.id,
                                  ]) // Utiliser l'opérateur de coalescence nulle
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    ) ?? [] // Utiliser l'opérateur de coalescence nulle
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Mois de semis */}
        <FormField
          control={form.control}
          name="mois_semis"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Mois de semis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Ensoleillement */}
        <FormField
          control={form.control}
          name="ensoleillement"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Ensoleillement" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Commentaire"
                  className="resize-none min-h-72"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bouton de soumission */}
        <Button type="submit" className="w-full">
          Ajouter la plante
        </Button>
      </form>
    </Form>
  );
}
