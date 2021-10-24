DROP TABLE IF EXISTS testMergeIdTab;
CREATE TABLE testMergeIdTab ( 
  idA int(4) NOT NULL, 
  idB int(4) NOT NULL, 
  UNIQUE KEY (idA,idB)
  ) ENGINE=INNODB;
  
INSERT INTO testMergeIdTab (idA, idB) VALUES 
(1,2), 
(1,3), 
(2,2), 
(2,3), 
(2,4), 
(3,2), 
(3,3);

SELECT * FROM testMergeIdTab;


-- UPDATE testMergeIdTab SET idA=1 WHERE idA=2;



  -- Create a table tmpA with only the involved idMerge's
DROP TABLE IF EXISTS tmpA;
CREATE TEMPORARY TABLE tmpA ( idMerge int(4) NOT NULL, idAlt int(4) NOT NULL ) ENGINE=INNODB;
INSERT INTO tmpA SELECT idA,idB FROM testMergeIdTab WHERE idA IN(1,2,3);

SELECT * FROM tmpA;

  -- Create a table tmpB with the idAlts that have multiple entries in tmpA
DROP TABLE IF EXISTS tmpB;
CREATE TEMPORARY TABLE tmpB ( idAlt int(4) NOT NULL ) ENGINE=INNODB;
INSERT INTO tmpB SELECT idAlt
    FROM 
    (SELECT idAlt, COUNT(*) AS Counter 
     FROM `tmpA` 
     GROUP BY `idAlt`) AS tbl WHERE Counter>1;

SELECT * FROM tmpB;

DELETE t FROM testMergeIdTab t JOIN tmpB tB ON t.idB=tB.idAlt WHERE idA IN (1,2);



  -- Create a table tmpA with only the involved idMerge's
DROP TABLE IF EXISTS tmpA;
CREATE TEMPORARY TABLE tmpA ( idMerge int(4) NOT NULL, idAlt int(4) NOT NULL ) ENGINE=INNODB;
INSERT INTO tmpA SELECT idB,idA FROM testMergeIdTab WHERE idB IN(1,2,3);

SELECT * FROM tmpA;

  -- Create a table tmpB with the idAlts that have multiple entries in tmpA
DROP TABLE IF EXISTS tmpB;
CREATE TEMPORARY TABLE tmpB ( idAlt int(4) NOT NULL ) ENGINE=INNODB;
INSERT INTO tmpB SELECT idAlt
    FROM 
    (SELECT idAlt, COUNT(*) AS Counter 
     FROM `tmpA` 
     GROUP BY `idAlt`) AS tbl WHERE Counter>1;

SELECT * FROM tmpB;

DELETE t FROM testMergeIdTab t JOIN tmpB tB ON t.idA=tB.idAlt WHERE idB IN (1,2);



UPDATE transport_user t
JOIN
  (SELECT idComplainee, COUNT(*) AS n FROM transport_complaint c GROUP BY c.idComplainee) tmp
  ON t.idUser=tmp.idComplainee
  SET t.nComplaint = n;


UPDATE transport_user t SET t.nComplaint = 0;




UPDATE transport_user u
    JOIN
      (SELECT idComplainer, COUNT(*) AS n FROM transport_complaint c GROUP BY c.idComplainer) tmp
      ON u.idUser=tmp.idComplainer
      SET u.nComplaintGiven = n;
