-- CreateTable
CREATE TABLE "Plante" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "espece" TEXT NOT NULL,
    "famille" TEXT NOT NULL,
    "mois_plantation" TEXT NOT NULL,
    "mois_semis" TEXT NOT NULL,
    "ensoleillement" TEXT NOT NULL,
    "notes" TEXT NOT NULL
);
