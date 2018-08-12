
SHOW CREATE TABLE mmm.taxi_report;

RENAME TABLE mmm.taxi_report TO mmm.taxi_complaint;
RENAME TABLE mmm.transport_report TO mmm.transport_complaint;
RENAME TABLE mmm.cleaner_report TO mmm.cleaner_complaint;
RENAME TABLE mmm.windowcleaner_report TO mmm.windowcleaner_complaint;
RENAME TABLE mmm.lawnmower_report TO mmm.lawnmower_complaint;
RENAME TABLE mmm.snowremoval_report TO mmm.snowremoval_complaint;
RENAME TABLE mmm.fruitpicker_report TO mmm.fruitpicker_complaint;
RENAME TABLE mmm.programmer_report TO mmm.programmer_complaint;

ALTER TABLE mmm.taxi_complaint CHANGE idReporter idComplainer int(4) NOT NULL;
ALTER TABLE mmm.transport_complaint CHANGE idReporter idComplainer int(4) NOT NULL;
ALTER TABLE mmm.cleaner_complaint CHANGE idReporter idComplainer int(4) NOT NULL;
ALTER TABLE mmm.windowcleaner_complaint CHANGE idReporter idComplainer int(4) NOT NULL;
ALTER TABLE mmm.lawnmower_complaint CHANGE idReporter idComplainer int(4) NOT NULL;
ALTER TABLE mmm.snowremoval_complaint CHANGE idReporter idComplainer int(4) NOT NULL;
ALTER TABLE mmm.fruitpicker_complaint CHANGE idReporter idComplainer int(4) NOT NULL;
ALTER TABLE mmm.programmer_complaint CHANGE idReporter idComplainer int(4) NOT NULL;


-- Set back

RENAME TABLE mmm.taxi_complaint TO mmm.taxi_report;
RENAME TABLE mmm.transport_complaint TO mmm.transport_report;
RENAME TABLE mmm.cleaner_complaint TO mmm.cleaner_report;
RENAME TABLE mmm.windowcleaner_complaint TO mmm.windowcleaner_report;
RENAME TABLE mmm.lawnmower_complaint TO mmm.lawnmower_report;
RENAME TABLE mmm.snowremoval_complaint TO mmm.snowremoval_report;
RENAME TABLE mmm.fruitpicker_complaint TO mmm.fruitpicker_report;
RENAME TABLE mmm.programmer_complaint TO mmm.programmer_report;

ALTER TABLE mmm.taxi_report CHANGE idReporter idReporter int(4) NOT NULL;
ALTER TABLE mmm.transport_report CHANGE idReporter idReporter int(4) NOT NULL;
ALTER TABLE mmm.cleaner_report CHANGE idReporter idReporter int(4) NOT NULL;
ALTER TABLE mmm.windowcleaner_report CHANGE idReporter idReporter int(4) NOT NULL;
ALTER TABLE mmm.lawnmower_report CHANGE idReporter idReporter int(4) NOT NULL;
ALTER TABLE mmm.snowremoval_report CHANGE idReporter idReporter int(4) NOT NULL;
ALTER TABLE mmm.fruitpicker_report CHANGE idReporter idReporter int(4) NOT NULL;
ALTER TABLE mmm.programmer_report CHANGE idReporter idReporter int(4) NOT NULL;

