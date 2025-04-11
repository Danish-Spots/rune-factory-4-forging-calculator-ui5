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

const weaponsCall = async (results, req, Materials) => {
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
	const materialQuery = {
		path: "data>/Materials",
		sorter: {
			path: "Rarity",
			descending: true,
		},
		filters: [],
	};
	const materialLookup = Object.fromEntries(materialNames.map((m) => [m.ID, m.Name]));
	for (const weapon of results) {
		const materials = [];
		for (let i = 1; i <= 6; i++) {
			const raw = weapon[`Material_${i}`];
			const material = {
				Header_Name: "",
				Field_Name: `Material_${i}`,
				Select_Query: materialQuery,
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
				material.Select_Query = Object.assign({}, materialQuery);
				material.Select_Query.filters.push({
					path: "Category",
					operator: "Contains",
					value1: name,
				});
			} else if (raw.startsWith("W:")) {
				const name = raw.substring(2);
				material.Header_Name = name;
			} else {
				const name = materialLookup[raw];
				weapon[`Material_${i}`] = name;
				material.Select_Query = Object.assign({}, materialQuery);
				material.Select_Query.filters.push({
					path: "ID",
					operator: "EQ",
					value1: raw,
				});
				material.Header_Name = name;
			}
			materials.push(material);
		}
		weapon["Materials"] = materials;
	}
};

module.exports = {
	weaponsCall,
};
