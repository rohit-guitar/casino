(function(){
	var baseURL = "https://glacial-anchorage-4989.herokuapp.com"
		$.ajax({
			type: "GET",
			url: baseURL+ "/index/userbets",
		}).done(function( data ) {
	   		console.log(data);
	   	    datar=data;
	   		var table1 = document.getElementById("user-bets");

	   		data.forEach(function(datarow){
	   			var row = table1.insertRow(1);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				cell1.innerHTML = datarow.Date;
				cell2.innerHTML = datarow["Bet Type"];
				cell3.innerHTML = datarow.Profit;
	   		})
		});;
	


	var jobSubmitSuccess = function(data){
		console.log("Data on success is : ",data);
	};
	var jobSubmitError = function(data){
		console.log("Data on Error is : ",data);
	}

	$("#submit-job").click(function(){
		console.log("clicked here")
		var date = $("#date-input").val().split(" ")[0];
		console.log("date : ",date);
		$.ajaxSetup({
    		headers: { 'Access-Control-Allow-Origin' : "*"}
		});
		// $.ajax({
		// 	type: "POST",
		// 	url: "http://130.211.186.99:8998/batches",
		// 	data: { "file" : "hdfs://130.211.186.99:9000/user/dl/spark-scala-maven-project-0.0.1-SNAPSHOT-jar-with-dependencies.jar",
		// 		    "className" : "SampleApp",
		// 		    "args":"["+date+"]"},
		// 	dataType:"jsonp",
		// 	success: jobSubmitSuccess,
		// 	error : jobSubmitError
		// });
	$.post("http://130.211.186.99:8998/batches",{ "file" : "hdfs://130.211.186.99:9000/user/dl/spark-scala-maven-project-0.0.1-SNAPSHOT-jar-with-dependencies.jar",
				    "className" : "SampleApp",
				    "args":"["+date+"]"},jobSubmitSuccess);
	});
})();