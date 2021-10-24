


ALTER TABLE taxi_seller CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE transport_seller CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE cleaner_seller CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE windowcleaner_seller CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE lawnmowing_seller CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE snowremoval_seller CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE fruitpicker_seller CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE programmer_seller CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();


ALTER TABLE taxi_buyer CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE transport_buyer CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE cleaner_buyer CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE windowcleaner_buyer CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE lawnmowing_buyer CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE snowremoval_buyer CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE fruitpicker_buyer CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE programmer_buyer CHANGE tPos tAppear timestamp NOT NULL DEFAULT current_timestamp();


RENAME TABLE taxi_binsTPos TO taxi_binsTAppear;
RENAME TABLE transport_binsTPos TO transport_binsTAppear;
RENAME TABLE cleaner_binsTPos TO cleaner_binsTAppear;
RENAME TABLE windowcleaner_binsTPos TO windowcleaner_binsTAppear;
RENAME TABLE lawnmowing_binsTPos TO lawnmowing_binsTAppear;
RENAME TABLE snowremoval_binsTPos TO snowremoval_binsTAppear;
RENAME TABLE fruitpicker_binsTPos TO fruitpicker_binsTAppear;
RENAME TABLE programmer_binsTPos TO programmer_binsTAppear;



-- Set Back


ALTER TABLE taxi_seller CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE transport_seller CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE cleaner_seller CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE windowcleaner_seller CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE lawnmowing_seller CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE snowremoval_seller CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE fruitpicker_seller CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE programmer_seller CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();


ALTER TABLE taxi_buyer CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE transport_buyer CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE cleaner_buyer CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE windowcleaner_buyer CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE lawnmowing_buyer CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE snowremoval_buyer CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE fruitpicker_buyer CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();
ALTER TABLE programmer_buyer CHANGE tAppear tPos timestamp NOT NULL DEFAULT current_timestamp();


RENAME TABLE taxi_binsTAppear TO taxi_binsTPos;
RENAME TABLE transport_binsTAppear TO transport_binsTPos;
RENAME TABLE cleaner_binsTAppear TO cleaner_binsTPos;
RENAME TABLE windowcleaner_binsTAppear TO windowcleaner_binsTPos;
RENAME TABLE lawnmowing_binsTAppear TO lawnmowing_binsTPos;
RENAME TABLE snowremoval_binsTAppear TO snowremoval_binsTPos;
RENAME TABLE fruitpicker_binsTAppear TO fruitpicker_binsTPos;
RENAME TABLE programmer_binsTAppear TO programmer_binsTPos;
