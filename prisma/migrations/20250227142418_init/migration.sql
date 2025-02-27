-- CreateTable
CREATE TABLE "Plante" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "espece" TEXT,
    "famille" TEXT,
    "mois_plantation" TEXT,
    "mois_semis" TEXT,
    "ensoleillement" TEXT,
    "notes" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "M_multiplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "methode" TEXT,
    "saison" TEXT,
    "observation" TEXT
);

-- CreateTable
CREATE TABLE "_Plante_M_multiplication" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Plante_M_multiplication_A_fkey" FOREIGN KEY ("A") REFERENCES "M_multiplication" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Plante_M_multiplication_B_fkey" FOREIGN KEY ("B") REFERENCES "Plante" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_Plante_M_multiplication_AB_unique" ON "_Plante_M_multiplication"("A", "B");

-- CreateIndex
CREATE INDEX "_Plante_M_multiplication_B_index" ON "_Plante_M_multiplication"("B");
