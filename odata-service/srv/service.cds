using { RF_Entity } from '../db/schema';

service DataService {
    entity Materials as projection on RF_Entity.Material;
    entity Locations as projection on RF_Entity.Location;
    entity Monsters as projection on RF_Entity.Monster;
    entity Others as projection on RF_Entity.Other;
    entity MonsterToLocations as projection on RF_Entity.MonsterToLocation;
}
