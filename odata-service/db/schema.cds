using { managed } from '@sap/cds/common';

namespace RF_Entity;

entity Material {
  key ID        : Integer;
  Name         : String;
  Rarity       : Integer;
  Category     : String;
  Difficulty   : Integer;
  matk        : Integer;
  def         : Integer;
  mdef        : Integer;
  str         : Integer;
  vit         : Integer;
  atk         : Integer;
  drainAtk        : Integer;
  int         : Integer;
  parAtk        : Integer;
  crit        : Integer;
  drainRes        : Integer;
  psnAtk        : Integer;
  sickAtk         : Integer;
  slpAtk        : Integer;
  sealAtk         : Integer;
  psnRes        : Integer;
  sealRes         : Integer;
  parRes        : Integer;
  slpRes        : Integer;
  ftgRes        : Integer;
  sickRes         : Integer;
  diz         : Integer;
  knockAtk        : Integer;
  faintRes        : Integer;
  dizRes        : Integer;
  critRes         : Integer;
  knockRes        : Integer;
  knock         : Integer;
  stun        : Integer;
  ftgAtk        : Integer;
  faintAtk        : Integer;
  upgradeEffct        : Integer;
  effect        : String;
  fireRes         : Integer;
  waterRes        : Integer;
  windRes         : Integer;
  earthRes        : Integer;

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
