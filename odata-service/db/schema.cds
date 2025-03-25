namespace rf.calculator;

entity Material {
  key Id        : Integer;
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
  key Id       : Integer;
  Name        : String;
}

entity Monster {
  key Id       : Integer;
  Name        : String;
  Locations   : Association to many Location;
}

entity Other {
  key Id       : Integer;
  Name        : String;
  Locations   : Association to many Location;
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
