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
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//import React, { useState } from "react";

export default function InsertPlant() {
  // 1. Define the form.
  const form = useForm<plantFormData>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      nom: "",
    },
  });

  /*  // 2. Define a submit handler.
  function onSubmit(values: plantFormData) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  } */

  const onSubmit = async (values: plantFormData) => {
    console.log(values);
    try {
      const response = await fetch("/api/names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      console.log(response);

      if (!response.ok) throw new Error("Erreur lors de l'ajout du nom 1");

      toast({
        title: "Succès",
        description: "Le nom a été ajouté avec succès.",
      });
      form.reset();
    } catch (error) {
      console.error("Erreur lors de l'ajout du nom:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du nom.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          name="nom"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom de la plante" {...field} />
              </FormControl>
              <FormDescription>Compris entre 2 et 5 caractères</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Ajouter</Button>
      </form>
    </Form>
  );
}
/* return (
    <form action={createPlante} className="bg-slate-300 p-5">
      <ImportChamp />
      <Button type="submit" className="px-2 py-2 rounded-sm primary">
        Envoyer
      </Button>
    </form>
  ); */
