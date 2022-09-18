taxi_complaint
taxi_customer
taxi_customerTeam
taxi_customerTeamImage
taxi_hist
taxi_setting
taxi_user
taxi_userImage
taxi_vendor
taxi_vendorTeam
taxi_vendorTeamImage


-- new
mysqldump mmm -u root -p --skip-comments --no-data --hex-blob         taxi_user transport_user cleaner_user windowcleaner_user fruitpicker_user lawnmower_user snowremoval_user programmer_user           taxi_userImage transport_userImage cleaner_userImage windowcleaner_userImage fruitpicker_userImage lawnmower_userImage snowremoval_userImage programmer_userImage           taxi_customer transport_customer cleaner_customer windowcleaner_customer fruitpicker_customer lawnmower_customer snowremoval_customer programmer_customer          taxi_customerTeam transport_customerTeam cleaner_customerTeam windowcleaner_customerTeam fruitpicker_customerTeam lawnmower_customerTeam snowremoval_customerTeam programmer_customerTeam          taxi_customerTeamImage transport_customerTeamImage cleaner_customerTeamImage windowcleaner_customerTeamImage fruitpicker_customerTeamImage lawnmower_customerTeamImage snowremoval_customerTeamImage programmer_customerTeamImage                       taxi_vendor transport_vendor cleaner_vendor windowcleaner_vendor fruitpicker_vendor lawnmower_vendor snowremoval_vendor programmer_vendor          taxi_vendorTeam transport_vendorTeam cleaner_vendorTeam windowcleaner_vendorTeam fruitpicker_vendorTeam lawnmower_vendorTeam snowremoval_vendorTeam programmer_vendorTeam          taxi_vendorTeamImage transport_vendorTeamImage cleaner_vendorTeamImage windowcleaner_vendorTeamImage fruitpicker_vendorTeamImage lawnmower_vendorTeamImage snowremoval_vendorTeamImage programmer_vendorTeamImage            taxi_setting transport_setting cleaner_setting windowcleaner_setting fruitpicker_setting lawnmower_setting snowremoval_setting programmer_setting          taxi_complaint transport_complaint cleaner_complaint windowcleaner_complaint fruitpicker_complaint lawnmower_complaint snowremoval_complaint programmer_complaint            taxi_admin transport_admin cleaner_admin windowcleaner_admin fruitpicker_admin lawnmower_admin snowremoval_admin programmer_admin          >locatabl.sql


 -- old
mysqldump mmm -u root -p  --hex-blob  --no-data  --skip-comments     taxi_user transport_user cleaner_user windowcleaner_user fruitpicker_user lawnmower_user snowremoval_user programmer_user          taxi_vendor transport_vendor cleaner_vendor windowcleaner_vendor fruitpicker_vendor lawnmower_vendor snowremoval_vendor programmer_vendor          taxi_vendorImage transport_vendorImage cleaner_vendorImage windowcleaner_vendorImage fruitpicker_vendorImage lawnmower_vendorImage snowremoval_vendorImage programmer_vendorImage          taxi_team transport_team cleaner_team windowcleaner_team fruitpicker_team lawnmower_team snowremoval_team programmer_team          taxi_teamImage transport_teamImage cleaner_teamImage windowcleaner_teamImage fruitpicker_teamImage lawnmower_teamImage snowremoval_teamImage programmer_teamImage          taxi_setting transport_setting cleaner_setting windowcleaner_setting fruitpicker_setting lawnmower_setting snowremoval_setting programmer_setting          taxi_complaint transport_complaint cleaner_complaint windowcleaner_complaint fruitpicker_complaint lawnmower_complaint snowremoval_complaint programmer_complaint          taxi_rebateCode transport_rebateCode cleaner_rebateCode windowcleaner_rebateCode fruitpicker_rebateCode lawnmower_rebateCode snowremoval_rebateCode programmer_rebateCode          taxi_pubKey transport_pubKey cleaner_pubKey windowcleaner_pubKey fruitpicker_pubKey lawnmower_pubKey snowremoval_pubKey programmer_pubKey          taxi_payment transport_payment cleaner_payment windowcleaner_payment fruitpicker_payment lawnmower_payment snowremoval_payment programmer_payment          taxi_marketer transport_marketer cleaner_marketer windowcleaner_marketer fruitpicker_marketer lawnmower_marketer snowremoval_marketer programmer_marketer          taxi_admin transport_admin cleaner_admin windowcleaner_admin fruitpicker_admin lawnmower_admin snowremoval_admin programmer_admin          >locatabl.sql

