import { weaponLevelBonuses, armorLevelBonuses, weaponRarityBonuses, armourRarityBonuses } from './constants';
import { Gear, LevelKey, RarityKey, StatKey } from './enums';
import { MaterialItem, StatBonus } from './types';

const materials = [];

const applyStat = (currentStat: number, addedStat: number, divisionNumbber: number) => {
	return currentStat + addedStat / divisionNumbber;
};

const calculateLevelBonuses = (totalItemLevel: number, gear: Gear): StatBonus => {
	const key = (Math.floor(totalItemLevel / 30) * 30) as LevelKey;

	if (gear === Gear.Weapon) return weaponLevelBonuses[key];
	else if (gear === Gear.Armour) return armorLevelBonuses[key];

	return { atk: 0, matk: 0 };
};

const calculateRarityBonuses = (totalRarity: number, gear: Gear): StatBonus => {
	const key = totalRarity >= 70 || totalRarity <= 99 ? 70 : ((Math.floor(totalRarity / 25) * 25) as RarityKey);

	if (gear === Gear.Weapon) return weaponRarityBonuses[key];
	else if (gear === Gear.Armour) return armourRarityBonuses[key];

	return { atk: 0, matk: 0 };
};

const calculateBonuses = (totalRarity: number, totalLevel: number, gear: Gear) => {
	const rarityBonuses = calculateRarityBonuses(totalRarity, gear);
	const levelBonuses = calculateLevelBonuses(totalLevel, gear);
	const result: StatBonus = {};
	for (const key in rarityBonuses) {
		const newKey: StatKey = key as StatKey;
		result[newKey] = (rarityBonuses[newKey] as number) + (levelBonuses[newKey] as number);
	}
	return result;
};

/**
 * Only to be used in forging part of the process.
 * When upgrading, each subsequent use of the same material has a halved effect
 * @param materials
 * @returns
 */
const calculateStats = (materials: MaterialItem[]) => {
	const results: { [key: string]: number } = {};

	for (const material of materials) {
		for (const stat of material.Stats) {
			const statKey = stat.Stat_Key;
			const statValue = parseInt(stat.Stat_Value);
			if (!results[statKey]) results[statKey] = statValue;
			else results[statKey] += statValue;
		}
	}
	return results;
};

const calculateInheritanceOutcomes = (materials: MaterialItem[]): any[] => {
	// 6 different materials
	// each combination uses 3 materials
	const maxMaterialsSize = Math.min(materials.length, 6);

	if (materials.length === 0) return [] as StatBonus[];
	let results: any[] = [];
	if (materials.length <= 3) {
		results.push(calculateStats(materials));
		return results;
	}

	const helper = (start: number, selected: MaterialItem[]) => {
		if (selected.length === 3) {
			results.push(calculateStats(selected));
			return;
		}
		for (let i = start; i < maxMaterialsSize; i++) {
			helper(i + 1, [...selected, materials[i]]);
		}
	};
	helper(0, []);

	results = Array.from(new Set(results.map((r) => JSON.stringify(r)))).map((r) => JSON.parse(r));
	return results;
};

const calculateUpgrades = (materials: MaterialItem[], gear: Gear): StatBonus => {
	const bonusValues = materials.reduce(
		(acc, item) => {
			const itemLevel = item.Level;
			const itemRarity = item.Rarity;
			acc.Rarity += itemRarity;
			acc.Level += itemLevel;
			return acc;
		},
		{ Rarity: 0, Level: 0 }
	);

	const bonuses = calculateBonuses(bonusValues.Rarity, bonusValues.Level, gear);
	// Caclulate stat upgrades
	return bonuses;
};
