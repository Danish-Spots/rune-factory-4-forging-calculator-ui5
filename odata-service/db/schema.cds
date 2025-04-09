using { managed } from '@sap/cds/common';

namespace RF_Entity;



type Stat {
  Stat_Key   : String;
  Stat_Value : String;
  Stat_HTML  : String;
}
type MaterialType {
  ID         : Integer;
  Name       : String;
  Rarity     : Integer;
  Category   : String;
  Level      : Integer;
  Stats      : array of Stat;
}
entity Material {
  key ID        : Integer;
  Name         : String;
  Rarity       : Integer;
  Category     : String;
  Difficulty   : Integer;
  virtual Stats   : array of  Stat;
  Drops       : Association to many Drop on Drops.Material = $self;

  matk      : Integer;
  def       : Integer;
  mdef      : Integer;
  str       : Integer;
  vit       : Integer;
  atk       : Integer;
  drainAtk      : Integer;
  int       : Integer;
  parAtk      : Integer;
  crit      : Integer;
  drainRes      : Integer;
  psnAtk      : Integer;
  sickAtk       : Integer;
  slpAtk      : Integer;
  sealAtk       : Integer;
  psnRes      : Integer;
  sealRes       : Integer;
  parRes      : Integer;
  slpRes      : Integer;
  ftgRes      : Integer;
  sickRes       : Integer;
  diz       : Integer;
  knockAtk      : Integer;
  faintRes      : Integer;
  dizRes      : Integer;
  critRes       : Integer;
  knockRes      : Integer;
  knock       : Integer;
  stun      : Integer;
  ftgAtk      : Integer;
  faintAtk      : Integer;
  upgradeEffct      : Integer;
  effect      : String;
  fireRes       : Integer;
  waterRes      : Integer;
  windRes       : Integer;
  earthRes      : Integer;
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

entity Weapon {
  key ID      : Integer;
  Name        : String;
  Type        : String;
  Level       : Integer;
  Element     : String;
  atk         : Integer;
  diz         : Integer;
  matk        : Integer;
  def         : Integer;
  crit        : Integer;
  int         : Integer;
  vit         : Integer;
  parAtk      : Integer;
  psnAtk      : Integer;
  knock       : Integer;
  stun        : Integer;
  drain       : Integer;
  virtual Stats   : array of  Stat;
  Material_1  : String;
  Material_2  : String;
  Material_3  : String;
  Material_4  : String;
  Material_5  : String;
  virtual Materials   : array of {
    Header_Name : String;
    Select_Query : String; // Either a materialId or category
    Field_Name : String;
    Material : MaterialType;
  };
}
