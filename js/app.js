/*
--------------Onload function to check if already logged in or not----------------
*/

document.addEventListener("deviceready", init, false);
/*
--------------Check If device is connected to internet or not----------------
*/
function init(){
    document.addEventListener("backbutton", function(e){
           if(window.location.href=='file:///android_asset/www/dashboard.html'){
               var re= confirm("Do you want to close the app?");
               e.preventDefault();
               if(re==true)
               {
                navigator.app.exitApp();
               }

           }
           else {
               navigator.app.backHistory()
           }
        }, false);
	createdb();
	checkConnection();
}

/*
--------------Check whether device is online or not----------------
*/
function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    if(states[networkState]=="No network connection")
	    {
		window.localStorage.setItem("dstatus","offline");
		
	    }
	if(states[networkState]=="Unknown connection")
	{
	    window.localStorage.setItem("dstatus","offline");
	}
    if(states[networkState]!="No network connection" )
        {
            window.localStorage.setItem("dstatus","online");
        }
   /* if(stated[networkState]=='WiFi connection')
    {
        window.localStorage.setItem("dstatus","online");
    }*/
    if(window.location.href=="file:///android_asset/www/login.html")
    {
        directlogin();
    }
  }


/*
--------------Slide Left on Previous Page----------------
*/

function slideleft() {
			var options = {
			  		"direction"        : "left", // 'left|right|up|down', default 'left' (which is like 'next')
					"duration"         :  250, // in milliseconds (ms), default 400
					"slowdownfactor"   :    -1, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
					"slidePixels"      :   0, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
					"iosdelay"         :  100, // ms to wait for the iOS webview to update before animation kicks in, default 60
					"androiddelay"     :  150, // same as above but for Android, default 70
					"winphonedelay"    :  250, // same as above but for Windows Phone, default 200,
					"fixedPixelsTop"   :    0, // the number of pixels of your fixed header, default 0 (iOS and Android)
					"fixedPixelsBottom":   0  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
					};
			window.plugins.nativepagetransitions.slide(
					options,
					function (msg) {console.log("success: " + msg);}, // called when the animation has finished
					function (msg) {console.log("error: " + msg);} // called in case you pass in weird values
					);
		} 


/*
--------------Slide Right on Next Page----------------
*/

function slideright() {
			var options = {
			  		"direction"        : "right", // 'left|right|up|down', default 'left' (which is like 'next')
					"duration"         :  250, // in milliseconds (ms), default 400
					"slowdownfactor"   :    0, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
					"slidePixels"      :   0, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
					"iosdelay"         :  100, // ms to wait for the iOS webview to update before animation kicks in, default 60
					"androiddelay"     :  150, // same as above but for Android, default 70
					"winphonedelay"    :  250, // same as above but for Windows Phone, default 200,
					"fixedPixelsTop"   :    0, // the number of pixels of your fixed header, default 0 (iOS and Android)
					"fixedPixelsBottom":   0  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
					};
			window.plugins.nativepagetransitions.slide(
					options,
					function (msg) {console.log("success: " + msg);}, // called when the animation has finished
					function (msg) {console.log("error: " + msg);} // called in case you pass in weird values
					);
		} 



/*
--------------Create Database to Store all the required product information----------------
*/

      function createdb() {
        // Now safe to use device APIs
				
                            var myDB = window.sqlitePlugin.openDatabase({name: "nextlaw.db", location: 'default'});
                       		myDB.transaction(function(transaction) {

                               transaction.executeSql('CREATE TABLE IF NOT EXISTS wooproducts (id integer primary key, docid integer, name text,short_desc text,description text, file_id text unique, filename text,  dfile text,folder_links text,date_created text,date_modified text)', [],
                               function(tx, result) {
                               		console.log("Table created successfully");
                               },
                               function(error) {
                               		console.log("Error occurred while creating the table.");
                               });
				               transaction.executeSql('CREATE TABLE IF NOT EXISTS note (documentname text primary key, note text)', [],
                               function(tx, result) {
                               		console.log("Note Table created successfully");
                               },
                               function(error) {
                               		console.log("Error occurred while creating the note table.");
                               });
                               transaction.executeSql('CREATE TABLE IF NOT EXISTS searchhistory (id integer primary key, filename text,searched text, filepath text,category text,leftmatter text,rightmatter text,triggercheck text)', [],
                                                              function(tx, result) {
                                                              		console.log("Searchhistory Table created successfully");
                                                              },
                                                              function(error) {
                                                              		console.log("Error occurred while creating the searchhistory table.");
                                                              });
                               });
               

    }


/*
--------------Automatic Login Function----------------
*/
	function directlogin(){

					var loginval=0;
					var loginval=window.localStorage.getItem("loginval");	

						if(loginval==1)
						{
							
							window.localStorage.setItem("procheck",0);
							slideleft();
							var dstatus=window.localStorage.getItem("dstatus");

						            if(dstatus=="online")
						            {
								window.plugins.spinnerDialog.show(null, "Logging in",true);
						            	subscriptioncheck();
						            }
							else
							{				
									window.location.href="dashboard.html";
							}
						}

			}

