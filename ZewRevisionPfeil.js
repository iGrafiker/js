//---------------------------------------	
//Revision anzeigen	
function revision() {
	
	// definition of text labels
  var chartTitel ="Reale Jahresveränderungsraten 2014 in Prozent";
  var chartTitel2 ="Monatliche Revision der Prognose in Prozentpunkten";
  var xAxisLabel ="Monat der jeweiligen Veröffentlichung der Prognose";
  var lineLabel4 ="Prognose";
  var revLabel = "Revision in Prozentpunkten";
  var button1Text ="Monatliche Revision anzeigen";	
  var button2Text ="zurück zur Medianprognose";
  
  //svg size
  var margin = {top:50, right: 35, bottom: 50, left: 35}, 
	  width = 620 - margin.left - margin.right,
	  height = 280 - margin.top - margin.bottom;  

  //change buttons
	var textNode = document.getElementById('button1').firstChild;
	var buttontext = document.createTextNode(button2Text);
	document.getElementById('button1').replaceChild(buttontext, textNode);
	document.getElementById('button1').onclick = function () {
		chart1();
	}
 
  //------ create d3 chart  ---------------
  
  //set locales
  var german = d3.locale({
	decimal: ",",
	thousands: "",
	grouping: [3, 3],
	currency: ["€", ""],
	dateTime: "%b %m %Y, %H:%M:%S",
	date: "%d-%m-%Y",
	time: "%H:%M:%S",
	periods: ["AM", "PM"],
	days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
	shortDays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
	months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
	shortMonths: ["Jan.", "Feb.", "März", "April", "Mai", "Juni", "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."]
  });
  
  var formatTime = german.timeFormat("%b %Y");
  var parseDate = d3.time.format("%Y").parse; 
  var ge_monat = german.timeFormat("%b");
  var ge_jahr = german.timeFormat("%Y");
  //var ge_zahl = german.numberFormat("4n");
  var ge_zahl = german.numberFormat(",.1f");
  var ge_skalenZahl = german.numberFormat(",.1f");
  
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]); 
  
  var xAxis = d3.svg.axis()
	  .scale(x)
	  .orient("bottom")
	  //.ticks(xTicks)
	  .tickFormat(ge_monat);
  
  var zeroline = d3.svg.axis()
	  .scale(x)
	  .orient("bottom")
	  .tickSize(0, 0, 0)
	  .tickFormat("");
	  
  var yAxis = d3.svg.axis()
	  .scale(y)
	  .orient("left")
	  //.ticks(yTicks)
	  .tickFormat(ge_skalenZahl);
  
  var valueline = d3.svg.line()
	  .x(function(d) { return x(d.Datum); }) 
	  .y(function(d) { return y(d.Median); })
	  .interpolate("step-after");
	  
   //append svg
  if (document.getElementById("diagramm")) {
	  var toDelete = d3.select("#diagramm")
		.remove("g");
	  var svg = d3.select("#chart") 
		.insert("g")
		  .attr("id", "diagramm")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	}else{
	  var contentNode = document.getElementById("grafik");
	  var svg = d3.select(contentNode) 
	  //.append("svg")
		.insert("svg", ":first-Child")
			  .attr("id", "chart")	
			  .attr("width", width + margin.left + margin.right)
			  .attr("height", height + margin.top + margin.bottom)
		  .append("g")
			  .attr("id", "diagramm")
			  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	  }
	
  // Grid lines
  function make_x_axis() { return d3.svg.axis()
	.scale(x)
	.orient("bottom")
	//.ticks(xTicks)
  };
  function make_y_axis() { return d3.svg.axis()
	.scale(y)
	.orient("left")
	//.ticks(yTicks)
  };
  
  svg.append("text") // Add label for the chart titel
	.attr("id", "subhead")
	.attr("class", "textAxis")
	.attr("x", (-35))
	.attr("y", 0 - (margin.top-11))
	.attr("text-anchor", "begin")
	.text(chartTitel);
	
  svg.append("text") // Add label for the x axis
	.attr("class", "textAxis")
	.attr("x", (width / 2) )
	.attr("y",  height + margin.bottom-10)
	.style("text-anchor", "middle")
	.text(xAxisLabel); 
	  
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Datum; })); 
  if (d3.min(data, function(d) { return d.Minimum; }) <= 0) {
	  y.domain([d3.min(data, function(d) { return d.Minimum; }),d3.max(data, function(d) { return Math.max(d.Maximum); })]).nice();
  } else {
	y.domain([0, d3.max(data, function(d) { return Math.max(d.Median, d.Maximum); })]).nice();
  }
  
  svg.append("g") // Draw grid lines x axis
	.attr("class", "grid")
	.attr("transform", "translate(0," + height + ")")
	  .call(make_x_axis()
	  .tickSize(-height, 0, 0)
	  .tickFormat("")
	);
  svg.append("g") // Draw grid lines y axis
	.attr("class", "grid")
	.call(make_y_axis()
	  .tickSize(-width, 0, 0)
	  .tickFormat("")
	);
  svg.append("g") // Add the X Axis 
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")") 
	  .call(xAxis);
	  
  svg.append("g") // Add the Y Axis
	  .attr("class", "y axis")
	  .call(yAxis);
  
  svg.append("g") // Add the zero line to the x axis 
	  .attr("class", "nulllinie")
	  .attr("transform", "translate(0," + y(0) + ")") 
	  .call(zeroline);
		  
	// append year labels to beginn and end of x axis
	var ersterTag = ge_jahr(d3.min(data, function(d) { return d.Datum; }));
	var letzterTag = ge_jahr(d3.max(data, function(d) { return d.Datum; }));
	var tickLabels = document.getElementsByClassName('x axis');
	var FirstTickNode = tickLabels[0].firstChild.firstChild.nextSibling;
	var LastTickNode = tickLabels[0].lastChild.previousSibling.firstChild.nextSibling;
	var neuerKnoten = document.createTextNode(ersterTag);
	var copy = FirstTickNode.cloneNode(true);
	
	tickLabels[0].firstChild.appendChild (copy);
	var laenge = tickLabels[0].firstChild.firstChild.nextSibling.nextSibling.firstChild.nodeValue.length;
	tickLabels[0].firstChild.firstChild.nextSibling.nextSibling.firstChild.replaceData(0,laenge,neuerKnoten.nodeValue);
	tickLabels[0].firstChild.firstChild.nextSibling.nextSibling.setAttribute('y', '25px');
	var neuerKnoten = document.createTextNode(letzterTag);
	var copy = LastTickNode.cloneNode(true);
	tickLabels[0].lastChild.previousSibling.appendChild (copy);
	tickLabels[0].lastChild.previousSibling.firstChild.nextSibling.nextSibling.firstChild.replaceData(0,laenge,neuerKnoten.nodeValue);
	tickLabels[0].lastChild.previousSibling.firstChild.nextSibling.nextSibling.setAttribute('y', '25px');
	
	 // Add the valueline path
	svg.append("path")
	  .attr("class", "valueline1")
	  .attr("d", valueline(data));
	
	//add dots to main valueline 1
	svg.selectAll("dot")
	  .data(data)
	.enter().append("circle")
		.attr("class", "valueline1")
		.attr("r", 4)
		.attr("cx", function(d) { return x(d.Datum); })
		.attr("cy", function(d) { return y(d.Median); })
		.style.zIndex="100";
		
