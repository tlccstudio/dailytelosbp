// telosAPI.js
// VERSION 1.51 - April 19, 2021
// Copyright 2021, TLCC Consultants Pte. Ltd. and Theodore Lowry.  All Rights Reserved.
//
// Javascript interface with Telos Network Public Blockchain
// Requires that jquery already be included
//
// v1.50 begins with removing basic old functions which are used elsewhere
//  also adds function: cleanPrivateKeyText(sPKey)
// v1.51 added tlos_create_general_action(contract, action, signor, auth, data)
//       added tlos_sign_actions(pkey, aActions, fFunction)
// v1.52 added tlos_get_permissions(account_name, funcCallback, errorCallback)
// v1.52-hybrid - added index_position to get_table_rows as trailing parameter
//                added key_type to get_table_rows

//LOCALNET SETUP
/*
var telosAPIURL_history = "http://0.0.0.0:8888/v1/history/";
var telosAPIURL_history_type = "post";

var telosAPIURL_chain = "http://0.0.0.0:8888/v1/chain/";
var telosAPIURL_chain_type = "post";

var telosAPIURL_transact = 'http://0.0.0.0:8888/';
*/


//TESTNET SETUP
/*
var telosAPIURL_history = "https://testnet.telos.caleos.io/v2/history/";
var telosAPIURL_history_type = "get";

var telosAPIURL_chain = "https://testnet.telos.caleos.io/v1/chain/";
var telosAPIURL_chain_type = "post";

var telosAPIURL_transact = 'https://testnet.telos.caleos.io/';
*/

//LIVENET SETUP

var telosAPIURL_history = "https://telos.caleos.io/v2/history/";
var telosAPIURL_history_type = "get";

var telosAPIURL_chain = "https://telos.caleos.io/v1/chain/";
var telosAPIURL_chain_type = "post";

var telosAPIURL_transact = 'https://telos.caleos.io';


//LIVENET SETUP #2 - Alternate
/*
var telosAPIURL_history = "https://api.telosunlimited.io/v2/history/";
var telosAPIURL_history_type = "get";

var telosAPIURL_chain = "https://api.telosunlimited.io/v1/chain/";
var telosAPIURL_chain_type = "post";

var telosAPIURL_transact = 'https://api.telosunlimited.io';
*/


// ****************** INPUT CORRECTION *********************** //

// function cleanTelosUser(userName)
// This function is to help correct / sanitize 
//  user input when they provide a username.
// One way to make apps more friendly to assume users
//  input things wrongly, such as spaces before / after usernames.
//
// userName - string, Telos Blockchain Username given by user
//
// returns - string, with spaces and other characters removed
//           on error returns ""
function cleanTelosUser(userName)
{
	if (typeof userName !== 'undefined')
	{
		if(userName !== "")
		{
			var sReturn = userName.replaceAll(" ", ""); //no spaces
			sReturn = sReturn.replaceAll("\\", "");
			sReturn = sReturn.replaceAll("/", "");
			sReturn = sReturn.replaceAll("\n", ""); //no newline character
			sReturn = sReturn.replaceAll("\t", ""); //no tab character
			sReturn = sReturn.replaceAll("\r", ""); //no return character
			sReturn = sReturn.replaceAll("\f", ""); //no formfeed character
			sReturn = sReturn.replaceAll("\"", ""); //no quote character
			sReturn = sReturn.replaceAll("'", ""); //no quote character
			sReturn = sReturn.replaceAll(":", ""); //no color character
			sReturn = sReturn.replaceAll(";", ""); //no semicolon character
			sReturn = sReturn.replaceAll("[", ""); 
			sReturn = sReturn.replaceAll("]", ""); 
			sReturn = sReturn.replaceAll("{", ""); 
			sReturn = sReturn.replaceAll("}", ""); 
			sReturn = sReturn.replaceAll("|", ""); 
			sReturn = sReturn.replaceAll("(", ""); 
			sReturn = sReturn.replaceAll(")", ""); 
			sReturn = sReturn.replaceAll(",", ""); 
			
			return sReturn;
		}
	}
	
	return "";
}

