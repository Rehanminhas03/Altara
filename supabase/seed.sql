-- Altara Automotive — seed inventory (~12 realistic used vehicles).
-- Titles are stored WITHOUT the year (rendered as "{year} {title}").
-- No image rows are seeded: the app renders branded placeholders until real
-- photos are uploaded in the admin (getVehicleImages fallback).
-- Re-runnable: clears seeded vehicles by slug first.

delete from public.vehicles where slug in (
  'bmw-m340i-xdrive-2022','mercedes-benz-c300-amg-line-2021','audi-q5-40-tdi-s-line-2021',
  'range-rover-evoque-r-dynamic-2022','porsche-911-carrera-2020','tesla-model-3-long-range-2022',
  'volkswagen-golf-gti-2021','toyota-corolla-excel-hybrid-2022','audi-a5-sportback-s-line-2021',
  'bmw-x5-xdrive40d-m-sport-2021','mercedes-benz-e220d-amg-line-estate-2021','bmw-420i-m-sport-convertible-2021'
);

insert into public.vehicles
  (slug, title, make, model, variant, year, mileage, fuel, transmission, engine_size, power_bhp, colour, body_type, doors, seats, price, previous_price, description, features, status, featured, reg_plate, registered_at)
values
('bmw-m340i-xdrive-2022','BMW M340i xDrive','BMW','3 Series','M340i xDrive',2022,18450,'petrol','automatic',3.0,369,'Portimao Blue','Saloon',4,5,38995,40995,
 'A stunning example of BMW''s super-saloon, finished in the sought-after Portimao Blue with full black leather. This M340i xDrive pairs a 369bhp straight-six with all-wheel-drive traction for effortless, all-weather pace. Supplied with full BMW service history and a fresh MOT, it is HPI clear and ready to drive away. A genuine M-lite that flatters on both the daily commute and a spirited B-road.',
 ARRAY['Heated M Sport seats','Harman Kardon surround sound','Apple CarPlay & Android Auto','Adaptive M suspension','Live Cockpit Professional','Reversing camera'],'available',true,'72 reg','2022-09-14'),

('mercedes-benz-c300-amg-line-2021','Mercedes-Benz C300 AMG Line','Mercedes-Benz','C-Class','C300 AMG Line Premium Plus',2021,24600,'petrol','automatic',2.0,254,'Obsidian Black','Saloon',4,5,29995,null,
 'The latest-generation C-Class redefines cabin luxury, and this C300 AMG Line Premium Plus showcases it beautifully. The 254bhp turbocharged four-cylinder is smooth and quietly rapid, while the panoramic roof and Burmester sound elevate every journey. One owner from new with a full main-dealer service history. ULEZ compliant and immaculate throughout.',
 ARRAY['Panoramic sunroof','Burmester sound system','360° camera','Wireless phone charging','Ambient lighting','Keyless entry & go'],'available',false,'21 reg','2021-06-02'),

('audi-q5-40-tdi-s-line-2021','Audi Q5 40 TDI S line','Audi','Q5','40 TDI quattro S line',2021,31200,'diesel','automatic',2.0,201,'Mythos Black','SUV',5,5,34990,36490,
 'A supremely capable family SUV, this Audi Q5 40 TDI quattro combines frugal real-world economy with genuine go-anywhere ability. The S line specification adds larger alloys, sports seats and a purposeful stance. Virtual Cockpit and the crisp MMI touch display keep the cabin feeling thoroughly modern. Full service history, two keys and HPI clear.',
 ARRAY['Quattro all-wheel drive','Virtual Cockpit','Powered tailgate','Heated front seats','Matrix LED headlights','Apple CarPlay'],'available',true,'21 reg','2021-03-19'),

('range-rover-evoque-r-dynamic-2022','Range Rover Evoque R-Dynamic','Range Rover','Evoque','D200 R-Dynamic SE',2022,21750,'diesel','automatic',2.0,201,'Nolita Grey','SUV',5,5,36750,null,
 'Unmistakably Range Rover, the Evoque blends urban style with genuine off-road pedigree. This R-Dynamic SE benefits from the mild-hybrid D200 diesel for smooth, economical progress and the excellent Pivi Pro infotainment. Finished in Nolita Grey with a contrasting black roof, it presents beautifully inside and out. Balance of manufacturer warranty and full history.',
 ARRAY['Meridian sound system','Pivi Pro navigation','Heated steering wheel','ClearSight rear-view mirror','20" alloy wheels','Front & rear parking sensors'],'available',true,'22 reg','2022-04-27'),

('porsche-911-carrera-2020','Porsche 911 Carrera','Porsche','911','992 Carrera',2020,16900,'petrol','semi_auto',3.0,380,'GT Silver Metallic','Coupe',2,4,84995,null,
 'The 992-generation 911 in its purest Carrera form — 380bhp, rear-wheel drive and the sublime 8-speed PDK gearbox. Presented in timeless GT Silver over a black leather interior with the desirable Sport Chrono package. A fastidiously maintained example with full Porsche main-dealer history. Simply one of the finest all-round sports cars ever made.',
 ARRAY['Sport Chrono Package','PASM adaptive suspension','BOSE surround sound','Sports exhaust','14-way electric sports seats','LED matrix headlights'],'available',true,'70 reg','2020-11-08'),

