const file = require("fs");
const path = require("path");

const inputFilePath = path.join(__dirname, "webapp/model/localMaterial.json");
const outputDir = path.join(__dirname, "webapp/localService/mockdata");

// Helper function to get unique values
function getUnique(arr) {
  return [...new Set(arr)];
}

const statInfoKeys = [
  "matk",
  "def",
  "mdef",
  "str",
  "vit",
  "atk",
  "drainAtk",
  "int",
  "parAtk",
  "crit",
  "drainRes",
  "psnAtk",
  "sickAtk",
  "slpAtk",
  "sealAtk",
  "psnRes",
  "sealRes",
  "parRes",
  "slpRes",
  "ftgRes",
  "sickRes",
  "diz",
  "knockAtk",
  "faintRes",
  "dizRes",
  "critRes",
  "knockRes",
  "knock",
  "stun",
  "ftgAtk",
  "faintAtk",
  "upgradeEffct",
  "effect",
  "fireRes",
  "waterRes",
  "windRes",
  "earthRes",
];

// Conversion script
function convertData(input) {
  let materialId = 1000;
  let locationId = 2000;
  let monsterId = 3000;
  let Monster_Location_Id = 4000;
  let dropId = 5000;

  const materialHeaders = "ID,Name,Category,Rarity,Difficulty";

  // const materials = [];
  let materials = `${materialHeaders},${statInfoKeys.join(",")}\n`;
  const monsters = [];
  const locations = [];
  const drops = [];

  const materialMonsterDrops = [];
  const materialLocationDrops = [];
  const monsterLocations = [];

  input.forEach((item) => {
    materials += `${materialId},${item.Name},${item.Category},${item.Rarity},${item.Difficulty}`;

    statInfoKeys.forEach((key) => {
      if (item.StatInfo && item.StatInfo[key] !== undefined) {
        materials += `,${item.StatInfo[key]}`;
      } else {
        materials += ",";
      }
    });
    materials += "\n";

    // Process Locations
    item.Drop.Locations?.forEach((location) => {
      if (!locations.some((loc) => loc.Name === location)) {
        locations.push({ ID: locationId++, Name: location });
      }
      const locId = locations.find((loc) => loc.Name === location).Id;
      drops.push({
        ID: dropId++,
        Material_ID: materialId,
        Monster_ID: undefined,
        Location_ID: locId,
      });
    });

    // Process Monsters
    item.Drop.Monsters?.forEach((monster) => {
      if (!monsters.some((m) => m.Name === monster.Name)) {
        monsters.push({ ID: monsterId++, Name: monster.Name });
      }
      const monId = monsters.find((m) => m.Name === monster.Name).ID;

      monster.Locations.forEach((location) => {
        if (!locations.some((loc) => loc.Name === location)) {
          locations.push({ ID: locationId++, Name: location });
        }
        const locId = locations.find((loc) => loc.Name === location).ID;
        if (
          !monsterLocations.some(
            (ml) => ml.Monster_ID === monId && ml.Location_ID === locId
          )
        ) {
          monsterLocations.push({
            ID: Monster_Location_Id++,
            Monster_ID: monId,
            Location_ID: locId,
          });
          drops.push({
            ID: dropId++,
            Material_ID: materialId,
            Monster_ID: monId,
            Location_ID: locId,
          });
        }
      });
    });

    materialId++;
  });

  return {
    materials,
    monsters,
    locations,
    drops,
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
  const convertToCsvFile = (fileName, content) => {
    const firstItem = content[0];
    const headers = Object.keys(firstItem).join(",");
    let csv = headers + "\n";

    content.forEach((item) => {
      const values = Object.values(item).join(",");
      csv += values + "\n";
    });

    file.writeFileSync(path.join(outputDir, fileName), csv);
  };
  const writeCSVFile2 = (fileName, content) => {
    file.writeFileSync(path.join(outputDir, fileName), content);
  };

  // Write out all the converted data
  // writeJsonFile("Materials.json", result.materials); // Materials list (with linked DropId)
  writeCSVFile2("Materials.csv", result.materials); // Materials list (with linked DropId)
  convertToCsvFile("Locations.csv", result.locations); // Locations list (unique)
  convertToCsvFile("Monsters.csv", result.monsters); // Monsters list (unique)
  convertToCsvFile("MonsterLocations.csv", result.monsterLocations); // Monster ⇄ Location mapping

  convertToCsvFile("Drops.csv", result.drops); // Material ⇄ Monster mapping
  // writeJsonFile("MaterialLocationDrops.json", result.materialLocationDrops); // Material ⇄ Location mapping
});
