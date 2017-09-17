/* 
--------------List Files---------------
*/

	function listfiles() {
		var index = 0;
		var i;

		/**
		 * Need cordova.file plugin.
		 * $ cordova plugin add org.apache.cordova.file
		 * 
		 * To get all urls see https://github.com/apache/cordova-plugin-file/blob/master/README.md#where-to-store-files
		 * 
		 */
		var localURLs    = [
		 
		  cordova.file.dataDirectory
		 
		];

		/**
		 * Recursive function for file entry.
		 */
		var addFileEntry = function (entry) {
		  var dirReader = entry.createReader();
		  dirReader.readEntries(
		    function (entries) {
		      var fileStr = "";
		      var i;
		      for (i = 0; i < entries.length; i++) {
			if (entries[i].isDirectory === true) {
			  // Recursive -- call back into this subdirectory
			  addFileEntry(entries[i]);
			} else {
			  console.log(entries[i].fullPath);
			  index++;
			}
		      }
		    },
		    function (error) {
		      console.error("readEntries error: " + error.code);
		    }
		  );
		};

		/**
		 * Directory error.
		 */
		var addError = function (error) {
		  console.error("getDirectory error: " + error.code);
		};

		/**
		 * Loop through the array.
		 */
		for (i = 0; i < localURLs.length; i++) {
		  if (localURLs[i] === null || localURLs[i].length === 0) {
		    continue; // skip blank / non-existent paths for this platform
		  }
		  window.resolveLocalFileSystemURL(localURLs[i], addFileEntry, addError);
		}
	}