--no-data
--no-create-info

-- Update taxi_user
ALTER TABLE taxi_user 
 CHANGE idFb idFB varchar(128) DEFAULT NULL,
 CHANGE password hashPW varchar(40) NOT NULL DEFAULT '',
 MODIFY COLUMN email varchar(65) NOT NULL DEFAULT '',
 ADD COLUMN displayName varchar(32) NOT NULL DEFAULT '' AFTER hashPW,
 ADD COLUMN boImgOwn tinyint(1) NOT NULL DEFAULT '0' AFTER hashPW,
 ADD COLUMN imTag int(4) NOT NULL DEFAULT '0' AFTER hashPW

UPDATE taxi_user AS uN
  LEFT JOIN taxi_vendor AS vN uN.idUser = vN.idUser
SET uN.imTag = vN.imTag, uN.boImgOwn = vN.boImgOwn, uN.displayName = vN.displayName


ALTER TABLE taxi_vendor
 ADD COLUMN experience int(4) NOT NULL DEFAULT '0' AFTER wheelChairPlaces,
 ADD COLUMN iSeq int(4) NOT NULL DEFAULT '0' AFTER wheelChairPlaces,
 ADD COLUMN pubKey varchar(256) NOT NULL DEFAULT '' AFTER wheelChairPlaces,
 MODIFY COLUMN coordinatePrecisionM int(8) NOT NULL DEFAULT '1000',
 CHANGE lastPriceChange tLastPriceChange timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 MODIFY COLUMN hideTimer int(8) NOT NULL DEFAULT '1800',
 CHANGE timeAccumulated tAccumulated timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 CHANGE posTime tPos timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 CHANGE created tCreated timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
 ADD COLUMN boShow tinyint(4) NOT NULL DEFAULT '0' AFTER tCreated,
 CHANGE distUnit strUnitDist enum('km','mile') NOT NULL DEFAULT 'km',
 CHANGE wheelChairPlaces nWheelChairPlaces tinyint(4) NOT NULL DEFAULT '0',
 CHANGE childSeat nChildSeat tinyint(4) NOT NULL DEFAULT '0',
 CHANGE extraSeat nExtraSeat tinyint(4) NOT NULL DEFAULT '0'



RENAME TABLE
    taxi_user TO taxi_userOld,
    transport_user TO transport_userOld,
    cleaner_user TO cleaner_userOld,
    windowcleaner_user TO windowcleaner_userOld,
    lawnmower_user TO lawnmower_userOld,
    snowremoval_user TO snowremoval_userOld,
    fruitpicker_user TO fruitpicker_userOld,
    programmer_user TO programmer_userOld,
    taxi_vendor TO taxi_vendorOld,
    transport_vendor TO transport_vendorOld,
    cleaner_vendor TO cleaner_vendorOld,
    windowcleaner_vendor TO windowcleaner_vendorOld,
    lawnmower_vendor TO lawnmower_vendorOld,
    snowremoval_vendor TO snowremoval_vendorOld,
    fruitpicker_vendor TO fruitpicker_vendorOld,
    programmer_vendor TO programmer_vendorOld;

INSERT INTO taxi_user (idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW, imTag, boImgOwn, displayName)
   SELECT vO.idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password, imTag, boImgOwn, displayName FROM taxi_userOld uO LEFT JOIN taxi_vendorOld vO ON uO.idUser=vO.idUser;
INSERT INTO transport_user (idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW, imTag, boImgOwn, displayName)
   SELECT vO.idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password, imTag, boImgOwn, displayName FROM transport_userOld uO LEFT JOIN transport_vendorOld vO ON uO.idUser=vO.idUser;
INSERT INTO cleaner_user (idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW, imTag, boImgOwn, displayName)
   SELECT vO.idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password, imTag, boImgOwn, displayName FROM cleaner_userOld uO LEFT JOIN cleaner_vendorOld vO ON uO.idUser=vO.idUser;
INSERT INTO windowcleaner_user (idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW, imTag, boImgOwn, displayName)
   SELECT vO.idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password, imTag, boImgOwn, displayName FROM windowcleaner_userOld uO LEFT JOIN windowcleaner_vendorOld vO ON uO.idUser=vO.idUser;
INSERT INTO lawnmower_user (idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW, imTag, boImgOwn, displayName)
   SELECT vO.idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password, imTag, boImgOwn, displayName FROM lawnmower_userOld uO LEFT JOIN lawnmower_vendorOld vO ON uO.idUser=vO.idUser;