//function cleanPrivateKeyText(sPKey)
//
// sPKey - string of Private Key Field
//
// returns - modified sPKey
function cleanPrivateKeyText(sPKey)
{
	var sRet = sPKey.replace(/\t/g, " ");
	sRet = sRet.replace(/\n/g, ""); // delete new line
	sRet = sRet.replace(/\v/g, ""); // delete vertical tab character
	sRet = sRet.replace(/\r/g, ""); // delete return character
	sRet = sRet.replace(/\f/g, ""); // delete form-feed character
	sRet = sRet.replace(/\0/g, ""); // delete null character

	sRet = sRet.replaceAll("[", "");
	sRet = sRet.replaceAll("]", "");
	sRet = sRet.replaceAll("<", "");
	sRet = sRet.replaceAll(">", "");
	sRet = sRet.replaceAll("(", "");
	sRet = sRet.replaceAll(")", "");
	sRet = sRet.replaceAll(" ", "");
	sRet = sRet.replaceAll(":", "");
	sRet = sRet.replaceAll(",", "");
    sRet = sRet.replaceAll("\"", "");
	sRet = sRet.replaceAll("'", "");
    
	return sRet;
}

// function nameToValue(name: string)
// https://github.com/MrToph/eos-utils/blob/29a10c20e172068ec4f0b75883cbaae8a0f6e12c/src/name.ts
function nameToValueBinary(sName) {
  if (!isString(sName)) { return null; }

  if (sName.length > 13) { return null; }
  
  var bitstr = '';
  var c;
  var bitlen;
  
  for (var i = 0; i < 13; i++) {
    // process all 64 bits (even if name is short)
    c = i < sName.length ? charidx(sName.substr(i,1)) : 0;
    bitlen = i < 12 ? 5 : 4;
    let bits = Number(c).toString(2);
    if (bits.length > bitlen) { return null; }
    bits = '0'.repeat(bitlen - bits.length) + bits;
    bitstr += bits;
  }

  //return Long.fromString(bitstr, true, 2);
  return bitstr;
}

function binaryToBigInt(bin) {
  
    var big  = BigInt(0);
    var mult = BigInt(1);
    var n2   = BigInt(2);
    
    for(var i = bin.length-1; i >= 0; i--) {
        if(bin.substr(i,1) === "1") {
            big = big + mult;
        }
        
        mult = mult * n2;
    }
    
    return big;
}

function encodeName_i64(sName) {
    
    return nameToValueBinary(sName);
}

//*************************************************************//


// function telos_get_actions(account_name, limit, skip, funcCallback)
//
// account_name 	 - string of TLOS account name
// limit			 - position value, integer
// skip				 - skip value, integer
// funcCallback(ret) - function to initiate, which receives ret data upon completion of query
// errorCallback(ret)- function to call upon error
//
// returns			 - nothing
function telos_get_actions(account_name, limit, skip, funcCallback, errorCallback = function() {})
{
	var sURL = '';
    
    if(telosAPIURL_history_type === "get")
    {
        sURL = telosAPIURL_history + "get_actions?limit=" + limit.toString() + "&skip=" + skip.toString() + "&account=" + account_name.toLowerCase();
        $.ajax({
        url: sURL,
        type: 'GET',
        success: function(data, status){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            funcCallback(ret);
        },
        error: function(status, data){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            errorCallback(ret);
        }
        });
    }
    else // if POST
    {
        sURL = telosAPIURL_history + "get_actions";
        
        var post_data = {};
        post_data.limit = limit.toString();
        post_data.skip = skip.toString();
        post_data.account = account.toLowerCase();
        post_data = JSON.stringify(post_data);
        
        $.ajax({
        url: sURL,
        type: 'POST',
        data: post_data,
        success: function(data, status){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            funcCallback(ret);
        },
        error: function(status, data){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            errorCallback(ret);
        }
        });
    }
}