//-------------- End create d3-Chart----------------------------
   
  // add new key 
  var lineLabel1X = 25;
  var lineLabel1Y = -7;
  var lineLabelAbstand = 95;
  //var svg = d3.select("#diagramm");
  // forecast
  var keyLabel4 = svg.append("text")
	.attr("class", "linelabels")
	.attr ("id", "Keylabel4")
	.attr("transform", "translate("+ lineLabel1X +","+ lineLabel1Y +")")
	.attr("text-anchor", "start")
	.text(lineLabel4)
	.style ("opacity", 1);
	
  var key4 = svg.append("circle")
	.attr("class", "valueline1")
	.attr ("id", "Key4")
	.attr("r", 5)
	.attr("cx", lineLabel1X - 7)
	.attr("cy", lineLabel1Y - 4)
	.style ("opacity", 1);
	
  // revision 
  lineLabel1X += lineLabelAbstand;
  var lineLabel2Y = lineLabel1Y;
  var keyLabel5 = svg.append("text")
	.attr("class", "linelabels")
	.attr ("id", "Keylabel5")
	.attr("transform", "translate("+ lineLabel1X +","+ lineLabel2Y +")")
	.attr("text-anchor", "start")
	.text(revLabel)
	.style ("opacity", 1);  
   var key5 = svg.append("polygon")
	  .attr("class", "minus")
	  .attr ("id", "Key5")
	  .attr("points", "-10,-10, 0,0 , 10,-10")
	  .style("opacity", 1)
	  .attr("transform", "translate("+ (lineLabel1X-10) +","+ (lineLabel1Y+2) +")");

  // add arrows and figures in case of revision
  for (var i=1;i<data.length;i++) {
	  
	  var idArrow = "Pfeil" + i;
	  var idValue = "Revision" + i;
	  var idRevDot = "Datenpunkt" + i;
	  var x1=x(data[i].Datum);
	  var y2=y(data[i].Median);
  
	if (data[i].Revision < 0) {
	  var revised = true;
	  var arrow = svg.append("polygon")
	  .attr("class", "minus")
	  .attr("id", idArrow)
	  .attr("points", "-20,-20, 0,0 , 20,-20")
	  .style("opacity", 1)
	  .attr("transform", "translate("+ (x1) +","+ (y2-20) +")");
	  
	  var revisionValue = svg.append("text")
	  .attr("class", "revisionFigures")
	  .attr("id", idValue)
	  .attr("x", x1)
	  .attr("y", y2-45)
	  .text(ge_zahl(data[i].Revision));
	  //.style("font-size", 16)
	  //.style("opacity", 1);
	  
	  var revDot = svg.append("circle")
	  .attr("class", "valueline1")
	  .attr("id", idRevDot)
	  .attr("r", 5)
	  .attr("cx", x1)
	  .attr("cy", y2)
	  .style ("opacity", 1);
	  
	}else if (data[i].Revision > 0) {
	  var revised = true;
	  
	  var arrow = svg.append("polygon")
	  .attr("class", "plus")
	  .attr("id", idArrow)
	  .attr("points", "-20,20, 0,0 , 20,20")
	  .attr("transform", "translate("+ (x1) +","+ (y2+20) +")")
	  .style("opacity", 1);
	  
	  var revisionValue = svg.append("text")
	  .attr("class", "revisionFigures")
	  .attr("id", idValue)
	  .attr("x", x1)
	  .attr("y", y2+55)
	  .text(ge_zahl(data[i].Revision));
	  //.style("font-size", 16)
	  //.style("opacity", 1);
	  
	  var revDot = svg.append("circle")
	  .attr("class", "valueline1")
	  .attr("id", idRevDot)
	  .attr("r", 5)
	  .attr("cx", x1)
	  .attr("cy", y2)
	  .style ("opacity", 1);	
	} else {
	}  
  }
 
  mouse_over2();
