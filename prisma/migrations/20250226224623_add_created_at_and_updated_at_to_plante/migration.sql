-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plante" (
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
INSERT INTO "new_Plante" ("ensoleillement", "espece", "famille", "id", "imageUrl", "mois_plantation", "mois_semis", "nom", "notes") SELECT "ensoleillement", "espece", "famille", "id", "imageUrl", "mois_plantation", "mois_semis", "nom", "notes" FROM "Plante";
DROP TABLE "Plante";
ALTER TABLE "new_Plante" RENAME TO "Plante";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;