using { managed } from '@sap/cds/common';

namespace RF_Entity;

entity Material {
  key MaterialId        : Integer;
  Name         : String;
  Rarity       : Integer;
  Category     : String;
  Difficulty   : Integer;
  StatInfo     : String;
  Drops        : Association to many Drop;
}

entity Drop {
  Locations    : Association to many Location;
  Monsters     : Association to many Monster;
  Other        : Association to many Other;
  Fishing      : Association to many Fishing;
  Chopping     : Association to many Chopping;
}

entity Location {
  key LocationId       : Integer;
  Name        : String;
  Monsters    : Association to many MonsterToLocation on Monsters.Location = $self;
}

entity Monster {
  key MonsterId       : Integer;
  Name        : String;
  Locations : Association to  many MonsterToLocation on Locations.Monster = $self;
}

entity MonsterToLocation {
  key Monster_Location_Id: Integer;
  Monster : Association to one Monster;
  Location : Association to one Location;
}

entity Other {
  key Id       : Integer;
  Name        : String;
  LocationId   : Integer;
  Location    : Association to Location on LocationId = $self.LocationId;
}

entity Fishing {
  key Id       : Integer;
  Location    : String;
  Area        : String;
}

entity Chopping {
  key Id       : Integer;
  Name        : String;
}
