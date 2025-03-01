/* // import { createPlante } from "@/actions/actions";
import InsertPlant from "@/app/_components/form/insertPlant";
import prisma from "@/lib/db";
import Link from "next/link";

export default async function plantesPage() {
  const plantes = await prisma.plante.findMany();

  return (
    <div>
      Liste de mes plantes
      <ul>
        {plantes.map((plante) => (
          <li key={plante.id}>
            {plante.nom} {` `}
            <Link href={`/plantes/${plante.nom}`}>stat</Link>
          </li>
        ))}
      </ul>
      
      <InsertPlant />
    </div>
  );
}
 */