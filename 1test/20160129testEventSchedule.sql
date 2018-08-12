-- SET GLOBAL event_scheduler = ON;; -- One can't set event_scheduler = ON on ClearDB (bummer)
-- SET GLOBAL event_scheduler = OFF;;

DROP TABLE IF EXISTS atab;;
CREATE TABLE atab ( 
  intA  int(4) NOT NULL, 
  strA  varchar(256) NOT NULL default ''
  ) ENGINE=INNODB COLLATE utf8_general_ci;;


DROP PROCEDURE IF EXISTS myProc;;
CREATE PROCEDURE myProc()
BEGIN 
  INSERT INTO atab VALUES (1,'a');
END;;

-- ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 MINUTE
-- ON SCHEDULE EVERY 2 SECOND 
DROP EVENT IF EXISTS myEv;;
CREATE EVENT myEv
      ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 10 SECOND 
      DO 
        CALL myProc();
  

