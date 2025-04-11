const { createStatHtml } = require("./helpers/createHtml");
const calculateOutcomes = async (req) => {
	const { outcomes, weaponStats } = req.data;
	const results = [];
	outcomes.forEach((outcome) => {
		for (const stat of weaponStats) {
			if (outcome[stat.Stat_Key]) {
				outcome[stat.Stat_Key] += parseInt(stat.Stat_Value);
			} else outcome[stat.Stat_Key] = parseInt(stat.Stat_Value);
		}
		const result = {
			stats: [],
		};

		Object.entries(outcome).forEach(([key, value]) => {
			result.stats.push({ key, value });
		});
		results.push(result);
	});

	return results;
};

module.exports = {
	calculateOutcomes,
};