// function telos_get_block(block_num, funcCallback)
//
// block_num 		- integer of TLOS block number to query
// funcCallback(ret)- function to initiate, which receives ret data upon completion of query
// errorCallback(ret)- function to call upon error
//
// returns			- nothing
function telos_get_block(block_num, funcCallback, errorCallback = function() {})
{
    var sURL = '';
    
    if(telosAPIURL_chain_type === "get")
    {
        sURL = telosAPIURL_chain + "get_block?block_num_or_id=" + block_num.toString();
    
        $.ajax({
        url: sURL,
        type: 'GET',
        success: function(data, status){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            funcCallback(ret);
        },
        error: function(status, data){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            errorCallback(ret);
        }
        });
    }
    else // if POST
    {
        sURL = telosAPIURL_chain + "get_block";
        
        var post_data 				= {};
		post_data.block_num_or_id	= block_num.toString();
		post_data 					= JSON.stringify(post_data);
        
        $.ajax({
        url: sURL,
        type: 'POST',
        data: post_data,
        success: function(data, status){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            funcCallback(ret);
        },
        error: function(status, data){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            errorCallback(ret);
        }
        });
    }
}

// function telos_get_account(account_name, funcCallback)
//
// account_name 	- string of TLOS account name
// funcCallback(ret)- function to initiate, which receives ret data upon completion of query
// errorCallback(ret)- function to call upon error
//
// returns			- nothing
function telos_get_account(account_name, funcCallback, errorCallback = function() {})
{
    var sURL = '';
    
    if(telosAPIURL_chain_type === "get")
    {
        sURL = telosAPIURL_chain + "get_account?account_name=" + account_name.toLowerCase();
    
        $.ajax({
        url: sURL,
        type: 'GET',
        success: function(data, status){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            funcCallback(ret);
        },
        error: function(status, data){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            errorCallback(ret);
        }
        });
    }
    else // if POST
    {
        sURL = telosAPIURL_chain + "get_account";
        
        var post_data 			= {};
        post_data.account_name	= account_name.toLowerCase();
        post_data 				= JSON.stringify(post_data);
        
        $.ajax({
        url: sURL,
        type: 'POST',
        data: post_data,
        success: function(data, status){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            funcCallback(ret);
        },
        error: function(status, data){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            errorCallback(ret);
        }
        });
    }
}

// function telos_get_transaction(trx_id, funcCallback, errorCallback = function() {})
//
// trx_id 	- string of TLOS transaction id
// funcCallback(ret)- function to initiate, which receives ret data upon completion of query
// errorCallback(ret)- function to call upon error
//
// returns			- nothing
function telos_get_transaction(trx_id, funcCallback, errorCallback = function() {})
{
    var sURL = '';
    
    if(telosAPIURL_history_type === "get")
    {
        sURL = telosAPIURL_history + "get_transaction?id=" + trx_id;
    
        $.ajax({
        url: sURL,
        type: 'GET',
        success: function(data, status){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            funcCallback(ret);
        },
        error: function(status, data){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            errorCallback(ret);
        }
        });
    }
    else // if POST
    {
        sURL = telosAPIURL_history + "get_transaction";
        
        var post_data 			= {};
        post_data.id	        = trx_id;
        post_data 				= JSON.stringify(post_data);
        
        $.ajax({
        url: sURL,
        type: 'POST',
        data: post_data,
        success: function(data, status){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            funcCallback(ret);
        },
        error: function(status, data){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            errorCallback(ret);
        }
        });
    }
}





