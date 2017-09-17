/*
--------------Onload Function to check for product updates and downloading them----------------
*/
var k=1;
document.addEventListener("deviceready", function(){ checkspace();}, false);
var allfilelinks = new Array();
var page = new Array();
//cordova.plugins.backgroundMode.enable();
var options={"location":2};
// ----------Device Space checking -------------//
function checkspace()
{
    var dstatus=window.localStorage.getItem("dstatus");
    if(dstatus=="offline")
    {
        window.plugins.toast.show('No internet connection', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){console.log('toast error: ' + b)});

    }
    else
    {

        $.ajax({
                url:"https://nextlaw.co.za/foldersize.php",
                type:"GET",
                async: false,
                crossDomain:true,
                cache:false,
                dataType:"json",
                success: function(resul)
                {
                    var serverFolder = parseInt(resul.folderSize) + parseInt('1');
                    //alert(resul.folderActual);
                    var oldSize=window.localStorage.getItem("oldsize");
                    var serverFolder1=1;

                    if(oldSize != null)
                    {
                        //alert(oldSize);
                        serverFolder1=parseFloat(resul.folderActual)-parseFloat(oldSize);
                        //alert(serverFolder1);
                        if(serverFolder1 > 0)
                        {
                            serverFolder=parseFloat(serverFolder1)+parseFloat('0.5');
                        }
                    }

                    var successCallback=function(success)
                    {
                        var checkSize=success.free;
                        var allowedSize=((checkSize/1024)/1024)/1024;
                        if(serverFolder1 > 0)
                        {
                            if(allowedSize > serverFolder)
                            {
                                var procheck=window.localStorage.getItem("procheck");
                                if(procheck==0)
                                {
                                    window.localStorage.setItem("oldsize",parseFloat(resul.folderActual));
                                    //window.plugins.spinnerDialog.show(null, "Checking for products. This may take a while, Please do not close the app");
                                    product(k);
                                }

                            }
                            else
                            {
                                //window.plugins.spinnerDialog.hide();
                                window.plugins.toast.show('Sorry! Insufficient space on device. It requires more than '+serverFolder+' GB space.', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){console.log('toast error: ' + b)});
                            }
                         }

                    }
                    var errorCallback=function(error)
                    {

                        console.log("errorCallback"+JSON.stringify(error));

                    }
                    DiskSpacePlugin.info(options, successCallback, errorCallback);
                }
        });
        //window.plugins.spinnerDialog.hide();

    }


}
// ----------Product Main function -------------//
function product(k) {

// dstatus is the device status, if it's online or not
    var dstatus=window.localStorage.getItem("dstatus");
    if(dstatus=="offline")
            {
                window.plugins.toast.show('No internet connection', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){console.log('toast error: ' + b)});
            }
            else
            {
    //Status is the woocommerce subscription status
    var status=window.localStorage.getItem("status");

    var procheck=window.localStorage.getItem("procheck");
    if(procheck==0)
    {
        window.localStorage.setItem("procheck",1);

        if(status=="active")
            {
             window.plugins.spinnerDialog.show(null, "Checking for products. This may take a while, Please do not close the app",true);
            $.ajax({
						/*url:"https://nextlaw.co.za/wp-json/wc/v1/products?consumer_key=ck_dd1a1db26f8dc588ca276f5c55c540d29e563a9f&consumer_secret=cs_6ea659fa62d878ab6463a3d7ed4e07b26ef7d27d&context=view",*/
						url:"https://nextlaw.co.za/api.php?page="+k,
						type:"GET",
						async: false,
						crossDomain:true,
						cache:false,
						dataType:"json",
						success: function(resul)
						{

						var i=0;
						if(resul.length > 0){
							setprod(resul,i,k);

						}
						else
						{
                            window.localStorage.setItem("procheck",1);
							window.plugins.spinnerDialog.hide();
							var searchtext='Sample';
							window.plugins.spinnerDialog.show(null, "Creating indexes! This may take a while, Please do not close the app",true);
							var myDB = window.sqlitePlugin.openDatabase({name: "nextlaw.db", location: 'default'});

                             myDB.transaction(function(transaction) {

                            transaction.executeSql('SELECT DISTINCT folder_links as folder_links FROM wooproducts',[],
                            function(tx, result) {

                                console.log("selectresultss ="+JSON.stringify(result));
                                var len=result.rows.length;
                                   //  alert(len);
                                if(len>0)
                                {

                                    for(var dd=0; dd<len; dd++)
                                    {
                                        console.log("selectresultsis ="+result.rows.item(dd).folder_links);
                                        //alert(result.rows.item(dd).folder_links);
                                        var test = result.rows.item(dd).folder_links;
                                        var indexFolder=test.split('/').filter(function(el) { return el.trim().length > 0; }).pop();
                                        LucenePlugin.init(cordova.file.externalApplicationStorageDirectory+"indexes/"+indexFolder,result.rows.item(dd).folder_links, searchtext, 2);
                                        LucenePlugin.createindex(searchtext,function(result){
                                             //alert(result);
                                        });
                                        if(dd==(result.rows.length-1))
                                        {

                                        window.plugins.spinnerDialog.hide();
                                        window.plugins.toast.show('Indexes are created. Thanks for your patience.', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
                                        break;
                                        }
                                    }


                                }

                            },
                            function(error) {
                                //alert(error);
                                    console.log("selecterrorss ="+JSON.stringify(error));




                                });
                            });

						}
							
                    }
                });
            }
       }
    }
}
// ----------Set/Check/Update Product Data  -------------//
function setprod(resul,i,k)
			{

                console.log("resulength"+resul.length);
				var size=resul.length;
				//var size=300;
				var desc;
				var short_desc;
				var date_created;
				var date_modified;
				var file_id;

				var userid=resul[i].id;
				var postname=resul[i].name;
				//var status=resul[i].status;
				if( resul[i].date_created){
					date_created= resul[i].date_created;
				}else{
					date_created = "";
				}
				if( resul[i].date_modified){
					date_modified= resul[i].date_modified;
				}else{
					date_modified = "";
				}
				if( resul[i].description){
					desc= resul[i].description;
				}else{
					desc = "no description";
				}
				if( resul[i].short_description){
					short_desc = resul[i].short_description;
				}else{
					short_desc = "no short description";
				}
				if( resul[i].file_id){
					file_id = resul[i].file_id;
				}else{
					file_id = "";
				}
				
				var file_name=resul[i].file_name;
				var file_link=resul[i].file_link;
				page = file_link.substring(file_link.lastIndexOf('/') + 1);
				var file_links=cordova.file.externalApplicationStorageDirectory+postname+"/"+i+"/"+page;
                var folder_links=cordova.file.externalApplicationStorageDirectory+postname+"/";
                                console.log("starter"+file_id);
			

	            var myDB = window.sqlitePlugin.openDatabase({name: "nextlaw.db", location: 'default'});
				
							 myDB.transaction(function(transaction) {
											 
						transaction.executeSql('SELECT * FROM wooproducts WHERE file_id=?',[file_id],
				function(tx, result) {
					console.log("selectresult ="+JSON.stringify(result));
					//alert(file_id);
					if(result.length > 0)
					{
						if(result.rows.item(0).date_modified != date_modified)
						{
							var executeQuery ="UPDATE wooproducts set docid="+userid+", name="+postname+", short_desc="+short_desc+", description="+desc+", file_id="+file_id+",filename="+file_name+",  dfile="+file_links+",date_created="+date_created+",date_modified="+date_modified+",folder_link="+folder_links+" where id="+result.rows.item(0).id;
							transaction.executeSql(executeQuery,[],function(tx, result) {
									console.log('Updated');
							del(result.rows.item(0).file_name);
							downloadfile(postname,file_link,i,page);
							i++;


							if(i==size)
							{

								k++;
								window.localStorage.setItem("procheck",0);
								size=-1;
								product(k);
							}
							if(i<size)
							{

								setprod(resul,i,k);
							}

			
							},
							function(error){
							console.log(JSON.stringify(error.message));
							i++;


							if(i==size)
							{

								k++;
								window.localStorage.setItem("procheck",0);
								size=-1;
								product(k);
							}
							if(i<size)
							{

								setprod(resul,i,k);
							}
							});
						}
						else
						{
							console.log("NoUpdate");
							i++;
                                			if(i==size)
							{

								k++;
								window.localStorage.setItem("procheck",0);
								size=-1;
								product(k);
							}
							if(i<size)
							{

								setprod(resul,i,k);
							}
						}
					}	
					else
					{
						


							if(i==size)
							{

								k++;
								window.localStorage.setItem("procheck",0);
								size=-1;
								product(k);
							}
							if(i<size)
							{

								insertData(userid,postname,short_desc,desc,file_id,file_name,file_links,folder_links,date_created,date_modified,postname,file_link,i,page,size,k,resul);
							}
					}			

				},
				function(error) {

					insertData(userid,postname,short_desc,desc,file_id,file_name,file_links,folder_links,date_created,date_modified,postname,file_link,i,page,size,k,resul);
					
						
				
				});
											
				
				});

				
				window.localStorage.setItem('allfileNames',page);
                                window.localStorage.setItem('allfilelinks',allfilelinks);

				}