INSERT INTO snowremoval_user (idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW, imTag, boImgOwn, displayName)
   SELECT vO.idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password, imTag, boImgOwn, displayName FROM snowremoval_userOld uO LEFT JOIN snowremoval_vendorOld vO ON uO.idUser=vO.idUser;
INSERT INTO fruitpicker_user (idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW, imTag, boImgOwn, displayName)
   SELECT vO.idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password, imTag, boImgOwn, displayName FROM fruitpicker_userOld uO LEFT JOIN fruitpicker_vendorOld vO ON uO.idUser=vO.idUser;
INSERT INTO programmer_user (idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW, imTag, boImgOwn, displayName)
   SELECT vO.idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password, imTag, boImgOwn, displayName FROM programmer_userOld uO LEFT JOIN programmer_vendorOld vO ON uO.idUser=vO.idUser;
   

INSERT INTO taxi_vendor (experience, iSeq, pubKey, coordinatePrecisionM, idTeamWanted, idTeam, displayEmail, y, x, tLastPriceChange, currency, homeTown, link, tel, hideTimer, tAccumulated, tLastWriteOfTA, histActive, tPos, tCreated, boShow, donatedAmount, idUser, vehicleType, pricePerHour, pricePerDist, strUnitDist, priceStart, standingByMethod, shiftEnd, nWheelChairPlaces, nChildSeat, nPassengers, nExtraSeat, idDriverGovernment, brand)
   SELECT 0, 0, '', coordinatePrecisionM, idTeamWanted, idTeam, displayEmail, y, x, lastPriceChange, currency, homeTown, link, tel, hideTimer, timeAccumulated, tLastWriteOfTA, histActive, posTime, created, boShow, donatedAmount, idUser, vehicleType, pricePerHour, pricePerDist, distUnit, priceStart, standingByMethod, shiftEnd, wheelChairPlaces, childSeat, nPassengers, extraSeat, idDriverGovernment, brand FROM taxi_vendorOld;

INSERT INTO transport_vendor (idUser, donatedAmount, boShow, tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, tel, link, homeTown, currency, tLastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, pubKey, iSeq, experience, vehicleType, priceStart, strUnitDist, pricePerDist, pricePerHour, standingByMethod, shiftEnd, payload, generalCargo, tailLift, loaderCrane, tipper, loadableFromTheSide, iso20, iso40, tiltBed, sideLift, rollerContainer, otherContainer, brand)
   SELECT idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, tel, link, homeTown, currency, lastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, '', 0, 0, vehicleType, priceStart, distUnit, pricePerDist, pricePerHour, standingByMethod, shiftEnd, payload, generalCargo, tailLift, loaderCrane, tipper, loadableFromTheSide, iso20, iso40, tiltBed, sideLift, rollerContainer, otherContainer, brand FROM transport_vendorOld;

INSERT INTO cleaner_vendor (idUser, donatedAmount, boShow, tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, tel, link, homeTown, currency, tLastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, pubKey, iSeq, experience, vehicleType, priceStart, strUnitDist, pricePerDist, pricePerHour, shiftEnd)
   SELECT idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, tel, link, homeTown, currency, lastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, '', 0, 0, vehicleType, priceStart, distUnit, pricePerDist, pricePerHour, shiftEnd FROM cleaner_vendorOld;

INSERT INTO windowcleaner_vendor (idUser, donatedAmount, boShow, tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, tel, link, homeTown, currency, tLastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, pubKey, iSeq, experience, vehicleType, priceStart, strUnitDist, pricePerDist, pricePerHour, ladder, skyLift)
   SELECT idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, tel, link, homeTown, currency, lastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, '', 0, 0, vehicleType, priceStart, distUnit, pricePerDist, pricePerHour, boLadder, boSkyLift FROM windowcleaner_vendorOld;

INSERT INTO lawnmower_vendor (idUser, donatedAmount, boShow, tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, tel, link, homeTown, currency, tLastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, pubKey, iSeq, experience, vehicleType, priceStart, strUnitDist, pricePerDist, pricePerHour, cuttingWidth, pushMower, ridingMower, edger)
   SELECT idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, tel, link, homeTown, currency, lastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, '', 0, 0, vehicleType, priceStart, distUnit, pricePerDist, pricePerHour, cuttingWidth, pushMower, ridingMower, edger FROM lawnmower_vendorOld;

