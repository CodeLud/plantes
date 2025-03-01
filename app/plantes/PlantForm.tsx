"use client";

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
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ensoleillement, mois_plantation } from "../_methodes/function";


export default function PlantForm() {

  const form = useForm<plantFormData>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      nom: "",
      espece: "",
      famille: "",
      mois_plantation: [], // vide par défaut
      mois_semis: [], // vide par défaut
      ensoleillement: [], // vide par défaut
      notes: "",
      imageUrl: undefined,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }, // État du formulaire
  } = form;

  // État pour la reconnaissance vocale
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);

  const [activeField, setActiveField] = useState<"nom" | "espece" | "famille" | "notes" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
 
  // Désactivé car on utilise la vérification direct
 /*  useEffect(() => {
    setIsSpeechRecognitionSupported(
      typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    );
  }, []); */

  // Démarrer la reconnaissance vocale pour un champ spécifique
  const startSpeechRecognition = (field: "nom" | "espece" | "famille") => {
   
    if (typeof window === "undefined" ||
      !("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) return; 

    setActiveField(field);
    setIsVoiceListening(true);
  
// 1. Vérification d'environnement + 
//  Assertion de type explicite : as { new(): SpeechRecognition } indique à TypeScript qu'il s'agit d'un constructeur
const Recognition = typeof window !== "undefined" 
  ? (window.SpeechRecognition || window.webkitSpeechRecognition) as { new(): SpeechRecognition } 
  : null;

  // 2. Instanciation sécurisée avec vérification
    if (Recognition) {
      const recognition = new Recognition();
      recognition.lang = "fr-FR";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const result = event.results[0][0]?.transcript;
        if (result) {
          form.setValue(field, result, { shouldValidate: true });
        }
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
        setActiveField(null);
      };

      recognition.start();
    }
  };

  // Démarrer la dictée continue pour le champ "notes"
  const startContinuousSpeechRecognition = () => {
    // Vérifie si nous sommes dans un environnement client
    if (typeof window === "undefined") return;

    if (
      !("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      alert(
        "La reconnaissance vocale n'est pas supportée par votre navigateur"
      );
      return;
    }

    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();

    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      form.setValue("notes", transcript, { shouldValidate: true });
    };

    recognition.onend = () => {
      setIsVoiceListening(false);
      setActiveField(null);
    };

    recognition.start();
    setIsVoiceListening(true);
    setActiveField("notes");
    setRecognitionInstance(recognition);
  };

  // Arrêter la reconnaissance vocale
  const stopSpeechRecognition = () => {
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    setIsVoiceListening(false);
    setActiveField(null);
    setRecognitionInstance(null);
  };

  // Gestion de la soumission du formulaire
  const onSubmit = async (values: plantFormData) => {
    console.log("Données du formulaire:", values);

    // Conversion des tableaux en chaînes de caractères
    const formattedValues = {
      ...values,
      mois_plantation: values.mois_plantation?.join(",") || null,
      mois_semis: values.mois_semis?.join(",") || null,
      ensoleillement: values.ensoleillement?.join(",") || null,
    };

    console.log("Données formatées:", formattedValues);

    const formData = new FormData();
    formData.append("nom", formattedValues.nom);
    formData.append("espece", formattedValues.espece || "");
    formData.append("famille", formattedValues.famille || "");
    formData.append("mois_semis", formattedValues.mois_semis || "");
    formData.append("ensoleillement", formattedValues.ensoleillement || "");
    formData.append("mois_plantation", formattedValues.mois_plantation || "");
    formData.append("notes", formattedValues.notes || "");

    if (values.imageUrl && values.imageUrl.length > 0) {
      formData.append("imageUrl", values.imageUrl[0]);
    }

    try {
      const response = await fetch("/api/plantes", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Plante ajoutée avec succès!");
        form.reset();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de l'ajout de la plante:", errorData.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-col  space-y-8 border-2 border-white p-4"
      >
        {/* Champ Nom */}
        <FormField
          control={control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Nom de la plante"
                    readOnly={activeField === "nom"}
                    className={`w-full px-4 py-2 text-base sm:text-lg border rounded-md ${
                      activeField === "nom" ? "cursor-not-allowed bg-muted" : ""
                    }`}
                  />
                  {activeField === "nom" ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={stopSpeechRecognition}
                    >
                      <Mic className="text-white animate-pulse" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => startSpeechRecognition("nom")}
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
          control={control}
          name="famille"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Famille de la plante"
                    readOnly={activeField === "famille"}
                    className={`w-full px-4 py-2 text-base sm:text-lg border rounded-md ${
                      activeField === "famille"
                        ? "cursor-not-allowed bg-muted"
                        : ""
                    }`}
                  />
                  {activeField === "famille" ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={stopSpeechRecognition}
                    >
                      <Mic className="text-white animate-pulse" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => startSpeechRecognition("famille")}
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
          control={control}
          name="espece"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Espèce de la plante"
                    readOnly={activeField === "espece"}
                    className={`w-full px-4 py-2 text-base sm:text-lg border rounded-md ${
                      activeField === "espece"
                        ? "cursor-not-allowed bg-muted"
                        : ""
                    }`}
                  />
                  {activeField === "espece" ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={stopSpeechRecognition}
                    >
                      <Mic className="text-white animate-pulse" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => startSpeechRecognition("espece")}
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
          control={control}
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
          control={control}
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

        {/* Champ Ensoleillement */}
        <FormField
          control={control}
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
        {/* Champ Notes */}
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Textarea
                    {...field}
                    placeholder="Cliquez sur l'icône du microphone pour démarrer la dictée..."
                    readOnly={activeField === "notes"}
                    className={`resize-none min-h-72 pr-10 ${
                      activeField === "notes" ? "bg-muted" : ""
                    }`}
                  />
                  {activeField === "notes" ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 bottom-2"
                      onClick={stopSpeechRecognition}
                    >
                      <Mic className="text-white animate-pulse" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute right-2 bottom-2"
                      onClick={startContinuousSpeechRecognition}
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

        {/* Champ Image */}
        <FormField
          control={control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléchager un Image ? </FormLabel>
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
        <div className="flex justify-center">
          <Button
            type="submit"
            className={`w-full py-8 px-8 text-white text-lg font-semibold rounded-md shadow-md bg-primary hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-green-300 ${
              isSubmitting || isVoiceListening
                ? "disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-80"
                : ""
            }`}
            disabled={isSubmitting || isVoiceListening}
          >
            {isSubmitting ? "Envoi en cours..." : "Ajouter la plante"}
          </Button>
        </div>
      </form>
    </Form>
  );
  // Vérification dans le composant
  //console.log("globalTypesLoaded:", isGlobalTypesLoaded);
}
