

 -- Do the changes
RENAME TABLE taxi_vendor TO taxi_seller;
RENAME TABLE transport_vendor TO transport_seller;
RENAME TABLE cleaner_vendor TO cleaner_seller;
RENAME TABLE windowcleaner_vendor TO windowcleaner_seller;
RENAME TABLE lawnmower_vendor TO lawnmower_seller;
RENAME TABLE snowremoval_vendor TO snowremoval_seller;
RENAME TABLE fruitpicker_vendor TO fruitpicker_seller;
RENAME TABLE programmer_vendor TO programmer_seller;

RENAME TABLE taxi_vendorTeam TO taxi_sellerTeam;
RENAME TABLE transport_vendorTeam TO transport_sellerTeam;
RENAME TABLE cleaner_vendorTeam TO cleaner_sellerTeam;
RENAME TABLE windowcleaner_vendorTeam TO windowcleaner_sellerTeam;
RENAME TABLE lawnmower_vendorTeam TO lawnmower_sellerTeam;
RENAME TABLE snowremoval_vendorTeam TO snowremoval_sellerTeam;
RENAME TABLE fruitpicker_vendorTeam TO fruitpicker_sellerTeam;
RENAME TABLE programmer_vendorTeam TO programmer_sellerTeam;

RENAME TABLE taxi_vendorTeamImage TO taxi_sellerTeamImage;
RENAME TABLE transport_vendorTeamImage TO transport_sellerTeamImage;
RENAME TABLE cleaner_vendorTeamImage TO cleaner_sellerTeamImage;
RENAME TABLE windowcleaner_vendorTeamImage TO windowcleaner_sellerTeamImage;
RENAME TABLE lawnmower_vendorTeamImage TO lawnmower_sellerTeamImage;
RENAME TABLE snowremoval_vendorTeamImage TO snowremoval_sellerTeamImage;
RENAME TABLE fruitpicker_vendorTeamImage TO fruitpicker_sellerTeamImage;
RENAME TABLE programmer_vendorTeamImage TO programmer_sellerTeamImage;

 -- Setting it back
RENAME TABLE taxi_seller TO taxi_vendor;
RENAME TABLE transport_seller TO transport_vendor;
RENAME TABLE cleaner_seller TO cleaner_vendor;
RENAME TABLE windowcleaner_seller TO windowcleaner_vendor;
RENAME TABLE lawnmower_seller TO lawnmower_vendor;
RENAME TABLE snowremoval_seller TO snowremoval_vendor;
RENAME TABLE fruitpicker_seller TO fruitpicker_vendor;
RENAME TABLE programmer_seller TO programmer_vendor;

RENAME TABLE taxi_sellerTeam TO taxi_vendorTeam;
RENAME TABLE transport_sellerTeam TO transport_vendorTeam;
RENAME TABLE cleaner_sellerTeam TO cleaner_vendorTeam;
RENAME TABLE windowcleaner_sellerTeam TO windowcleaner_vendorTeam;
RENAME TABLE lawnmower_sellerTeam TO lawnmower_vendorTeam;
RENAME TABLE snowremoval_sellerTeam TO snowremoval_vendorTeam;
RENAME TABLE fruitpicker_sellerTeam TO fruitpicker_vendorTeam;
RENAME TABLE programmer_sellerTeam TO programmer_vendorTeam;

RENAME TABLE taxi_sellerTeamImage TO taxi_vendorTeamImage;
RENAME TABLE transport_sellerTeamImage TO transport_vendorTeamImage;
RENAME TABLE cleaner_sellerTeamImage TO cleaner_vendorTeamImage;
RENAME TABLE windowcleaner_sellerTeamImage TO windowcleaner_vendorTeamImage;
RENAME TABLE lawnmower_sellerTeamImage TO lawnmower_vendorTeamImage;
RENAME TABLE snowremoval_sellerTeamImage TO snowremoval_vendorTeamImage;
RENAME TABLE fruitpicker_sellerTeamImage TO fruitpicker_vendorTeamImage;
RENAME TABLE programmer_sellerTeamImage TO programmer_vendorTeamImage;