// function telos_get_balance(contract, token, account_name, funcCallback, errorCallback = function() {})
//   updated in v0.94.1
// contract			- string of contract issuer
// token			- "HEART" or "TLOS" examples
// account_name 	- string of TLOS account name
// funcCallback(ret)- function to initiate, which receives ret data upon completion of query
// errorCallback(ret)- function to call upon error
//
// returns			- nothing
function telos_get_balance(contract, token, account_name, funcCallback, errorCallback = function() {})
{
    var sURL = '';
    
    if(telosAPIURL_chain_type === "get")
    {
        sURL = telosAPIURL_chain + "get_currency_balance?code=" + contract.toLowerCase() + "&symbol=" + token + "&account=" + account_name.toLowerCase();
    
        $.ajax({
        url: sURL,
        type: 'GET',
        success: function(data, status){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            funcCallback(ret);
        },
        error: function(status, data){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            errorCallback(ret);
        }
        });
    }
    else // if POST
    {
        sURL = telosAPIURL_chain + "get_currency_balance";
        
        var post_data 			= {};
		post_data.code			= contract;
		post_data.account		= account_name.toLowerCase();
		post_data.symbol		= token;
		post_data 				= JSON.stringify(post_data);
        
        $.ajax({
        url: sURL,
        type: 'POST',
        data: post_data,
        success: function(data, status){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            funcCallback(ret);
        },
        error: function(status, data){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            errorCallback(ret);
        }
        });
    }
}


// function get_token_Balance(ret)
//
// ret - return object with .data from telos_get_balance(...)
//
// returns 0.00 on no balance / error, otherwise float val of balance is returned
function get_token_Balance(ret)
{
	if(!isObject(ret))
	{ return 0.00; }
	
	if(!ret.hasOwnProperty('data'))
	{ return 0.00; }
	
	if(!Array.isArray(ret.data))
	{ return 0.00; }

	if(ret.data.length <= 0)
	{ return 0.00; }
	
	var bal = ret.data[0];
	if (typeof bal === 'undefined')
	{ bal = 0.00; }
	else
	{ bal = parseFloat(bal.split(" ")[0]); }
	
	return bal;
}

// function _chopUnit(amount)
//
// amount - string such as "258.1153 TLOS"
//
// returns - returns "258.1153" if supplied "258.1153 TLOS"
//             returns "" if not a string
function _chopUnit(amount)
{
	if( (typeof amount) !== "string")
	{ return ""; }
	
	return amount.split(" ")[0];
}

// function _tlcur(amount, unit)
//  used to validate currency and provide correct string
// amount - string or float or double
// unit - "TLOS" or "HEART"
//
// returns - "235.0001 TLOS" or a valid TLOS string
//             returns "" empty string on error
function _tlcur(amount, unit)
{
	if( (typeof unit) !== "string")
	{ return ''; }
	
	if( unit.length <= 0)
	{ return ''; }
	
	var strAmt = '';
	
	if( (typeof amount) === "number")
	{
		if(isInt(amount))
		{ return '' + amount + '.0000 ' + unit; }
		else if(isFloat(amount))
		{
			strAmt = amount.toString();
			strAmt = '' + strAmt.split('.')[0] + '.' + strAmt.split('.')[1].substring(0,4);
		}
		else
		{ return ''; }
	}
	else if( (typeof amount) === "string")
	{ strAmt = amount; }
	else
	{ return ''; }
	
	if(strAmt.length >= 0)
	{
		var sVal = strAmt.split('.');
		
		//deal with before decimal
		if(sVal.length === 1)
		{
			if(/^\d+$/.test(sVal[0]) === true)
			{ return sVal[0] + ".0000 " + unit;}
			else
			{ return ''; }
		}
		else if(sVal.length >= 2)
		{ 
			if(/^\d+$/.test(sVal[0]) === true) //is sVal[0] all digits?
			{
				if(/^\d+$/.test(sVal[1]) === true) //is sVal[1] all digits?
				{
					if(sVal[1].length === 0)
					{ return sVal[0] + ".0000 " + unit;} 
					else if(sVal[1].length === 1)
					{ return sVal[0] + "." + sVal[1] + "000 " + unit;}
					else if(sVal[1].length === 2)
					{ return sVal[0] + "." + sVal[1] + "00 " + unit;}
					else if(sVal[1].length === 3)
					{ return sVal[0] + "." + sVal[1] + "0 " + unit;}
					else if(sVal[1].length === 4)
					{ return sVal[0] + "." + sVal[1] + " " + unit;}
				}
			}
		}
	}
	
	return '';
}

