using rf.calculator as calc;

service DataService {
    entity Materials as projection on calc.Material;
    entity Locations as projection on calc.Location;
}
