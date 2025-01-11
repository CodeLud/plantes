import {
  // FormCheckboxComponent,
  FormInputComponent,
  FormTextareaComponent,
} from "./2-FieldComponent";

const FormPlantFields = () => {
  return (
    <>
      <FormInputComponent
        name="nom"
        label="Nom"
        placeholder="Nom de la plante"
        description="Compris entre 2 et 5 caractères"
      />
      <FormInputComponent
        name="espece"
        label="Espèce"
        placeholder="Espèce de la plante"
        description=""
      />
      <FormInputComponent
        name="famille"
        label="Famille"
        placeholder="Famille de la plante"
        description=""
      />
      <FormInputComponent
        name="mois_plantation"
        label="Mois de plantation"
        placeholder="Mois de plantation"
        description=""
      />
      {/* <FormCheckboxComponent
        name="moPlanting"
        label="plantation"
        placeholder="Mois de plantation"
        description=""
      /> */}
      <FormInputComponent
        name="mois_semis"
        label="Mois de semis"
        placeholder="Mois de semis"
        description=""
      />
      <FormInputComponent
        name="ensoleillement"
        label="Ensoleillement"
        placeholder="Ensoleillement"
        description=""
      />
      <FormTextareaComponent
        name="notes"
        label="Notes"
        placeholder="Notes supplémentaires"
      />
    </>
  );
};

export default FormPlantFields;
