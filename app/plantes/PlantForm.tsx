"use client";

import { ensoleillement, mois_plantation } from "@/app/_methodes/function";
import { plantFormData, plantFormSchema } from "@/app/_schemas/plantForm";
import { Button } from "@/components/ui/button";
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

export default function PlantForm() {
  const form = useForm<plantFormData>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      nom: "",
      espece: "",
      famille: "",
      mois_plantation: [], // Tableau vide par défaut,
      // moPlanting: ["id", "label"],
      // mois_semis: "",
      mois_semis: [], // Tableau vide par défaut,
      ensoleillement: [], // Tableau vide par défaut,
      notes: "",
      imageUrl: undefined,
    },
  });

  //  Web Speech API
  const [reconnaissanceActive, setReconnaissanceActive] = useState(false);
  // Ajout deux nouveaux états
  const [reconnaissanceContinueActive, setReconnaissanceContinueActive] =
    useState(false);
  const [recognitionInstance, setRecognitionInstance] =
    useState<SpeechRecognition | null>(null);

  const [champActif, setChampActif] = useState<
    "nom" | "espece" | "famille" | "notes" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const demarrerReconnaissanceVocale = async (
    champ: "nom" | "espece" | "famille"
  ) => {
    if (!("webkitSpeechRecognition" in window)) {
      alert(
        "La reconnaissance vocale n'est pas supportée par votre navigateur"
      );
      return;
    }

    setChampActif(champ);
    setReconnaissanceActive(true);

    if (reconnaissanceActive) return;

    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const resultat = event.results[0][0]?.transcript;
      if (resultat) {
        form.setValue(champ, resultat, { shouldValidate: true });
      }
    };

    recognition.onend = () => {
      setReconnaissanceActive(false);
      setChampActif(null);
    };

    recognition.start();
    setReconnaissanceActive(true);
    setChampActif(champ);
  };
  // fin de la fonction demarrerReconnaissanceVocale

  // Nouvelle fonction pour la dictée continue du Textarea
  const demarrerReconnaissanceVocaleContinue = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert(
        "La reconnaissance vocale n'est pas supportée par votre navigateur"
      );
      return;
    }

    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      form.setValue("notes", transcript);
    };

    recognition.onend = () => {
      setReconnaissanceContinueActive(false);
      setChampActif(null);
    };

    recognition.start();
    setReconnaissanceContinueActive(true);
    setChampActif("notes");
    setRecognitionInstance(recognition);
  };

  /*  const arreterReconnaissanceVocale = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.stop();
    }

    setReconnaissanceActive(false);
    setChampActif(null);

    form.trigger(); // Déclenche la validation après la saisie vocale
  }; */

  // Fonction modifiée pour arrêter la reconnaissance
  const arreterReconnaissanceVocale = () => {
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    setReconnaissanceActive(false);
    setReconnaissanceContinueActive(false);
    setChampActif(null);
    setRecognitionInstance(null);
  };

  // Fin de modif Web Speech API

  // 1. Ajouter une référence à l'input fichier
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (values: plantFormData) => {
    console.log("Données du formulaire :", values);

    // Convertie le tableau des mois de plantation en une chaîne de caractères.
    const moisPlantationString = values.mois_plantation?.join(", ") || ""; // Chaîne vide si undefined ou tableau vide
    const moisSemisString = values.mois_semis?.join(", ") || "";
    const moisEnsoleillementString = values.ensoleillement?.join(", ") || "";

    // Créer un nouvel objet avec les données formatées
    const formattedValues = {
      ...values,
      mois_plantation: moisPlantationString || null,
      mois_semis: moisSemisString || null,
      ensoleillement: moisEnsoleillementString || null,
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
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={arreterReconnaissanceVocale}
                    >
                      <Mic className="text-white" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
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
                <div className="relative">
                  <Input
                    placeholder="Espèce de la plante"
                    {...field}
                    readOnly={champActif === "espece"}
                    className={`w-full ${
                      champActif === "espece"
                        ? "cursor-not-allowed bg-muted"
                        : ""
                    }`}
                  />
                  {champActif === "espece" ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={arreterReconnaissanceVocale}
                    >
                      <Mic className="text-white" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => demarrerReconnaissanceVocale("espece")}
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

        {/* Champ Famille */}
        <FormField
          control={form.control}
          name="famille"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Famille de la plante"
                    {...field}
                    readOnly={champActif === "famille"}
                    className={`w-full ${
                      champActif === "famille"
                        ? "cursor-not-allowed bg-muted"
                        : ""
                    }`}
                  />
                  {champActif === "famille" ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={arreterReconnaissanceVocale}
                    >
                      <Mic className="text-white" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => demarrerReconnaissanceVocale("famille")}
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

        {/* Mois de plantation */}
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
              {/* Conteneur principal pour les checkboxes */}
              <div className="flex flex-wrap gap-4">
                {mois_plantation.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="mois_plantation"
                    render={({ field }) => {
                      const isChecked = field.value?.includes(item.id);

                      return (
                        <FormItem
                          key={item.id}
                          className={`cursor-pointer rounded-md px-4 py-2 transition-colors duration-300 ${
                            isChecked
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                          onClick={() => {
                            if (isChecked) {
                              field.onChange(
                                field.value?.filter(
                                  (value) => value !== item.id
                                ) ?? []
                              );
                            } else {
                              field.onChange([...(field.value ?? []), item.id]);
                            }
                          }}
                        >
                          <FormLabel className="text-sm font-normal capitalize">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Mois de semis */}
        <FormField
          control={form.control}
          name="mois_semis"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Mois de semis</FormLabel>
                <FormDescription>
                  Sélectionnez le(s) mois de semis de la plante.
                </FormDescription>
              </div>
              {/* Conteneur principal pour les checkboxes */}
              <div className="flex flex-wrap gap-4">
                {mois_plantation.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="mois_semis"
                    render={({ field }) => {
                      const isChecked = field.value?.includes(item.id);

                      return (
                        <FormItem
                          key={item.id}
                          className={`cursor-pointer rounded-md px-4 py-2 transition-colors duration-300 ${
                            isChecked
                              ? "bg-chart-1 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                          onClick={() => {
                            if (isChecked) {
                              field.onChange(
                                field.value?.filter(
                                  (value) => value !== item.id
                                ) ?? []
                              );
                            } else {
                              field.onChange([...(field.value ?? []), item.id]);
                            }
                          }}
                        >
                          <FormLabel className="text-sm font-normal capitalize">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Ensoleillement */}
        <FormField
          control={form.control}
          name="ensoleillement"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Exposition</FormLabel>
                <FormDescription>Exposition de la plante.</FormDescription>
              </div>
              {/* Conteneur principal pour les checkboxes */}
              <div className="flex flex-wrap gap-4">
                {ensoleillement.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="ensoleillement"
                    render={({ field }) => {
                      const isChecked = field.value?.includes(item.id);

                      return (
                        <FormItem
                          key={item.id}
                          className={`cursor-pointer rounded-md px-4 py-2 transition-colors duration-300 ${
                            isChecked
                              ? "bg-chart-5 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                          onClick={() => {
                            if (isChecked) {
                              field.onChange(
                                field.value?.filter(
                                  (value) => value !== item.id
                                ) ?? []
                              );
                            } else {
                              field.onChange([...(field.value ?? []), item.id]);
                            }
                          }}
                        >
                          <FormLabel className="text-sm font-normal capitalize">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
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
                <div className="relative">
                  <Textarea
                    {...field}
                    placeholder="1) Cliquer sur l'icone microphone. 2) Dicter votre texte. 3) Recliquer sur l'icone pour valider votre commentaire."
                    className={`resize-none min-h-72 pr-10 ${
                      reconnaissanceContinueActive ? "bg-muted" : ""
                    }`}
                    readOnly={reconnaissanceContinueActive}
                  />
                  <div className="absolute right-2 bottom-2">
                    {reconnaissanceContinueActive ? (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={arreterReconnaissanceVocale}
                      >
                        <Mic className="h-4 w-4 text-white" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={demarrerReconnaissanceVocaleContinue}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
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
