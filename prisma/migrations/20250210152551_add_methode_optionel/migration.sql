-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_M_multiplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "methode" TEXT,
    "saison" TEXT,
    "observation" TEXT
);
INSERT INTO "new_M_multiplication" ("id", "methode", "observation", "saison") SELECT "id", "methode", "observation", "saison" FROM "M_multiplication";
DROP TABLE "M_multiplication";
ALTER TABLE "new_M_multiplication" RENAME TO "M_multiplication";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