//----------------- Mousover with figure and dot --------------------  
function mouse_over2() {
	// definitions
	var rCircle = 5;
	var rectWidth = 20;
	var rectHeight = 15;
	var rectXoffset = rectWidth/2;
	var rectYoffset = 20;
	var rectWidthYear = 65;
	var rectHeightYear = 18;
	var rectXoffsetYear = rectWidthYear/2;
	var widthMouseOver = 20;
	var fadeInTime = 50;
	var fadeOutTime = 150; 
	var dataPoint = d3.select("#chart").append("circle")
		.attr("class", "valueline1")
		.attr("r", rCircle)
		.attr("cx", margin.left)
		.attr("cy", margin.top)
		.style("opacity", 0);	
	var backGround = d3.select("#chart").append("rect")
		.attr("class", "figures")
		.attr("x", margin.left)
		.attr("y", margin.top)
		.attr("width", rectWidth)
		.attr("height", rectHeight)
		.style("opacity", 0);  
	var lineFigure = d3.select("#chart").append("text")
		.attr("class", "lineFigures1")
		.attr("x", margin.left)
		.attr("y", margin.top)
		.style("opacity", 0);
	var rectYear = d3.select("#chart").append("rect")
		.attr("class", "years")
		.attr("x", margin.left)
		.attr("y", margin.top)
		.attr("width", rectWidthYear)
		.attr("height", rectHeightYear)
		.style("opacity", 0);
	var yearFigure = d3.select("#chart").append("text")
		.attr("class", "lineFigures")
		.attr("x", margin.left)
		.attr("y", margin.top)
		.style("opacity", 0);	
	
	//add mouseover to chart 
	svg.selectAll("dot")
	.data(data)
	.enter().append("rect")
	  .attr("cursor", "pointer")
	  .attr("class", "MouseOvers")
	  .attr("x", function(d) { return x(d.Datum); })
	  .attr("width", widthMouseOver)
	  .attr("y", function(d) { return y(Math.max(0, d.gibtEsNicht)); })// Beginn am oberen Rand
	  .attr("height", function(d) { return Math.min(0, d.Minimum) <= 0 ? height + 20 : height + 20 ; })
	  .attr("transform", "translate("+ -(widthMouseOver/2) +","+ "0" +")")
	  .style("opacity", 0)
	  .on("mouseover", function(d) {
		fade_in(d);
	  })
	  .on("mouseout", function(d) { 
		fade_out(d);
	  });
 
  function fade_in(d){
	  backGround.transition()
		.duration(fadeInTime)
		.attr("transform", "translate("+ (x(d.Datum)-rectXoffset) +","+ (y(d.Median)-rectYoffset) +")")
		.style("opacity", 1);
	 dataPoint
		.transition()
		.duration(fadeInTime)
		.attr("transform", "translate("+ x(d.Datum) +","+ y(d.Median) +")")
		.style("opacity", 1);
	  lineFigure.transition()
		.duration(fadeInTime)
		.attr("transform", "translate("+ x(d.Datum) +","+ y(d.Median) +")")
		.attr("dy", "-.75em")
		.text(ge_zahl(d.Median))
		.style("opacity", 1); 
	  rectYear.transition()
		.duration(fadeInTime)
		.attr("transform", "translate("+ (x(d.Datum)-rectXoffsetYear) +","+ (y(0)+5) +")")
		.style("opacity", 1);
	  yearFigure.transition()
		.duration(fadeInTime)
		.attr("transform", "translate("+ x(d.Datum) +","+ (y(0)+27) +")")
		.attr("dy", "-.75em")
		.text(formatTime(d.Datum))
		.style("opacity", 1);
	}
	
	function fade_out(d) {
		dataPoint.transition()
		  .duration(fadeOutTime)
		  .style("opacity", 0);
		lineFigure.transition()	
		  .duration(fadeOutTime)
		  .style("opacity", 0);
		backGround.transition()
		  .duration(fadeOutTime)
		  .style("opacity", 0);	
		yearFigure.transition()	
		  .duration(fadeOutTime)
		  .style("opacity", 0);
		rectYear.transition()
		  .duration(fadeOutTime)
		  .style("opacity", 0);	  
	}
  }

}