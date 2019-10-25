
ALTER TABLE taxi_customerTeamImage DROP FOREIGN KEY `taxi_customerTeamImage_ibfk_1`;
ALTER TABLE taxi_customerTeamImage ADD CONSTRAINT `taxi_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `taxi_customerTeam` (`idUser`) ON DELETE CASCADE;
ALTER TABLE taxi_sellerTeamImage DROP FOREIGN KEY `taxi_sellerTeamImage_ibfk_1`;
ALTER TABLE taxi_sellerTeamImage ADD CONSTRAINT `taxi_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `taxi_sellerTeam` (`idUser`) ON DELETE CASCADE;

ALTER TABLE transport_customerTeamImage DROP FOREIGN KEY `transport_customerTeamImage_ibfk_1`;
ALTER TABLE transport_customerTeamImage ADD CONSTRAINT `transport_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `transport_customerTeam` (`idUser`) ON DELETE CASCADE;
ALTER TABLE transport_sellerTeamImage DROP FOREIGN KEY `transport_sellerTeamImage_ibfk_1`;
ALTER TABLE transport_sellerTeamImage ADD CONSTRAINT `transport_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `transport_sellerTeam` (`idUser`) ON DELETE CASCADE;

ALTER TABLE cleaner_customerTeamImage DROP FOREIGN KEY `cleaner_customerTeamImage_ibfk_1`;
ALTER TABLE cleaner_customerTeamImage ADD CONSTRAINT `cleaner_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `cleaner_customerTeam` (`idUser`) ON DELETE CASCADE;
ALTER TABLE cleaner_sellerTeamImage DROP FOREIGN KEY `cleaner_sellerTeamImage_ibfk_1`;
ALTER TABLE cleaner_sellerTeamImage ADD CONSTRAINT `cleaner_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `cleaner_sellerTeam` (`idUser`) ON DELETE CASCADE;

ALTER TABLE windowcleaner_customerTeamImage DROP FOREIGN KEY `windowcleaner_customerTeamImage_ibfk_1`;
ALTER TABLE windowcleaner_customerTeamImage ADD CONSTRAINT `windowcleaner_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `windowcleaner_customerTeam` (`idUser`) ON DELETE CASCADE;
ALTER TABLE windowcleaner_sellerTeamImage DROP FOREIGN KEY `windowcleaner_sellerTeamImage_ibfk_1`;
ALTER TABLE windowcleaner_sellerTeamImage ADD CONSTRAINT `windowcleaner_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `windowcleaner_sellerTeam` (`idUser`) ON DELETE CASCADE;

ALTER TABLE lawnmowing_customerTeamImage DROP FOREIGN KEY `lawnmowing_customerTeamImage_ibfk_1`;
ALTER TABLE lawnmowing_customerTeamImage ADD CONSTRAINT `lawnmowing_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `lawnmowing_customerTeam` (`idUser`) ON DELETE CASCADE;
ALTER TABLE lawnmowing_sellerTeamImage DROP FOREIGN KEY `lawnmowing_sellerTeamImage_ibfk_1`;
ALTER TABLE lawnmowing_sellerTeamImage ADD CONSTRAINT `lawnmowing_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `lawnmowing_sellerTeam` (`idUser`) ON DELETE CASCADE;

ALTER TABLE snowremoval_customerTeamImage DROP FOREIGN KEY `snowremoval_customerTeamImage_ibfk_1`;
ALTER TABLE snowremoval_customerTeamImage ADD CONSTRAINT `snowremoval_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `snowremoval_customerTeam` (`idUser`) ON DELETE CASCADE;
ALTER TABLE snowremoval_sellerTeamImage DROP FOREIGN KEY `snowremoval_sellerTeamImage_ibfk_1`;
ALTER TABLE snowremoval_sellerTeamImage ADD CONSTRAINT `snowremoval_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `snowremoval_sellerTeam` (`idUser`) ON DELETE CASCADE;

ALTER TABLE fruitpicker_customerTeamImage DROP FOREIGN KEY `fruitpicker_customerTeamImage_ibfk_1`;
ALTER TABLE fruitpicker_customerTeamImage ADD CONSTRAINT `fruitpicker_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `fruitpicker_customerTeam` (`idUser`) ON DELETE CASCADE;
ALTER TABLE fruitpicker_sellerTeamImage DROP FOREIGN KEY `fruitpicker_sellerTeamImage_ibfk_1`;
ALTER TABLE fruitpicker_sellerTeamImage ADD CONSTRAINT `fruitpicker_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `fruitpicker_sellerTeam` (`idUser`) ON DELETE CASCADE;

ALTER TABLE programmer_customerTeamImage DROP FOREIGN KEY `programmer_customerTeamImage_ibfk_1`;
ALTER TABLE programmer_customerTeamImage ADD CONSTRAINT `programmer_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `programmer_customerTeam` (`idUser`) ON DELETE CASCADE;
ALTER TABLE programmer_sellerTeamImage DROP FOREIGN KEY `programmer_sellerTeamImage_ibfk_1`;
ALTER TABLE programmer_sellerTeamImage ADD CONSTRAINT `programmer_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `programmer_sellerTeam` (`idUser`) ON DELETE CASCADE;







