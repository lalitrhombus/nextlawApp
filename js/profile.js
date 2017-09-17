document.addEventListener("deviceready", init, false);

function init(){
	getprofilepic();
	updateprofile();	
}

function getprofilepic(){
	var profilepicpath = window.localStorage.getItem("profilepicpath");
	var entryname = profilepicpath.substring(profilepicpath.lastIndexOf('/') + 1);
	$('#profilepic').html('');
	if(profilepicpath == 0){
		$('#profilepic').append("<img src='images/profile-user-img.png' class='img-responsive profileimage' id='pimage'>");
	}
	else{
		$('#profilepic').append("<img src='"+profilepicpath+"' class='img-responsive profileimage' id='pimage'>");
	}
}

var inp = document.getElementById('uploadpic');
inp.addEventListener('change', function(e){
    var file = this.files[0];
   updateprofilepic();
   /* var reader = new FileReader();
    reader.onload = function(){
        document.getElementById('preview').src = this.result;
        };
    reader.readAsDataURL(file);*/
    
    },false);
function updateprofilepic(){
	window.plugins.spinnerDialog.show(null, "Updating Profile");
	var profilepic = $('#uploadpic').prop("files")[0];
	//alert(profilepic);
	if(profilepic != null){
		var userid=window.localStorage.getItem("userid");
		var formData = new FormData();
		//console.log("gotfile=",profilepic);
		formData.append("userid", userid);

		// HTML file input, chosen by user
		formData.append("profilepic", profilepic);
	
		$.ajax({
			url:"http://nextlaw.co.za/profile-picture-api",
			type:"POST",
			data:formData,
	 		processData: false,
			contentType: false,
			crossDomain:true,
			cache:false,
			success: function(resul)
			{
				resul = JSON.parse(resul);
				var assetURL=resul.image_url;
				var fileName=assetURL.substring(assetURL.lastIndexOf('/') + 1);
				var profilepicpath = cordova.file.externalApplicationStorageDirectory+fileName;
				var fileTransfer = new FileTransfer();
				console.log("About to start transfer");
				fileTransfer.download(assetURL, cordova.file.externalApplicationStorageDirectory+fileName,
				function(entry) {
					console.log(entry);
					window.localStorage.setItem("profilepicpath", profilepicpath);
					document.getElementById('pimage').src=profilepicpath;
					window.plugins.toast.show('Profile Picture Updated', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});	
					window.plugins.spinnerDialog.hide();
				},
				function(err) {
					console.dir(err);
					window.plugins.toast.show('Profile Updated', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});	
					window.plugins.spinnerDialog.hide();
				});
				
			}			
		});
	}
	else{
		window.plugins.toast.show('Profile Updated', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});	
		window.plugins.spinnerDialog.hide();
	}
}

function updateprofile() {
			document.getElementById("save").disabled = true;
			document.getElementById("edidet").disabled = false;
			$('#edibtn').removeClass('panel-dioa');
			$('#svbtn').removeClass('prev-buta');
			$('#edibtn').addClass('prev-buta');
			$('#svbtn').addClass('panel-dioa');
			var name=window.localStorage.getItem("name");
			var firstname=window.localStorage.getItem("firstname"); 
			var lastname=window.localStorage.getItem("lastname");
			var email=window.localStorage.getItem("email"); 
			var password=window.localStorage.getItem("password"); 
			var username=window.localStorage.getItem("username");
			var avatar=window.localStorage.getItem("avatar");

			document.getElementById('name').value=name;
			document.getElementById('firstname').value=firstname;
			document.getElementById('lastname').value=lastname;
			document.getElementById('email').value=email;
			document.getElementById('username').value=username;
			document.getElementById('password').value=password;
			document.getElementById("name").readOnly = true;
			document.getElementById("firstname").readOnly = true;
			document.getElementById("lastname").readOnly = true;
			document.getElementById("email").readOnly = true;
			document.getElementById("username").readOnly = true;
			document.getElementById("password").readOnly = true;
			}
 function editprofile() {
			document.getElementById("firstname").readOnly = false;
			document.getElementById("lastname").readOnly = false;
			document.getElementById("password").readOnly = false;
			document.getElementById("save").disabled = false;
			document.getElementById("edidet").disabled = true;
			document.getElementById("firstname").focus();
			$('#edibtn').removeClass('prev-buta');
			$('#svbtn').removeClass('panel-dioa');
			$('#edibtn').addClass('panel-dioa');
			$('#svbtn').addClass('prev-buta');
			}
 function saveprofile() {
			window.plugins.spinnerDialog.show(null, "Updating Profile");
			var firstname2=document.getElementById('firstname').value; 
			window.localStorage.removeItem("firstname"); 
			window.localStorage.setItem("firstname", firstname2);
			var lastname2=document.getElementById('lastname').value; 
			window.localStorage.removeItem("lastname"); 
			window.localStorage.setItem("lastname", lastname2);    
			var email=document.getElementById('email').value;
			window.localStorage.removeItem("email");
			window.localStorage.setItem("email", email);
			var username=document.getElementById('username').value;
			window.localStorage.removeItem("username");
			window.localStorage.setItem("username", username);
			var password=document.getElementById('password').value;
			window.localStorage.removeItem("password");
			window.localStorage.setItem("password", password);
			var name=firstname2+" "+lastname2;
			window.localStorage.setItem("name", name);
			document.getElementById("firstname").readOnly = true;
			document.getElementById("lastname").readOnly = true;
			document.getElementById("email").readOnly = true;
			document.getElementById("username").readOnly = true;
			document.getElementById("password").readOnly = true;
			var userid=window.localStorage.getItem("userid"); 
			//alert(userid);
			$.ajax({
			url:"https://nextlaw.co.za/wp-json/wp/v2/users/"+userid,
			type:"post",
			header:{Authentication: "Basic " + btoa(username+":"+password)},
			data:"first_name="+firstname2+"&last_name="+lastname2+"&name="+name+"&password="+password,
			success:function(res)
			{
				window.plugins.toast.show('Profile Updated', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});	
					window.plugins.spinnerDialog.hide();
				console.log("updating");
				
			}			
			});
			
			
			}
