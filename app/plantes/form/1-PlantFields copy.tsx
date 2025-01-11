import { FormFieldComponent } from "./2-FieldComponent";

const FormPlantFields = () => {
  return (
    <>
      <FormFieldComponent
        name="nom"
        label="Nom"
        placeholder="Nom de la plante"
        description="Compris entre 2 et 5 caractères"
        type="input"
      />
      <FormFieldComponent
        name="espece"
        label="Espèce"
        placeholder="Espèce de la plante"
        type="input"
      />
      <FormFieldComponent
        name="famille"
        label="Famille"
        placeholder="Famille de la plante"
        type="input"
      />
      <FormFieldComponent
        name="mois_plantation"
        label="Mois de plantation"
        placeholder="Mois de plantation"
        type="input"
      />
      <FormFieldComponent
        name="mois_semis"
        label="Mois de semis"
        placeholder="Mois de semis"
        type="input"
      />
      <FormFieldComponent
        name="ensoleillement"
        label="Ensoleillement"
        placeholder="Ensoleillement"
        type="input"
      />
      <FormFieldComponent
        name="notes"
        label="Notes"
        placeholder="Notes supplémentaires"
        type="textarea"
      />
    </>
  );
};

export default FormPlantFields;
