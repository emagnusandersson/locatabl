
myQueryGen=function*(flow, sql, Val, pool){ 
  var err, connection, results, fields;
  for(var i=0;i<nDBRetry;i++){
    pool.getConnection(function(errT, connectionT) { err=errT; connection=connectionT; flow.next(); }); yield;
    if(err) {
      console.log('Error when getting mysql connection, attemptCounter: '+i);
      if(typeof err=='object' && 'code' in err) {
        console.log('err.code: '+err.code);
        if(err.code=='PROTOCOL_CONNECTION_LOST' || err.code=='ECONNREFUSED' || err.code=='ECONNRESET'){
          setTimeout(function(){ flow.next();}, 2000); yield;  continue;
        } else { console.log('Can\'t handle: err.code: '+err.code); return [err]; }
      }
      else { console.log('No \'code\' in err'); return [err]; }
    }
  
    connection.query(sql, Val, function(errT, resultsT, fieldsT) { err=errT; results=resultsT; fields=fieldsT; flow.next();}); yield;
    connection.release();
    if(err) {
      console.log('Error when making mysql query, attemptCounter: '+i);
      if(typeof err=='object' && 'code' in err) {
        console.log('err.code: '+err.code); debugger
        if(err.code=='PROTOCOL_CONNECTION_LOST' || err.code=='ECONNREFUSED'){
          setTimeout(function(){ flow.next();}, 2000); yield;   continue;
        } else { console.log('Can\'t handle: err.code: '+err.code); break; }
      }
      else { console.log('No \'code\' in err'); break; }
    }
    else {break;}
  }
  return [err, results, fields];
}

mysqlGetConnection=function*(flow, pool){
  var err, connection;      pool.getConnection(function(errT, connectionT) { err=errT; connection=connectionT; flow.next(); }); yield;   return [err, connection];
}
mysqlStartTransaction=function*(flow, connection){
  var err;     connection.beginTransaction(function(errT) { err=errT; flow.next(); }); yield;   if(err) return [err];
  connection.myTransactionState='started';
  return [null];
}
mysqlQuery=function*(flow, connection, sql, Val){
  var err, results, fields;    connection.query(sql, Val, function (errT, resultsT, fieldsT) { err=errT; results=resultsT; fields=fieldsT; flow.next(); }); yield;   return [err, results, fields];
}
mysqlRollback=function*(flow, connection){  connection.rollback(function() { flow.next(); }); yield;   }
mysqlCommit=function*(flow, connection){
  var err; connection.commit(function(errT){ err=errT; flow.next(); }); yield;   return [err];
}
mysqlRollbackNRelease=function*(flow, connection){  connection.rollback(function() { flow.next(); }); yield;  connection.release(); }
mysqlCommitNRelease=function*(flow, connection){
  var err; connection.commit(function(errT){ err=errT; flow.next(); }); yield;  connection.release();  return [err];
}




  // accountMergeTwo: Logging in from a non-logged-in state with a IdP (which includes email). And since idIdP and email may point to different accounts, those should be merged.
  // Called "accountMergeTwo" since a maximum of two accounts (idIdP- and email-) accounts are merged.
  //
  // Only one of IidFB, IidIdPlace and IidOpenId should be non-null.