INSERT INTO snowremoval_vendor (idUser, donatedAmount, boShow, tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, tel, link, homeTown, currency, tLastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, pubKey, iSeq, experience, vehicleType, priceStart, strUnitDist, pricePerDist, pricePerHour, shovel, snowblower, plow)
   SELECT idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, tel, link, homeTown, currency, lastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, '', 0, 0, vehicleType, priceStart, distUnit, pricePerDist, pricePerHour, shovel, snowblower, plow FROM snowremoval_vendorOld;

INSERT INTO fruitpicker_vendor (idUser, donatedAmount, boShow, tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, tel, link, homeTown, currency, tLastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, pubKey, iSeq, experience, vehicleType, priceStart, strUnitDist, pricePerDist, pricePerHour)
   SELECT idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, tel, link, homeTown, currency, lastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, '', 0, 0, vehicleType, 0, 'km', 0, pricePerHour FROM fruitpicker_vendorOld;

INSERT INTO programmer_vendor (idUser, donatedAmount, boShow, tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, tel, link, homeTown, currency, tLastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, pubKey, iSeq, pricePerHour, c, java, php, javascript, cpp, python, shell, ruby, objectiveC, cSharp, assembly, `sql`, perl, asp, d, vb, delphi, scala, actionScript, coldFusion, lua, ada, pascal, haskell, scheme, cobol, lisp, clojure, erlang, fortran, otherLang)
   SELECT idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, tel, link, homeTown, currency, lastPriceChange, x, y, displayEmail, idTeam, idTeamWanted, coordinatePrecisionM, '', 0, pricePerHour, c, java, php, javascript, cpp, python, shell, ruby, objectiveC, cSharp, assembly, `sql`, perl, asp, d, vb, delphi, scala, actionScript, coldFusion, lua, ada, pascal, haskell, scheme, cobol, lisp, clojure, erlang, fortran, otherLang FROM programmer_vendorOld;



----------------------------------------------------------------------
-- Set back
----------------------------------------------------------------------



RENAME TABLE
    taxi_user TO taxi_userTmp,
    transport_user TO transport_userTmp,
    cleaner_user TO cleaner_userTmp,
    windowcleaner_user TO windowcleaner_userTmp,
    lawnmower_user TO lawnmower_userTmp,
    snowremoval_user TO snowremoval_userTmp,
    fruitpicker_user TO fruitpicker_userTmp,
    programmer_user TO programmer_userTmp,
    taxi_vendor TO taxi_vendorTmp,
    transport_vendor TO transport_vendorTmp,
    cleaner_vendor TO cleaner_vendorTmp,
    windowcleaner_vendor TO windowcleaner_vendorTmp,
    lawnmower_vendor TO lawnmower_vendorTmp,
    snowremoval_vendor TO snowremoval_vendorTmp,
    fruitpicker_vendor TO fruitpicker_vendorTmp,
    programmer_vendor TO programmer_vendorTmp;
    

INSERT INTO taxi_user (idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password)
   SELECT idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW FROM taxi_userTmp;
INSERT INTO transport_user (idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password)
   SELECT idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW FROM transport_userTmp;
INSERT INTO cleaner_user (idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password)
   SELECT idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW FROM cleaner_userTmp;
INSERT INTO windowcleaner_user (idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password)
   SELECT idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW FROM windowcleaner_userTmp;
INSERT INTO lawnmower_user (idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password)
   SELECT idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW FROM lawnmower_userTmp;
INSERT INTO snowremoval_user (idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password)
   SELECT idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW FROM snowremoval_userTmp;
INSERT INTO fruitpicker_user (idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password)
   SELECT idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW FROM fruitpicker_userTmp;
INSERT INTO programmer_user (idUser, tCreated, idFb, idIdPlace, idOpenId, email, nameIP, image, password)
   SELECT idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW FROM programmer_userTmp;


INSERT INTO taxi_vendor (idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, terminationDate, displayName, tel, link, homeTown, standingByMethod, currency, lastPriceChange, x, y, nMonthsStartOffer, imTag, displayEmail, idTeam, idTeamWanted, boImgOwn, coordinatePrecisionM, vehicleType, priceStart, distUnit, pricePerDist, pricePerHour, shiftEnd, brand, idDriverGovernment, nPassengers, extraSeat, childSeat, wheelChairPlaces)
   SELECT u.idUser, donatedAmount, boShow, v.tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, FROM_UNIXTIME(POW(2,31)-1), u.displayName, tel, link, homeTown, standingByMethod, currency, tLastPriceChange, x, y, 0, u.imTag, displayEmail, idTeam, idTeamWanted, u.boImgOwn, coordinatePrecisionM, vehicleType, priceStart, strUnitDist, pricePerDist, pricePerHour, shiftEnd, brand, idDriverGovernment, nPassengers, nExtraSeat, nChildSeat, nWheelChairPlaces FROM taxi_vendorTmp v JOIN taxi_userTmp u ON v.idUser=u.idUser;

