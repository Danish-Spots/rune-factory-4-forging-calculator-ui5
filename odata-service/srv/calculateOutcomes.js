const { createStatHtml } = require("./helpers/createHtml");
const calculateOutcomes = async (req) => {
	const { outcomes, bonuses, weaponStats } = req.data;
	const results = [];
	outcomes.forEach((outcome) => {
		for (const bonus in bonuses) {
			if (outcome[bonus]) outcome[bonus] += bonuses[bonus] || 0;
			else outcome[bonus] = bonuses[bonus] || 0;
		}
		for (const stat of weaponStats) {
			if (outcome[stat.Stat_Key]) {
				outcome[stat.Stat_Key] += parseInt(stat.Stat_Value);
			} else outcome[stat.Stat_Key] = parseInt(stat.Stat_Value);
		}
		const result = {
			secondaryStats: [],
			primaryStats: [],
		};

		Object.entries(outcome).forEach(([key, value]) => {
			if (key === "atk" || key === "def" || key === "mdef" || key === "matk")
				result.primaryStats.push({ key, value, html: createStatHtml(key, value) });
			else result.secondaryStats.push({ key, value, html: createStatHtml(key, value) });
		});
		results.push(result);
	});
	console.log(results);

	return results;
};

module.exports = {
	calculateOutcomes,
};
