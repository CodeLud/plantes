import prisma from "@/lib/db";

export default async function pageDetails({
  params,
}: {
  params: Promise<{ pageName: string }>;
}) {
  // Récupère le nom
  // Retrieves the name on the url
  const slugName = (await params).pageName;
  // Récupère les données concernant la fiche dans le model plante
  // Retrieves data on the table model plant
  const maPlante = await prisma.plante.findUnique({
    where: {
      nom: slugName,
    },
  });
  /*   Si je ne trouve pas de résultat
   */
  if (!maPlante) {
    return (
      <div>
        <h1>Recherche de {slugName}</h1>
        <span>Désolé, Nous n'avons pas trouvé de réponse.</span>
      </div>
    );
  }

  /*   retourne la fiche plante
   */
  return (
    <h1>
      id de {maPlante.nom}: {maPlante.id}
    </h1>
  );
}
