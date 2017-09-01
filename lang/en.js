

langClientFunc=function(){
langHtml={
Cancel:'Cancel',
Yes:'Yes',
No:'No',
OK:'OK',
Continue:'Continue',
On:'On',
Off:'Off',
Save:'Save',
Delete:'Delete',
Reporter:'Reporter', // The one who files a report
Vehicle:'Vehicle',
Brand:'Brand',  // Vehicle brand
Independent:'Independent',


vendorRewritten:'vendor',

vendor:'vendor', vendors:'vendors',
theVendor:"the vendor", theVendors:"the vendors",
theVendors0:"vendors",
IndependentVendor:'Independent<br>Vendor',

driver:'driver', drivers:'drivers',
theDriver:'the driver', theDrivers:'the drivers',
theDrivers0:'drivers',
IndependentDriver:'Independent<br>Driver',

cleaner:'cleaner', cleaners:'cleaners',
theCleaner:'the cleaner', theCleaners:'the cleaners',
theCleaners0:'cleaners',
IndependentCleaner:'No team',

programmer:'programmer', programmers:'programmers',
theProgrammer:'the programmer', theProgrammers:'the programmers',
theProgrammers0:'programmers',
IndependentProgrammer:'Freelance',

picker:"picker", pickers:"pickers",
thePicker:"the picker", thePickers:"the pickers",
thePickers0:"pickers",
IndependentPicker:'No team',

snowShoveler:"snow shoveler", snowShovelers:"snow shovelers",
theSnowShoveler:"the snow shoveler",  theSnowShovelers:"the snow shovelers",
theSnowShovelers0:"snow shovelers",
IndependentSnowShoveler:'No team',

windowcleaner:'window cleaner',
lawnmower:'lawnmower',
snowRemovalWorker:'snow removal worker',

Languages:'Skills (higher grade is better)',
Tools:'Tools',

Reputation:'Reputation',
Price:'Price',
Type:'Type',
Other:'Other',
ShowMoreData:'Show more data',
SelectColumns:'Select columns',
AddRemoveColumns:'Add/remove columns',
ChangeMapMarker:'Change map marker',
Prices:'Prices',
UserInfo:'User info',
UserSettings:'User settings',
DriverSettings:'Driver settings',
Deadline:'Deadline',
PaymentList:'List of payments',

DistanceUnit:'Distance unit',

Wiki:'Wiki',

Sort:'Sort',
SortColumns:'Sort columns',

column:'column',
show:'show',

None:'None',
All:'All',

Settings:'Settings',
//VendorSettings:'<span nom="Vendor">Vendor</span> settings',
VendorSettings:'Vendor settings',
VendorLogin:'Login (<span nom="Vendors">Vendors</span>)',
VendorEntry:'<span nom="Vendor">Vendor</span> entry',
DidYouUseAltIPBefore:'Did you use <span nom="IP">another IP</span> to login before?',


Default:'Default',
DefaultFiltering:'Default filtering',
Done:'Done',



Position:'Position',
PositionETC:'Position etc',
Contact:'Contact',
Prices:'Prices',

reports:'Reports',
vote:{
deleteReport:'Delete report',
deleteAnswer:'Delete answer',
answer:'Answer',
writeComment:'Write Report'
},

Answer:'Answer',
Change:'Change',
Report:'Report',
Back:'⇦',


Compare:'Compare',
//Compare:'&#63523,
Filter:'Filter',
Filtered:'Filtered',

MiniMap:'Mini map',

YourImage:'Your image',
uploadNewImg:'Upload new image',

DragOrZoom:'Drag/zoom the map to reload markers.',

moreInfo:'More info',
InformationPage:'Information page',
TeamAdmin:'Team administrator',
gettingStartedLink:'Getting started as <span nom="vendor">vendor</span>',
SeeAlso:'See also',
//labOrdinal:'Be the <span></span> <span nom="vendor">vendor</span> to join.',
headOrdinal:'New vendor (<span nom="vendorRewritten">vendor</span>)?',
labOrdinal:'Join now and be <span nom="vendor">vendor</span> number <span></span>.',
labOrdinalB:'You can delete your account at any time.',

Info:'Info',
OtherJobs:'Other jobs/services...',
OtherMapApps:'Other mappers',
ComparisonTable:'Comparison table',
FilterTitle:'Filter (hide uninteresting <span nom="vendors">vendors</span>)',

//toManyMess:'To many <span nom="vendors">vendors</span> for listing details, zoom in, or use filter to reduce the number below '+maxVendor,
//toManyMess:'Max '+maxVendor+' <span nom="vendors">vendors</span> to see the comparisson table, zoom in, or use filter to reduce the number.',
toManyMess:'Disabled when the number of filtered <span nom="vendors">vendors</span> are above '+maxVendor+'',


// Help-popup-texts:
tsPopup:'Exact timepoint', // As in opposite of approximate timepoint 

SeeUnActivePopMess:'<p>No <span nom="vendor">vendor</span> uploaded his position during the last <span></span> hours.</p><p>Use the <b>Filter</b>-button to include older positions.</p>',
SeeUnActivePopMessButt:'Include older positions now.',

driverTextPopup:{
idDriverGovernment:'Serves as verification to the customer that you are a real taxi driver',
tel:'The number you want the customers to call',
contactEmail:'Will not be displayed to the public',
homeTown:'Good if you are in other town and wants to get in contact with customers heading in the same direction',
standingByMethod:'How are you waiting',
//idTeam:'If you are connected to a team who in turn is connected to taxiselecor.com',
shiftEnd:'When do you end for the day.<br>Useful for customers that wants to book ahead, or to go on long trips'
},



writeReportPopup:'<span nom="theVendor">The vendor</span> may delete his account, which means that all collected reputation data (including reports) are deleted.',

quickHelp:'Set the timer and click "On" to become visible.<p>Click "Off" to hide.',
  

pricePref:{pop:"Change distance and time"}, 


  //login
loginInfo:{'reporter':'reporter',
'vendor':'vendor',
'team':'team',
'marketer':'marketer',
'admin':'admin',
'logoutButt':'Sign-out'
},

Login:'Login',
SignInAs:'Sign in as',
helpLoginCommenter:'<p>This is to prevent that people tries to appear as more than one person.<p>Your integrity has the highest priority. No data is sent to the ID provider. You can at any time remove your comments an thereby all references to you',

LoginSingInAsVendor:'Login / Sign in as <span nom="vendor">vendor</span>',
IdProviderNeeded:'ID-provider needed',
anIdentityIsNeeded:'An identity is needed...',
pendingMessLogin:'Signing you in',
cancelMessLogin:'Sign-in canceled',
WhyOAuth:'Why is an external ID-provider used?',
noteLoginVendor:'<p>This is to prevent that people tries to appear as more than one person.<p>Your integrity has the highest priority. No data is sent to the ID provider.<p>If your disappointed or just want to try around, then just login, play around, and delete you account, no hard feelings (And you are welcome back any time)',
//noteLoginVendor:'<p>idPlace.org (the ID provider) is a separate site which tries to ensure unique accounts (so that noone tries to appear as more than one person).<p>Your integrity has the highest priority. No data is sent to the ID provider.<p>If your disappointed or just want to try around, then just login, play around, and delete you account, no hard feelings (And you are welcome back any time)',
whatDoesItMeanLoggingInWithAnExternalId:'What does it mean logging in with an external ID',
toContinueAFacebookAccountIsNeeded:"To continue a Facebook account is needed",
goAHead:"Go ahead ...",
whatIdPDataIsUsedQ:"What Facebook data is used?",
whatIdPDataIsUsedA:"Only name and image (Facebook sends along friend-list too but it is not used)",
//WhyIsFBNeededQ:'Why is a Facebook account needed?',
//WhyIsFBNeededA:'A Facebook account is needed to make sure that the users are unique. Nothing is written to your Facebook flow.',
//AFBAccountIsNeededBecause:'A Facebook account is needed to make sure that the users are unique. Nothing is written to your Facebook flow.',
MoreAboutWhyAnIdPIsUsed:'More about how and why an ID provider (Facebook) is used?',
FBToPreventMultipleAccounts:'An ID provider (Facebook) is used to prevent people from creating multiple accounts.',
//(Otherwise some mischievous person could create like 100\'s of accounts and effectively sabotage the service)
NothingIsWrittenToYourFBFlow:'Nothing is written to your Facebook flow.',
YouCanChangeImage:"You don't have to appear with your Facebook image, name etc.",
YouCanDeleteYourAccount:'You can delete all your data (delete your account), and come back at a later timepoint as many times as you want.',
moreInfoOnFAQ:'More info (FAQ)',

vendorPay:{
head:"Deadline: <span><span class=num></span> <span class=unit></span></span>",
div:"\
  <div>\
    <p>Add time by paying: <select></select>\
    <p><input type=radio>Outside EU: No tax added\
    <p><input type=radio>Inside EU: 25% tax (Swedish VAT) must also be payed\
    <p>EU: If you are a company you shall also provide a VAT number, sort of: SE999999999901: <input type=text>\
    <p><img></img>\
  </div>\
  <div>Use campaign code: <input type=text> <button>Send</button></div>\
  <div>More than a year till deadline.</div>\
  <hr><button>Show list of all payments</button>\
  <div><hr><button>Delete account</button></div>"
},


deleteBox:{
regret:"Do you really want to delete the account",
help:"As long as you haven't made any payments, you can delete the account"
},

vehicleType:['Sedan', 'Station wagon', 'Large MPV', 'MPV', 'Hatchback', 'Pickup', 'Convertible', 'Rickshaw', 'Limo', 'Bus', 'Small bus', 'Boat', 'Airplane', 'Helicopter','Van','Lorry','Semi-trailer','Lorry w trailer','Lorry w dolly trailer','Dump truck'],

vehicleType:{
sedan:'Sedan',
wagon:'Station wagon',
largeMPV:'Large MPV',
MPV:'MPV',
convertable:'Convertible',
hatchback:'Hatchback',
rickshaw:'Rickshaw',
limo:'Limo',
bus:'Bus',
smallBus:'Small bus',
boat:'Boat',
bike:'Bike',
moped:'Moped',
MC:'MC',
pickup:'Pickup',
van:'Van',
lorry:'Lorry',
semiTrailer:'Semi-trailer',
lorryWTrailer:'Lorry w trailer',
semiTrailerWTrailer:'Semi trailer plus trailer',
boat:'Boat'
},

standingByMethods:['In vehicle','At home','5 min','10 min'],
standingByMethodsLong:['In vehicle','At home','Ready in 5 min','Ready in 10 min'],

ShowNUpdate:'Visible / New pos',
visible:'visible',
NewPos:'New pos',
Hide:'Hide',

obligatory:{head:'Obligatory info'},

  //filter
histsRem:'Trunc: ',
min:'Min',
max:'Max',
IncludeAll:'Include all',
Reset:'Reset',
ConnectedSince:'Connected since',

multCurrencies:'Note! different currencies',

// time units [singularShort, pluralShort, singularLong, pluralLong]
timeUnit:{
s:['s','s','second','seconds'],
min:['min','min','minute','minutes'],
h:['h','h','hour','hours'],
d:['d','d','day','days'],
mo:['mo','mo','month','months'],
y:['y','y','year','years']
},

ago:'<span></span> ago',

Currency:'Currency',
StartPrice:'Start price',
PricePer:'Price per',
PricePerKM:'Price per km',
PricePerMile:'Price per mile',
PricePerHour:'Price per hour',

link:'link',
HomePage:'Home page',

WaitingForYourPosition:'Waiting for your position',
WaitingForYourPositionHelp:'No collected data is saved',
//DummiesShowingMess:'"Dummy"-<span nom="vendors">vendors</span> are shown so that one can see how it works.',
//DummiesShowingMess:'To demonstrate some "Dummy"-<span nom="vendors">vendors</span> are included.',
//DummiesShowingMess:'Some "Dummies" are included as demonstration, since only very few <span nom="vendors">vendors</span> are using the site yet.',
//DummiesShowingMess:'Note! the dummies will be remove once more people begin to use the site.',
//DummiesShowingMess:'The "Dummies" are there as demonstration, and will be removed later.',
//DummiesShowingMess:'No real <span nom="vendors">vendors</span>, only "Dummies" are visible right now.',
//DummiesShowingMess:'Dummies are show, since no real <span nom="vendors">vendors</span> are visible right now.',
//DummiesShowingMess:'No real <span nom="vendors">vendors</span> are visible right now.',
//DummiesShowingMess:'Since no <span nom="vendors">vendors</span> are visible right now, some dummies are shown.',
//DummiesShowingMess:'Showing dummies.',
DummiesShowingMess:'No real <span nom="vendors">vendors</span> (only dummies) are visible right now.',
//DummiesShowingMess2:'These will be removed once more people begin to use the site.',


introHead:'New <span nom="vendor">vendor</span>, welcome!',
introBread:'A contact email is needed incase the site changes ID-provider. (The contact email will not be be shown to the public.)',
Tel:'Tel',
ContactEmail:'Contact email',

comparePrice:{head:'Parameters for comparative price'},
Distance:'Distance',
Time:'Time',

agreement:[
'<p>Notice the menu "Fine print".</p><p>Using the site means that you agree to the fineprint.</p><p>If you don\'t agree then don\'t use it.</p>',
'<p>Notice changes under the menu "Fine print".</p>'
],

quickSettings:{
hiddenText:'You are now hidden',
showingText:'You are now visible'
},

setting:{
head:'Settings',
nec:'* = These fields are necessary',
idDriverGovernment:'Driver id-number from your government/authorities',
tel:'Tel',
link:'Web link',
homeTown:'Home town',
vehicleType:'Vehicle type',
Brand:'Brand',
nPassengers:'Number of adult passengers',
childSeat:'Number of child seats',
extraSeat:'Number of extra seats',
wheelChairPlaces:'Number of wheelchair places',
standingByMethod:'Standing by',
shiftEnd:'Shiftend',
idTeam:'Team-id'
},

NotYetApproved:'Not&nbsp;yet&nbsp;approved',

//standingByMethods:['0','1','2','3','4','5','10'],
//standingByMethodsLong:['0','1','2','3','4','5','10'],
//setting.standingByMethod:'Standby (ready in ... [min])',

label:{
index:'index',
idUser:'idVendor',
IP:'IP',
idIP:'idIP',
terminationDate:'',
donatedAmount:'Donated amount [USD]',
created:'Account age',
displayName:'Name',
tel:'Tel',
displayEmail:'Email',
link:'Link',
homeTown:'Home town',
standingByMethod:'How is <span nom="theVendor">the vendor</span> waiting',
idDriverGovernment:'Driver-ID (gov)',
vehicleType:'Vehicle type',
brand:'Brand',
nPassengers:'Number of passengers',
extraSeat:'Extra seats',
childSeat:'Child seats',
wheelChairPlaces:'Wheelchair places',
currency:'Currency',
priceStart:'Start price',
distUnit:'',
pricePerDist:'Price per dist',
pricePerHour:'Price per hour',
lastPriceChange:'Price age',
posTime:'Position age',
shiftEnd:'Shift ends in',
boShow:'',
x:'',
y:'',
nMonthsStartOffer:'',
nPayment:'',
imTag:'',
imTagTeam:'',
idTeam:'Team',
idTeamWanted:'idTeam',
linkTeam:'',
bla:'',
nReport:'Reports',
histActive:'Active days per last-<span></span>-days',
timeAccumulated:'Accumulated time as visible',
tLastWriteOfTA:'',
hideTimer:'Hide timer',
hideTime:'Automatically hide',
comparePrice:'Comparative\nprice',
coordinatePrecisionM:'Coordinate precision',
dist:'Distance',
image:'Picture',
info:'Info',

payload:'Payload [ton]',
generalCargo:'General cargo',
tailLift:'Tail lift',
loaderCrane:'Loader crane',
tipper:'Tipper',
loadableFromTheSide:'Loadable from the side',
iso20:"ISO 20'",
iso40:"ISO 40'",
tiltBed:'Tilt bed',
sideLift:'Side lift',
rollerContainer:'Hook lift',
otherContainer:'Other container', //(Specify standard in the keyword field)
tankTruck:'Tank truck',
flatbed:'Flatbed',
lowboy:'Lowboy',
loggingTruck:'Logging truck',
automobileTransport:'Automobile transport',
livestock:'Livestock',
vehicleTowing:'Vehicle towing',
keyword:'Keyword',

boHome:'Home cleaning',
boOffice:'Office cleaning',
boIndustrial:'Industrial cleaning',
boGotEquipment:'Got own equipment',
boLadder:'Ladder',
boSkyLift:'Skylift or similar',

pushMower:'Push mower',
ridingMower:'Riding mower',
edger:'Edger',
cuttingWidth:'Cutting width [cm]'
},

helpBub:{
index:'',
idUser:'',
IP:'Identity provider',
idIP:'Identity number',
terminationDate:'',
donatedAmount:'How much has <span nom="theVendor">the vendor</span> donated to this site.',
created:'How long since the account was created.',
displayName:'',
tel:'',
displayEmail:'',
link:'... if <span nom="theVendor">the vendor</span> has an own website.',
homeTown:'',
standingByMethod:'',
idDriverGovernment:'Driver ID number from government/authority (so that customers can verify that they are dealing with a legitimate driver.',
vehicleType:'',
brand:'',
nPassengers:'',
extraSeat:'Seats that are of lower standard than normal seats<br>Sometimes limited to persons under a certain weight/length...<br> <img>',
childSeat:'Equipment that changes an adult seat to one that is safer for a child<br> <img><img>',
wheelChairPlaces:'',
currency:'',
priceStart:'',
distUnit:'',
pricePerDist:'',
pricePerHour:'',
lastPriceChange:'How long since the price changed. (Good if the customer suspects that the price has changed since the agreement was made.)',
posTime:'How long since <span nom="theVendor">the vendor</span> uploaded his position. (Helps customers to sort out inactive <span nom="vendors">vendors</span>)',
shiftEnd:'How long before <span nom="theVendor">the vendor</span> ends for the day. (Good for customers who wants to book ahead)',
boShow:'',
x:'',
y:'',
nMonthsStartOffer:'',
nPayment:'',
imTag:'',
imTagTeam:'',
idTeam:'',
idTeamWanted:'<p>Being in a team/company with a brand that the customers recognize, can give the customers extra confidence.</p><p>Read more in the FAQ on how to join/create a team.</p>',
linkTeam:'',
bla:'',
nReport:'',
histActive:'Number of days with any activity during the last <span></span> days',
timeAccumulated:'',
tLastWriteOfTA:'',
hideTimer:"Automatically hide after last position upload.",
hideTime:'Automatically hide at this timepoint.',
comparePrice:'',
coordinatePrecisionM:"If you don't want to reveal your exact poition, you can round it off.",
dist:'',
image:'',
info:'',

payload:'',
generalCargo:'<img></img>', //(as in not only containers)',
tailLift:'<img></img>',
loaderCrane:'<img></img>',
tipper:'<img></img>',
loadableFromTheSide:'<img></img>',
iso20:'<img></img>',
iso40:'<img></img>',
tiltBed:'<img></img>',
sideLift:'<img></img>',
rollerContainer:'<img></img>',
otherContainer:'', //<img></img><br>(Specify standard in the keyword field)
tankTruck:'<img></img><br>(Use the keyword to specify the content)',
flatbed:'<img></img>',
lowboy:'<img></img>',
loggingTruck:'<img></img>',
automobileTransport:'<img></img>',
livestock:'<img></img>',
vehicleTowing:'<img></img>',
keyword:'',
boSkyLift:'Skylift or other advanced tools'
}
} // langHtml
} // function

