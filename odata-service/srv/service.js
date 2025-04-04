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
		const { Monsters, Locations, Materials, MonsterToLocations, Weapons } = this.entities;
		console.log(Weapons);
		this.after("READ", Materials, (results, req) => {
			results.forEach((m) => {
				Object.assign(m, { Stats: [] });
				statInfoKeys.forEach((key) => {
					if (m[key] !== undefined && m[key] !== null) m.Stats.push({ Stat_Key: key, Stat_Value: m[key] });
				});
			});
		});
		this.after("READ", Weapons, async (results, req) => {
			const tx = cds.transaction(req);
			const materialIds = new Set();

			results.forEach(async (m) => {
				Object.assign(m, { Stats: [] });
				statInfoKeys.forEach((key) => {
					if (m[key] !== undefined && m[key] !== null) m.Stats.push({ Stat_Key: key, Stat_Value: m[key] });
				});
				for (let i = 1; i <= 5; i++) {
					const raw = m[`Material_${i}`];
					if (raw && raw !== null && !raw.startsWith("C:") && !raw.startsWith("W:")) {
						materialIds.add(parseInt(raw));
					}
				}
			});
			const materialNames = await tx.run(
				SELECT.from(Materials)
					.columns("ID", "Name")
					.where({ ID: { in: Array.from(materialIds) } })
			);
			const materialLookup = Object.fromEntries(materialNames.map((m) => [m.ID, m.Name]));
			for (const weapon of results) {
				for (let i = 1; i <= 5; i++) {
					const raw = weapon[`Material_${i}`];
					if (!raw) continue;
					if (raw.startsWith("C:") || raw.startsWith("W:")) weapon[`Material_${i}`] = raw.substring(2);
					else weapon[`Material_${i}`] = materialLookup[raw];
				}
			}
		});
		return super.init();
	}
}

module.exports = DataService;
