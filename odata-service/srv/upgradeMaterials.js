const upgradeMaterials = async (req) => {
	const material = {
		ID: 1,
		Header_Name: "Choose material",
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
	return {
		Materials: new Array(10).fill(material).map((_, i) => ({ ...material, ID: i })),
	};
};

module.exports = {
	upgradeMaterials,
};
