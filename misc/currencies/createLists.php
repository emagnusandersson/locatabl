<!DOCTYPE html>
<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<?php


//http://stackoverflow.com/questions/7441361/iso-currency-list


$content = file_get_contents("currencies.txt");  //echo $content;

$matches=array();
$n=preg_match_all('/^(.*)\s+([A-Z]{3})\s+(\d)$/m', $content, &$matches);
//$n=preg_match_all('/^.*\s+[A-Z]{3}\s+\d$/m', $content, &$matches);
$matches=array_slice($matches, 1);

echo $n.'<br>';
//echo '<pre>'.print_r($matches,1).'</pre>';

    // remove duplets
$newArr=array(array(),array(),array());
for($i=0;$i<count($matches[0]);$i++){
  $code=$matches[1][$i];  
  if(!in_array($code, $newArr[1])) {
    if($code!='MXV' AND $code!='USN' AND $code!='USS' AND $code!='UYI')
    for($j=0;$j<3;$j++) $newArr[$j][]=$matches[$j][$i]; 
  }
}
echo count($newArr[0]).'<br>';


    //sort
$tmp=$newArr[1];
asort($tmp);  $keys=array_keys($tmp);
//echo '<pre>'.print_r($keys,1).'</pre>'; exit;
$newArr1=array(array(),array(),array());
foreach($keys as $k=>$key){
  for($j=0;$j<3;$j++) $newArr1[$j][$k]=$newArr[$j][$key]; 
}
//echo '<pre>'.print_r($newArr1,1).'</pre>'; exit;


$matches=$newArr1;
/*
$strJS='';
$strPHP='';
for($i=0;$i<count($matches[0]);$i++){
  $strJS.="['".$matches[0][$i]."','".$matches[1][$i]."',".$matches[2][$i]."],\n";
  $strPHP.="array('".$matches[0][$i]."','".$matches[1][$i]."',".$matches[2][$i]."),\n";
}
$strJS="currencies=[$strJS];";
$strPHP="\$currencies=array($strPHP);";
echo '<pre>'.print_r($strJS,1).'</pre>';
echo "<br><br><br>";
//echo '<pre>'.print_r($strPHP,1).'</pre>';
*/
/*
$strJS=array('','','');
for($i=0;$i<count($matches);$i++){
  for($j=0;$j<count($matches[$i]);$j++) $strJS[$i].="'".$matches[$i][$j]."',";
}
*/
$strJS0='';$strJS1='';$strJS2='';
$len=count($matches[0]);
for($j=0;$j<$len;$j++) {$strJS0.="'".$matches[0][$j]."',";  $strJS1.="'".$matches[1][$j]."',";  $strJS2.=$matches[2][$j].',';}

$strJS="currencies=[[$strJS0],\n[$strJS1],\n[$strJS2]\n];";

echo '<pre>'.print_r($strJS,1).'</pre>'; exit;



?>
<body>

