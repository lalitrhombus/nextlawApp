document.addEventListener("deviceready", listDir, false);
/*--------base function to get the search list ------*/
function listDir() {


    var searchLink= window.localStorage.getItem("SearchResult");

    var searchtext=window.localStorage.getItem("SearchText");
    searchLink=JSON.parse(searchLink);
    console.log("searchlink="+JSON.stringify(searchLink));
    searchLink.forEach(function (doc) {
 var fp='file://';
    var myDBs = window.sqlitePlugin.openDatabase({name: "nextlaw.db", location: 'default'});
    	myDBs.transaction(function(transaction) {
    		var executeQuery ="INSERT INTO searchhistory (filename,searched,filepath,category,leftmatter,rightmatter,triggercheck)VALUES(?,?,?,?,?,?,?)";

    		transaction.executeSql(executeQuery,[doc.filename,doc.searchd,doc.filepath,doc.category,doc.leftmatter,doc.rightmatter,doc.triggercheck],function(tx, result) {
    					console.log('Inserted');



    		},
    		function(error){
    				console.log("already");

    		});
    	});

console.log("triggercheck="+doc.triggercheck);
    var middle="<span class='color-motor'>"+doc.searchd+"</span>";
    var category="<span style='color:#000063;'>"+doc.category+"</span>";
    var res=doc.leftmatter+middle+doc.rightmatter;
    var trg='';
    if(doc.triggercheck==1)
    {
        trg='green';
    }
    else if(doc.triggercheck==2)
    {
        trg='red';
    }
    else if(doc.triggercheck==3)
    {
        trg='yellow';
    }
    else
    {
        trg='grey';
    }

    				    $('.datal').append("<div class='col-xs-12 detail-name'><div class='col-xs-8'><div class='detail-name-text'> <p class='disc-motor-text' style='word-wrap:break-word;' id='file://"+doc.filepath+"' onclick='casedetail(this.id)'>"+res+"<br/>"+category+"</p></div></div><div class='col-xs-2'>  <div class='download-serch'><div class='tre'><a href=''><img src='images/"+trg+".png' class='img-responsive'></a></div></div></div><div class='col-xs-2'><div class='download-serch' class='img-responsive'><div class='tre'><img src='images/edit.png' class='img-responsive' onClick='add_note(this.id);'  id='"+doc.filename+"'></div></div></div></div>");

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
            //window.plugins.fileOpener.openFile(url);
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