// tlos_create_transfer_action(contract, sender, receiver, amount, unit, smemo)
//   returns object used in telos array of actions, single action object
//
// contract -  string of contract account like 'eosio.token'
// sender - sender's telos account
// receiver - receiver's telos account
// amount - string or float or double like 1.235 or 1.0000 or '1.00'
//              unsure if 5 decimals or more work such as 1.02356
// unit - "TLOS" or "HEART"
// smemo - string of up to 256 characters for memo field of transaction
//
// return - should return valid object
function tlos_create_transfer_action(contract, sender, receiver, amount, unit, smemo)
{
	return {
		  account: contract,
		  name: 'transfer',
		  authorization: [{
			actor: sender,
			permission: 'active',
		  }],
		  data: {
			from: sender,
			to: receiver,
			quantity: _tlcur(amount, unit),
			memo: smemo,
		  }
		};
}


// tlos_create_general_action(contract, action, signer, auth, data)
//   returns object used in telos array of actions, single action object
//   added in v1.51
//
// contract -  string of contract account like 'eosio.token'
// action - string, specific ACTION with contract
// signer - string, account signing for the action
// auth - string, permission to sign with on signer account, "active", "owner", etc.
// oData - object {} of parameters to pass,
//           such as this for 'transfer' action with 'eosio.token' contract:
//              { from: signer,
//              to: receiver,
//              quantity: _tlcur(amount, unit),
//              memo: smemo }
//
// return - should return valid object
//-------------------------------------------------------------------
//-------------------------------------------------------------------
// Tutorial, these actions can be packed into a single transaction:
//
//   for(...) {  //looping
//      aActions[i] = tlos_create_general_action(...);  //pack action into array
//   }
//  
//   try {  //send the transaction
//      result = await api.transact({actions: aActions}, {blocksBehind: 3, expireSeconds: 30,});
//   } catch ...
//-------------------------------------------------------------------
function tlos_create_general_action(contract, action, signer, auth, oData)
{
	return {
		  account: contract,
		  name: action,
		  authorization: [{
			actor: signer,
			permission: auth,
		  }],
		  data: oData
		};
}


// function tlos_send_amount(sender, pkey, receiver, sAmt)
//
// contract  - 'eosio.token' for example
// sender - string, sender username TLOS blockchain
// pkey - string, private key
// receiver - string, receiver username TLOS blockchain
// amount - float only, later converted to string
// unit   - "TLOS" for "HEART"
// smemo - string up to 1524 characters
// fFunction - function callback when transaction successful
//
// returns - true if executed asynch(), else false if preliminary error occurred
function tlos_send_amount(contract, sender, pkey, receiver, amount, unit, smemo, fFunction)
{
	var rpc = new eosjs_jsonrpc.JsonRpc(telosAPIURL_transact);
	var signatureProvider = new eosjs_jssig.JsSignatureProvider([pkey]);
	var api = new eosjs_api.Api({ rpc, signatureProvider });
  
	//Build Actions Array based on smemo
	if( (typeof smemo) !== "string")
	{ return false; }
	
	var lenMemo = smemo.length;
  
	if(lenMemo > 254) //Max of 6 entries of (256-2) character memos
	{ return false; }
  
	var nQty = Math.floor(lenMemo / 254) + 1;
	var aActions = [];
	
	var fAmtFrag = _chopUnit(_tlcur((amount / nQty), unit));
	var fTotalAmt = 0.0;
	var fRemAmt = 0.0;
	
	var sMemFrag = '';
	
	for (i = 0; i < nQty; i++)
	{
		if((i+1) == (nQty)) //last memo piece
		{
			sMemFrag = smemo.substring(i*254,smemo.length);
			fRemAmt = _chopUnit(_tlcur((amount - fTotalAmt), unit));
			if(parseFloat(fAmtFrag) > fRemAmt)
			{}
			else
			{ fAmtFrag = fRemAmt; }
		}
		else //not last memo piece
		{
			sMemFrag = '' + i + '-' + smemo.substring(i*254,(i*254)+254);
			fTotalAmt = fTotalAmt + parseFloat(fAmtFrag);
		}
		
		if(sMemFrag >= 256)
		{ 
			console.log("sMemFrag Error (telosAPI.js) - Line 446"); 
			console.log(sMemFrag); 
		}
		aActions[i] = tlos_create_transfer_action(contract, sender, receiver, fAmtFrag, unit, sMemFrag);
	}
  
	(async () => {
		var result = null;
	
		try{
		result = await api.transact({actions: aActions}, {blocksBehind: 3, expireSeconds: 30,});
		}
		catch(err){
			console.log('Posting Error - line #663 of telosAPI.js');
			//error
            apiQueryWaitScreen(false);
            console.log(err);
            alert(err);
			
			return;
		}
		
		fFunction(result);
	})();
	
	return aActions;
}

