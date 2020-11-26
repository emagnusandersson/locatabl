

ALTER TABLE taxi_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE transport_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE cleaner_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE windowcleaner_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE lawnmowing_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE snowremoval_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE fruitpicker_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE programmer_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;


ALTER TABLE taxi_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE transport_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE cleaner_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE windowcleaner_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE lawnmowing_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE snowremoval_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE fruitpicker_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;
ALTER TABLE programmer_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 10000;





-- Set Back

ALTER TABLE taxi_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE transport_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE cleaner_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE windowcleaner_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE lawnmowing_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE snowremoval_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE fruitpicker_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE programmer_seller MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;


ALTER TABLE taxi_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE transport_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE cleaner_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE windowcleaner_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE lawnmowing_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE snowremoval_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE fruitpicker_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;
ALTER TABLE programmer_buyer MODIFY coordinatePrecisionM int(4) unsigned NOT NULL DEFAULT 1000;




