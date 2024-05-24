// Author : Karen-Fae Laurin
// Script for SVG Clock index.html


function positionTxtCircle(value, numDivision, clockRadius, coordCenter,shiftCenter){
    // inspired from https://stackoverflow.com/questions/28131091/how-to-place-the-hours-in-a-clock-dynamically

    // 24/4 = 6 degrees for the hours 
    // 60/4 = 15 degrees for the minutes and secondes
    let shiftRotation = numDivision/4;

    // ex : rotate to shift the 24th hour at the top of the clock
    // rotate 6/24 to the left
    let rotateClock = - 2*Math.PI*shiftRotation/numDivision;

    // Place text on a circle
    // transform in radians
    let radians = value/numDivision * 360  * Math.PI / 180 + rotateClock;
    let x = Math.cos(radians);
    let y = Math.sin(radians);

    // radius of givin circle
    x *= clockRadius;
    y *= clockRadius;

    // coords depending of the center of the circle
    let clockDiameter = coordCenter;
    x += clockDiameter-shiftCenter;  // -shift because text isn't properly centered
    y += clockDiameter+shiftCenter;  // +shift for the same reason ^^

    return [x,y]
}


//-----------------    
// Time and Date
//-----------------    

    function  txtHours(hour)  {
        const coord = positionTxtCircle(hour, 24, 130, 200,6);
        const x = coord[0];
        const y = coord[1];

        const hours = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        hours.setAttribute("x",x);
        hours.setAttribute("y",y);
        hours.setAttribute("fill","black");            
        
        if (hour == 0) {hour = 24;}
        const textNode = document.createTextNode(String(hour));
        hours.appendChild(textNode);
        gHours.appendChild(hours);
    }


    function  txtMinutes(min)  {
        const coord = positionTxtCircle(min, 60, 100, 200,5);
        const x = coord[0];
        const y = coord[1];

        mins = document.getElementById("minsClock");
        mins.setAttribute("x",x);
        mins.setAttribute("y",y);
        mins.setAttribute("fill","green");
        if (min == 0) {min = 60;}
        mins.textContent=String(min);
    }

    function txtSecondes(sec) {
        const coord = positionTxtCircle(sec, 60, 100, 200,5);
        const x = coord[0];
        const y = coord[1];

        secs = document.getElementById("secsClock");
        secs.setAttribute("x",x);
        secs.setAttribute("y",y);
        secs.setAttribute("fill","green");
        if (sec == 0) {sec = 60;}
        secs.textContent=String(sec);
    }

    function changerHour() {
        //time
        const current = new Date(); 

        const realTimeHour = current.getHours();
        hArrow.setAttribute("transform","rotate("+realTimeHour*15+" 200 200)");

        const realTimeMinutes = current.getMinutes();
        txtMinutes(realTimeMinutes);

        const realTimeSeconds = current.getSeconds();
        txtSecondes(realTimeSeconds);
    }


    function nameDayOfTheWeek(day) {
        if (day == 0) {return "Sunday"}
        else if (day == 1) {return "Monday"}
        else if (day == 2) {return "Tuesday"}
        else if (day == 3) {return "Wednesday"}                
        else if (day == 4) {return "Thursday"}
        else if (day == 5) {return "Friday"}    
        else if (day == 6) {return "Saturday"}
        return day
    }

    function monthName(month) {
        if (month == 0) {return "January"}
        else if (month == 1) {return "February"}
        else if (month == 2) {return "March"}
        else if (month == 3) {return "April"}                
        else if (month == 4) {return "May"}
        else if (month == 5) {return "June"}    
        else if (month == 6) {return "July"}
        else if (month == 7) {return "August"}
        else if (month == 8) {return "September"}
        else if (month == 9) {return "October"}
        else if (month == 10) {return "November"}
        else if (month == 11) {return "December"}
        return month
    }