// function tlos_sign_actions(pkey, aActions, fFunction)
//  added in v1.51
//
// pkey - string, private key
// aActions - array of object actions, created with tlos_create_general_action(...)
// fFunction - function(result) callback when transaction successful
//
// returns - true if executed asynch(), else false if preliminary error occurred
function tlos_sign_actions(pkey, aActions, fFunction)
{
	var rpc = new eosjs_jsonrpc.JsonRpc(telosAPIURL_transact);
	var signatureProvider = new eosjs_jssig.JsSignatureProvider([pkey]);
	var api = new eosjs_api.Api({ rpc, signatureProvider });
  
    //length of aActions
    if(aActions.length == 0) 
    { return false; }
  
	//aActions should be containing objects
	if( (typeof aActions[0]) !== "object")
	{ return false; }
    
    if(aActions[0] === null)
	{ return false; }
  
	(async () => {
		var result = null;
	
		try{
		result = await api.transact({actions: aActions}, {blocksBehind: 3, expireSeconds: 30,});
		}
		catch(err){
			console.log('Posting Error - line #756 of telosAPI.js');
			//error
            apiQueryWaitScreen(false);
            console.log(err);
            alert(err);
			
			return false;
		}
		
		fFunction(result);
	})();
	
	return true;
}


//function tlos_verify_trans(user, trans, orderUnit, funcCallback)
//  delayed recursive function which finds transaction sent to contract account
//   when found, calls fCallFunc
//
// user - string of token username like 'eosio.token'
// trans - string of blockchain transaction ID
// orderUnit - string of "TLOS" or "HEART" for example
// funcCallback(ret) - Callback function upon finding transaction
// errorCallback() - Error Callback function upon not finding transaction

var apiCount = 0; // global tracking for how many recursions performed with tlos_verify_trans

function tlos_verify_trans(user, trans, orderUnit, funcCallback, errorCallback = function() {})
{
	var found = false;
	telos_get_actions(user, 10, 0, function(ret) {
		
		console.log("Returning data....");
		console.log(ret);
		
		var result = ret.data.actions;
		var block = null, trx_id = null, type = null, tokenAcct = null, from = null, to = null, unit = null, qty = null, memo = null;
		var ctrOK = false;
		
		for (var i = 0; i < result.length; i++)
		{
			block = result[i].block_num;
			trx_id = result[i].trx_id;
			type = result[i].act.name;
			tokenAcct = result[i].act.account;
			
			if((tokenAcct === "revelation21") || (tokenAcct === "eosio.token"))
			{
				if(type === "transfer")
				{
					from = result[i].act.data.from;
					to = result[i].act.data.to;
					qty = parseFloat(result[i].act.data.quantity.split(" ")[0]);
					unit = result[i].act.data.quantity.split(" ")[1];
					memo = result[i].act.data.memo;
					ctrOK = false;
					
					if(unit === "TLOS")
					{
						if(tokenAcct === "eosio.token")
						{ ctrOK = true; }
					}
					
					if(unit === "HEART")
					{
						if(tokenAcct === "revelation21")
						{ ctrOK = true; }
					}
					
					if( (trx_id === trans) &&
						(orderUnit === unit) &&
						(ctrOK) )
					{
						console.log("Transaction located - block: " + block);
						found = true;
						
						funcCallback(ret, trx_id, block);
						return;
					}
					
					//console.log(block, trx_id, type, tokenAcct, from, to, qty, unit, memo);
				}
				else
				{ from = to = unit = qty = memo = null; }
			}
			else
			{ from = to = unit = qty = memo = null; }
		}
		
		//changed to 6 count at 2.0 seconds each in v0.94
		if((found == false) && (apiCount < 6))
		{ 
			console.log("Request Sent - " + apiCount);
			setTimeout(function(){ tlos_verify_trans(user, trans, orderUnit, funcCallback, errorCallback); }, 2000); apiCount++;
		}
		else
		{ errorCallback(); }
	});
}


