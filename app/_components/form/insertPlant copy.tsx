"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { plantFormData, plantFormSchema } from "../../_schemas/plantForm";

//import React, { useState } from "react";

export default function InsertPlant() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<plantFormData>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      nom: "",
    },
  });

  const onSubmit = (data: plantFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="nom"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor="nom">Nom :</label>
            <input {...field} id="nom" />
            {errors.nom && <span>{errors.nom.message}</span>}
          </div>
        )}
      />
      <button type="submit">Envoyer</button>
    </form>
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
