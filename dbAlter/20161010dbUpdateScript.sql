-- Set levelMaintenance to 1

CALL demodupMake();   CALL taxidupMake();   CALL transportdupMake();   CALL cleanerdupMake();   CALL windowcleanerdupMake();   CALL fruitpickerdupMake();  CALL lawnmowerdupMake();   CALL snowremovaldupMake();   CALL programmerdupMake();

-- Verify that the duplicate tables have the same number of rows

-- Upload new version

-- https://taxi.locatabl.com/sql/createTableAll  https://taxi.locatabl.com/sql/createFunctionAll

CALL demodupTrunkOrgNCopyBack();   CALL taxidupTrunkOrgNCopyBack();   CALL transportdupTrunkOrgNCopyBack();   CALL cleanerdupTrunkOrgNCopyBack();   CALL windowcleanerdupTrunkOrgNCopyBack();   CALL fruitpickerdupTrunkOrgNCopyBack();  CALL lawnmowerdupTrunkOrgNCopyBack();   CALL snowremovaldupTrunkOrgNCopyBack();   CALL programmerdupTrunkOrgNCopyBack();

-- Verify that the tables have the same number of rows as the duplicates

-- Set levelMaintenance to 0

-- Verify that apps work

CALL demodupDrop();   CALL taxidupDrop();   CALL transportdupDrop();   CALL cleanerdupDrop();   CALL windowcleanerdupDrop();   CALL fruitpickerdupDrop();  CALL lawnmowerdupDrop();   CALL snowremovaldupDrop();   CALL programmerdupDrop();







