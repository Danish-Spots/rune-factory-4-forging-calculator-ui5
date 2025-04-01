using { managed } from '@sap/cds/common';

namespace RF_Entity;



entity Stat {
  key ID  : Integer;
  Material  : Association to one Material;
  Stat_Key  : String;
  Stat_Value  : String;
}

entity Material {
  key ID        : Integer;
  Name         : String;
  Rarity       : Integer;
  Category     : String;
  Difficulty   : Integer;
  Stats   : Association to many Stat on Stats.Material = $self;
  Drops       : Association to many Drop on Drops.Material = $self;
}

entity Drop {
  key ID : Integer;
  Location    : Association to  Location;
  Monster     : Association to  Monster;
  Material  : Association to Material;
}

entity Location {
  key ID       : Integer;
  Name        : String;
  Monsters    : Association to many Monster_Location on Monsters.Location = $self;
  Drops       : Association to many Drop on Drops.Location = $self;
}

entity Monster {
  key ID       : Integer;
  Name        : String;
  Locations : Association to  many Monster_Location on Locations.Monster = $self;
  Drops       : Association to many Drop on Drops.Monster = $self;
}

@cds.autoexpose entity Monster_Location {
  key ID: Integer;
  Monster : Association to Monster;
  Location : Association to Location;
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
