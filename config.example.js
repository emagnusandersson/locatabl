
//
// For variable naming convention see https://emagnusandersson.com/prefixes_to_variables
//


  // Leave these empty if don't want to show them.
strBTC='1abcdefghijklmnopqrstuvwxyzABCDEFG'; // Bitcoin address 
ppStoredButt="ABCDEFGHIJKLM";  // Paypal-stored-button


intDDOSMax=200; // intDDOSMax: How many requests before DDOSBlocking occurs. 
timeOutDDOSBan=5; // timeOutDDOSBan: How long in seconds til the blocking is lifted
intDDOSIPMax=100; // intDDOSIPMax: How many requests before DDOSBlocking occurs. 
timeOutDDOSIPBan=10; // timeOutDDOSIPBan: How long in seconds til the blocking is lifted

boUseDBIndex=0;
timeOutAccumulatedUpdate=3600; // How long to wait before updating tAccumulated in buyer/seller tabs

timeOutDeleteStatusInfo=3600;

  // Needed if you use Google Webmaster Tools  (www.google.com/webmasters)
googleSiteVerification='googleXXXXXXXXXXXXXXXX.html';


RegRedir=[];


strSalt='abcdefghijklmnop'; // Random letters to prevent that the hashed passwords looks the same as on other sites.


  // Create idplace url (local or production etc.)
var createUrlAuthIdPlace=function(strIdPlace="idplace",portIdPlace=5000){
    // Note !!! no ending slash
  var UrlIdplace={
    local:"http://localhost:"+portIdPlace,
    "192":"http://"+www192+":"+portIdPlace,
    testgavott:"https://testgavott.herokuapp.com",
    idplaceherokuapp:"https://idplace.herokuapp.com",
    idplaceorg:"https://idplace.org"
  }

  return UrlIdplace[strIdPlace];
  
}

var www192=ip.address();  // 192.168.0.X;
if(www192=='127.0.0.1') www192='localhost';

urlAuthIdplace=createUrlAuthIdPlace('idplaceorg');  // Which idplace (local or production etc.)
strIPPrim='idplace';  strIPAlt='fb';  // Which IdP?
strIPPrim='fb';  strIPAlt='idplace';  // Which IdP?

apiKeySendGrid="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
emailRegisterdUser="noreply@example.com";



  //
  //  Since one might want use the software on several different infrastrucures (heroku.com, appfog.com, digitalocean.com, localhost ...),
  //  then I personally use an environment variable "strInfrastructure" on respective site, set to either to 'heroku', 'af', 'do' or nothing assigned (localhost)
  //  This way one can use the same config file for all the infrastructures.
  //

