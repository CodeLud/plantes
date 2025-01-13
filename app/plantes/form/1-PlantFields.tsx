import {
  FormInputComponent,
  FormTextareaComponent,
} from "./2-FieldComponent copy";

const FormPlantFields = () => {
  return (
    <>
      <FormInputComponent
        name="nom"
        label="Nom"
        placeholder="Nom de la plante"
        description="Compris entre 2 et 5 caractères"
        type="input"
      />
      <FormInputComponent
        name="espece"
        label="Espèce"
        placeholder="Espèce de la plante"
        description=""
        type="input"
      />
      <FormInputComponent
        name="famille"
        label="Famille"
        placeholder="Famille de la plante"
        description=""
        type="input"
      />
      <FormInputComponent
        name="mois_plantation"
        label="Mois de plantation"
        placeholder="Mois de plantation"
        description=""
        type="input"
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
        type="input"
      />
      <FormInputComponent
        name="ensoleillement"
        label="Ensoleillement"
        placeholder="Ensoleillement"
        description=""
        type="input"
      />
      <FormTextareaComponent
        name="notes"
        label="Notes"
        placeholder="Notes supplémentaires"
        type="textarea"
      />
    </>
  );
};

export default FormPlantFields;