accountMergeTwo=function*(objArg){
  var req=this.req, flow=req.flow, site=req.site, Prop=site.Prop, {userTab, vendorTab}=site.TableName;
  var con=this.con;
  var {idFB, idIdPlace, idOpenId, email, nameIP, image}=objArg, Ou={idUser:null};
  var StrMes=[];
  var sql="SELECT * FROM "+userTab+" WHERE idFB=? OR idIdPlace=? OR idOpenId=? OR email=? ORDER BY tCreated;";
  var Val=[idFB, idIdPlace, idOpenId, email];
  var [err, resultsU]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
  var nU=resultsU.length;
  //if(nU==0) {
    //if(objArg.boCreate){
      //var Sql=[];
      //Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, nameIP, image, password) VALUES (?, ?, ?, ?, ?, ?, MD5(RAND()) );");
      //Sql.push("SELECT LAST_INSERT_ID() AS idUser;");
      //var sql=Sql.join('\n'), Val=[idFB, idIdPlace, idOpenId, email, nameIP, image];
      //var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
      //Ou.idUser=results[1][0].idUser;
    //}
  //}else
  if(nU==1) {
    var rowT=resultsU[0];
    var sql="UPDATE "+userTab+" SET idFB=IF(? IS NULL, idFB, ?), idIdPlace=IF(? IS NULL, idIdPlace, ?), idOpenId=IF(? IS NULL, idOpenId, ?), email=IF(? IS NULL, email, ?), nameIP=IF(? IS NULL, nameIP, ?), image=IF(? IS NULL, image, ?) WHERE idUser=?;";
    var Val=[idFB, idFB, idIdPlace, idIdPlace, idOpenId, idOpenId, email, email, nameIP, nameIP, image, image,   rowT.idUser]; 
    var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
    Ou.idUser=rowT.idUser;
  }else if(nU==2) {
    var row0=resultsU[0], row1=resultsU[1];
    idFB=idFB||row0.idFB||row1.idFB;
    idIdPlace=idIdPlace||row0.idIdPlace||row1.idIdPlace;
    idOpenId=idOpenId||row0.idOpenId||row1.idOpenId;
    email=email||row0.email||row1.email;
    var iBest=indexOfMin([row0.tCreated,row1.tCreated]);
    var idUserUBest=resultsU[iBest].idUser,  idUserUD=resultsU[1-iBest].idUser;    // Suffix D for deleted.
    

      // Now check which vendorTab row to keep
    var sql="SELECT idUser, donatedAmount, nMonthsStartOffer, coordinatePrecisionM, created, histActive, timeAccumulated, terminationDate FROM "+vendorTab+" WHERE idUser=? OR idUser=?;";
    var Val=[idUserUBest,idUserUD];
    var [err, resultsV]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
    var nV=resultsV.length;
    if(nV==1) {
      var rowA=resultsV[0];
      if(idUserUBest!=rowA.idUser) {
        var sql="UPDATE "+vendorTab+" SET idUser=? WHERE idUser=?;";  var Val=[idUserUBest, rowA.idUser];
        var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
        var c=results.affectedRows; StrMes.push(c+" rows from vendorTab changed idUser.");
      }
    }
    else if(nV==2) {
      var row0=resultsV[0], row1=resultsV[1];
      var donatedAmount=row0.donatedAmount+row1.donatedAmount;
      var nMonthsStartOffer=Math.max(row0.nMonthsStartOffer,row1.nMonthsStartOffer);
      var coordinatePrecisionM=Math.max(row0.coordinatePrecisionM,row1.coordinatePrecisionM);
      var terminationDate=maxKeepType(row0.terminationDate,row1.terminationDate);
      var created=minKeepType(row0.created,row1.created);
      var iBest=indexOfMax([row0.timeAccumulated,row1.timeAccumulated]);
      var idUserVBest=resultsV[iBest].idUser,  idUserVD=resultsV[1-iBest].idUser;
      
      var sql="DELETE FROM "+vendorTab+" WHERE idUser=?;";  var Val=[idUserVD];
      var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
      var c=results.affectedRows; StrMes.push(c+" rows from vendorTab deleted.");
      
      var sql="UPDATE "+vendorTab+" SET idUser=?, created=?, donatedAmount=?, nMonthsStartOffer=?, coordinatePrecisionM=?, terminationDate=? WHERE idUser=?;";
      var Val=[idUserUBest, created, donatedAmount, nMonthsStartOffer, coordinatePrecisionM, terminationDate, idUserVBest];
      var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
      var c=results.affectedRows; StrMes.push(c+" rows from vendorTab updated.");
    }
    
    
    var sql="DELETE FROM "+userTab+" WHERE idUser=?;";  var Val=[idUserUD];
    var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
    var c=results.affectedRows; StrMes.push(c+" rows from userTab deleted.");
    
    var sql="UPDATE "+userTab+" SET idFB=?, idIdPlace=?, idOpenId=?, email=?, nameIP=?, image=? WHERE idUser=?;";  var Val=[idFB,idIdPlace,idOpenId,email,nameIP,image,idUserUBest];
    var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
    var c=results.affectedRows; StrMes.push(c+" rows from userTab updated.");
    Ou.idUser=idUserUBest;
  }
  return [null,Ou];
}

   
  // accountMergeThree: logging from a logged-in state (corresponding to the row that "idUser"-input points to) with an IdP (which includes email). And since idIdP and email and idUser may point to three different accounts, those should be merged.
  // Called "accountMergeThree" since a maximum of three rows are pointed to by the input variables (idUser (already logged in account) and idIdP/email from the new account).
  //
  // Only one of IidFB, IidIdPlace and IidOpenId should be non-null.
