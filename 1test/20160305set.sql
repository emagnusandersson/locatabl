CREATE TABLE myset (col SET('a', 'b', 'c', 'd'));

DROP TABLE IF EXISTS atab;;
CREATE TABLE atab ( 
  col  SET('a', 'b', 'c', 'd') NOT NULL
  ) ENGINE=INNODB COLLATE utf8_general_ci;;


INSERT INTO atab (col) VALUES  ('a,b'),('a,d'), ('d,a'), ('a,d,a'), ('a,d,d'), ('d,a,d'), ('d,a,c');
