const upgradeMaterials = async (req) => {
	const material = {
		ID: 1,
		Header_Name: "Choose material",
		Select_Query: {
			path: "data>/Materials",
			sorter: {
				path: "Rarity",
				descending: true,
			},
			length: 240,
			filters: [],
			editable: true,
		},
		Material: {
			ID: null,
			Name: null,
			Rarity: null,
			Category: null,
			Level: 1,
			Stats: [],
		},
	};
	return {
		Materials: new Array(9).fill(material).map((_, i) => ({ ...material, ID: i })),
	};
};

module.exports = {
	upgradeMaterials,
};
