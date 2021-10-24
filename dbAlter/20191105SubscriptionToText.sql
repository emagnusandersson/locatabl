
ALTER TABLE taxi_webPushSubscription MODIFY COLUMN `strSubscription` text CHARSET utf8 NULL;
ALTER TABLE transport_webPushSubscription MODIFY COLUMN `strSubscription` text CHARSET utf8 NULL;
ALTER TABLE cleaner_webPushSubscription MODIFY COLUMN `strSubscription` text CHARSET utf8 NULL;
ALTER TABLE windowcleaner_webPushSubscription MODIFY COLUMN `strSubscription` text CHARSET utf8 NULL;
ALTER TABLE lawnmowing_webPushSubscription MODIFY COLUMN `strSubscription` text CHARSET utf8 NULL;
ALTER TABLE snowremoval_webPushSubscription MODIFY COLUMN `strSubscription` text CHARSET utf8 NULL;
ALTER TABLE fruitpicker_webPushSubscription MODIFY COLUMN `strSubscription` text CHARSET utf8 NULL;
ALTER TABLE programmer_webPushSubscription MODIFY COLUMN `strSubscription` text CHARSET utf8 NULL;
  





-- Set Back

ALTER TABLE taxi_webPushSubscription MODIFY COLUMN strSubscription varchar(512) CHARSET utf8 NULL;
ALTER TABLE transport_webPushSubscription MODIFY COLUMN `strSubscription` varchar(512) CHARSET utf8 NULL;
ALTER TABLE cleaner_webPushSubscription MODIFY COLUMN `strSubscription` varchar(512) CHARSET utf8 NULL;
ALTER TABLE windowcleaner_webPushSubscription MODIFY COLUMN `strSubscription` varchar(512) CHARSET utf8 NULL;
ALTER TABLE lawnmowing_webPushSubscription MODIFY COLUMN `strSubscription` varchar(512) CHARSET utf8 NULL;
ALTER TABLE snowremoval_webPushSubscription MODIFY COLUMN `strSubscription` varchar(512) CHARSET utf8 NULL;
ALTER TABLE fruitpicker_webPushSubscription MODIFY COLUMN `strSubscription` varchar(512) CHARSET utf8 NULL;
ALTER TABLE programmer_webPushSubscription MODIFY COLUMN `strSubscription` varchar(512) CHARSET utf8 NULL;