/*
--------------Login Function----------------
*/
 	function login() { //checkConnection();
		// dstatus is the device status, if it's online or not
		var dstatus=window.localStorage.getItem("dstatus");
		//procheck is the variable used for checking products update while first time dashboard opens		
		window.localStorage.setItem("procheck",0);
		//Device ID is the IMEI no. of the users phone		
		var deviceid = device.uuid;

		
		var username=document.getElementById('username').value;
		var password=document.getElementById('password').value;
		
		window.localStorage.setItem("password", password);
		if(dstatus=="offline")
		{
			window.plugins.toast.show('No internet connection', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
		}
		else
		{
		window.plugins.spinnerDialog.show(null, "Logging In",true);
		if(username!='' && password!='')
			{
				var datastring="username="+username+"&password="+password;
				$.ajax({
				url:"https://nextlaw.co.za/api/user/generate_auth_cookie/",
				type:"POST",
				data:"username="+username+"&password="+password,
				crossDomain:true,
				cache:false,
				dataType:"jsonp",
				success: function(res)
				{ 	console.log("Res="+JSON.stringify(res));
					if(res.status=="ok")
						{
							console.log(JSON.stringify(res));
							var userid=(res.user.id);
							window.localStorage.setItem("userid", userid);
	 						var username=(res.user.username);
							window.localStorage.setItem("username", username);
							var email=(res.user.email);
							window.localStorage.setItem("email", email); 	
							var firstname=(res.user.firstname);
							window.localStorage.setItem("firstname", firstname);	
							var lastname=(res.user.lastname);
							window.localStorage.setItem("lastname", lastname);
							var avatar=(res.user.avatar);
							window.localStorage.setItem("avatar", avatar);
							var name=firstname+" "+lastname;
							window.localStorage.setItem("name", name);
							
							devicecheck(deviceid,username,userid,email);
							//var deviceallowed = window.localStorage.getItem("deviceallowed");
							
						}
					else
						{
							window.plugins.spinnerDialog.hide();
							window.plugins.toast.show('Login Failed. Invalid username/password', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
						}
				}
			});
		}
		else{

			window.plugins.spinnerDialog.hide();
		window.plugins.toast.show('Username or password can not be empty.', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
}
	}
	}
    /*------(Should not have logged in through more than 2 devices) device check---------*/
	function devicecheck(deviceid,username,userid,email){
		$.ajax({
				url:"https://nextlaw.co.za/secure-login/",
				type:"POST",
				data:"username="+username+"&useremail="+email+"&userid="+userid+"&imei="+deviceid,
				crossDomain:true,
				cache:false,
				success: function(res)
				{
					var result = JSON.parse(res);
					var deviceallowed=result.success;
					window.localStorage.setItem("deviceallowed", deviceallowed);
					//deviceallowed = "yes";
					if(deviceallowed == "yes"){	
							getprofilepic();
							
					}
					else
					{
						window.plugins.spinnerDialog.hide();
						window.plugins.toast.show('Sorry you cannont login from more than 2 device', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
						window.location.href="login.html";
			
					}	
									
				}	
		});
	}
	
/*-------------------Get Profile Image From API---------------*/
function getprofilepic(){
	var userid=window.localStorage.getItem("userid");
	$.ajax({
		url:"http://nextlaw.co.za/profile-picture-api",
		type:"POST",
		data:"userpic="+userid,
		crossDomain:true,
		cache:false,
		success: function(resul)
		{

		      downloadimage(resul);

		}
	});
}
/*---------------------------Download Profile Image ---------------*/
function downloadimage(resul){
	resul = JSON.parse(resul);
	//alert(resul.status);
	if(resul.status==1){
			       var assetURL=resul.image_url;
				var fileName=assetURL.substring(assetURL.lastIndexOf('/') + 1);
				if(fileName != '')
				{
				    var profilepicpath = cordova.file.externalApplicationStorageDirectory+fileName;
                    		                var fileTransfer = new FileTransfer();
                    		               console.log("About to start transfer");
                    		                fileTransfer.download(assetURL, cordova.file.externalApplicationStorageDirectory+fileName,
                    		                function(entry) {
                    					console.log(entry);
                    					window.localStorage.setItem("profilepicpath", profilepicpath);
                    					subscriptioncheck();
                    		                },
                    		                function(err) {
                    		               	        console.dir(err);
                    		                });
				}
				else
				{
				    window.localStorage.setItem("profilepicpath", 0);
                    subscriptioncheck();
				}

			}
			else{
				window.localStorage.setItem("profilepicpath", 0);
				subscriptioncheck();
			}
}


/*
--------------Check Subscription Status of a logged in User----------------
*/
				
	function subscriptioncheck() {
			var userid=window.localStorage.getItem("userid");
			// STCHECK is the variable used used for checking the subscription status			
			var stcheck='';
			$.ajax({
			url:"https://nextlaw.co.za/wp-json/wc/v1/subscriptions?consumer_key=ck_dd1a1db26f8dc588ca276f5c55c540d29e563a9f&consumer_secret=cs_6ea659fa62d878ab6463a3d7ed4e07b26ef7d27d&context=view&status=any",
			type:"GET",
			async: false,
			crossDomain:true,
			cache:false,
			dataType:"json",
			success: function(resu)
			{ console.log(JSON.stringify(resu));

				function findItem(arr, key1,key2,value1,value2) {
						
					for (var i = 0; i < arr.length; i++) {
					  if ((arr[i][key1] == value1) && (arr[i][key2] == value2)) {
						window.localStorage.setItem("status", "active");
					       var re="1";
					   }else{
						if((arr[i][key1] == value1) && arr[i][key2]=="expired")
						{ stcheck="expired";
							window.localStorage.setItem("status", "expired");
							var re="0";
						}
						
						if((arr[i][key1] == value1) && arr[i][key2]=="cancelled")
						{ stcheck="cancelled";
							window.localStorage.setItem("status", "cancelled");
							var re="0";
						}
						
						if((arr[i][key1] == value1) && arr[i][key2]=="pending")
						{ stcheck="pending";
							window.localStorage.setItem("status", "pending");
							var re="0";						
						}
						
						if((arr[i][key1] == value1) && arr[i][key2]=="on-hold")
						{ stcheck="on-hold";
							window.localStorage.setItem("status", "on-hold");
							var re="0";
						}
						
						if((arr[i][key1] == value1) && arr[i][key2]=="pending-cancel")
						{ stcheck="pending-cancel";
							window.localStorage.setItem("status", "pending-cancel");
							var re="0";
						}
						
					}
					
					}
					return(re);
					
				    }

                    var usernames=window.localStorage.getItem("username");
                    var emails=window.localStorage.getItem("email");

				    var check = findItem(resu,"customer_id","status",userid,"active");

					if (check == 1) {
						window.localStorage.setItem("loginval", 1);
						window.plugins.spinnerDialog.hide();
						slideleft();
						window.location.href="dashboard.html";
					}
					else
					{
						if(stcheck == "expired")
						{
							window.localStorage.setItem("loginval", 1);
							window.plugins.spinnerDialog.hide();
							window.plugins.toast.show('Your Subscription status is '+stcheck+'. Please renew your subscription to get updates.', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
							slideleft();							
							window.location.href="dashboard.html";
						}
						else
						{
						if(stcheck == "pending" || stcheck == "pending-cancel")
						{
							window.localStorage.setItem("loginval", 1);
							window.plugins.spinnerDialog.hide();
							window.plugins.toast.show('Your Subscription status is '+stcheck+'. Please get an active subscription to get updates.', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
							slideleft();							
							window.location.href="dashboard.html";
						}
						else
						{
						    window.localStorage.setItem("loginval", 0);
						    $.ajax({
                            				url:"https://nextlaw.co.za/secure-login/",
                            				type:"POST",
                            				data:"username="+usernames+"&useremail="+emails+"&userid="+userid+"&trial=1",
                            				crossDomain:true,
                            				cache:false,
                            				success: function(resss)
                            				{
                            				    var rest=JSON.parse(resss);
                                                if(rest.trialperiod <= 14)
                                                {
                                                    window.localStorage.setItem("loginval", 1);
                                                    window.plugins.spinnerDialog.hide();
                                                    if(rest.trialperiod == 0)
                                                    {
                                                        window.plugins.toast.show('Your 14 days trial subscription is started today.' , 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
                                                    }
                                                    slideleft();
                                                    window.location.href="dashboard.html";
                                                }
                                                else
                                                {
                                                    window.localStorage.setItem("loginval", 0);
                                                    window.plugins.spinnerDialog.hide();
                                                    window.plugins.toast.show('You do not have a valid subscription or your trial subscription ended. Please visit nextlaw.co.za' , 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
                                                    slideleft();
                                                    window.location.href="login.html";

                                                }

                            				}
                            });

						}
						}
					}
					

			}
		});
}

/*
--------------Retrieve Password for a user's account----------------
*/
	
function retrieve_pass() {
			var mail=document.getElementById('forgotpass').value;
			if(mail != '')
				{
			window.plugins.spinnerDialog.show(null, "Sending verification mail",true);
			$.ajax({
			url:"https://nextlaw.co.za/api/user/retrieve_password/",
			type:"POST",
			data:"user_login="+mail,
			crossDomain:true,
			cache:false,
			dataType:"jsonp",
			success: function(resultuu)
			{ 	
				if(resultuu.status=="ok")
					{
						window.plugins.spinnerDialog.hide();
						window.plugins.toast.show('Recovery mail sent to your email address', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
						window.location.href="login.html";
						}
				else
					{
						window.plugins.spinnerDialog.hide();
						window.plugins.toast.show('Invalid email address', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
					}		
						

		}	
});
}
			else
				{	
					window.plugins.toast.show('Please enter a email address', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
				}
}			
   
		
   