INSERT INTO transport_vendor (idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, terminationDate, displayName, tel, link, homeTown, standingByMethod, currency, lastPriceChange, x, y, nMonthsStartOffer, imTag, displayEmail, idTeam, idTeamWanted, boImgOwn, coordinatePrecisionM, vehicleType, priceStart, distUnit, pricePerDist, pricePerHour, shiftEnd, brand, payload, generalCargo, tailLift, loaderCrane, tipper, loadableFromTheSide, iso20, iso40, tiltBed, sideLift, rollerContainer, otherContainer)
   SELECT u.idUser, donatedAmount, boShow, v.tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, FROM_UNIXTIME(POW(2,31)-1), u.displayName, tel, link, homeTown, standingByMethod, currency, tLastPriceChange, x, y, 0, u.imTag, displayEmail, idTeam, idTeamWanted, u.boImgOwn, coordinatePrecisionM, vehicleType, priceStart, strUnitDist, pricePerDist, pricePerHour, shiftEnd, brand, payload, generalCargo, tailLift, loaderCrane, tipper, loadableFromTheSide, iso20, iso40, tiltBed, sideLift, rollerContainer, otherContainer FROM transport_vendorTmp v JOIN transport_userTmp u ON v.idUser=u.idUser;

INSERT INTO cleaner_vendor (idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, terminationDate, displayName, tel, link, homeTown, currency, lastPriceChange, x, y, nMonthsStartOffer, imTag, displayEmail, idTeam, idTeamWanted, boImgOwn, coordinatePrecisionM, vehicleType, priceStart, distUnit, pricePerDist, pricePerHour, shiftEnd, boHome, boOffice, boIndustrial, boGotEquipment)
   SELECT u.idUser, donatedAmount, boShow, v.tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, FROM_UNIXTIME(POW(2,31)-1), u.displayName, tel, link, homeTown, currency, tLastPriceChange, x, y, 0, u.imTag, displayEmail, idTeam, idTeamWanted, u.boImgOwn, coordinatePrecisionM, vehicleType, priceStart, strUnitDist, pricePerDist, pricePerHour, shiftEnd, 0, 0, 0, 0 FROM cleaner_vendorTmp v JOIN cleaner_userTmp u ON v.idUser=u.idUser;

INSERT INTO windowcleaner_vendor (idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, terminationDate, displayName, tel, link, homeTown, currency, lastPriceChange, x, y, nMonthsStartOffer, imTag, displayEmail, idTeam, idTeamWanted, boImgOwn, coordinatePrecisionM, vehicleType, priceStart, distUnit, pricePerDist, pricePerHour, boLadder, boSkyLift)
   SELECT u.idUser, donatedAmount, boShow, v.tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, FROM_UNIXTIME(POW(2,31)-1), u.displayName, tel, link, homeTown, currency, tLastPriceChange, x, y, 0, u.imTag, displayEmail, idTeam, idTeamWanted, u.boImgOwn, coordinatePrecisionM, vehicleType, priceStart, strUnitDist, pricePerDist, pricePerHour, ladder, skyLift FROM windowcleaner_vendorTmp v JOIN  windowcleaner_userTmp u ON v.idUser=u.idUser;

INSERT INTO lawnmower_vendor (idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, terminationDate, displayName, tel, link, homeTown, currency, lastPriceChange, x, y, nMonthsStartOffer, imTag, displayEmail, idTeam, idTeamWanted, boImgOwn, coordinatePrecisionM, vehicleType, priceStart, distUnit, pricePerDist, pricePerHour, cuttingWidth, pushMower, ridingMower, edger)
   SELECT u.idUser, donatedAmount, boShow, v.tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, FROM_UNIXTIME(POW(2,31)-1), u.displayName, tel, link, homeTown, currency, tLastPriceChange, x, y, 0, u.imTag, displayEmail, idTeam, idTeamWanted, u.boImgOwn, coordinatePrecisionM, vehicleType, priceStart, strUnitDist, pricePerDist, pricePerHour, cuttingWidth, pushMower, ridingMower, edger FROM lawnmower_vendorTmp v JOIN lawnmower_userTmp u ON v.idUser=u.idUser;

