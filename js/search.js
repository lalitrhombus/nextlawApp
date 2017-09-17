document.addEventListener("deviceready", createindexnames, false);

function createindexnames(){
	//window.plugins.spinnerDialog.show(null, "Loading");
	var indexfilter = [];
	var myDB = window.sqlitePlugin.openDatabase({name: "nextlaw.db", location: 'default'});
               myDB.transaction(function(transaction) {
               transaction.executeSql('SELECT * from wooproducts',[],
               function(tx, result) {
			for ( var i = 0; i < result.rows.length; i++ ){
				indexfilter[i] = result.rows.item(i).name;}
			indexfilter = indexfilter.filter( function( item, index, inputArray ) {
				   return inputArray.indexOf(item) == index;
			    });
				//alert(JSON.stringify(indexfilter));
			//window.plugins.spinnerDialog.hide();
                },
                function(error) {
			//window.plugins.spinnerDialog.hide();
                	//alert(JSON.stringify(error));
               });
	});

}
/*
----------------------The Lucene Search Functionality------------------------	
*/
function search(){

	        var legalauthority = [];

        	$.each($(".legalauthority option:selected"), function(){            

            	legalauthority.push($(this).val());

        	});

		var searchvar = legalauthority;		
			
	        var otherlegalauthority = [];

        	$.each($(".ola option:selected"), function(){            

            	otherlegalauthority.push($(this).val());
		
		searchvar.push($(this).val());

        	});


	var searchtext=document.getElementById('searchtext').value;
	var lauthority=legalauthority.join(", ");
	var lquestion=document.getElementById('lquestion').value;
	var ooam=document.getElementById('ooam').value;
	var ola=otherlegalauthority;
	var searchresult = [];
    //LucenePlugin.createIndex("/storage/sdcard/Android/data/com.appideas.court");

    var textValue=searchtext;

	if(searchtext != '' && lauthority != '')
	{
                window.plugins.spinnerDialog.show(null, "Searching",true);
                if(lquestion!='')
                {
                    textValue = textValue+'----'+lquestion;
                }
			    if(ooam!='')
			    {
			        textValue = textValue+'----'+ooam;
			    }


			    var k=0;
			    for(var i=0; i<searchvar.length; i++)
			    {

			        LucenePlugin.init(cordova.file.externalApplicationStorageDirectory+"indexes/"+searchvar[i],cordova.file.externalApplicationStorageDirectory+searchvar[i], searchvar[i], 20);
                    			    LucenePlugin.search(textValue, function (result) {
                                    console.log("resultdoc"+JSON.stringify(result.docs));
                                    window.plugins.spinnerDialog.hide();

                                     result.docs.forEach(function (doc) {

                                       searchresult.push(doc);
                                     });
                                     k++;
                                     if(k==searchvar.length)
                                     {

                                        if(searchresult.length > 0)
                                         {
                                             window.localStorage.setItem("SearchText",textValue);
                                                            window.localStorage.setItem("SearchResult",JSON.stringify(searchresult));
                                                            window.location.href="searchlist.html";
                                         }
                                         else
                                         {
                                            window.plugins.spinnerDialog.hide();
                                                                 window.plugins.toast.show('No result found', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
                                         }


                                     }

                    			    }
                    			    ,function (error)
                    			    {
                    			        k++;
                    			        console.log("Leceneerror:"+error);

                    			        if(k==searchvar.length)
                                         {
                                            if(searchresult.length > 0)
                                             {
                                                 window.localStorage.setItem("textValue",textValue);
                                                                window.localStorage.setItem("SearchResult",JSON.stringify(searchresult));
                                                                window.location.href="searchlist.html";
                                             }
                                             else
                                             {
                                                window.plugins.spinnerDialog.hide();
                                                                     window.plugins.toast.show('No result found', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
                                             }


                                         }

                    			    }
                    			    );
			    }



	}
	else
	{
		window.plugins.toast.show('Search field or Legal authority cannot be blank', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});	
	}
}

