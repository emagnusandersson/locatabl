

ALTER TABLE taxi_user CHANGE boImgOwn boUseIdPImg tinyint(1) NOT NULL DEFAULT 1;
ALTER TABLE transport_user CHANGE boImgOwn boUseIdPImg tinyint(1) NOT NULL DEFAULT 1;
ALTER TABLE cleaner_user CHANGE boImgOwn boUseIdPImg tinyint(1) NOT NULL DEFAULT 1;
ALTER TABLE windowcleaner_user CHANGE boImgOwn boUseIdPImg tinyint(1) NOT NULL DEFAULT 1;
ALTER TABLE lawnmowing_user CHANGE boImgOwn boUseIdPImg tinyint(1) NOT NULL DEFAULT 1;
ALTER TABLE snowremoval_user CHANGE boImgOwn boUseIdPImg tinyint(1) NOT NULL DEFAULT 1;
ALTER TABLE fruitpicker_user CHANGE boImgOwn boUseIdPImg tinyint(1) NOT NULL DEFAULT 1;
ALTER TABLE programmer_user CHANGE boImgOwn boUseIdPImg tinyint(1) NOT NULL DEFAULT 1;
ALTER TABLE demo_user CHANGE boImgOwn boUseIdPImg tinyint(1) NOT NULL DEFAULT 1;


UPDATE taxi_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE transport_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE cleaner_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE windowcleaner_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE lawnmowing_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE snowremoval_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE fruitpicker_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE programmer_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE demo_user SET boUseIdPImg=1-boUseIdPImg;




-- Set Back


UPDATE taxi_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE transport_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE cleaner_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE windowcleaner_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE lawnmowing_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE snowremoval_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE fruitpicker_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE programmer_user SET boUseIdPImg=1-boUseIdPImg;
UPDATE demo_user SET boUseIdPImg=1-boUseIdPImg;

ALTER TABLE taxi_user CHANGE boUseIdPImg boImgOwn tinyint(1) NOT NULL DEFAULT 0;
ALTER TABLE transport_user CHANGE boUseIdPImg boImgOwn tinyint(1) NOT NULL DEFAULT 0;
ALTER TABLE cleaner_user CHANGE boUseIdPImg boImgOwn tinyint(1) NOT NULL DEFAULT 0;
ALTER TABLE windowcleaner_user CHANGE boUseIdPImg boImgOwn tinyint(1) NOT NULL DEFAULT 0;
ALTER TABLE lawnmowing_user CHANGE boUseIdPImg boImgOwn tinyint(1) NOT NULL DEFAULT 0;
ALTER TABLE snowremoval_user CHANGE boUseIdPImg boImgOwn tinyint(1) NOT NULL DEFAULT 0;
ALTER TABLE fruitpicker_user CHANGE boUseIdPImg boImgOwn tinyint(1) NOT NULL DEFAULT 0;
ALTER TABLE programmer_user CHANGE boUseIdPImg boImgOwn tinyint(1) NOT NULL DEFAULT 0;
ALTER TABLE demo_user CHANGE boUseIdPImg boImgOwn tinyint(1) NOT NULL DEFAULT 0;






