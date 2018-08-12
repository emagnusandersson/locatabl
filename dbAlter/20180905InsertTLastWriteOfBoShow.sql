

 -- Do the changes
INSERT INTO taxi_setting VALUES ('tLastWriteOfBoShow', 0);
INSERT INTO transport_setting VALUES ('tLastWriteOfBoShow', 0);
INSERT INTO cleaner_setting VALUES ('tLastWriteOfBoShow', 0);
INSERT INTO windowcleaner_setting VALUES ('tLastWriteOfBoShow', 0);
INSERT INTO lawnmower_setting VALUES ('tLastWriteOfBoShow', 0);
INSERT INTO snowremoval_setting VALUES ('tLastWriteOfBoShow', 0);
INSERT INTO fruitpicker_setting VALUES ('tLastWriteOfBoShow', 0);
INSERT INTO programmer_setting VALUES ('tLastWriteOfBoShow', 0);


 -- Setting it back
DELETE FROM taxi_setting WHERE value='tLastWriteOfBoShow';
DELETE FROM transport_setting WHERE value='tLastWriteOfBoShow';
DELETE FROM cleaner_setting WHERE value='tLastWriteOfBoShow';
DELETE FROM windowcleaner_setting WHERE value='tLastWriteOfBoShow';
DELETE FROM lawnmower_setting WHERE value='tLastWriteOfBoShow';
DELETE FROM snowremoval_setting WHERE value='tLastWriteOfBoShow';
DELETE FROM fruitpicker_setting WHERE value='tLastWriteOfBoShow';
DELETE FROM programmer_setting WHERE value='tLastWriteOfBoShow';
