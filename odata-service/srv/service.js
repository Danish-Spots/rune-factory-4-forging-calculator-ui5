const cds = require("@sap/cds");
const { calculateOutcomes } = require("./calculateOutcomes");
const { createStatHtml } = require("./helpers/createHtml");
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
		this.after("READ", Materials, (results, req) => {
			results.forEach((m) => {
				Object.assign(m, { Stats: [] });
				statInfoKeys.forEach((key) => {
					if (m[key] !== undefined && m[key] !== null)
						m.Stats.push({ Stat_Key: key, Stat_Value: m[key], Stat_HTML: createStatHtml(key, m[key]) });
				});
				Object.assign(m, { StatJoin: m.Stats.map((s) => `${s.Stat_Key} - ${s.Stat_Value}`).join(", ") });
			});
		});
		this.on("CalculateOutcomes", calculateOutcomes);
		this.after("READ", Weapons, async (results, req) => {
			const tx = cds.transaction(req);
			const materialIds = new Set();

			results.forEach(async (m) => {
				Object.assign(m, { Stats: [] });
				statInfoKeys.forEach((key) => {
					if (m[key] !== undefined && m[key] !== null)
						m.Stats.push({
							Stat_Key: key,
							Stat_Value: m[key],
							Stat_HTML: createStatHtml(key, m[key]),
						});
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
				const materials = [];
				for (let i = 1; i <= 6; i++) {
					const raw = weapon[`Material_${i}`];
					const material = {
						Header_Name: "",
						Field_Name: `Material_${i}`,
						Select_Query: null,
						Material: {
							ID: null,
							Name: null,
							Rarity: null,
							Category: null,
							Level: 1,
							Stats: [],
						},
					};
					if (!raw) {
						material.Header_Name = "Choose material";
					} else if (raw.startsWith("C:")) {
						const name = raw.substring(2);
						weapon[`Material_${i}`] = name;
						material.Header_Name = name;
						material.Select_Query = `${name}`;
					} else if (raw.startsWith("W:")) {
						const name = raw.substring(2);
						material.Header_Name = name;
					} else {
						const name = materialLookup[raw];
						weapon[`Material_${i}`] = name;
						material.Select_Query = `${raw}`;
						material.Header_Name = name;
					}
					materials.push(material);
				}
				weapon["Materials"] = materials;
			}
		});
		return super.init();
	}
}

module.exports = DataService;
