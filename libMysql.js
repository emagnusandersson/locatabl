

//
// Mysql interface
// 

app.MyMySql=function(pool){ this.pool=pool; this.connection=null;  }
MyMySql.prototype.getConnection=async function(){
  var [err, connection]= await new Promise(resolve=>{   this.pool.getConnection((...arg)=>resolve(arg));    });
  this.connection=connection; return [err];
}
MyMySql.prototype.startTransaction=async function(){
  if(!this.connection) {var [err]=await this.getConnection(); if(err) return [err];}
  var err=await new Promise(resolve=>{   this.connection.beginTransaction(eT=>resolve(eT));   });     if(err) return [err];
  this.transactionState='started';
  return [null];
}
MyMySql.prototype.query=async function(sql, Val=[]){
  if(!this.connection) {var [err]=await this.getConnection(); if(err) return [err];}
  var [err, results, fields]=await new Promise(resolve=>{    this.connection.query(sql, Val, (...arg)=>resolve(arg) );      });
  return [err, results, fields];
}
MyMySql.prototype.rollback=async function(){  await new Promise(resolve=>{this.connection.rollback(()=>resolve());   });   }
MyMySql.prototype.commit=async function(){
  var err=await new Promise(resolve=>{   this.connection.commit(eT=>resolve(eT));   });   return [err];
}
MyMySql.prototype.rollbackNRelease=async function(){  await new Promise(resolve=>{this.connection.rollback(()=>resolve())});  this.connection.release(); }
MyMySql.prototype.commitNRelease=async function(){
  var err=await new Promise(resolve=>{this.connection.commit(eT=>resolve(eT));  });  this.connection.release();  return [err];
}
MyMySql.prototype.fin=function(){   if(this.connection) { this.connection.destroy();this.connection=null;};  }




app.RHide=async function(objArg){  // writing needSession
  var {req}=this;
  //var Ou={};
  //var {user, buyer, seller}=this.sessionUserInfoFrDB; if(!user || (!buyer && !seller)) { this.mes('No session'); return [null, [Ou,'errFunc']];}
  //var {idUser}=user;
  var {idUser, idFB, site}=objArg, {siteName}=site;
  var {userTab, buyerTab, sellerTab, buyerTeamTab, sellerTeamTab}=site.TableName;
  if(idUser) {var idT=idUser, columnT='idUser';} else {var idT=idFB, columnT='idFB';}

     // Get iRole
  var Sql=[];
  //Sql.push("SELECT iRoleActive FROM "+userTab+" WHERE idUser=?"); var Val=[idUser];
  Sql.push("SELECT iRoleActive AS iRole, idUser FROM "+userTab+" WHERE "+columnT+"=?"); var Val=[idT];
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err, {}];
  if(results.length==0) { return [Error('No such idUser in the database'), {}];}
  //var iRole=results[0].iRoleActive
  var {iRole,idUser}=results[0];
  var roleTab=iRole?sellerTab:buyerTab;
  var roleTeamTab=iRole?sellerTeamTab:buyerTeamTab;

  var Sql=[], Val=[];
  Sql.push("CALL "+siteName+"TimeAccumulatedUpdOne(?);"); 
  Sql.push("UPDATE "+roleTab+" SET tPos=0, tHide=0, histActive=histActive|1, boShow=0 WHERE idUser=?;");
  Sql.push(`SELECT `+site.SqlColSelOne[iRole]+` FROM (`+roleTab+` ro LEFT JOIN `+roleTeamTab+` tea on tea.idUser=ro.idTeam) WHERE ro.idUser=?;`);
  Val=[idUser,idUser,idUser];
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err, {}];
  //var c=results[1].affectedRows;
  var objR=results[2][0];
    
  return [null, {iRole, objR}];
} 

   
  // accountMerge: The arguments: idUser, idFB, idIdPlace, idOpenId and email may point to different accounts. If so, then those accounts should be merged.
  // Any of the above mentioned arguments may be null.
