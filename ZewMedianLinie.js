// bar chart with tooltipps
function medianLinie() {
	
// definition of text labels
  var chartTitel ="Reale Jahresveränderungsraten 2014 in Prozent";
  var chartTitel2 ="Monatliche Revision der Prognose in Prozentpunkten";
  var xAxisLabel ="Monat der jeweiligen Veröffentlichung der Prognose";
  var lineLabel1 ="Median";
  var lineLabel2 ="Höchstwert";
  var lineLabel3 ="Tiefstwert";
  var lineLabel4 ="Prognose";
  var revLabel = "Revision in Prozentpunkten";
  var button1Text ="Monatliche Revision anzeigen";	
  var button2Text ="zurück zur Medianprognose";
  
  //svg size
  var margin = {top:50, right: 35, bottom: 50, left: 35}, 
	  width = 620 - margin.left - margin.right,
	  height = 280 - margin.top - margin.bottom;
	
  //replace headline	
  var contentNode = document.getElementById("content");
  var hl = document.getElementById("headline");
  var hlneu = document.createElement('h1');
  var hlneuText = document.createTextNode(headline);
  hlneu.appendChild (hlneuText);
  hlneu.setAttribute('id', 'headline');
  contentNode.replaceChild(hlneu, hl);
  
  //create buttons
  if (! document.getElementById("diagramm")) {
	var toc = document.getElementById("schalter1"); 
	var button = document.createElement('button'); 
	button.setAttribute('id', 'button1');
	button.setAttribute('class','button');
	var buttontext = document.createTextNode(button1Text);
	button.appendChild(buttontext);
	toc.appendChild(button);
	
  
  }else{
	var textNode = document.getElementById('button1').firstChild;
	var buttontext = document.createTextNode(button1Text);
	document.getElementById('button1').replaceChild(buttontext, textNode);
	
  }
  document.getElementById('button1').onclick = function () {
	chart2();
  }
 
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
	  
  var valueline2 = d3.svg.line()
	  .x(function(d) { return x(d.Datum); }) 
	  .y(function(d) { return y(d.Maximum); })
	  .interpolate("step-after");
	  
  var valueline3 = d3.svg.line()
	  .x(function(d) { return x(d.Datum); }) 
	  .y(function(d) { return y(d.Minimum); })
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
	
	
	  
	// add rect between min and max
	var spanneMinMax = svg.selectAll("dot").data(data)
	.enter().append("rect")
	  .attr("class", "area")
	  .attr("cursor", "pointer")
	  .attr("x", function(d) { return x(d.Datum); })
	  .attr("width", 5)
	  .attr("y", function(d) { return y(Math.max(0, d.Maximum)); })
	  .attr("height", function(d) { return Math.min(0, d.Minimum) <= 0 ? height - y(d.Maximum-d.Minimum) : height - y(d.Maximum-d.Minimum) ; })
	  .attr("transform", "translate("+ -(5/2) +","+ "0" +")")
	  .style("opacity", 0);
	
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
		
	//add dots to valueline 2	
	var dotMax = svg.selectAll("dot").data(data)
	  .enter().append("circle")
		.attr("r", 4)
		.attr("class", "valueline2")
		.attr("cx", function(d) { return x(d.Datum); })
		.attr("cy", function(d) { return y(d.Maximum); })
		.style("opacity", 0);
		
	 //add dots to valueline 3
	var dotMin = svg.selectAll("dot").data(data)	
	  .enter().append("circle")
		.attr("class", "valueline3")
		.attr("r", 4)
		.attr("cx", function(d) { return x(d.Datum); })
		.attr("cy", function(d) { return y(d.Minimum); })
		.style("opacity", 0);  

//----------------- add labels to the lines on the top of the chart -------------------- 
	//1st value line
	var lineLabel1X = 25;
 	var lineLabel1Y = -7;
	var lineLabelAbstand = 75;
	
	var keyLabel1 = svg.append("text")
	  .attr("class", "linelabels")
	  .attr ("id", "Keylabel1")
	  .attr("transform", "translate("+ lineLabel1X +","+ lineLabel1Y +")")
	  .attr("text-anchor", "start")
	  .text(lineLabel1)
	  .style ("opacity", 0);
	var key1 = svg.append("circle")
	  .attr("class", "valueline1")
	  .attr ("id", "Key1")
	  .attr("r", 5)
	  .attr("cx", lineLabel1X - 7)
	  .attr("cy", lineLabel1Y - 4)
	  .style ("opacity", 0);
	  
	//2nd value line 
	lineLabel1X += lineLabelAbstand;
	var lineLabel2Y = lineLabel1Y;
	var keyLabel2 = svg.append("text")
	  .attr("class", "linelabels")
	  .attr ("id", "Keylabel2")
	  .attr("transform", "translate("+ lineLabel1X +","+ lineLabel2Y +")")
	  .attr("text-anchor", "start")
	  .text(lineLabel2)
	  .style ("opacity", 0);
	 var key2 = svg.append("circle")
	  .attr("class", "valueline2")
	  .attr ("id", "Key2")
	  .attr("r", 5)
	  .attr("cx", lineLabel1X - 7)
	  .attr("cy", lineLabel1Y - 4)
	  .style ("opacity", 0);
   
	 //3rd value line
	lineLabel1X += (lineLabelAbstand +20 );
	var lineLabel3Y = lineLabel1Y;
	var keyLabel3 = svg.append("text")
	  .attr("class", "linelabels")
	 .attr ("id", "Keylabel3")
	  .attr("transform", "translate("+ lineLabel1X +","+ lineLabel3Y +")")
	  .attr("text-anchor", "start")
	  .text(lineLabel3)
	  .style ("opacity", 0);  
	var key3 = svg.append("circle")
		.attr("class", "valueline3")
		.attr ("id", "Key3")
		.attr("r", 5)
		.attr("cx", lineLabel1X - 7)
		.attr("cy", lineLabel1Y - 4)
		.style ("opacity", 0);
	  
//------------------------end of chart legend --------------------------------------------	  
	  
  // fade in in valueline and dots	  
  var fadeInTime1 = 1000;
  var fadeInTime2 = 3000;
  var fadeInTime3 = 3500;
  function fade_in_dots() {
	   keyLabel1.transition()
		.duration(fadeInTime1 )
		.style("opacity",1);
	  key1.transition()
		.duration(fadeInTime1 )
		.style("opacity", 1);	
	  keyLabel2.transition()
		.duration(fadeInTime2)
		.style("opacity",1);
	  key2.transition()
		.duration(fadeInTime2)
		.style("opacity", 1);
	  keyLabel3.transition()
		.duration(fadeInTime2)
		.style("opacity",1);
	  key3.transition()
		.duration(fadeInTime2)
		.style("opacity", 1);	
	   dotMax.transition()
		.duration(fadeInTime2)
		.style("opacity", 1);
	  dotMin.transition()
		.duration(fadeInTime2)
		.style("opacity", 1);
	  spanneMinMax.transition()
		.duration(fadeInTime3)
		.style("opacity", 0.7);	
	}
   fade_in_dots();
	mouse_over();
	
//----------------- Mousover with figure and dot --------------------  
function mouse_over() {
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
	var dataPoint2 = d3.select("#chart").append("circle")
		.attr("class", "valueline2")
		.attr("r", rCircle)
		.attr("cx", margin.left)
		.attr("cy", margin.top)
		.style("opacity", 0);
	var dataPoint3 = d3.select("#chart").append("circle")
		.attr("class", "valueline3")
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
	var backGround2 = d3.select("#chart").append("rect")
		.attr("class", "figures")
		.attr("x", margin.left)
		.attr("y", margin.top)
		.attr("width", rectWidth)
		.attr("height", rectHeight)
		.style("opacity", 0);
	var lineFigure2 = d3.select("#chart").append("text")
		.attr("class", "lineFigures2")
		.attr("x", margin.left)
		.attr("y", margin.top)
		.style("opacity", 0);
	var backGround3 = d3.select("#chart").append("rect")
		.attr("class", "figures")
		.attr("x", margin.left)
		.attr("y", margin.top)
		.attr("width", rectWidth)
		.attr("height", rectHeight)
		.style("opacity", 0)
	var lineFigure3 = d3.select("#chart").append("text")
		.attr("class", "lineFigures3")
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
	  backGround2.transition()
		.duration(fadeInTime)
		.attr("transform", "translate("+ (x(d.Datum)-rectXoffset) +","+ (y(d.Maximum)-rectYoffset) +")")
		.style("opacity", 1);
	  dataPoint2
		.transition()
		.duration(fadeInTime)
		.attr("transform", "translate("+ (x(d.Datum)) +","+ y(d.Maximum) +")")
		.style("opacity", 1);
	  lineFigure2.transition()
		.duration(fadeInTime)
		.attr("transform", "translate("+ x(d.Datum) +","+ y(d.Maximum) +")")
		.attr("dy", "-.75em")
		.text(ge_zahl(d.Maximum))
		.style("opacity", 1);
	  backGround3.transition()
		.duration(fadeInTime)
		.attr("transform", "translate("+ (x(d.Datum)-rectXoffset) +","+ (y(d.Minimum)+(rectYoffset/4)) +")")
		.style("opacity", 1);
	  dataPoint3
		.transition()
		.duration(fadeInTime)
		.attr("transform", "translate("+ (x(d.Datum)) +","+ y(d.Minimum) +")")
		.style("opacity", 1);
	  lineFigure3.transition()
		.duration(fadeInTime)
		.attr("transform", "translate("+ x(d.Datum) +","+ y(d.Minimum) +")")
		.attr("dy", "1.25em")
		.text(ge_zahl(d.Minimum))
		.style("opacity", 1)
		.style.zIndex= "100";
	  rectYear.transition()
		.duration(fadeInTime)
		.attr("transform", "translate("+ (x(d.Datum)-rectXoffsetYear) +","+ (y(0)+5) +")")
		//.attr("transform", "translate("+ -7.5 +","+ -10 +")")
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
		dataPoint2.transition()
		  .duration(fadeOutTime)
		  .style("opacity", 0);
		lineFigure2.transition()	
		  .duration(fadeOutTime)
		  .style("opacity", 0);
		backGround2.transition()
		  .duration(fadeOutTime)
		  .style("opacity", 0);	
		dataPoint3.transition()
		  .duration(fadeOutTime)
		  .style("opacity", 0);
		lineFigure3.transition()	
		  .duration(fadeOutTime)
		  .style("opacity", 0);
		backGround3.transition()
		  .duration(fadeOutTime)
		  .style("opacity", 0);	
		yearFigure.transition()	
		  .duration(fadeOutTime)
		  .style("opacity", 0);
		rectYear.transition()
		  .duration(fadeOutTime)
		  .style("opacity", 0);	  
		  //wert = y(d.Maximum);
	}
  }
}