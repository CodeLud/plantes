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
import { Mic } from "lucide-react";
import { useRef, useState } from "react"; // <-- Ajouter ici
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
      imageUrl: undefined,
    },
  });

  //  Web Speech API
  const [reconnaissanceActive, setReconnaissanceActive] = useState(false);
  const [champActif, setChampActif] = useState<"nom" | "espece" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const demarrerReconnaissanceVocale = async (champ: "nom" | "espece") => {
    if (!("webkitSpeechRecognition" in window)) {
      alert(
        "La reconnaissance vocale n'est pas supportée par votre navigateur"
      );
      return;
    }

    setChampActif(champ);
    setReconnaissanceActive(true);

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = true;
    recognition.continuous = true;
    /* recognition.maxResults = 10;
    recognition.interimResults = true; */

    recognition.onresult = (event) => {
      const resultat = event.results[event.resultIndex][0]?.transcript;
      if (resultat) {
        form.setValue(champ, resultat);
      }
    };

    recognition.onerror = (event) => {
      console.error("Erreur de reconnaissance:", event.error);
      setReconnaissanceActive(false);
    };

    recognition.onend = () => {
      setReconnaissanceActive(false);
      setChampActif(null);
    };

    recognition.start();
  };

  const arreterReconnaissanceVocale = () => {
    setReconnaissanceActive(false);
    setChampActif(null);
  };
  // Fin de modif Web Speech API

  // 1. Ajouter une référence à l'input fichier
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (values: plantFormData) => {
    console.log("Données du formulaire :", values);
    // Convertie le tableau des mois de plantation en une chaîne de caractères.
    const moisPlantationString = values.mois_plantation?.join(", ") || ""; // Chaîne vide si undefined ou tableau vide

    // Créer un nouvel objet avec les données formatées
    const formattedValues = {
      ...values,
      mois_plantation: moisPlantationString || null,
    };

    console.log("Données formatées :", formattedValues);

    // Gestion des fichiers image :
    const formData = new FormData();
    formData.append("nom", formattedValues.nom);
    formData.append("espece", formattedValues.espece || ""); // Valeur par défaut si le champ est optionnel
    formData.append("famille", formattedValues.famille || ""); // Valeur par défaut si le champ est optionnel
    formData.append("mois_semis", formattedValues.mois_semis || ""); // Valeur par défaut si le champ est optionnel
    formData.append("ensoleillement", formattedValues.ensoleillement || ""); // Valeur par défaut si le champ est optionnel
    formData.append("mois_plantation", formattedValues.mois_plantation || ""); // Valeur par défaut si le champ est optionnel
    formData.append("notes", formattedValues.notes || ""); // Valeur par défaut si le champ est optionnel

    // Ajoute une image si elle existe
    if (values.imageUrl && values.imageUrl.length > 0) {
      formData.append("imageUrl", values.imageUrl[0]);
    }

    // Vérifie le contenu de FormData par convertion de la valeur en objet JavaScript
    const formDataObject = Object.fromEntries(formData.entries());
    console.log("Données formData :", formDataObject);
    //return;

    try {
      const response = await fetch("/api/plantes", {
        method: "POST",
        /* headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedValues), */
        body: formData,
      });

      if (response.ok) {
        console.log("Plante ajoutée avec succès !");
        form.reset();
        // Réinitialisation spécifique au champ fichier
        form.resetField("imageUrl");
        // Réinitialisation DOM via la ref
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
        {/*  <FormField
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
        /> */}

        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Nom de la plante"
                    readOnly={champActif === "nom"}
                    className={`w-full ${
                      champActif === "nom" ? "cursor-not-allowed bg-muted" : ""
                    }`}
                  />
                  {champActif === "nom" ? (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={arreterReconnaissanceVocale}
                    >
                      <Mic className="text-white" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => demarrerReconnaissanceVocale("nom")}
                    >
                      <Mic />
                    </Button>
                  )}
                </div>
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
                <FormLabel className="text-base">Mois de plantation</FormLabel>
                <FormDescription>
                  Sélectionnez le(s) mois de plantation de la plante.
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

        {/* Champ Image */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image de la plante</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bouton de soumission */}
        {/* <Button type="submit" className="w-full"> */}
        <Button
          type="submit"
          className="w-full"
          disabled={reconnaissanceActive}
        >
          Ajouter la plante
        </Button>
      </form>
    </Form>
  );
}