langServerFunc=function(){
if('taxi' in Site) Site.taxi.langSetup=function(){
  var serv=this.serv={};
  serv.strTitle="Taxis / Taxicabs, Jobs, Free taxi app"; serv.strH1="taxi.closeby.market"; 
  serv.strDescription="Positioning/tracking-tool for finding and comparing taxicabs in the neighborhood";
  serv.strKeywords="job, work, search tool, tracker, taxi, taxicab, freelance, business, entrepreneurs, jobs, job center";
  serv.strSummary="<div>\n\
  <p>This web application uses the positioning system of the customers resp the taxi drivers iphones/androids/computers.</p>\n\
  <p>The customer can then see on a map where all the vacant taxis in the neighborhood are, and compare latest/current prices, number of seats etc.</p>\n\
  <p>The taxi driver can change the price between different periods depending on supply and demand.</p>\n\
</div>";
}

if('transport' in Site) Site.transport.langSetup=function(){
  var serv=this.serv={};
  serv.strTitle="Couriers / Truckers, Jobs"; serv.strH1="transport.closeby.market"; 
  serv.strDescription="Positioning/tracking-tool for finding and comparing couriers and goods transports";
  serv.strKeywords="job, work, search tool, tracker, truckers, couriers, drivers, freelance, business, entrepreneurs, jobs, job center";
  serv.strSummary="<div>\n\
  <p>This web application uses the positioning system of the customers resp the drivers iphones/androids/computers.</p>\n\
  <p>The customer can then see on a map where all the vacant vehicles in the neighborhood are, and compare latest/current prices, vehicle type etc.</p>\n\
  <p>The driver can change the price between different periods depending on supply and demand.</p>\n\
</div>";
}

if('cleaner' in Site) Site.cleaner.langSetup=function(){
  var serv=this.serv={};
  serv.strTitle="Cleaners / Janitors / Chars, Jobs"; serv.strH1="cleaner.closeby.market";
  serv.strDescription="Positioning/tracking-tool for finding and comparing cleaners/janitors/chars";
  serv.strKeywords="job, work, search tool, tracker, cleaners, chars, janitors, freelance, business, entrepreneurs, jobs, job center";
  serv.strSummary="<div>\n\
  <p>Tracker-web-app for cleaners and those who seek cleaners.</p>\n\
  <p>The cleaner can make him/herself visible for the customers, and the customers can on a map see which cleaners are available for the moment and compare prices and reputation etc.</p>\n\
</div>";
}
if('windowcleaner' in Site) Site.windowcleaner.langSetup=function(){
  var serv=this.serv={};
  serv.strTitle="Window Cleaners, Jobs"; serv.strH1="windowcleaner.closeby.market";
  serv.strDescription="Positioning/tracking-tool for finding and comparing window cleaners";
  serv.strKeywords="job, work, search tool, tracker, window cleaners, freelance, business, entrepreneurs, jobs, job center";
  serv.strSummary="<div>\n\
  <p>Tracker-web-app for window cleaners and those who seek window cleaners.</p>\n\
  <p>The window cleaner can make him/herself visible for the customers, and the customers can on a map see which window cleaners are available for the moment and compare prices and reputation etc.</p>\n\
</div>";
}

if('fruitpicker' in Site) Site.fruitpicker.langSetup=function(){
  var serv=this.serv={};
  serv.strTitle="Fruit / Vegetable Pickers, Jobs"; serv.strH1="fruitpicker.closeby.market";
  serv.strDescription="Positioning/tracking-tool for finding and comparing fruit/vegetable-pickers.";
  serv.strKeywords="job, work, search tool, tracker, fruit, vegetable,  pickers, freelance, business, entrepreneurs, jobs, job center";
  serv.strSummary="<div>\n\
  <p>Tracker-web-app of fruit/vegetable pickers.</p>\n\
  <p>Those who want work as pickers can make themselves visible to employers. Works all over the world. Usefull for short-time employments.</p>\n\
</div>";
}

if('lawnmower' in Site) Site.lawnmower.langSetup=function(){
  var serv=this.serv={};
  serv.strTitle="Lawn Mower Drivers, Jobs"; serv.strH1="lawnmower.closeby.market";
  serv.strDescription="Positioning/tracking-tool for finding and comparing lawn mowing entrepreneurs / people ready mow lawns";
  serv.strKeywords="job, work, search tool, tracker, lawn mowing, freelance, business, entrepreneurs, jobs, job center";
  serv.strSummary="<div>\n\
  <p>Tracker-web-app for lawn mowing entrepreneurs.</p>\n\
  <p>Those who want work mowing lawns can make themselves visible to employers. Works all over the world. Usefull for short-time employments.</p>\n\
</div>";
}
if('snowremoval' in Site) Site.snowremoval.langSetup=function(){
  var serv=this.serv={};
  serv.strTitle="Snow Removal, Jobs"; serv.strH1="snowremoval.closeby.market";
  serv.strDescription="Positioning/tracking-tool for finding and comparing snow shovelers/plowers ...";
  serv.strKeywords="job, work, search tool, tracker, snow removal, shoveling, plowing, freelance, business, entrepreneurs, jobs, job center";
  serv.strSummary="<div>\n\
  <p>Tracker-web-app for snow shoveler / plower entrepreneurs.</p>\n\
  <p>Those who want snow shoveling/plowing-jobs can make themselves visible to any customer. Works all over the world.</p>\n\
</div>";
}

if('programmer' in Site) Site.programmer.langSetup=function(){
  var serv=this.serv={};
  serv.strTitle="Programmers, Jobs"; serv.strH1="programmer.closeby.market";
  serv.strDescription="Positioning/tracking-tool for finding and comparing programmers.";
  serv.strKeywords="job, work, search tool, tracker, programmers, freelance, business, entrepreneurs, jobs, job center";
  serv.strSummary="<div>\n\
  <p>Tracker-web-app for programmers and those who seek programmers.</p>\n\
  <p>The programmer can make him/herself visible for the customers, and the customers can on a map see which programmers are available for the moment and compare skills etc.</p>\n\
</div>";
}


//Site.bla.langSetup=function(){this.strTitle="App for Sellers"; this.strH1="App for Sellers"; this.strSummary='<div></div>';}


}









