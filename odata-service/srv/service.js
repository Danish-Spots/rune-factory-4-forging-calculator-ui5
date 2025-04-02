const cds = require("@sap/cds");
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
class DataService extends cds.ApplicationService {
  init() {
    const { Monsters, Locations, Materials, MonsterToLocations } =
      this.entities;
    // this.on("READ", Monsters, async (req) => {
    //   const tx = cds.transaction(req);
    //   // const monsters = await SELECT.from(this.entities);
    //   const data = await SELECT.from(Monsters).columns("ID", "Name", {
    //     Locations: { Location: "*" },
    //   });

    //   return data.map((monster) => ({
    //     ...monster,
    //     Locations: monster.Locations?.map((loc) => loc.Location), // Flatten join table data
    //   }));
    // });
    this.after("READ", Materials, (results, req) => {
      results.forEach((m) => {
        Object.assign(m, { Stats: [] });
        statInfoKeys.forEach((key) => {
          if (m[key] !== undefined && m[key] !== null)
            m.Stats.push({ Stat_Key: key, Stat_Value: m[key] });
        });
      });
    });
    return super.init();
  }
}

module.exports = DataService;
