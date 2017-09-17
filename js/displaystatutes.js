document.addEventListener("deviceready", listDir, false);


function listDir() {
window.plugins.spinnerDialog.show(null, "Loading",true);
var myDB = window.sqlitePlugin.openDatabase({name: "nextlaw.db", location: 'default'});
                       		myDB.transaction(function(transaction) {
                               transaction.executeSql('SELECT * from wooproducts WHERE name = "Statutes of Parliament"',[],
                               function(tx, result) {
					var currentDate=new Date();
					//alert(JSON.stringify(result));
					//var fileDate=new Date(result.rows.item(0));
                               		//alert(JSON.stringify(result.rows.item(0)));
					//alert(JSON.stringify(result.rows.item(0).date_modified));
					//alert(JSON.stringify(fileDate);
					$('.datal').html('');
					for ( var i = 0; i < result.rows.length; i++ ) {
						//var moddate=window.localStorage.getItem("moddate");
						//alert(moddate);
						/*Loop start*/
						//if(daysDiff(currentDate, result.rows.item(i).date_modified) > 0)
						//{
                        console.log("filalinkas="+result.rows.item(i).dfile);
							$('.datal').append("<div class='col-xs-12 detail-name'><div class='col-xs-8'><div class='detail-name-text'> <p class='disc-motor-text' id='"+result.rows.item(i).dfile+"' onclick='casedetail(this.id)'>"+result.rows.item(i).filename+"</p></div></div><div class='col-xs-2'>  <div class='download-serch'><div class='tre'><a href='search.html'><img src='images/post-serch.png' class='img-responsive'></a></div></div></div><div class='col-xs-2'><div class='download-serch' class='img-responsive'><div class='tre'><img src='images/edit.png' class='img-responsive' onClick='add_note(this.id);'  id='"+result.rows.item(i).filename+"'></div></div></div></div>");
						//}
					}
					$('.datal').append('');
					window.plugins.spinnerDialog.hide();
                               },
                               function(error) {
					window.plugins.spinnerDialog.hide();
                               		//alert(JSON.stringify(error));
                               });
});
  
}

function add_note(id){
	var filename = id;
	window.localStorage.setItem("filename",filename);
	slideleft();
	window.location.href="addnote.html";

}

function casedetail(url)
{
	//cordova.plugins.market.open('your.app.package')
	var onSuccesss = function(datas) {
    		//alert('File opened successfully');
	};

	// onError Callback receives a json object
	//
	function onErrorr(errors) {
	    //alert('Notice: ' + errors.message);
	}
	var onSuccess = function(data) {
		if(data.canBeOpen==true)
		{
			
			window.cordova.plugins.FileOpener.openFile(url, onSuccesss, onErrorr);
		}
		else
		{
			var r=confirm("File viewer is required to open the file. Please click 'OK' to download file viewer!");
			if(r==true)
			{
				cordova.plugins.market.open('com.tf.thinkdroid.viewer.global');
			}
			else
			{
							
			}
		}	    
		//alert('extension: ' + data.extension + '\n' +0 'canBeOpen: ' + data.canBeOpen);
	};

	// onError Callback receives a json object
	//
	function onError(error) {
	    alert('Notice: File is either corrupted or not downloaded properly');
	}

	window.cordova.plugins.FileOpener.canOpenFile(url, onSuccess, onError);
	

	
}

