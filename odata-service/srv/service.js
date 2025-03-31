const cds = require("@sap/cds");

class DataService extends cds.ApplicationService {
  init() {
    const { Monsters, Locations, Materials, MonsterToLocations } =
      this.entities;
    this.on("READ", Monsters, async (req) => {
      const tx = cds.transaction(req);
      // const monsters = await SELECT.from(this.entities);
      const data = await SELECT.from(Monsters).columns("ID", "Name", {
        Locations: { Location: "*" },
      });

      return data.map((monster) => ({
        ...monster,
        Locations: monster.Locations?.map((loc) => loc.Location), // Flatten join table data
      }));
    });
    return super.init();
  }
}

module.exports = DataService;