if(process.env.strInfrastructure=='heroku'){

    // UriDB: an object storing database urls
  UriDB={ 
    //exampleDB:"mysql://user:password@host/database?reconnect=true" 
  }
    // If you added the ClearDB-database on the heroku.com-interface then that one is added as "default".
  if('CLEARDB_DATABASE_URL' in process.env) UriDB.default=process.env.CLEARDB_DATABASE_URL;


    // Heroku uses the environment variable "PORT" to store the port used:
  port = parseInt(process.env.PORT, 10); 


    // RootDomain: an object to store app credetials from IPs (identity providers) and other data to the root domain (I'm using "root domain" for Second level domains (xxx.xxx))
    //   googleAPIKey: is needed otherwise you won't be able to use the map.
  RootDomain={
    exampleDomain:{
      idplace:{id: "XXXXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}, 
      //fb:{id:"XXXXXXXXXXXXXXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"},
      //google:{id: "X", secret:"XXXXXXXXXXXXXXXXXXXXXXXX"},
      googleAPIKey:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    }
  }

    // Site: an oject to store data about each site
    //   Note! "www" is my special notation see more https://emagnusandersson.com/myNodeApps_notation 
  Site={
    taxi:{wwwSite:"YOURTAXIWWW", strRootDomain:"exampleDomain", googleAnalyticsTrackingID:"UA-XXXXXXXX-XX",db:"default"},
    transport:{wwwSite:"YOURTAXIWWW", strRootDomain:"exampleDomain", googleAnalyticsTrackingID:"UA-XXXXXXXX-XX",db:"default"}  
  }

  //LevelMaintenance={ taxi:0, transport:0, cleaner:0, windowcleaner:0, fruitpicker:0, lawnmowing:0, snowremoval:0, programmer:0};
  levelMaintenance=0;
  wwwLoginRet=Site.taxi.wwwSite+"/"+leafLoginBack;
  wwwLoginScope="closeby.market";

  RegRedir=[
  function(req){
    var Str=RegExp('^([^\\.]+)\\.tracker\\.center$').exec(req.headers.host);
    if(Str) {    return 'https://'+Str[1]+'closeby.market/'+req.url;   }
    return null;
  }
  ];


}else if(process.env.strInfrastructure=='do'){

  UriDB={default:'mysql://user:password@host/database'};

  port = 8081;
  RootDomain={
    exampleDomain:{
      idplace:{id: "XXXXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"},
      googleAPIKey:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    }
  }
  Site={
    taxi:{wwwSite:"YOURTAXIWWW", strRootDomain:"exampleDomain", googleAnalyticsTrackingID:"UA-XXXXXXXX-XX",db:"default"},
    transport:{wwwSite:"YOURTAXIWWW", strRootDomain:"exampleDomain", googleAnalyticsTrackingID:"UA-XXXXXXXX-XX",db:"default"}  
  }
 
  //LevelMaintenance={ taxi:0, transport:0, cleaner:0, windowcleaner:0, fruitpicker:0, lawnmowing:0, snowremoval:0, programmer:0};
  levelMaintenance=0;
  wwwLoginRet=Site.taxi.wwwSite+"/"+leafLoginBack;  wwwLoginScope="closeby.market";

  RegRedir=[
  function(req){
    var Str=RegExp('^([^\\.]+)\\.tracker\\.center$').exec(req.headers.host);
    if(Str) {    return 'https://'+Str[1]+'closeby.market/'+req.url;   }
    return null;
  }
  ];
 

  strReCaptchaSiteKey="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";   strReCaptchaSecretKey="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";  //localhost
  //boDbg=1;
  boShowTeam=1; 
}
else {
  boUseDBIndex=1;

  var strIdPlace='192';
  var strIdPlace='local';
  var strIdPlace='idplaceorg';
  urlAuthIdplace=createUrlAuthIdPlace(strIdPlace,5002);  // Which idplace (local or production etc.)
  strIPPrim='idplace';  strIPAlt='fb';  // Which IdP?
  strIPPrim='fb';  strIPAlt='idplace';  // Which IdP?

  UriDB={default:'mysql://user:password@host/database'};

  var TmpCred={ // 
    localhost:{
      idplaceherokuapp:{id: "XXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"},
      //"192":{id: "XXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"},
      "local":{id: "XXX", secret:"XXXXXXXXXXXXXXXXXXX"},
      "192":{id: "XXX", secret:"XXXXXXXXXXXXXXXXXXX"},
      idplaceorg:{id: "XXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}
    },
    dotLocal:{
      "192":{id: "XXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"},
      "local":{id: "XXX", secret:"XXXXXXXXXXXXXXXXXXX"},
      idplaceorg:{id: "XXX", secret:"XXX"}
    }
  }
  RootDomain={
    localhost:{
      fb:{id:"XXXXXXXXXXXXXXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"},
      google:{id: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com", secret:"XXXXXXXXXXXXXXXXXXXXXXXX"},
      idplace:TmpCred.localhost[strIdPlace],
      googleAPIKey:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    },
    "192Loc":   {
      idplace:{id: "XXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}, // https://idplace.herokuapp.com
      fb:{id:"XXXXXXXXXXXXXXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"},
      google:{id: "XXX", secret:"XXX"},
      googleAPIKey:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    },
    "dotLocal":   {
      google:{id: "XXX", secret:"XXX"},
      fb:{id:"XXXXXXXXXXXXXXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"},
      idplace:TmpCred.dotLocal[strIdPlace],
    }
  }

  boUseSSLViaNodeJS=true;

  //port = process.argv[2] || 8081; 
  port = port || 8081;
  var portTmp=port;
  var wwwLocalhost='localhost:'+portTmp, www192WPort=www192+':'+portTmp;
  Site={
    taxi:{wwwSite:"YOURTAXIWWW", strRootDomain:"exampleDomain", googleAnalyticsTrackingID:"",db:"default"},
    transport:{wwwSite:"YOURTAXIWWW", strRootDomain:"exampleDomain", googleAnalyticsTrackingID:"",db:"default"}  
  }
  //LevelMaintenance={ taxi:0, transport:0, cleaner:0, windowcleaner:0, fruitpicker:0, lawnmowing:0, snowremoval:0, programmer:0};
  levelMaintenance=0;
  
  buDbgShowDummies=1;

  boDbg=1; boShowTeam=1; 
  userInfoFrIPDbg={IP:'fb',idIP:'XXXXXXXXXXXXXXX',nameIP:'John Doe'};
  boSlowNetWork=0; // In normal case, when debugging, one should disable cache. However if the network is really, really slow one can use caching and this option.  

  strReCaptchaSiteKey="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";   strReCaptchaSecretKey="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";  //localhost
  


} // End of boLocal 

  // WebPush keys
VAPID_PUBLIC_KEY='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
VAPID_PRIVATE_KEY='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

boEnablePushNotification=true;

//
// wwwCommon
//

if(!wwwCommon) {var keys=Object.keys(Site), nKey=keys.length; wwwCommon=Site[keys[0]].wwwSite; }  


//
// Endpoint urls for the IdP.
//
strFBVersion="v7.0"

UrlOAuth={fb:"https://www.facebook.com/"+strFBVersion+"/dialog/oauth", google:"https://accounts.google.com/o/oauth2/v2/auth", idplace:urlAuthIdplace}
UrlToken={fb:"https://graph.facebook.com/"+strFBVersion+"/oauth/access_token", google:"https://accounts.google.com/o/oauth2/token", idplace:urlAuthIdplace+"/access_token"}
UrlGraph={fb:"https://graph.facebook.com/"+strFBVersion+"/me", google:"https://www.googleapis.com/plus/v1/people/me", idplace:urlAuthIdplace+"/me"};
response_type='token';    
response_type='code';





/***********************************************************************************
 * Paypal variables (really obsolete now)
 ***********************************************************************************/
if(boDbg){
  domainPayPal='www.sandbox.paypal.com';
  urlPayPal='https://www.sandbox.paypal.com/cgi-bin/webscr';
  boSV=0;   
  accountPayPal='XXXXXXXXXXXXX';
  emailPayPal='xxxxxxxxx@example.com';
  storedButt={donate:"",sponsring:"XXXXXXXXXXXXX",pay:"XXXXXXXXXXXXX",payTax:"XXXXXXXXXXXXX",prices:[2,10,20],cur:'USD'};
  
}
else {
  domainPayPal='www.paypal.com';
  urlPayPal='https://www.paypal.com/cgi-bin/webscr'; 

  accountPayPal='XXXXXXXXXXXXX';
  emailPayPal='mail@taxiselector.com';
  storedButt={donate:"",sponsring:"XXXXXXXXXXXXX",pay:"XXXXXXXXXXXXX",payTax:"XXXXXXXXXXXXX",prices:[2,10,20],cur:'USD'};
}