// ----------InserData -------------//
function insertData(userid,postname,short_desc,desc,file_id,file_name,file_links,folder_links,date_created,date_modified,postname,file_link,i,page,size,k,resul)
{
	var myDBs = window.sqlitePlugin.openDatabase({name: "nextlaw.db", location: 'default'});
	myDBs.transaction(function(transaction) {
		var executeQuery ="INSERT INTO wooproducts (docid, name, short_desc, description, file_id,filename,  dfile,folder_links,date_created,date_modified)VALUES(?,?,?,?,?,?,?,?,?,?)";
					
		transaction.executeSql(executeQuery,[userid,postname,short_desc,desc,file_id,file_name,file_links,folder_links,date_created,date_modified],function(tx, result) {
					console.log('Inserted');

		downloadfile(postname,file_link,i,page);
		i++;


		if(i==size)
		{

			k++;
			console.log("newk="+k);
			window.localStorage.setItem("procheck",0);
			size=-1;
			product(k);
		}
		if(i<size)
		{

			setprod(resul,i,k);
		}


		},
		function(error){
				console.log("already");
				i++;
				if(i==size)
				{

					k++;
					console.log("newk="+k);
					window.localStorage.setItem("procheck",0);
					size=-1;
					product(k);
				}
				if(i<size)
				{

					setprod(resul,i,k);
				}
		});
	});
}

//----------Delete Old File --------------//
function del(file_name) {

    window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function (dir) {

        dir.getFile(file_name, {create: false}, function (fileEntry) {
            fileEntry.remove(function (file) {
                alert("fichier supprimer");
            }, function () {
                alert("erreur suppression " + error.code);
            }, function () {
                alert("fichier n'existe pas");
            });
        });


    });

}

//----Display function for the File Links----//
	function showlinks()
		{
			alert("showlinks");
		console.log(JSON.stringify(allfilelinks));
		console.log(JSON.stringify(page));
		}

//----Download File Function----//
function downloadfile(category,url,i,pagedl) {

                        var assetURL=url;
			
                            var fileName=pagedl;
                            var fileTransfer = new FileTransfer();
                                
				 console.log("About to start transfer");
                                fileTransfer.download(assetURL, cordova.file.externalApplicationStorageDirectory+category+"/"+i+"/"+fileName,
                                    function(entry) {

                                        console.log(entry);
                                    },
                                    function(err) {

                                        console.dir(err);
                                    });
}


