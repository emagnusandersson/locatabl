

 -- Do the changes
ALTER TABLE taxi_user 
ADD COLUMN `nComplaintCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaint,
ADD COLUMN `nComplaintGivenCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaintGiven;
ALTER TABLE transport_user 
ADD COLUMN `nComplaintCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaint,
ADD COLUMN `nComplaintGivenCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaintGiven;
ALTER TABLE cleaner_user 
ADD COLUMN `nComplaintCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaint,
ADD COLUMN `nComplaintGivenCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaintGiven;
ALTER TABLE windowcleaner_user 
ADD COLUMN `nComplaintCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaint,
ADD COLUMN `nComplaintGivenCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaintGiven;
ALTER TABLE lawnmower_user 
ADD COLUMN `nComplaintCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaint,
ADD COLUMN `nComplaintGivenCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaintGiven;
ALTER TABLE snowremoval_user 
ADD COLUMN `nComplaintCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaint,
ADD COLUMN `nComplaintGivenCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaintGiven;
ALTER TABLE fruitpicker_user 
ADD COLUMN `nComplaintCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaint,
ADD COLUMN `nComplaintGivenCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaintGiven;
ALTER TABLE programmer_user 
ADD COLUMN `nComplaintCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaint,
ADD COLUMN `nComplaintGivenCum` int(4) NOT NULL DEFAULT '0' AFTER nComplaintGiven;


UPDATE taxi_user SET nComplaintCum=nComplaint, nComplaintGivenCum=nComplaintGiven;
UPDATE transport_user SET nComplaintCum=nComplaint, nComplaintGivenCum=nComplaintGiven;
UPDATE cleaner_user SET nComplaintCum=nComplaint, nComplaintGivenCum=nComplaintGiven;
UPDATE windowcleaner_user SET nComplaintCum=nComplaint, nComplaintGivenCum=nComplaintGiven;
UPDATE lawnmower_user SET nComplaintCum=nComplaint, nComplaintGivenCum=nComplaintGiven;
UPDATE snowremoval_user SET nComplaintCum=nComplaint, nComplaintGivenCum=nComplaintGiven;
UPDATE fruitpicker_user SET nComplaintCum=nComplaint, nComplaintGivenCum=nComplaintGiven;
UPDATE programmer_user SET nComplaintCum=nComplaint, nComplaintGivenCum=nComplaintGiven;


 -- Setting it back
ALTER TABLE taxi_user 
  DROP COLUMN nComplaintCum,
  DROP COLUMN nComplaintGivenCum;
ALTER TABLE transport_user 
  DROP COLUMN nComplaintCum,
  DROP COLUMN nComplaintGivenCum;
ALTER TABLE cleaner_user 
  DROP COLUMN nComplaintCum,
  DROP COLUMN nComplaintGivenCum;
ALTER TABLE windowcleaner_user 
  DROP COLUMN nComplaintCum,
  DROP COLUMN nComplaintGivenCum;
ALTER TABLE lawnmower_user 
  DROP COLUMN nComplaintCum,
  DROP COLUMN nComplaintGivenCum;
ALTER TABLE snowremoval_user 
  DROP COLUMN nComplaintCum,
  DROP COLUMN nComplaintGivenCum;
ALTER TABLE fruitpicker_user 
  DROP COLUMN nComplaintCum,
  DROP COLUMN nComplaintGivenCum;
ALTER TABLE programmer_user 
  DROP COLUMN nComplaintCum,
  DROP COLUMN nComplaintGivenCum;


