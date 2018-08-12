

 -- Do the changes
ALTER TABLE taxi_user 
ADD COLUMN `nComplaintGiven` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `nComplaint` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER displayName;
ALTER TABLE transport_user 
ADD COLUMN `nComplaintGiven` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `nComplaint` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER displayName;
ALTER TABLE cleaner_user 
ADD COLUMN `nComplaintGiven` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `nComplaint` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER displayName;
ALTER TABLE windowcleaner_user 
ADD COLUMN `nComplaintGiven` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `nComplaint` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER displayName;
ALTER TABLE lawnmower_user 
ADD COLUMN `nComplaintGiven` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `nComplaint` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER displayName;
ALTER TABLE snowremoval_user 
ADD COLUMN `nComplaintGiven` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `nComplaint` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER displayName;
ALTER TABLE fruitpicker_user 
ADD COLUMN `nComplaintGiven` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `nComplaint` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER displayName;
ALTER TABLE programmer_user 
ADD COLUMN `nComplaintGiven` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `nComplaint` int(4) NOT NULL DEFAULT '0' AFTER displayName,
ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER displayName;

ALTER TABLE taxi_vendor 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE transport_vendor 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE cleaner_vendor 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE windowcleaner_vendor 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lawnmower_vendor 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE snowremoval_vendor 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE fruitpicker_vendor 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE programmer_vendor 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE taxi_customer 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE transport_customer 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE cleaner_customer 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE windowcleaner_customer 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lawnmower_customer 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE snowremoval_customer 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE fruitpicker_customer 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE programmer_customer 
 DROP COLUMN donatedAmount,
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tPos timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastWriteOfTA timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 MODIFY COLUMN tLastPriceChange timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE taxi_complaint 
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHANGE modified `tCommentModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 ADD COLUMN `tAnswerModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER tCommentModified;
ALTER TABLE transport_complaint 
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHANGE modified `tCommentModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 ADD COLUMN `tAnswerModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER tCommentModified;
ALTER TABLE cleaner_complaint 
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHANGE modified `tCommentModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 ADD COLUMN `tAnswerModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER tCommentModified;
ALTER TABLE windowcleaner_complaint 
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHANGE modified `tCommentModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 ADD COLUMN `tAnswerModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER tCommentModified;
ALTER TABLE lawnmower_complaint 
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHANGE modified `tCommentModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 ADD COLUMN `tAnswerModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER tCommentModified;
ALTER TABLE snowremoval_complaint 
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHANGE modified `tCommentModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 ADD COLUMN `tAnswerModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER tCommentModified;
ALTER TABLE fruitpicker_complaint 
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHANGE modified `tCommentModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 ADD COLUMN `tAnswerModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER tCommentModified;
ALTER TABLE programmer_complaint
 MODIFY COLUMN tCreated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHANGE modified `tCommentModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 ADD COLUMN `tAnswerModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER tCommentModified;
 
 -- Setting it back
ALTER TABLE taxi_user 
  DROP COLUMN nComplaintGiven,
  DROP COLUMN nComplaint,
  DROP COLUMN donatedAmount;
ALTER TABLE transport_user 
  DROP COLUMN nComplaintGiven,
  DROP COLUMN nComplaint,
  DROP COLUMN donatedAmount;
ALTER TABLE cleaner_user 
  DROP COLUMN nComplaintGiven,
  DROP COLUMN nComplaint,
  DROP COLUMN donatedAmount;
ALTER TABLE windowcleaner_user 
  DROP COLUMN nComplaintGiven,
  DROP COLUMN nComplaint,
  DROP COLUMN donatedAmount;
ALTER TABLE lawnmower_user 
  DROP COLUMN nComplaintGiven,
  DROP COLUMN nComplaint,
  DROP COLUMN donatedAmount;
ALTER TABLE snowremoval_user 
  DROP COLUMN nComplaintGiven,
  DROP COLUMN nComplaint,
  DROP COLUMN donatedAmount;
ALTER TABLE fruitpicker_user 
  DROP COLUMN nComplaintGiven,
  DROP COLUMN nComplaint,
  DROP COLUMN donatedAmount;
ALTER TABLE programmer_user 
  DROP COLUMN nComplaintGiven,
  DROP COLUMN nComplaint,
  DROP COLUMN donatedAmount;

ALTER TABLE taxi_vendor ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE transport_vendor ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE cleaner_vendor ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE windowcleaner_vendor ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE lawnmower_vendor ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE snowremoval_vendor ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE fruitpicker_vendor ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE programmer_vendor ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE taxi_customer ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE transport_customer ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE cleaner_customer ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE windowcleaner_customer ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE lawnmower_customer ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE snowremoval_customer ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE fruitpicker_customer ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;
ALTER TABLE programmer_customer ADD COLUMN `donatedAmount` double NOT NULL DEFAULT '0' AFTER idUser;


ALTER TABLE taxi_complaint 
 DROP COLUMN tAnswerModified,
 CHANGE tCommentModified modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE transport_complaint 
 DROP COLUMN tAnswerModified,
 CHANGE tCommentModified modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE cleaner_complaint 
 DROP COLUMN tAnswerModified,
 CHANGE tCommentModified modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE windowcleaner_complaint 
 DROP COLUMN tAnswerModified,
 CHANGE tCommentModified modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lawnmower_complaint 
 DROP COLUMN tAnswerModified,
 CHANGE tCommentModified modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE snowremoval_complaint 
 DROP COLUMN tAnswerModified,
 CHANGE tCommentModified modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE fruitpicker_complaint 
 DROP COLUMN tAnswerModified,
 CHANGE tCommentModified modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE programmer_complaint 
 DROP COLUMN tAnswerModified,
 CHANGE tCommentModified modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
 


