// import { createPlante } from "@/actions/actions";
import PlantForm from "./plantes/PlantForm";

export default async function plantesPage() {
  // const plantes = await prisma.plante.findMany();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      Liste de mes plantes
      <ul>
        {/* {plantes.map((plante) => (
          <li key={plante.id}>
            {plante.nom} {` `}
            <Link href={`/plantes/${plante.nom}`}>stat</Link>
          </li>
        ))} */}
      </ul>
      {/* Formulaire */}
      <PlantForm />
    </div>
  );
}
