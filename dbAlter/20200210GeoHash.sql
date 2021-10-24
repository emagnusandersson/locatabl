

ALTER TABLE taxi_buyer ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;
ALTER TABLE taxi_seller ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;

ALTER TABLE transport_buyer ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;
ALTER TABLE transport_seller ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;

ALTER TABLE cleaner_buyer ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;
ALTER TABLE cleaner_seller ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;

ALTER TABLE windowcleaner_buyer ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;
ALTER TABLE windowcleaner_seller ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;

ALTER TABLE lawnmowing_buyer ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;
ALTER TABLE lawnmowing_seller ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;

ALTER TABLE snowremoval_buyer ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;
ALTER TABLE snowremoval_seller ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;

ALTER TABLE fruitpicker_buyer ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;
ALTER TABLE fruitpicker_seller ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;

ALTER TABLE programmer_buyer ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;
ALTER TABLE programmer_seller ADD COLUMN `geoHash` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER y;

UPDATE taxi_buyer SET geoHash=pWC2GeoHash(x, y);
UPDATE taxi_seller SET geoHash=pWC2GeoHash(x, y);

UPDATE transport_buyer SET geoHash=pWC2GeoHash(x, y);
UPDATE transport_seller SET geoHash=pWC2GeoHash(x, y);

UPDATE cleaner_buyer SET geoHash=pWC2GeoHash(x, y);
UPDATE cleaner_seller SET geoHash=pWC2GeoHash(x, y);

UPDATE windowcleaner_buyer SET geoHash=pWC2GeoHash(x, y);
UPDATE windowcleaner_seller SET geoHash=pWC2GeoHash(x, y);

UPDATE lawnmowing_buyer SET geoHash=pWC2GeoHash(x, y);
UPDATE lawnmowing_seller SET geoHash=pWC2GeoHash(x, y);

UPDATE snowremoval_buyer SET geoHash=pWC2GeoHash(x, y);
UPDATE snowremoval_seller SET geoHash=pWC2GeoHash(x, y);

UPDATE fruitpicker_buyer SET geoHash=pWC2GeoHash(x, y);
UPDATE fruitpicker_seller SET geoHash=pWC2GeoHash(x, y);

UPDATE programmer_buyer SET geoHash=pWC2GeoHash(x, y);
UPDATE programmer_seller SET geoHash=pWC2GeoHash(x, y);


-- ~ SHOW INDEX FROM mmm.transport_buyer;
-- ~ SHOW INDEX FROM mmm.transport_seller;
-- ~ CREATE INDEX geoHashIndex ON transport_buyer(geoHash);
-- ~ CREATE INDEX geoHashIndex ON transport_seller(geoHash);

-- Set Back

ALTER TABLE taxi_buyer DROP COLUMN geoHash;
ALTER TABLE taxi_seller DROP COLUMN geoHash;

ALTER TABLE transport_buyer DROP COLUMN geoHash;
ALTER TABLE transport_seller DROP COLUMN geoHash;

ALTER TABLE cleaner_buyer DROP COLUMN geoHash;
ALTER TABLE cleaner_seller DROP COLUMN geoHash;

ALTER TABLE windowcleaner_buyer DROP COLUMN geoHash;
ALTER TABLE windowcleaner_seller DROP COLUMN geoHash;

ALTER TABLE lawnmowing_buyer DROP COLUMN geoHash;
ALTER TABLE lawnmowing_seller DROP COLUMN geoHash;

ALTER TABLE snowremoval_buyer DROP COLUMN geoHash;
ALTER TABLE snowremoval_seller DROP COLUMN geoHash;

ALTER TABLE fruitpicker_buyer DROP COLUMN geoHash;
ALTER TABLE fruitpicker_seller DROP COLUMN geoHash;

ALTER TABLE programmer_buyer DROP COLUMN geoHash;
ALTER TABLE programmer_seller DROP COLUMN geoHash;
  


-- ~ DROP INDEX geoHashIndex ON transport_buyer;
-- ~ DROP INDEX geoHashIndex ON transport_seller;