-- Set Back

ALTER TABLE taxi_customerTeamImage DROP FOREIGN KEY `taxi_customerTeamImage_ibfk_1`;
ALTER TABLE taxi_customerTeamImage ADD CONSTRAINT `taxi_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `taxi_user` (`idUser`) ON DELETE CASCADE;
ALTER TABLE taxi_sellerTeamImage DROP FOREIGN KEY `taxi_sellerTeamImage_ibfk_1`;
ALTER TABLE taxi_sellerTeamImage ADD CONSTRAINT `taxi_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `taxi_user` (`idUser`) ON DELETE CASCADE;

ALTER TABLE transport_customerTeamImage DROP FOREIGN KEY `transport_customerTeamImage_ibfk_1`;
ALTER TABLE transport_customerTeamImage ADD CONSTRAINT `transport_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `transport_user` (`idUser`) ON DELETE CASCADE;
ALTER TABLE transport_sellerTeamImage DROP FOREIGN KEY `transport_sellerTeamImage_ibfk_1`;
ALTER TABLE transport_sellerTeamImage ADD CONSTRAINT `transport_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `transport_user` (`idUser`) ON DELETE CASCADE;

ALTER TABLE cleaner_customerTeamImage DROP FOREIGN KEY `cleaner_customerTeamImage_ibfk_1`;
ALTER TABLE cleaner_customerTeamImage ADD CONSTRAINT `cleaner_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `cleaner_user` (`idUser`) ON DELETE CASCADE;
ALTER TABLE cleaner_sellerTeamImage DROP FOREIGN KEY `cleaner_sellerTeamImage_ibfk_1`;
ALTER TABLE cleaner_sellerTeamImage ADD CONSTRAINT `cleaner_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `cleaner_user` (`idUser`) ON DELETE CASCADE;

ALTER TABLE windowcleaner_customerTeamImage DROP FOREIGN KEY `windowcleaner_customerTeamImage_ibfk_1`;
ALTER TABLE windowcleaner_customerTeamImage ADD CONSTRAINT `windowcleaner_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `windowcleaner_user` (`idUser`) ON DELETE CASCADE;
ALTER TABLE windowcleaner_sellerTeamImage DROP FOREIGN KEY `windowcleaner_sellerTeamImage_ibfk_1`;
ALTER TABLE windowcleaner_sellerTeamImage ADD CONSTRAINT `windowcleaner_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `windowcleaner_user` (`idUser`) ON DELETE CASCADE;

ALTER TABLE lawnmowing_customerTeamImage DROP FOREIGN KEY `lawnmowing_customerTeamImage_ibfk_1`;
ALTER TABLE lawnmowing_customerTeamImage ADD CONSTRAINT `lawnmowing_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `lawnmowing_user` (`idUser`) ON DELETE CASCADE;
ALTER TABLE lawnmowing_sellerTeamImage DROP FOREIGN KEY `lawnmowing_sellerTeamImage_ibfk_1`;
ALTER TABLE lawnmowing_sellerTeamImage ADD CONSTRAINT `lawnmowing_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `lawnmowing_user` (`idUser`) ON DELETE CASCADE;

ALTER TABLE snowremoval_customerTeamImage DROP FOREIGN KEY `snowremoval_customerTeamImage_ibfk_1`;
ALTER TABLE snowremoval_customerTeamImage ADD CONSTRAINT `snowremoval_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `snowremoval_user` (`idUser`) ON DELETE CASCADE;
ALTER TABLE snowremoval_sellerTeamImage DROP FOREIGN KEY `snowremoval_sellerTeamImage_ibfk_1`;
ALTER TABLE snowremoval_sellerTeamImage ADD CONSTRAINT `snowremoval_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `snowremoval_user` (`idUser`) ON DELETE CASCADE;

ALTER TABLE fruitpicker_customerTeamImage DROP FOREIGN KEY `fruitpicker_customerTeamImage_ibfk_1`;
ALTER TABLE fruitpicker_customerTeamImage ADD CONSTRAINT `fruitpicker_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `fruitpicker_user` (`idUser`) ON DELETE CASCADE;
ALTER TABLE fruitpicker_sellerTeamImage DROP FOREIGN KEY `fruitpicker_sellerTeamImage_ibfk_1`;
ALTER TABLE fruitpicker_sellerTeamImage ADD CONSTRAINT `fruitpicker_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `fruitpicker_user` (`idUser`) ON DELETE CASCADE;

ALTER TABLE programmer_customerTeamImage DROP FOREIGN KEY `programmer_customerTeamImage_ibfk_1`;
ALTER TABLE programmer_customerTeamImage ADD CONSTRAINT `programmer_customerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `programmer_user` (`idUser`) ON DELETE CASCADE;
ALTER TABLE programmer_sellerTeamImage DROP FOREIGN KEY `programmer_sellerTeamImage_ibfk_1`;
ALTER TABLE programmer_sellerTeamImage ADD CONSTRAINT `programmer_sellerTeamImage_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `programmer_user` (`idUser`) ON DELETE CASCADE;

