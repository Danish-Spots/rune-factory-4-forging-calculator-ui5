import { LevelKey, RarityKey, StatKey } from './enums';

export type LevelBonus = {
	[key in LevelKey]: StatBonus;
};

export type RarityBonus = {
	[key in RarityKey]: StatBonus;
};

export type StatBonus = {
	[key in StatKey]?: number;
};

export type MaterialItem = {
	ID: number;
	Name: string;
	Rarity: number;
	Category: string;
	Difficulty: number;
	Level: number;
	Stats: { Stat_Key: string; Stat_Value: string }[];
};
