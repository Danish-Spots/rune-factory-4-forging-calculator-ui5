const file = require("fs");
const path = require("path");

const inputFilePath = path.join(__dirname, "webapp/model/localMaterial.json");
const outputDir = path.join(__dirname, "webapp/localService/mockdata");

// Helper function to get unique values
function getUnique(arr) {
  return [...new Set(arr)];
}

// Conversion script
function convertData(input) {
  let materialId = 1000;
  let locationId = 2000;
  let monsterId = 3000;
  let Monster_Location_Id = 4000;

  const materials = [];
  const monsters = [];
  const locations = [];

  const materialMonsterDrops = [];
  const materialLocationDrops = [];
  const monsterLocations = [];

  input.forEach((item) => {
    // Create Material
    const material = {
      Id: materialId++,
      Name: item.Name,
      Category: item.Category,
      Rarity: item.Rarity,
      Difficulty: item.Difficulty,
      StatInfo: item.StatInfo,
    };
    materials.push(material);

    // Process Locations
    item.Drop.Locations?.forEach((location) => {
      if (!locations.some((loc) => loc.Name === location)) {
        locations.push({ Id: locationId++, Name: location });
      }
      const locId = locations.find((loc) => loc.Name === location).Id;
      materialLocationDrops.push({
        MaterialId: material.Id,
        LocationId: locId,
      });
    });

    // Process Monsters
    item.Drop.Monsters?.forEach((monster) => {
      if (!monsters.some((m) => m.Name === monster.Name)) {
        monsters.push({ Id: monsterId++, Name: monster.Name });
      }
      const monId = monsters.find((m) => m.Name === monster.Name).Id;

      monster.Locations.forEach((location) => {
        if (!locations.some((loc) => loc.Name === location)) {
          locations.push({ Id: locationId++, Name: location });
        }
        const locId = locations.find((loc) => loc.Name === location).Id;
        monsterLocations.push({
          Monster_Location_Id: Monster_Location_Id++,
          Monster: { MonsterId: monId },
          Location: { LocationId: locId },
        });
      });

      materialMonsterDrops.push({
        MaterialId: material.Id,
        MonsterId: monId,
      });
    });
  });

  return {
    materials,
    monsters,
    locations,
    materialMonsterDrops,
    materialLocationDrops,
    monsterLocations,
  };
}

file.readFile(inputFilePath, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const result = convertData(JSON.parse(data).Materials);

  // Helper function to write JSON to output files
  const writeJsonFile = (fileName, content) => {
    file.writeFileSync(
      path.join(outputDir, fileName),
      JSON.stringify(content, null, 2)
    );
  };

  // Write out all the converted data
  writeJsonFile("Materials.json", result.materials); // Materials list (with linked DropId)
  writeJsonFile("Locations.json", result.locations); // Locations list (unique)
  writeJsonFile("Monsters.json", result.monsters); // Monsters list (unique)
  writeJsonFile("MaterialMonsterDrops.json", result.materialMonsterDrops); // Material ⇄ Monster mapping
  writeJsonFile("MaterialLocationDrops.json", result.materialLocationDrops); // Material ⇄ Location mapping
  writeJsonFile("MonsterLocations.json", result.monsterLocations); // Monster ⇄ Location mapping
});
