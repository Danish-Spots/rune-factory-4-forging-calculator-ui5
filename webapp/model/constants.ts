import { LevelBonus, RarityBonus } from './types';

export const weaponRarityBonuses: RarityBonus = {
	25: { atk: 10, matk: 5 },
	50: { atk: 40, matk: 15 },
	70: { atk: 80, matk: 35 },
	100: { atk: 150, matk: 100 },
	125: { atk: 300, matk: 160 },
	150: { atk: 500, matk: 400 },
	175: { atk: 1000, matk: 950 },
	200: { atk: 2000, matk: 1800 },
};
export const armourRarityBonuses: RarityBonus = {
	25: { def: 3, mdef: 3 },
	50: { def: 10, mdef: 10 },
	70: { def: 20, mdef: 20 },
	100: { def: 50, mdef: 50 },
	125: { def: 90, mdef: 90 },
	150: { def: 150, mdef: 150 },
	175: { def: 400, mdef: 400 },
	200: { def: 800, mdef: 780 },
};
export const weaponLevelBonuses: LevelBonus = {
	1: { atk: 0, matk: 0 },
	30: { atk: 10, matk: 5 },
	60: { atk: 25, matk: 10 },
	90: { atk: 70, matk: 40 },
	120: { atk: 200, matk: 180 },
	150: { atk: 700, matk: 650 },
};

export const armorLevelBonuses: LevelBonus = {
	1: { def: 0, mdef: 0 },
	30: { def: 6, mdef: 5 },
	60: { def: 15, mdef: 12 },
	90: { def: 36, mdef: 28 },
	120: { def: 180, mdef: 170 },
	150: { def: 350, mdef: 350 },
};
