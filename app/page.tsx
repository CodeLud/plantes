// import { createPlante } from "@/actions/actions";
import PlantForm from "./plantes/PlantForm";

export default async function plantesPage() {
  // const plantes = await prisma.plante.findMany();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800 mb-6">
        Ajouter une plante
      </h1>
      <ul className="bg-slate-400 mb-8 space-y-2 max-w-md mx-auto">
        {/* {plantes.map((plante) => (
          <li key={plante.id}>
            {plante.nom} {` `}
            <Link href={`/plantes/${plante.nom}`}>stat</Link>
          </li>
        ))} */}
      </ul>
      {/* Formulaire */}
      <div className="w-full max-w-lg mx-auto space-y-6 mb-14">
        <PlantForm />
      </div>
    </div>
  );
}