('tesla-model-3-long-range-2022','Tesla Model 3 Long Range','Tesla','Model 3','Long Range AWD',2022,27400,'electric','automatic',null,441,'Pearl White','Saloon',4,5,27995,29995,
 'The car that brought performance EVs to the mainstream. This Long Range dual-motor Model 3 offers a real-world range of around 290 miles and effortless, silent acceleration. Enjoy free-flowing access to the Tesla Supercharger network and over-the-air updates that keep it feeling new. Full charging history, HPI clear and ready for its next owner.',
 ARRAY['Autopilot','Dual-motor all-wheel drive','15" central touchscreen','Heated seats front & rear','Glass panoramic roof','Premium connectivity'],'reserved',true,'22 reg','2022-01-30'),

('volkswagen-golf-gti-2021','Volkswagen Golf GTI','Volkswagen','Golf','GTI Mk8',2021,29900,'petrol','manual',2.0,242,'Kings Red','Hatchback',5,5,24995,null,
 'The definitive hot hatch, now in sharp Mk8 form. This Golf GTI delivers 242bhp through a slick six-speed manual — increasingly rare and all the more engaging for it. The tartan sports seats and honeycomb detailing nod to GTI heritage while the digital cockpit keeps things bang up to date. Two owners, full service history and ULEZ compliant.',
 ARRAY['Tartan sports seats','Digital Cockpit Pro','Adaptive chassis control (DCC)','LED Plus headlights','Apple CarPlay','Dual-zone climate'],'available',false,'21 reg','2021-07-11'),

('toyota-corolla-excel-hybrid-2022','Toyota Corolla Excel Hybrid','Toyota','Corolla','1.8 VVT-i Excel',2022,22100,'hybrid','automatic',1.8,120,'Silver Metallic','Hatchback',5,5,19995,null,
 'Toyota''s self-charging hybrid hatch is the sensible choice that also happens to be genuinely refined. Returning around 60mpg in everyday use, this Excel-spec Corolla wants for very little, with heated seats, adaptive cruise and a reversing camera all included. Backed by the remainder of Toyota''s market-leading warranty when serviced with Toyota. Fully inspected and HPI clear.',
 ARRAY['Self-charging hybrid','Adaptive cruise control','Heated front seats','Reversing camera','LED headlights','Lane-keep assist'],'available',false,'22 reg','2022-05-22'),

('audi-a5-sportback-s-line-2021','Audi A5 Sportback S line','Audi','A5','40 TFSI S line',2021,33500,'petrol','automatic',2.0,201,'Daytona Grey','Coupe',5,5,27495,null,
 'The A5 Sportback marries coupe looks with the everyday practicality of a five-door. This 40 TFSI S line pairs a punchy 201bhp petrol with Audi''s smooth S tronic gearbox and sits on handsome 19" alloys. Daytona Grey with black leather is a classic combination that always presents well. Full history, two keys and recently serviced.',
 ARRAY['S line sports seats','Virtual Cockpit','19" alloy wheels','Smartphone interface','LED headlights','Rear parking camera'],'sold',false,'21 reg','2021-02-14'),

('bmw-x5-xdrive40d-m-sport-2021','BMW X5 xDrive40d M Sport','BMW','X5','xDrive40d M Sport',2021,38700,'diesel','automatic',3.0,335,'Carbon Black','SUV',5,7,49995,52995,
 'A commanding seven-seat SUV that blends luxury, pace and genuine towing muscle. The silky 335bhp straight-six diesel is perfectly matched to the eight-speed auto, delivering effortless mile-munching ability. Specified with the third row, air suspension and a panoramic roof, this X5 wants for nothing. Full BMW service history and HPI clear.',
 ARRAY['Third-row seating (7 seats)','Air suspension','Panoramic sky lounge roof','Laserlight headlights','Harman Kardon audio','Heated & ventilated seats'],'available',false,'21 reg','2021-09-03'),

('mercedes-benz-e220d-amg-line-estate-2021','Mercedes-Benz E220d AMG Line Estate','Mercedes-Benz','E-Class','E220d AMG Line Estate',2021,41200,'diesel','automatic',2.0,194,'Selenite Grey','Estate',5,5,29995,null,
 'The consummate long-distance estate — vast, comfortable and beautifully finished. This E220d returns excellent motorway economy while the AMG Line trim keeps things looking sharp on 19" alloys. A huge, flexible boot makes it the ideal family or business load-lugger. Full main-dealer history, two keys and ULEZ compliant.',
 ARRAY['MBUX widescreen cockpit','Powered tailgate','AMG Line body styling','Heated front seats','LED High Performance lighting','Reversing camera'],'available',false,'21 reg','2021-10-16'),

('bmw-420i-m-sport-convertible-2021','BMW 420i M Sport Convertible','BMW','4 Series','420i M Sport Convertible',2021,19800,'petrol','automatic',2.0,181,'Arctic Race Blue','Convertible',2,4,33995,35495,
 'Open-top motoring with year-round usability, thanks to the 4 Series'' insulated fabric roof that folds in seconds. This 420i M Sport pairs a refined 181bhp petrol with a slick automatic for relaxed cruising. Low mileage and beautifully kept, finished in Arctic Race Blue with red leather. Full BMW history, HPI clear and ready for summer.',
 ARRAY['Electric fabric roof','M Sport package','Heated seats & neck warmers','Live Cockpit Professional','Wireless Apple CarPlay','Parking Assistant'],'available',false,'21 reg','2021-05-09');
