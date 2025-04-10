using { RF_Entity } from '../db/schema';

@impl: 'srv/service.js'
service DataService {
    entity Materials as projection on RF_Entity.Material;
    entity Locations as projection on RF_Entity.Location;
    entity Monsters as projection on RF_Entity.Monster;
    // entity Stats as projection on RF_Entity.Stat;
    entity Others as projection on RF_Entity.Other;
    entity Drops as projection on RF_Entity.Drop;
    entity Weapons as projection on RF_Entity.Weapon;
    entity MonsterToLocations as projection on RF_Entity.Monster_Location;

    action CalculateOutcomes(
      outcomes: array of RF_Entity.MaterialStat,
      bonuses: RF_Entity.MaterialStat,
      weaponStats: array of RF_Entity.WeaponStat,
    ) returns array of RF_Entity.StatArray;

    function UpgradeMaterials() returns  RF_Entity.UpgradeMaterial
}
