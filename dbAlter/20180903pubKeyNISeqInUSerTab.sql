

 -- Do the changes
ALTER TABLE taxi_user 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER donatedAmount,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER donatedAmount;
ALTER TABLE transport_user 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER donatedAmount,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER donatedAmount;
ALTER TABLE cleaner_user 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER donatedAmount,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER donatedAmount;
ALTER TABLE windowcleaner_user 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER donatedAmount,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER donatedAmount;
ALTER TABLE lawnmower_user 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER donatedAmount,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER donatedAmount;
ALTER TABLE snowremoval_user 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER donatedAmount,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER donatedAmount;
ALTER TABLE fruitpicker_user 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER donatedAmount,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER donatedAmount;
ALTER TABLE programmer_user 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER donatedAmount,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER donatedAmount;

ALTER TABLE taxi_seller 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE transport_seller 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE cleaner_seller 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE windowcleaner_seller 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE lawnmower_seller 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE snowremoval_seller 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE fruitpicker_seller 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE programmer_seller 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE taxi_customer 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE transport_customer 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE cleaner_customer 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE windowcleaner_customer 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE lawnmower_customer 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE snowremoval_customer 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE fruitpicker_customer 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE programmer_customer 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;

 -- Setting it back
ALTER TABLE taxi_user 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE transport_user 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE cleaner_user 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE windowcleaner_user 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE lawnmower_user 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE snowremoval_user 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE fruitpicker_user 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;
ALTER TABLE programmer_user 
 DROP COLUMN iSeq,
 DROP COLUMN pubKey;

ALTER TABLE taxi_seller 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE transport_seller
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE cleaner_seller 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE windowcleaner_seller 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE lawnmower_seller 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE snowremoval_seller 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE fruitpicker_seller 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE programmer_seller 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE taxi_customer 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE transport_customer 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE cleaner_customer 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE windowcleaner_customer 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE lawnmower_customer 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE snowremoval_customer 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE fruitpicker_customer 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;
ALTER TABLE programmer_customer 
ADD COLUMN `iSeq` int(4) NOT NULL DEFAULT 0 AFTER coordinatePrecisionM,
ADD COLUMN `pubKey` VARCHAR(256) NOT NULL DEFAULT '' AFTER coordinatePrecisionM;



