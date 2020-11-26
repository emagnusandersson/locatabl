

ALTER TABLE taxi_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE transport_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE cleaner_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE windowcleaner_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE lawnmowing_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE snowremoval_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE fruitpicker_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE programmer_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;


ALTER TABLE taxi_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE transport_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE cleaner_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE windowcleaner_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE lawnmowing_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE snowremoval_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE fruitpicker_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;
ALTER TABLE programmer_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2592000;





-- Set Back

ALTER TABLE taxi_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE transport_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE cleaner_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE windowcleaner_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE lawnmowing_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE snowremoval_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE fruitpicker_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE programmer_seller MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;


ALTER TABLE taxi_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE transport_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE cleaner_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE windowcleaner_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE lawnmowing_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE snowremoval_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE fruitpicker_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;
ALTER TABLE programmer_buyer MODIFY hideTimer int(8) NOT NULL DEFAULT 2147483647;




