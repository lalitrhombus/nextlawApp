document.addEventListener("deviceready", listDir, false);


function listDir() {
var myDB = window.sqlitePlugin.openDatabase({name: "nextlaw.db", location: 'default'});
                          myDB.transaction(function(transaction) {
                               transaction.executeSql('SELECT * from wooproducts',[],
                               function(tx, result) {
                                  alert(JSON.stringify(result.rows.item(0)));
                               },
                               function(error) {
                                  alert(JSON.stringify(error));
                               });
});
   window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {

var directoryReader = dirEntry.createReader();

directoryReader.readEntries(dirSuccess,dirFail);

});

}

function dirSuccess(entries) {
alert(JSON.stringify(entries));
console.log("INFO: Listing entries");

var i;
var j;
var currentDate=new Date();
$('.datal').html();
for ( var i = 0; i < entries.length; i++ ) {
  
  window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + entries[i].name, gotFile, fail);
  var moddate=window.localStorage.getItem("moddate");
  //alert(moddate);
  /*Loop start*/
  if(daysDiff(currentDate, file.lastModifiedDate) > 15)
  {
    var divs="<div class='col-xs-12 detail-name'><div class='col-xs-8'><div class='detail-name-text'> <p class='disc-motor-text' onclick='casedetail()'>"+entries[i].name+"</p></div></div><div class='col-xs-2'>  <div class='download-serch'><div class='tre'><a href=''><img src='images/post-serch.png' class='img-responsive'></a></div></div></div><div class='col-xs-2'><div class='download-serch' class='img-responsive'><div class='tre'><a href=''><img src='images/edit.png' class='img-responsive' onclick='addnote()'></a></div></div></div></div>";
    $('.datal').append(divs);
  }
}




}

 function fail(e) {
    console.log("FileSystem Error");
    console.dir(e);
}

function gotFile(fileEntry) {

    fileEntry.file(function(file) {
        var moddate = (new Date(file.lastModifiedDate));
        window.localStorage.setItem("moddate",moddate);
               
    });  
}

function dirFail(error) {

console.log("Failed to list directory contents: " + error.code);

}
