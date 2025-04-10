const statKeyMap = new Map([
	["matk", "Magic Attack"],
	["def", "Defense"],
	["mdef", "Magic Defense"],
	["str", "Strength"],
	["vit", "Vitality"],
	["atk", "Attack"],
	["drainAtk", "Drain Attack"],
	["int", "Intelligence"],
	["parAtk", "Paralysis Attack"],
	["crit", "Critical Rate"],
	["drainRes", "Drain Resistance"],
	["psnAtk", "Poison Attack"],
	["sickAtk", "Sickness Attack"],
	["slpAtk", "Sleep Attack"],
	["sealAtk", "Seal Attack"],
	["psnRes", "Poison Resistance"],
	["sealRes", "Seal Resistance"],
	["parRes", "Paralysis Resistance"],
	["slpRes", "Sleep Resistance"],
	["ftgRes", "Fatigue Resistance"],
	["sickRes", "Sickness Resistance"],
	["diz", "Dizziness"],
	["knockAtk", "Knockback Attack"],
	["faintRes", "Faint Resistance"],
	["dizRes", "Dizziness Resistance"],
	["critRes", "Critical Resistance"],
	["knockRes", "Knockback Resistance"],
	["knock", "Knockback"],
	["stun", "Stun"],
	["ftgAtk", "Fatigue Attack"],
	["faintAtk", "Faint Attack"],
	["upgradeEffct", "Upgrade Effect"],
	["effect", "Effect"],
	["fireRes", "Fire Resistance"],
	["waterRes", "Water Resistance"],
	["windRes", "Wind Resistance"],
	["earthRes", "Earth Resistance"],
]);

export const createStatHtml = (key, value) => {
	return `<p style="height: 100%; width: 100%; display: flex; flex-direction: column; margin: 0; gap: 4px;">
      <span style="font-weight: bold;"> ${key} </span>
      <span> ${value} </span>
     </p>`;
};
