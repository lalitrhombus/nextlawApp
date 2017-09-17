document.addEventListener("deviceready", listDir, false);
/*--------base function to get the search history ------*/
function listDir() {

    window.plugins.spinnerDialog.show(null, "Loading",true);
    var myDB = window.sqlitePlugin.openDatabase({name: "nextlaw.db", location: 'default'});
    myDB.transaction(function(transaction) {
    transaction.executeSql('SELECT * from searchhistory ORDER BY id DESC',[],
    function(tx, result) {
   					var currentDate=new Date();

   					$('.datal').html('');
   					for ( var i = 0; i < result.rows.length; i++ ) {

                            console.log("filelinkss="+result.rows.item(i).filepath);
                            var middle="<span class='color-motor'>"+result.rows.item(i).searched+"</span>";
                            var category="<span style='color:#000063;'>"+result.rows.item(i).category+"</span>";
                            //alert(JSON.stringify(result.rows.item(i).leftmatter));
                            //alert(JSON.stringify(result.rows.item(i).rightmatter));
                            var res=result.rows.item(i).leftmatter+middle+result.rows.item(i).rightmatter;
                            console.log("reeeee="+res);
                            var trg='';
                            if(result.rows.item(i).triggercheck==1)
                            {
                                trg='green';
                            }
                            else if(result.rows.item(i).triggercheck==2)
                            {
                                trg='red';
                            }
                            else if(result.rows.item(i).triggercheck==3)
                            {
                                trg='yellow';
                            }
                            else
                            {
                                trg='grey';
                            }
   							$('.datal').append("<div class='col-xs-12 detail-name'><div class='col-xs-8'><div class='detail-name-text' style='width:100%;'> <p class='disc-motor-text' style='word-wrap:break-word;' id='file://"+result.rows.item(i).filepath+"' onClick='casedetail(this.id)'>"+result.rows.item(i).leftmatter+"<span class='color-motor'>"+result.rows.item(i).searched+"</span>"+result.rows.item(i).rightmatter+"</p></div><p>"+category+"</p></div><div class='col-xs-2'><div class='download-serch' class='img-responsive'><div class='tre'><img src='images/"+trg+".png' class='img-responsive'></div></div></div><div class='col-xs-2'><div class='download-serch' class='img-responsive'><div class='tre'><img src='images/edit.png' class='img-responsive' onClick='add_note(this.id);'  id='"+result.rows.item(i).filename+"'></div></div></div></div>");

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
/*-------Function to add notes -----------*/
function add_note(id){
	var filename = id;
	window.localStorage.setItem("filename",filename);
	slideleft();
	window.location.href="addnote.html";

}
/*-------Function to open the detail of case ---- */
function casedetail(url)
{
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