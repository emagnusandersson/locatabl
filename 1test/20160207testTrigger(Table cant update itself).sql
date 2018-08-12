
DROP TABLE IF EXISTS atab;;
CREATE TABLE atab ( 
  intA  int(4) NOT NULL, 
  strA  varchar(256) NOT NULL default '',
  tChange TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=INNODB COLLATE utf8_general_ci;;


DROP TRIGGER IF EXISTS atab_bu;;
CREATE TRIGGER atab_bu
BEFORE UPDATE ON atab
FOR EACH ROW 
  IF(NEW.intA!=OLD.intA OR NEW.strA!=OLD.strA) THEN
    UPDATE atab SET tChange=now();
  END IF;
;;

INSERT INTO atab (intA, strA) VALUES (1,'a'), (2,'b'), (3,'c');;


UPDATE atab SET strA='a' WHERE intA=1;;
