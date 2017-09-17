document.addEventListener("deviceready", addnoteview, false);

var savednote="";

function addnoteview() {
	//window.plugins.spinnerDialog.show(null, "Loading");
	var filename=window.localStorage.getItem("filename");
	document.getElementById("save").disabled = true;
	document.getElementById("edidet").disabled = false;
	document.getElementById("note").readOnly = true;
	var myDB = window.sqlitePlugin.openDatabase({name: "nextlaw.db", location: 'default'});
                       		myDB.transaction(function(transaction) {
                               transaction.executeSql('SELECT * from note WHERE documentname = "'+filename+'"',[],
                               function(tx, result) {
					//alert(JSON.stringify(result.rows.item(0).note));
					savednote = result.rows.item(0).note;
					document.getElementById('note').value=savednote;
					//window.plugins.spinnerDialog.hide();
                               },
                               function(error) {alert(JSON.stringify(error));
					//window.plugins.spinnerDialog.hide();
                               });
		});
			
			}

function editnote() {
			
			document.getElementById("save").disabled = false;
			document.getElementById("edidet").disabled = true;
			document.getElementById("note").readOnly = false;
			$('#edibtn').removeClass('prev-buta');
			$('#svbtn').removeClass('panel-dioa');
			$('#edibtn').addClass('panel-dioa');
			$('#svbtn').addClass('prev-buta');
			}

function savenote() {
			var filename=window.localStorage.getItem("filename");
			var note = document.getElementById("note").value;
			if(savednote=="")
			{
				var myDBs = window.sqlitePlugin.openDatabase({name: "nextlaw.db", location: 'default'});
				myDBs.transaction(function(transaction) {
					 var executeQuery ="INSERT INTO note (documentname , note )VALUES(?,?)";
					transaction.executeSql(executeQuery,[filename,note],function(tx, result) {
									window.plugins.toast.show('Note saved', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
		                       },
		                        function(error){
		                        window.plugins.toast.show('Error saving note', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
		                        });
				window.plugins.spinnerDialog.hide();
						
				});
			}
			else
			{
				var myDBs = window.sqlitePlugin.openDatabase({name: "nextlaw.db", location: 'default'});
				myDBs.transaction(function(transaction) {
					 
					transaction.executeSql('UPDATE note SET note = "'+note+'"',[],function(tx, result) {
									window.plugins.toast.show('Note saved', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
		                       },
		                        function(error){
		                        window.plugins.toast.show('Error saving note', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
		                        });
				window.plugins.spinnerDialog.hide();
						
				});				
			}
			
			document.getElementById("save").disabled = true;
			document.getElementById("edidet").disabled = false;
			document.getElementById("note").readOnly = true;
			$('#edibtn').removeClass('panel-dioa');
			$('#svbtn').removeClass('prev-buta');
			$('#edibtn').addClass('prev-buta');
			$('#svbtn').addClass('panel-dioa');
			}