//-----------------    
// weather
//-----------------    
    function weatherFunction() {
        const  url="https://api.openweathermap.org/data/3.0/onecall?lat=45.5028&lon=-73.608&appid=0823cec7978ea2d7bd4f3bc0b3bb71f6";

        const req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var weatherJSON=JSON.parse(this.responseText);
                console.log(weatherJSON);
                weatherControl(weatherJSON);
            }
        };
        req.open("GET", url, true);
        req.send();
    }


    
    function weatherControl(jsonM) {
        const h=jsonM.hourly;

        // weather for the next 24 hours ----------------------------
        for(let i=0;i<24;i++) {
            const mainTempName = h[i].weather[0].main
            const colorTemp = colorWeather(mainTempName)
            // (i+realTimeHour-1)%24 used to adjust the weather to the current time
            // and sets following weathers types to the appropriate times
            weatherTab[(i+realTimeHour-1)%24].setAttribute("fill",colorTemp);
        }



        // sunrise and sunset --------------------------------
        // epoch method => https://www.epochconverter.com/programming/#javascript
        const epochSunrise = jsonM.daily[0].sunrise;
        const dataSunrise = new Date(epochSunrise*1000);
        let timeSunrise = dataSunrise.getHours() + dataSunrise.getMinutes()/60;
        console.log("sunrise at "+timeSunrise+" h");
        //timeSunrise = 6;  //test sunrise
        const coordRise = positionTxtCircle(timeSunrise, 24, 400, 200,0);
        const xRise = coordRise[0];
        const yRise = coordRise[1];

        const epochSunset = jsonM.daily[0].sunset;
        const dataSunset = new Date(epochSunset*1000);
        let timeSunset = dataSunset.getHours() + dataSunset.getMinutes()/60;
        console.log("sunset at "+timeSunset+" h");
        // timeSunset = 18;  //test sunset
        const coordSet = positionTxtCircle(timeSunset, 24, 400, 200,0);
        const xSet = coordSet[0];
        const ySet = coordSet[1];
        
        const sunTimePath = document.getElementById("sunHours");
        sunTimePath.setAttribute("d","M 200 200 L " + xRise +" "+ yRise + " L 600 600 L 0 600 L " + xSet + " " + ySet + " L 200 200");



        // moon phase ------------------------------------------
        let moonPhase=jsonM.daily[0].moon_phase*100;
        console.log("moon phase is", moonPhase, "%");
        // moonPhase = 50;      //test Full Moon
        // moonPhase = 0;       //test New Moon
        // moonPhase = 25;      //test First Quarter Moon
        moonPhase = ((moonPhase+50)%100)/100;    // adjustment full moon is at 50% not 0%
        const moonRadius = 20;
        const cxMoon = 350;
        const crescentPct = 4 * moonRadius * moonPhase;
        const cxCrescent = cxMoon - 2 * moonRadius + crescentPct;

        const crescent = document.getElementById("crescent");
        crescent.setAttribute("cx", cxCrescent);
    }


    function weatherColorDot(hour, id) {

        const coord = positionTxtCircle(hour, 24, 130, 200,0);
        const x = coord[0];
        const y = coord[1];

        const weather = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        weather.setAttribute("id",id);
        weather.setAttribute("cx",x);
        weather.setAttribute("cy",y);
        weather.setAttribute("r","12"); 
        weather.setAttribute("fill","none");       
        weather.setAttribute("stroke","none");
        gWeather.appendChild(weather);
        return (weather);
    }

    function colorWeather(temp) {
        // https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
        if (temp == "Thunderstorm") {return "plum"}
        else if (temp == "Drizzle") {return "aquamarine"}
        else if (temp == "Rain") {return "PaleTurquoise"}
        else if (temp == "Snow") {return "white"}                
        else if (temp == "Clear") {return "yellow"}
        else if (temp == "Clouds") {return "gray"}    
        else {return "PeachPuff"}  // for other miscellaneous weathers
    }



// initialization
function init() {

// Set hour/min/sec and date  (excepted JSON calender)

// Time --------------------------------------------
    // display of all 24 hours 
    for(let i=0;i<24;i++) {
        txtHours(i);
    }

    // set time
    setInterval(changerHour,1000);

// date ---------------------------------------------
    var month = current.getMonth();
    var dayOfTheMonth = current.getDate();
    var dayOfTheWeek = current.getDay();

    // day of the week
    var weekDay=document.getElementById("weekDay");
    nameDay = nameDayOfTheWeek(dayOfTheWeek);
    weekDay.textContent=nameDay;

    // date
    var todaysDate=document.getElementById("todayDate");
    const nameMonth = monthName(month);
    if (dayOfTheMonth == 1) {dayOfTheMonth = "1st"}
    var date = String(nameMonth)+" "+String(dayOfTheMonth);
    todaysDate.textContent=date;

//weather -------------------------------------------------
    for(let i=0;i<24;i++) weatherTab[i]=weatherColorDot(i, "weatherDot"+i);
    weatherFunction();

}


// All global variables
    var current = new Date();
    console.log(current);
    const realTimeHour = current.getHours();

    var gHours=document.getElementById("hours");
    var hArrow=document.getElementById("hourArrow");
    var gWeather=document.getElementById("weather");

    var weatherTab = [];

    init();