//function tlos_linkauth(user, contract, action, authority, pkey, funcCallback, errorCallback = function() {})
//  delayed recursive function which finds transaction sent to contract account
//   when found, calls fCallFunc
//
// user - string of token username like 'eosio.token'
// contract - string like "eosio.token"
// action - string contract action to add
// authority - permission to add "post" or "publish" for example
// funcCallback(ret) - Callback function upon finding transaction
// errorCallback(err) - Error Callback function upon not finding transaction
function tlos_linkauth(user, contract, action, authority, pkey, funcCallback, errorCallback = function(err) {})
{
	var rpc = new eosjs_jsonrpc.JsonRpc(telosAPIURL_transact);
	var signatureProvider = new eosjs_jssig.JsSignatureProvider([pkey]);
	var api = new eosjs_api.Api({ rpc, signatureProvider });
  
	if( (typeof user) !== "string")
	{ return false; }
    if( (typeof contract) !== "string")
	{ return false; }
    if( (typeof action) !== "string")
	{ return false; }
    if( (typeof authority) !== "string")
	{ return false; }
  
	(async () => {
		var result = null;
	
		try{
		result = await api.transact(
            {actions:
                [{
                      account: "eosio",
                      name: 'linkauth',
                      authorization: [{
                        actor: user,
                        permission: 'active',
                      }],
                      data: {
                        account: user,
                        code: contract,
                        type: action,
                        requirement: authority
                      }
                }]
            },
            {blocksBehind: 3, expireSeconds: 30,});
		}
		catch(err){
			console.log('Posting Error! tlos_linkauth(...) - telosAPI.js');
			errorCallback(err);
			return;
		}
		
		funcCallback(result);
	})();
}


/*
https://mainnet.persiantelos.com/v1/chain/get_table_rows
{
	"code": "revelation21",
	"json": true,
	"limit": 20,
	"scope": "revelation21", <--scope of the data
    "table": "tags"
}
*/