accountMergeThree=function*(objArg){
  var req=this.req, flow=req.flow, site=req.site, Prop=site.Prop, {userTab, vendorTab}=site.TableName;
  var con=this.con;
  var {idUser, idFB, idIdPlace, idOpenId, email, nameIP, image}=objArg, Ou={idUser:null};
  var {userTab, vendorTab}=site.TableName;
  var StrMes=[];
  var sql="SELECT * FROM "+userTab+" WHERE idUser=? OR idFB=? OR idIdPlace=? OR idOpenId=? OR email=? ORDER BY tCreated";
  var Val=[idUser, idFB, idIdPlace, idOpenId, email];
  var [err, resultsU]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
  var nU=resultsU.length;
  //if(nU==0) {
    //if(objArg.boCreate){
      //var Sql=[];
      //Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, nameIP, image, password) VALUES (?, ?, ?, ?, ?, ?, MD5(RAND()) );");
      //Sql.push("SELECT LAST_INSERT_ID() AS idUser;");
      //var sql=Sql.join('\n'), Val=[idFB, idIdPlace, idOpenId, email, nameIP, image];
      //var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
      //Ou.idUser=results[1][0].idUser;
    //}
  //}else
  if(nU==1) {
    var rowT=resultsU[0];
    var sql="UPDATE "+userTab+" SET idFB=IF(? IS NULL, idFB, ?), idIdPlace=IF(? IS NULL, idIdPlace, ?), idOpenId=IF(? IS NULL, idOpenId, ?), email=IF(? IS NULL, email, ?), nameIP=IF(? IS NULL, nameIP, ?), image=IF(? IS NULL, image, ?) WHERE idUser=?;";
    var Val=[idFB, idFB, idIdPlace, idIdPlace, idOpenId, idOpenId, email, email, nameIP, nameIP, image, image,   rowT.idUser]; 
    var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
    Ou.idUser=rowT.idUser;
  }else if(nU>=2) {
    var tCreated=Infinity, iBestU=0, ValU=[];
    for(var i=0;i<nU;i++){
      var rowT=resultsU[i];
      idFB=idFB||rowT.idFB;  idIdPlace=idIdPlace||rowT.idIdPlace;  idOpenId=idOpenId||rowT.idOpenId;  email=email||rowT.email;
      if(rowT.tCreated<tCreated) {tCreated=rowT.tCreated; iBestU=i;}
      ValU.push(resultsU[i].idUser);
    }
    var rowBest=resultsU[iBestU], idUserUBest=rowBest.idUser;
    
 
      // Now check which vendorTab row to keep
    var strQMark=array_fill(nU,'?').join(', ');
    var sql="SELECT idUser, donatedAmount, nMonthsStartOffer, coordinatePrecisionM, created, histActive, timeAccumulated, terminationDate FROM "+vendorTab+" WHERE idUser IN("+strQMark+");";
    var [err, resultsV]=yield* mysqlQuery(flow, con, sql, ValU); if(err) return [err];
    var nV=resultsV.length;
    if(nV==1) {
      var rowT=resultsV[0];
      if(idUserUBest!=rowT.idUser) {
        var sql="UPDATE "+vendorTab+" SET idUser=? WHERE idUser=?;";  var Val=[idUserUBest, rowT.idUser];
        var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
        var c=results.affectedRows; StrMes.push(c+" rows from vendorTab changed idUser.");
      }
    } else if(nV>=2) {
        // Select one vendorTab-row, delete the others, update the selected row, change the rows idUser to idUserUBest
      var donatedAmount=0, nMonthsStartOffer=0, coordinatePrecisionM=0, terminationDate=0, created=Infinity, timeAccumulated=0, iBest=0, Val=[];
      for(var i=0;i<nV;i++){
        var rowT=resultsV[i];
        donatedAmount+=rowT.donatedAmount;
        if(rowT.nMonthsStartOffer>nMonthsStartOffer) nMonthsStartOffer=rowT.nMonthsStartOffer;
        if(rowT.coordinatePrecisionM>coordinatePrecisionM) coordinatePrecisionM=rowT.coordinatePrecisionM;
        if(rowT.terminationDate>terminationDate) terminationDate=rowT.terminationDate;;
        if(rowT.created<created) {created=rowT.created;}
        if(rowT.timeAccumulated>timeAccumulated) {timeAccumulated=rowT.timeAccumulated; iBest=i;}
        Val.push(resultsV[i].idUser);
      }
      var rowBest=resultsV[iBest];
      var idUserVBest=rowBest.idUser
      Val.splice(iBest,1);
      
      var strQMark=array_fill(nV-1,'?').join(', ');
      var sql="DELETE FROM "+vendorTab+" WHERE idUser IN("+strQMark+");";
      var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
      var c=results.affectedRows; StrMes.push(c+" rows from vendorTab deleted.");
      
      var sql="UPDATE "+vendorTab+" SET idUser=?, created=?, donatedAmount=?, nMonthsStartOffer=?, coordinatePrecisionM=?, terminationDate=? WHERE idUser=?;";
      var Val=[idUserUBest, created, donatedAmount, nMonthsStartOffer, coordinatePrecisionM, terminationDate, idUserVBest];
      var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
      var c=results.affectedRows; StrMes.push(c+" rows from vendorTab updated.");
    }
    
    ValU.splice(iBestU,1);
    var strQMark=array_fill(ValU.length,'?').join(', ');
    var sql="DELETE FROM "+userTab+" WHERE idUser IN("+strQMark+");";
    var [err, results]=yield* mysqlQuery(flow, con, sql, ValU); if(err) return [err];
    var c=results.affectedRows; StrMes.push(c+" rows from userTab deleted.");
    
    var sql="UPDATE "+userTab+" SET idFB=?, idIdPlace=?, idOpenId=?, email=?, nameIP=?, image=? WHERE idUser=?;";  var Val=[idFB,idIdPlace,idOpenId,email,nameIP,image,idUserUBest];
    var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
    var c=results.affectedRows; StrMes.push(c+" rows from userTab updated.");
    Ou.idUser=idUserUBest;
  }
  return [null,Ou];
}



