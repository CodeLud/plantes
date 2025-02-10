-- CreateTable
CREATE TABLE "M_multiplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "methode" TEXT NOT NULL,
    "saison" TEXT,
    "observation" TEXT
);

-- CreateTable
CREATE TABLE "_M_multiplicationToPlante" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_M_multiplicationToPlante_A_fkey" FOREIGN KEY ("A") REFERENCES "M_multiplication" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_M_multiplicationToPlante_B_fkey" FOREIGN KEY ("B") REFERENCES "Plante" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_M_multiplicationToPlante_AB_unique" ON "_M_multiplicationToPlante"("A", "B");

-- CreateIndex
CREATE INDEX "_M_multiplicationToPlante_B_index" ON "_M_multiplicationToPlante"("B");
