/*
  Warnings:

  - You are about to drop the `_M_multiplicationToPlante` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_M_multiplicationToPlante";
PRAGMA foreign_keys=on;

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
