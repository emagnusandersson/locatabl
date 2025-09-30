-- development
ALTER TABLE transport_user MODIFY image varchar(1024) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE vehicledriver_user MODIFY image varchar(1024) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE demo_user MODIFY image varchar(1024) CHARSET utf8 NOT NULL DEFAULT '';

-- production
ALTER TABLE taxi_user MODIFY image varchar(1024) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE transport_user MODIFY image varchar(1024) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE vehicledriver_user MODIFY image varchar(1024) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE cleaner_user MODIFY image varchar(1024) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE windowcleaner_user MODIFY image varchar(1024) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE lawnmowing_user MODIFY image varchar(1024) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE snowremoval_user MODIFY image varchar(1024) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE fruitpicker_user MODIFY image varchar(1024) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE programmer_user MODIFY image varchar(1024) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE demo_user MODIFY image varchar(1024) CHARSET utf8 NOT NULL DEFAULT '';




-- Set Back

-- development
ALTER TABLE transport_user MODIFY image varchar(512) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE vehicledriver_user MODIFY image varchar(512) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE demo_user MODIFY image varchar(512) CHARSET utf8 NOT NULL DEFAULT '';

-- production
ALTER TABLE taxi_user MODIFY image varchar(512) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE transport_user MODIFY image varchar(512) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE vehicledriver_user MODIFY image varchar(512) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE cleaner_user MODIFY image varchar(512) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE windowcleaner_user MODIFY image varchar(512) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE lawnmowing_user MODIFY image varchar(512) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE snowremoval_user MODIFY image varchar(512) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE fruitpicker_user MODIFY image varchar(512) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE programmer_user MODIFY image varchar(512) CHARSET utf8 NOT NULL DEFAULT '';
ALTER TABLE demo_user MODIFY image varchar(512) CHARSET utf8 NOT NULL DEFAULT '';







