--
-- Taxi
--
SELECT * FROM mmm.taxi_user;

ALTER TABLE mmm.taxi_user ADD COLUMN tCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER idUser;
ALTER TABLE mmm.taxi_user ADD COLUMN idFb VARCHAR(128) AFTER tCreated;
ALTER TABLE mmm.taxi_user ADD COLUMN idIdPlace VARCHAR(128) AFTER idFb;
ALTER TABLE mmm.taxi_user ADD COLUMN idOpenId VARCHAR(128) AFTER idIdPlace;
ALTER TABLE mmm.taxi_user ADD COLUMN password VARCHAR(40) NOT NULL DEFAULT '' AFTER image;
ALTER TABLE mmm.taxi_user MODIFY COLUMN email VARCHAR(65) AFTER idOpenId;

UPDATE mmm.taxi_user SET idOpenId=idIP, email=CONCAT(LOWER(idIP),'@example.com') WHERE IP='openid';
UPDATE mmm.taxi_user SET email=NULL WHERE email='';
UPDATE mmm.taxi_user SET idFb=idIP WHERE IP='fb';
UPDATE mmm.taxi_user SET idIdPlace=idIP WHERE IP='idplace';


ALTER TABLE mmm.taxi_user DROP COLUMN IP;
ALTER TABLE mmm.taxi_user DROP COLUMN idIP;

ALTER TABLE mmm.taxi_user ADD CONSTRAINT UNIQUE (idFb);
ALTER TABLE mmm.taxi_user ADD CONSTRAINT UNIQUE (idIdPlace);
ALTER TABLE mmm.taxi_user ADD CONSTRAINT UNIQUE (idOpenId);
ALTER TABLE mmm.taxi_user ADD CONSTRAINT UNIQUE (email);

SHOW CREATE TABLE mmm.taxi_user;

-- Set Back

ALTER TABLE mmm.taxi_user ADD COLUMN IP ENUM('openid','fb','google','idplace') NOT NULL DEFAULT 'openid' AFTER idUser;
ALTER TABLE mmm.taxi_user ADD COLUMN idIP VARCHAR(128) NOT NULL AFTER IP;
ALTER TABLE mmm.taxi_user MODIFY COLUMN email VARCHAR(65) AFTER image;
UPDATE mmm.taxi_user SET IP='fb', idIP=idFB, idFB=NULL WHERE idFb IS NOT NULL;
UPDATE mmm.taxi_user SET idIP=nameIP WHERE idIP='';

ALTER TABLE mmm.taxi_user DROP COLUMN idFB;
ALTER TABLE mmm.taxi_user DROP COLUMN idIdPlace;
ALTER TABLE mmm.taxi_user DROP COLUMN idOpenId;
ALTER TABLE mmm.taxi_user DROP COLUMN tCreated;
ALTER TABLE mmm.taxi_user DROP COLUMN password;

ALTER TABLE mmm.taxi_user ADD CONSTRAINT UNIQUE (IP, idIP);
--SHOW INDEX FROM mmm.taxi_user;
ALTER TABLE mmm.taxi_user DROP INDEX email;
-- DROP INDEX email ON mmm.taxi_user;




