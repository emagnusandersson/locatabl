
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




  // accountMergeTwo: Logging in from an non-logged-in state with a IdP (which includes email). And since idIdP and email may point to different accounts, those should be merged.
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
  var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
  var c=results.length;
  //if(c==0) {
    //if(objArg.boCreate){
      //var Sql=[];
      //Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, nameIP, image, password) VALUES (?, ?, ?, ?, ?, ?, MD5(RAND()) );");
      //Sql.push("SELECT LAST_INSERT_ID() AS idUser;");
      //var sql=Sql.join('\n'), Val=[idFB, idIdPlace, idOpenId, email, nameIP, image];
      //var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
      //Ou.idUser=results[1][0].idUser;
    //}
  //}else
  if(c==1) {
    var rowT=results[0];
    var sql="UPDATE "+userTab+" SET idFB=IF(? IS NULL, idFB, ?), idIdPlace=IF(? IS NULL, idIdPlace, ?), idOpenId=IF(? IS NULL, idOpenId, ?), email=IF(? IS NULL, email, ?), nameIP=IF(? IS NULL, nameIP, ?), image=IF(? IS NULL, image, ?) WHERE idUser=?;";
    var Val=[idFB, idFB, idIdPlace, idIdPlace, idOpenId, idOpenId, email, email, nameIP, nameIP, image, image,   rowT.idUser]; 
    var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
    Ou.idUser=rowT.idUser;
  }else if(c==2) {
    var rowT=results[0], rowD=results[1], idUserU=rowT.idUser, idUserD=rowD.idUser;  // Suffix U for userTab, V for vendorTab (analogouly with accountMergeThree (see below)) and D for Delete
    idFB=idFB||rowT.idFB||rowD.idFB;
    idIdPlace=idIdPlace||rowT.idIdPlace||rowD.idIdPlace;
    idOpenId=idOpenId||rowT.idOpenId||rowD.idOpenId;
    email=rowT.email||rowD.email||email;
    

      // Now check which vendorTab row to keep
    var sql="SELECT donatedAmount, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, terminationDate, lastPriceChange FROM "+vendorTab+" WHERE idUser=? OR idUser=? ORDER BY created;";
    var Val=[idUserU,idUserD];
    var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
    var c=results.length;
    if(c==1) {
      var rowA=results[0];
      if(idUserU!=rowA.idUser) {
        var sql="UPDATE "+vendorTab+" SET idUser=? WHERE idUser=?;";  var Val=[idUserU, rowA.idUser];
        var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
        var c=results[0].affectedRows; StrMes.push(c+" rows from vendorTab changed idUser.");
      }
    }
    else if(c==2) {
      var rowA=results[0], rowD=results[1];
      var donatedAmount=rowA.donatedAmount||rowD.donatedAmount;
      var created=minOfTwo(rowA.created,rowD.created);
      var iBest=rowA.timeAccumulated<rowD.timeAccumulated, tLastWriteOfTA=results[iBest].tLastWriteOfTA, histActive=results[iBest].histActive, posTime=results[iBest].posTime;
      var idUserVBest=results[iBest].idUser;
      
      var sql="DELETE FROM "+vendorTab+" WHERE idUser=?;";  var Val=[idUserD];
      var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
      var c=results[0].affectedRows; StrMes.push(c+" rows from vendorTab deleted.");
      
      var sql="UPDATE "+vendorTab+" SET created=?, timeAccumulated=?, tLastWriteOfTA=?, histActive=?, posTime=? WHERE idUser=?;";  var Val=[created, timeAccumulated, tLastWriteOfTA, histActive, posTime, idUserVBest];
      var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
      var c=results[0].affectedRows; StrMes.push(c+" rows from vendorTab updated.");
    }
    
    
    var sql="DELETE FROM "+userTab+" WHERE idUser=?;";  var Val=[idUserD];
    var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
    var c=results[0].affectedRows; StrMes.push(c+" rows from userTab deleted.");
    
    var sql="UPDATE "+userTab+" SET idFB=?, idIdPlace=?, idOpenId=?, email=?, nameIP=?, image=?, password=MD5(RAND())) WHERE idUser=?;";  var Val=[idFB,idIdPlace,idOpenId,email,nameIP,image,idUserU];
    var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
    var c=results[0].affectedRows; StrMes.push(c+" rows from userTab updated.");
    Ou.idUser=idUserU;
  }
  return [null,Ou];
}

   
  // accountMergeThree: logging from an logged-in state (corresponding to the row that "idUser"-input points to) with a IdP (which includes email). And since idIdP and email and idUser may point to  three different accounts, those should be merged.
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
  var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
  var c=results.length;
  //if(c==0) {
    //if(objArg.boCreate){
      //var Sql=[];
      //Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, nameIP, image, password) VALUES (?, ?, ?, ?, ?, ?, MD5(RAND()) );");
      //Sql.push("SELECT LAST_INSERT_ID() AS idUser;");
      //var sql=Sql.join('\n'), Val=[idFB, idIdPlace, idOpenId, email, nameIP, image];
      //var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
      //Ou.idUser=results[1][0].idUser;
    //}
  //}else
  if(c==1) {
    var rowT=results[0];
    var sql="UPDATE "+userTab+" SET idFB=IF(? IS NULL, idFB, ?), idIdPlace=IF(? IS NULL, idIdPlace, ?), idOpenId=IF(? IS NULL, idOpenId, ?), email=IF(? IS NULL, email, ?), nameIP=IF(? IS NULL, nameIP, ?), image=IF(? IS NULL, image, ?) WHERE idUser=?;";
    var Val=[idFB, idFB, idIdPlace, idIdPlace, idOpenId, idOpenId, email, email, nameIP, nameIP, image, image,   rowT.idUser]; 
    var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
    Ou.idUser=rowT.idUser;
  }else if(c>=2) {
    var tCreated=intMax, iBestU, ValU=[];
    for(var i=0;i<c;i++){
      var rowT=results[i];
      idFB=idFB||rowT.idFB;  idIdPlace=idIdPlace||rowT.idIdPlace;  idOpenId=idOpenId||rowT.idOpenId;  email=email||rowT.email;
      if(rowT.tCreated<tCreated) {tCreated=rowT.tCreated; iBestU=i;}
      ValU.push(results[i].idUser);
    }
    var rowBest=results[iBestU], idUserU=rowBest.idUser;
    
 
      // Now check which vendorTab row to keep
    var strQMark=array_fill(c-1,'?').join(', ');
    var sql="SELECT donatedAmount, created, posTime, histActive, tLastWriteOfTA, timeAccumulated, terminationDate, lastPriceChange FROM "+vendorTab+" WHERE idUser IN("+strQMark+");";
    var [err, results]=yield* mysqlQuery(flow, con, sql, ValU); if(err) return [err];
    var c=results.length;
    if(c==1) {
      var rowT=results[0];
      if(idUserU!=rowT.idUser) {
        var sql="UPDATE "+vendorTab+" SET idUser=? WHERE idUser=?;";  var Val=[idUserU, rowT.idUser];
        var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
        var c=results[0].affectedRows; StrMes.push(c+" rows from vendorTab changed idUser.");
      }
    } else if(c>=2) {
        // Select one vendorTab-row, delete the others, update the selected row, change the rows idUser to idUserU
      var donatedAmount=0, created=intMax, timeAccumulated=0, iBest, Val=[];
      for(var i=0;i<c;i++){
        var rowT=results[i];
        donatedAmount+=rowT.donatedAmount;
        if(rowT.created<created) {created=rowT.created;}
        if(rowT.timeAccumulated>timeAccumulated) {timeAccumulated=rowT.timeAccumulated; iBest=i;}
        Val.push(results[i].idUser);
      }
      var rowBest=results[iBest], tLastWriteOfTA=rowBest.tLastWriteOfTA, histActive=rowBest.histActive, posTime=rowBest.posTime;
      var idUserVBest=rowBest.idUser
      Val.splice(iBest,1);
      
      var strQMark=array_fill(c-1,'?').join(', ');
      var sql="DELETE FROM "+vendorTab+" WHERE idUser IN("+strQMark+");";
      var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
      var c=results[0].affectedRows; StrMes.push(c+" rows from vendorTab deleted.");
      
      var sql="UPDATE "+vendorTab+" SET idUser=?, donatedAmount=?, created=?, timeAccumulated=?, tLastWriteOfTA=?, histActive=?, posTime=? WHERE idUser=?;";
      var Val=[idUserU, donatedAmount, created, timeAccumulated, tLastWriteOfTA, histActive, posTime, idUserVBest];
      var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
      var c=results[0].affectedRows; StrMes.push(c+" rows from vendorTab updated.");
    }
    
    ValU.splice(iBestU,1);
    var strQMark=array_fill(ValU.length,'?').join(', ');
    var sql="DELETE FROM "+userTab+" WHERE idUser IN("+strQMark+");";
    var [err, results]=yield* mysqlQuery(flow, con, sql, ValU); if(err) return [err];
    var c=results[0].affectedRows; StrMes.push(c+" rows from userTab deleted.");
    
    var sql="UPDATE "+userTab+" SET idFB=?, idIdPlace=?, idOpenId=?, email=?, nameIP=?, image=?, password=MD5(RAND())) WHERE idUser=?;";  var Val=[idFB,idIdPlace,idOpenId,email,nameIP,image,idUserU];
    var [err, results]=yield* mysqlQuery(flow, con, sql, Val); if(err) return [err];
    var c=results[0].affectedRows; StrMes.push(c+" rows from userTab updated.");
    Ou.idUser=idUserU;
  }
  return [null,Ou];
}



