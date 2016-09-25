
//
// For variable naming convention see https://emagnusandersson.com/myNodeApps_notation
//


  // Leave these empty if don't want to show them.
strBTC='1abcdefghijklmnopqrstuvwxyzABCDEFG'; // Bitcoin address 
ppStoredButt="ABCDEFGHIJKLM";  // Paypal-stored-button


intDDOSMax=200; // intDDOSMax: How many requests before DDOSBlocking occurs. 
tDDOSBan=5; // tDDOSBan: How long in seconds till the blocking is lifted



googleSiteVerification="googleXXXXXXXXXXXXXXXX.html"; // Needed if you use Google Webmaster Tools  (www.google.com/webmasters)



RegRedir=[];
  //
  // This "if"-statement allows you to keep the same config-file for multiple infrastructure
  //
  // If you are running on:
  //   * heroku.com, then create a environment variable strInfrastructure='heroku' 
  //   * appfog.com, then create a environment variable strInfrastructure='af' 
  //   * digitalocean.com, then create a environment variable strInfrastructure='do' 
  //   * localhost, then you can enter your settings in the "else"-statement below
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
  //LevelMaintenance={ taxi:0, transport:0, cleaner:0, windowcleaner:0, fruitpicker:0, lawnmower:0, snowremoval:0, programmer:0};
  levelMaintenance=0;
  wwwLoginRet=Site.taxi.wwwSite+"/"+leafLoginBack;
  wwwLoginScope=Site.taxi.wwwSite;

}else if(process.env.strInfrastructure=='af'){  // (is yet to be written)
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
  //LevelMaintenance={ taxi:0, transport:0, cleaner:0, windowcleaner:0, fruitpicker:0, lawnmower:0, snowremoval:0, programmer:0};
  levelMaintenance=0;
  wwwLoginRet=Site.taxi.wwwSite+"/"+leafLoginBack;
  wwwLoginScope=Site.taxi.wwwSite;

}
else {  
  UriDB={default:'mysql://user:password@host/database'};

  //port = process.argv[2] || 8081; 
  port = port || 8081; 
  Site={
    taxi:{wwwSite:"YOURTAXIWWW", strRootDomain:"exampleDomain", googleAnalyticsTrackingID:"",db:"default"},
    transport:{wwwSite:"YOURTAXIWWW", strRootDomain:"exampleDomain", googleAnalyticsTrackingID:"",db:"default"}  
  }
  //LevelMaintenance={ taxi:0, transport:0, cleaner:0, windowcleaner:0, fruitpicker:0, lawnmower:0, snowremoval:0, programmer:0};
  levelMaintenance=0;
  wwwLoginRet=Site.taxi.wwwSite+"/"+leafLoginBack;
  wwwLoginScope=Site.taxi.wwwSite;

  boDbg=1; payLev=0; boTerminationCheck=1; boShowTeam=0; 
  userInfoFrIPDbg={IP:'fb',idIP:'100002646477985',nameIP:'Magnus Andersson'};

}  



  // I used to have fb as IP (ID provider) then idplace
  // The mergeID-request allows users to merge old ID, (reputation etc) into new ID.
  // Hereof these variables:
  //   strIPPrim: primary IP 
  //   strIPAlt:  alternative IP
strIPPrim='google';  strIPAlt='fb';
strIPPrim='fb';  strIPAlt='google';
strIPPrim='idplace';  strIPAlt='fb';


  // OAuth response type 'code' or 'token'
response_type='code';


  // Exactly what is idplace (since I am the developer of that too, it might vary)
urlAuthIdplace="http://localhost:5000";
urlAuthIdplace="http://192.168.0.5:5000";
//urlAuthIdplace="http://l750.local:5000";
//urlAuthIdplace="http://l750.tja:5000";
//urlAuthIdplace="https://testgavott.herokuapp.com";
urlAuthIdplace="https://idplace.herokuapp.com";
urlAuthIdplace="https://idplace.org";
urlAuthIdplace=rtrim(urlAuthIdplace,'/');



  // If wwwCommon is not set then set it to the first "wwwSite" in "Site"
if(!wwwCommon) {var keys=Object.keys(Site); wwwCommon=Site[keys[0]].wwwSite; }  
wwwIcon16=wwwCommon+'/Site/Icon/icon16.png';   wwwIcon114=wwwCommon+'/Site/Icon/icon114.png';    wwwIcon200=wwwCommon+'/Site/Icon/icon200.png';





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








