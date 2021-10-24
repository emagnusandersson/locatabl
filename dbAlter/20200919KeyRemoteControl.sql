

ALTER TABLE taxi_user CHANGE keyFromExternalTracker keyRemoteControl varchar(32) NOT NULL DEFAULT '';
ALTER TABLE transport_user CHANGE keyFromExternalTracker keyRemoteControl varchar(32) NOT NULL DEFAULT '';
ALTER TABLE cleaner_user CHANGE keyFromExternalTracker keyRemoteControl varchar(32) NOT NULL DEFAULT '';
ALTER TABLE windowcleaner_user CHANGE keyFromExternalTracker keyRemoteControl varchar(32) NOT NULL DEFAULT '';
ALTER TABLE lawnmowing_user CHANGE keyFromExternalTracker keyRemoteControl varchar(32) NOT NULL DEFAULT '';
ALTER TABLE snowremoval_user CHANGE keyFromExternalTracker keyRemoteControl varchar(32) NOT NULL DEFAULT '';
ALTER TABLE fruitpicker_user CHANGE keyFromExternalTracker keyRemoteControl varchar(32) NOT NULL DEFAULT '';
ALTER TABLE programmer_user CHANGE keyFromExternalTracker keyRemoteControl varchar(32) NOT NULL DEFAULT '';

-- Set Back

ALTER TABLE taxi_user CHANGE keyRemoteControl keyFromExternalTracker varchar(32) NOT NULL DEFAULT '';
ALTER TABLE transport_user CHANGE keyRemoteControl keyFromExternalTracker varchar(32) NOT NULL DEFAULT '';
ALTER TABLE cleaner_user CHANGE keyRemoteControl keyFromExternalTracker varchar(32) NOT NULL DEFAULT '';
ALTER TABLE windowcleaner_user CHANGE keyRemoteControl keyFromExternalTracker varchar(32) NOT NULL DEFAULT '';
ALTER TABLE lawnmowing_user CHANGE keyRemoteControl keyFromExternalTracker varchar(32) NOT NULL DEFAULT '';
ALTER TABLE snowremoval_user CHANGE keyRemoteControl keyFromExternalTracker varchar(32) NOT NULL DEFAULT '';
ALTER TABLE fruitpicker_user CHANGE keyRemoteControl keyFromExternalTracker varchar(32) NOT NULL DEFAULT '';
ALTER TABLE programmer_user CHANGE keyRemoteControl keyFromExternalTracker varchar(32) NOT NULL DEFAULT '';

