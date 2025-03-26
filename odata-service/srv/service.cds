using { RF_Entity } from '../db/schema';

service DataService {
    entity Materials as projection on RF_Entity.Material;
    entity Locations as projection on RF_Entity.Location;
}