INSERT INTO snowremoval_vendor (idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, terminationDate, displayName, tel, link, homeTown, currency, lastPriceChange, x, y, nMonthsStartOffer, imTag, displayEmail, idTeam, idTeamWanted, boImgOwn, coordinatePrecisionM, vehicleType, priceStart, distUnit, pricePerDist, pricePerHour, shovel, snowblower, plow)
   SELECT u.idUser, donatedAmount, boShow, v.tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, FROM_UNIXTIME(POW(2,31)-1), u.displayName, tel, link, homeTown, currency, tLastPriceChange, x, y, 0, u.imTag, displayEmail, idTeam, idTeamWanted, u.boImgOwn, coordinatePrecisionM, vehicleType, priceStart, strUnitDist, pricePerDist, pricePerHour, shovel, snowblower, plow FROM snowremoval_vendorTmp v JOIN snowremoval_userTmp u ON v.idUser=u.idUser;

INSERT INTO fruitpicker_vendor (idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, terminationDate, displayName, tel, link, homeTown, currency, lastPriceChange, x, y, nMonthsStartOffer, imTag, displayEmail, idTeam, idTeamWanted, boImgOwn, coordinatePrecisionM, vehicleType, pricePerHour)
   SELECT u.idUser, donatedAmount, boShow, v.tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, FROM_UNIXTIME(POW(2,31)-1), u.displayName, tel, link, homeTown, currency, tLastPriceChange, x, y, 0, u.imTag, displayEmail, idTeam, idTeamWanted, u.boImgOwn, coordinatePrecisionM, vehicleType, pricePerHour FROM fruitpicker_vendorTmp v JOIN fruitpicker_userTmp u ON v.idUser=u.idUser;

INSERT INTO programmer_vendor (idUser, donatedAmount, boShow, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, hideTimer, terminationDate, displayName, tel, link, homeTown, currency, lastPriceChange, x, y, nMonthsStartOffer, imTag, displayEmail, idTeam, idTeamWanted, boImgOwn, coordinatePrecisionM, pricePerHour, c, java, php, javascript, cpp, python, shell, ruby, objectiveC, cSharp, assembly, `sql`, perl, asp, d, vb, delphi, scala, actionScript, coldFusion, lua, ada, pascal, haskell, scheme, cobol, lisp, clojure, erlang, fortran, otherLang)
   SELECT u.idUser, donatedAmount, boShow, v.tCreated, tPos, histActive, tLastWriteOfTA, tAccumulated, hideTimer, FROM_UNIXTIME(POW(2,31)-1), u.displayName, tel, link, homeTown, currency, tLastPriceChange, x, y, 0, u.imTag, displayEmail, idTeam, idTeamWanted, u.boImgOwn, coordinatePrecisionM, pricePerHour, c, java, php, javascript, cpp, python, shell, ruby, objectiveC, cSharp, assembly, `sql`, perl, asp, d, vb, delphi, scala, actionScript, coldFusion, lua, ada, pascal, haskell, scheme, cobol, lisp, clojure, erlang, fortran, otherLang FROM programmer_vendorTmp v JOIN programmer_userTmp u ON v.idUser=u.idUser;



-----

SET FOREIGN_KEY_CHECKS = 0;
SET FOREIGN_KEY_CHECKS = 1;
DROP TABLE IF EXISTS taxi_vendorOld, transport_vendorOld, cleaner_vendorOld, windowcleaner_vendorOld, lawnmower_vendorOld, snowremoval_vendorOld, fruitpicker_vendorOld, programmer_vendorOld;
DROP TABLE IF EXISTS taxi_userOld, transport_userOld, cleaner_userOld, windowcleaner_userOld, lawnmower_userOld, snowremoval_userOld, fruitpicker_userOld, programmer_userOld;

DROP TABLE IF EXISTS taxi_vendorTmp, transport_vendorTmp, cleaner_vendorTmp, windowcleaner_vendorTmp, lawnmower_vendorTmp, snowremoval_vendorTmp, fruitpicker_vendorTmp, programmer_vendorTmp;
DROP TABLE IF EXISTS taxi_userTmp, transport_userTmp, cleaner_userTmp, windowcleaner_userTmp, lawnmower_userTmp, snowremoval_userTmp, fruitpicker_userTmp, programmer_userTmp;

DROP TABLE IF EXISTS taxi_customer, transport_customer, cleaner_customer, windowcleaner_customer, lawnmower_customer, snowremoval_customer, fruitpicker_customer, programmer_customer;
