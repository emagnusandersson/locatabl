<?php
ob_start(); session_start(); 
$wCodeFolder=ltrim(dirname($_SERVER["SCRIPT_NAME"]),'/');  

require_once 'commonVariables.php';
?>
<html>
<head>
</head>
<body>

<?php
echo "<script src='http://code.jquery.com/jquery-latest.js'></script>";
echo '<script src="http://'.$wwwCodeFolder.'/lib.js"></script>';
?>
<script>

var fileLoginReturn=<?=json_encode($fileLoginReturn);?>;

var $loginSpan=$('<span>'); $('body').append($loginSpan);
$loginSpan.$mess=$('<span>');   $loginSpan.append($loginSpan.$mess);
var $imgBusy=$('<img>').attr({src:'busy.gif'});


$loginSpan.popup=function(e,IP,openid) {
  e.preventDefault();
  $loginSpan.$mess.empty();  $loginSpan.$mess.append('Signing you in ',$imgBusy);
  
  //var uPop;  if(IP==='openid') uPop='loginOIDStart.php?openid_identifier='+encodeURIComponent(openid); else if(IP==='fb') uPop='loginFBStart.php?openid_identifier=""';
  var uPop;  if(IP==='openid') uPop='loginStart.php?IP=openid&openid_identifier='+encodeURIComponent(openid); else if(IP==='fb') uPop='loginStart.php?IP=fb';
  var tmp=fileLoginReturn;  tmp='&fileReturn='+encodeURIComponent(tmp);  uPop+=tmp;

  $loginSpan.win=window.open(uPop, 'popup', 'width=790,height=580');
  $loginSpan.timerClosePoll = setInterval(function() { if($loginSpan.win.closed){ clearInterval($loginSpan.timerClosePoll); $loginSpan.$mess.html('Sign-in canceled'); }  }, 500);  
  return 0;
}


$loginSpan.loginReturn=function(IP, idIP, nickIP, nameIP, boExist, driverInfoFrDB, boVisible, strMess) {
  //var tmp=IP+', '+idIP+', '+nickIP+', '+nameIP+', '+boExist+', '+JSON.stringify(driverInfoFrDB)+', '+boVisible+', '+strMess; 
  var tmp=IP+', '+idIP+', '+nickIP+', '+nameIP+', '+boExist+', '+print_r(driverInfoFrDB)+', '+boVisible+', '+strMess; 
  
  $loginSpan.$mess.html(tmp);
  clearInterval($loginSpan.timerClosePoll);
}
var loginReturn=$loginSpan.loginReturn;


$ops=$('<div>');

$field=$('<input>').attr({type:'text',id:"openid_identifier"});  $submit=$('<input>').attr({type:'submit'}).val('sign in');
$field.css({background: 'url(openid-inputicon.gif) no-repeat scroll 0 50%', 'padding-left':'18px'});
$openidForm=$('<form>').submit(function(e){$loginSpan.popup(e,'openid',$field.val());}).append($field,$submit);
$openidForm.css({display:'inline'});
$fbButt=$('<button>').html('facebook').click(function(e){$loginSpan.popup(e,'fb','');});
$ops.append('Sign in using:',$fbButt,', or OpenID:',$openidForm);
$('body').append($ops);

</script>

</body>
</html>
