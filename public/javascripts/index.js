(function(){

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