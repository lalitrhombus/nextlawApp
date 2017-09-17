
function init(resul) {
    var fileName = resul[i].downloads[i].name;
	window.localStorage.setItem("fileName",fileName);
    $status = document.querySelector("#status");
	var assetURL= resul[i].downloads[i].file;
	window.localStorage.setItem("assetURL",assetURL);	
   console.log("Checking for data file.");

    store = cordova.file.dataDirectory;

    //Check for the file. 
    window.resolveLocalFileSystemURL(store +fileName, appStart, downloadAsset);

}

function downloadAsset() {
var assetURL = window.localStorage.getItem("assetURL");
var fileName = window.localStorage.getItem("fileName");
    var fileTransfer = new FileTransfer();
    console.log("About to start transfer");
    fileTransfer.download(assetURL, store+fileName, 
        function(entry) {
            console.log("Success!");
            appStart();
        }, 
        function(err) {
            console.log("Error");
            console.dir(err);
        });
}

//I'm only called when the file exists or has been downloaded.
function appStart() {
    console.log("App ready!");
}
