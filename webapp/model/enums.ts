export enum LevelKey {
	L1 = 1,
	L30 = 30,
	L60 = 60,
	L90 = 90,
	L120 = 120,
	L150 = 150,
}
export enum RarityKey {
	R25 = 25,
	R50 = 50,
	R70 = 70,
	R100 = 100,
	R125 = 125,
	R150 = 150,
	R175 = 175,
	R200 = 200,
}
export enum StatKey {
	Atk = 'atk',
	Def = 'def',
	Mdef = 'mdef',
	Matk = 'matk',
}
export enum Gear {
	Weapon = 'Weapon',
	Armour = 'Armour',
}

export enum CalcChangeEvent {
	/**
	 * This should be used to recalculate levels
	 */
	Level = 'level',
	/**
	 * Indicate that a forge material has been changed
	 */
	ForgeMaterial = 'forgeMaterial',
	/**
	 * Indicate that a upgrade material has been changed
	 */
	UpgradeMaterial = 'upgradeMaterial',
}