// function tlos_get_table_rows(contract, limit, scope, table, funcCallback, errorCallback = function(err) {}) {
// 
// contract - string like "eosio.token"
// limit - number such as 20
// scope - tlos account scope such as contract like "eosio.token" or user account
// table - table to access like "accounts" for eosio.token contract
// upper_bound - number
// lower_bound - number
// funcCallback(ret) - Callback function upon finding transaction
// errorCallback(err) - Error Callback function upon not finding transaction
// index_position - string:  primary, secondary, tertiary, fourth, fifth, sixth, seventh, eighth, ninth , tenth
// key_type - string: Type of key specified by index_position (for example - uint64_t or name)
//
// returns - nothing
function tlos_get_table_rows(contract, limit, scope, table, upper_bound, lower_bound, funcCallback, errorCallback = function(err) {}, index_position = "", key_type = "") {
    var sURL = '';
    
    if(telosAPIURL_chain_type === "get")
    {
        sURL = telosAPIURL_chain + "get_table_rows?json=true&code=" + contract.toLowerCase() + "&limit=" + limit + "&scope=" + scope.toLowerCase() + "&table=" + table.toLowerCase() + "&upper_bound=" + upper_bound + "&lower_bound=" + lower_bound + "&index_position=" + index_position + "&key_type=" + key_type;
    
        $.ajax({
        url: sURL,
        type: 'GET',
        success: function(data, status){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            funcCallback(ret);
        },
        error: function(status, data){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            errorCallback(ret);
        }
        });
    }
    else // if POST
    {
        sURL = telosAPIURL_chain + "get_table_rows";
        
        var post_data 			 = {};
        post_data.json           = true;
		post_data.code			 = contract.toLowerCase();
		post_data.limit		     = limit;
		post_data.scope          = scope.toLowerCase();
        post_data.table          = table;
        post_data.upper_bound    = upper_bound;
        post_data.lower_bound    = lower_bound;
        post_data.index_position = index_position;
        post_data.key_type       = key_type;
		post_data 				 = JSON.stringify(post_data);
        
        $.ajax({
        url: sURL,
        type: 'POST',
        data: post_data,
        success: function(data, status){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            funcCallback(ret);
        },
        error: function(status, data){
            var ret = {};
            ret.data = data;
            ret.status = status;
            
            errorCallback(ret);
        }
        });
    }
}

// function tlos_get_contract_tbl_row(contract, table, row_index, funcCallback, errorCallback = function(err) {})
//   This pulls a single row.  
//
// contract - string like "eosio.token"
// table - table to access like "accounts" for eosio.token contract
// row_index - string of row identifier like 'laa11' or primary index key to find
// funcCallback(ret) - Callback function upon finding transaction
// errorCallback(err) - Error Callback function upon not finding transaction
//
// returns - nothing
function tlos_get_contract_tbl_row(contract, table, row_index, funcCallback, errorCallback = function(err) {}) { 

    tlos_get_table_rows(contract, 1, contract, table, -1, row_index, funcCallback, errorCallback);

}

// function tlos_get_permissions(account_name, funcCallback, errorCallback = function() {})
//   returns array of all permissions
//
// account_name - eosio / telos account name
// funcCallback(ret) - Callback function upon quering API
// errorCallback(err) - Error Callback function upon quering API
//
// returns - nothing
function tlos_get_permissions(account_name, funcCallback, errorCallback = function() {}) {
    
    telos_get_account(account_name, function(ret){
        
        var permissions = ret.data.permissions;
        
        funcCallback(permissions);
    }, errorCallback);
}



//*********************** DEBUG TESTING -- 
// regional player slection, area player selection
// uses secondary keys

//var upper = "laa11pz1z2heartfarmsio";

//var lower = "laa11pz1z1heartfarmsio";
//var lower = encodeName_i128("laa11pz1z1","heartfarmsio");
//var lower = encodeName_i64("laa11pz1z1") + encodeName_i64("heartfarmsio");

//var upper = encodeName_i64("laa11pz1z1") + encodeName_i64("heartfarmsioj");
//var lower = encodeName_i64("laa11pz1z1") + encodeName_i64("heartfarmsio");

/*
var upper = encodeName_i64("laa11zzzzzzzj") + encodeName_i64(".");
var lower = encodeName_i64("laa11") + encodeName_i64("zzzzzzzzzzzzj");

var limit = 10;
var key_type = "i128";

console.log("lower - " + binaryToBigInt(lower));
console.log("upper - " + binaryToBigInt(upper));

var upper_a = binaryToBigInt(upper);
var lower_b = binaryToBigInt(lower);


function fCallback(ret) {
    console.log("Player data:");
    console.log(ret);
}

function fError(ret) {
    console.log("Error!:");
    console.log(ret);
}

console.log("init testing...");

tlos_get_table_rows("heartfarmsio", limit, "heartfarmsio", "players", upper_a, lower_b, fCallback, fError, 2, key_type);
*/
//function tlos_get_table_rows(contract, limit, scope, table, upper_bound, lower_bound, funcCallback, errorCallback = function(err) {}, index_position = "primary", key_type = "name") {