app.accountMerge=async function(objArg){
  var {req}=this, {site}=req, ORole=site.ORole, {userTab, buyerTab, sellerTab, complaintTab}=site.TableName;
  var con=this.con;
  var {idUser, idFB, idIdPlace, idOpenId, email, nameIP, image}=objArg, Ou={idUser:null};
  var StrMes=[];
  var donatedAmount=0, nComplaint=0, nComplaintCum=0, nComplaintGiven=0, nComplaintGivenCum=0; 
  var sql="SELECT * FROM "+userTab+" WHERE idUser=? OR idFB=? OR idIdPlace=? OR idOpenId=? OR email=? ORDER BY tCreated";
  var Val=[idUser, idFB, idIdPlace, idOpenId, email];
  var [err, resultsU]=await this.myMySql.query(sql, Val); if(err) return [err];
  var nU=resultsU.length;
  //if(nU==0) {
    //if(objArg.boCreate){
      //var Sql=[];
      //Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW) VALUES (?, ?, ?, ?, ?, ?, MD5(RAND()) );");
      //Sql.push("SELECT LAST_INSERT_ID() AS idUser;");
      //var sql=Sql.join('\n'), Val=[idFB, idIdPlace, idOpenId, email, nameIP, image];
      //var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
      //Ou.idUser=results[1][0].idUser;
    //}
  //}else
  if(nU==1) {
    var rowT=resultsU[0];
    var sql="UPDATE "+userTab+" SET idFB=IF(? IS NULL, idFB, ?), idIdPlace=IF(? IS NULL, idIdPlace, ?), idOpenId=IF(? IS NULL, idOpenId, ?), email=IF(? IS NULL, email, ?), nameIP=IF(? IS NULL, nameIP, ?), image=IF(? IS NULL, image, ?) WHERE idUser=?;";
    var Val=[idFB, idFB, idIdPlace, idIdPlace, idOpenId, idOpenId, email, email, nameIP, nameIP, image, image,   rowT.idUser]; 
    var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
    Ou.idUser=rowT.idUser;
  }else if(nU>1) {
    var tCreatedU=Infinity, iBestU=0, ValU=[];
    for(var i=0;i<nU;i++){
      var rowT=resultsU[i];
      idFB=idFB||rowT.idFB;  idIdPlace=idIdPlace||rowT.idIdPlace;  idOpenId=idOpenId||rowT.idOpenId;  email=email||rowT.email;
      donatedAmount+=rowT.donatedAmount; nComplaint+=rowT.nComplaint; nComplaintGiven+=rowT.nComplaintGiven; nComplaintCum+=rowT.nComplaintCum; nComplaintGivenCum+=rowT.nComplaintGivenCum;
      if(rowT.tCreated<tCreatedU) {tCreatedU=rowT.tCreated; iBestU=i;}
      ValU.push(resultsU[i].idUser);
    }
    var rowBest=resultsU[iBestU], idUserUBest=rowBest.idUser;
    
 
      // Now check which roleTab row to keep
    for(var j=0;j<ORole.length;j++){
      var {charRole, strRole}=ORole[j];
      var roleTab=charRole=='b'?buyerTab:sellerTab;
      var strQMark=array_fill(nU,'?').join(', ');
      var sql="SELECT idUser, coordinatePrecisionM, tCreated, histActive, tAccumulated FROM "+roleTab+" WHERE idUser IN("+strQMark+");";
      var [err, resultsR]=await this.myMySql.query(sql, ValU); if(err) return [err];
      var nR=resultsR.length;
      if(nR==1) {
        var rowT=resultsR[0];
        if(idUserUBest!=rowT.idUser) {
          var sql="UPDATE "+roleTab+" SET idUser=? WHERE idUser=?;";  var Val=[idUserUBest, rowT.idUser];
          var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
          var c=results.affectedRows; StrMes.push(c+" rows from "+strRole+"Tab changed idUser.");
        }
      } else if(nR>1) {
          // Select one roleTab-row, delete the others, update the selected row, change the rows idUser to idUserUBest
        var coordinatePrecisionM=0, tCreated=Infinity, tAccumulated=0, iBest=0, Val=[];
        for(var i=0;i<nR;i++){
          var rowT=resultsR[i];
          if(rowT.coordinatePrecisionM>coordinatePrecisionM) coordinatePrecisionM=rowT.coordinatePrecisionM;
          if(rowT.tCreated<tCreated) {tCreated=rowT.tCreated;}
          if(rowT.tAccumulated>tAccumulated) {tAccumulated=rowT.tAccumulated; iBest=i;}
          Val.push(resultsR[i].idUser);
        }
        var rowBest=resultsR[iBest];
        var idUserVBest=rowBest.idUser
        Val.splice(iBest,1);
        
        var strQMark=array_fill(nR-1,'?').join(', ');
        var sql="DELETE FROM "+roleTab+" WHERE idUser IN("+strQMark+");";
        var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
        var c=results.affectedRows; StrMes.push(c+" rows from "+strRole+"Tab deleted.");
        
        var sql="UPDATE "+roleTab+" SET idUser=?, tCreated=?, coordinatePrecisionM=? WHERE idUser=?;";
        var Val=[idUserUBest, tCreated, coordinatePrecisionM, idUserVBest];
        var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
        var c=results.affectedRows; StrMes.push(c+" rows from "+strRole+"Tab updated.");
      }
    }
      
      // Delete multiple key combos in the complaintTab.
    var sql=`
      -- Create a table tmpA with only the involved idMerge's
    DROP TABLE IF EXISTS tmpA;
    CREATE TEMPORARY TABLE tmpA AS SELECT $strColToMerge AS idMerge, $strColAlt AS idAlt FROM $strTab WHERE $strColToMerge IN($strToMergeAll);

      -- Create a table tmpB with the idAlts that have multiple entries in tmpA
    DROP TABLE IF EXISTS tmpB;
    CREATE TEMPORARY TABLE tmpB AS SELECT idAlt
        FROM 
        (SELECT idAlt, COUNT(*) AS Counter 
         FROM tmpA 
         GROUP BY idAlt) AS tbl WHERE Counter>1;

    DELETE t FROM $strTab t JOIN tmpB tB ON t.$strColAlt=tB.idAlt WHERE $strColToMerge IN ($strToMergeObs);`;
    
    var ValUObs=ValU.concat();  ValUObs.splice(iBestU,1);
    var sql=myParser(sql, {strTab:complaintTab, strColToMerge:'idComplainer', strColAlt:'idComplainee', strToMergeAll:ValU.join(','), strToMergeObs:ValUObs.join(',')});
    var [err, results]=await this.myMySql.query(sql, ValU); if(err) return [err];
    var sql=myParser(sql, {strTab:complaintTab, strColToMerge:'idComplainee', strColAlt:'idComplainer', strToMergeAll:ValU.join(','), strToMergeObs:ValUObs.join(',')});
    var [err, results]=await this.myMySql.query(sql, ValU); if(err) return [err];
      
      // Update nComplaint and nComplaintGiven
    var Sql=[];
    Sql.push('SELECT @n:=COUNT(*) FROM '+complaintTab+' WHERE idComplainee=?;');
    Sql.push('SELECT @nW:=COUNT(*) FROM '+complaintTab+' WHERE idComplainer=?;');
    Sql.push('UPDATE '+userTab+' SET nComplaint=@n, nComplaintGiven=@nW WHERE idUser=?;');
    Sql.push('UPDATE '+buyerTab+' SET nComplaint=@n, nComplaintGiven=@nW WHERE idUser=?;');
    Sql.push('UPDATE '+sellerTab+' SET nComplaint=@n, nComplaintGiven=@nW WHERE idUser=?;');
    var sql=Sql.join('\n'), Val=Array(5).fill(idUserUBest);
    var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
    
      
      // As there are multiple user-rows, then delete the surplus ones and update the one to keep.
    ValUObs.splice(iBestU,1);
    var strQMark=array_fill(ValUObs.length,'?').join(', ');
    var sql="DELETE FROM "+userTab+" WHERE idUser IN("+strQMark+");";
    var [err, results]=await this.myMySql.query(sql, ValUObs); if(err) return [err];
    var c=results.affectedRows; StrMes.push(c+" rows from userTab deleted.");
    
    var Sql=[];
    Sql.push("UPDATE "+userTab+" SET idFB=?, idIdPlace=?, idOpenId=?, email=?, nameIP=?, image=?, donatedAmount=?, nComplaintCum=?, nComplaintGivenCum=? WHERE idUser=?;"); // , nComplaint=?, nComplaintGiven=?
    var Val=[idFB, idIdPlace, idOpenId, email, nameIP, image, donatedAmount, nComplaintCum, nComplaintGivenCum, idUserUBest];  // , nComplaint, nComplaintGiven
    Sql.push("UPDATE "+buyerTab+" SET donatedAmount=?, nComplaintCum=?, nComplaintGivenCum=? WHERE idUser=?;");
    Sql.push("UPDATE "+sellerTab+" SET donatedAmount=?, nComplaintCum=?, nComplaintGivenCum=? WHERE idUser=?;");
    var sql=Sql.join('\n'), arrT=[donatedAmount, nComplaintCum, nComplaintGivenCum, idUserUBest];  Val.push(...arrT,...arrT);
    var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
    var c=results[0].affectedRows; StrMes.push(c+" rows from userTab updated.");
    Ou.idUser=idUserUBest;
  }
  return [null,Ou];
}


