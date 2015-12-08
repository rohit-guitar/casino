(function(){
	var baseURL = "http://glacial-anchorage-4989.herokuapp.com"
		$.ajax({
			type: "GET",
			url: baseURL+ "/index/userbets",
		}).done(function( data ) {
	   	    datar=data;
	   		var table1 = document.getElementById("user-bets");
	   		
	   		var pointSpreadBets=0;
	   		var totalBets = 0; 
	   		var moneyLineBets=0;
	   		data.forEach(function(datarow){
	   			if(datarow["Bet Type"] == "Point Spread"){
	   				pointSpreadBets = pointSpreadBets+1;
	   			}
	   			if(datarow["Bet Type"] == "Total Bets"){
	   				totalBets = totalBets +1
	   			}
	   			if(datarow["Bet Type"] == "Win/Loss")
	   			{
	   				moneyLineBets  = moneyLineBets +1;
	   			}
	   		});
	   		$("#money-bets").text(moneyLineBets);
	   		$("#point-spread-bets").text(pointSpreadBets);
	   		$("#total-bets").text(totalBets);
	   		console.log("moneyLineBets pointSpreadBets totalBets ", moneyLineBets," ",pointSpreadBets," ",totalBets);
	   		var totalBetsPlaced = moneyLineBets+pointSpreadBets+totalBets;
			$("#total-bets-placed").text(totalBetsPlaced);
	   		for(var i=0 ; i<7; i++){
	   			var row = table1.insertRow(1);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				cell1.innerHTML = data[i].Date;
				cell2.innerHTML = data[i]["Bet Type"];
				cell3.innerHTML = data[i].Profit;

	   		}
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
		$.ajax({
			type: "POST",
			url: baseURL + "/scores",
			data: { "file" : "hdfs://130.211.186.99:9000/user/dl/static_odds-0.0.1-SNAPSHOT-jar-with-dependencies.jar",
				    "className" : "staticOdds",
				    "args":"["+date+"]"},
			success: jobSubmitSuccess,
			error : jobSubmitError
		});
	});

		$.ajax({
			type: "GET",
			url: baseURL+ "/scores/bets/sql",
		}).done(function( data ) {
			console.log(data);
			datar=data;
	   		var table1 = document.getElementById("weekly-schedule");
	   		
	   		for(var i=0 ; i<7; i++){
	   			var row = table1.insertRow(1);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				var cell4 = row.insertCell(2);

				cell1.innerHTML = data[i].Name;
				cell2.innerHTML = data[i].Name2;
				cell3.innerHTML = data[i].pointSpread;
				cell4.innerHTML = data[i].totalbet;


	   		}
		});
	// setInterval(function(){

	// }, 40000);

	// $('#loadingDiv')
 //    .hide()  // Hide it initially
 //    .ajaxStart(function() {
 //        $(this).show();
 //    })
 //    .ajaxStop(function() {
 //        $(this).hide();
 //    })
;
})();