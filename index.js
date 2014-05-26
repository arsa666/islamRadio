//super cholo get Date function
function getDate(what){
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
 	if(what === 'month'){
 		return month;
 	} else if (what === 'day'){
 		return day;
 	} else {
		return day+"/"+month+"/"+year;
	}
};
// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//////////////Windows Creation //////////////////////////////
var win = Titanium.UI.createWindow({
    title:'Islam Radio',
    backgroundColor:'#fff',
    layout: 'vertical',
    exitOnClose:true
});

var namazWin = Titanium.UI.createWindow({
    title:'Namaz Times/Horario',
    backgroundColor:'#fff',
    layout: 'vertical',
    exitOnClose:true
});

var jamatWin = Titanium.UI.createWindow({
    title:'Jamat Times/Horario',
    backgroundColor:'#fff',
    layout: 'vertical',
    exitOnClose:true
});

///////////////// Namaz Times/////////////////////////////

//To make the program work you will need to have added the NamazTimes.sqlite file to Resources/myData
Ti.Database.install('/myData/NamazTimes.sqlite', 'NamazTimes');
var db = Ti.Database.open('NamazTimes');
var dayValues = db.execute('select * from NamazTimes where mes=' + getDate('month') + ' and dia='+getDate('day') + ';');

while (dayValues.isValidRow()){
    var fajr = dayValues.fieldByName('Fazar');
    var zohar = dayValues.fieldByName('Zohar');
    var asar = dayValues.fieldByName('Asar');
    var magrib = dayValues.fieldByName('Magrib');
    var isha = dayValues.fieldByName('Isha');
    dayValues.next();
}

dayValues.close();
db.close();

var date = Ti.UI.createLabel({
	color:'#CC9900',
	text: getDate(),
	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
});


var table1 =  Titanium.UI.createTableView({
    data:[
        {title:"Fajr ............................. " + fajr + " a.m"},
        {title:"Zohar ............................ " + zohar + " p.m"},
        {title:"Asar ............................. " + asar + " p.m"},
        {title:"Magrib ........................... " + magrib + " p.m"},
        {title:"Isha ............................. " + isha + " p.m"}
    ]
});

namazWin.add(date);
namazWin.add(table1);


////////////////Jamat Times/////////////////////////////////
var xhr = Ti.Network.createHTTPClient();
    xhr.onerror = function(e){
                  Ti.API.error('Bad Server =>' + e.error);
         };

    xhr.open('GET', 'http://107.170.87.104/islamApi/jamatTimes.php');
    xhr.send();

    xhr.onload = function(){
                 response = JSON.parse(this.responseText);
                var tableJamat =  Titanium.UI.createTableView({
                    data:[
                        {title:"Fajr ............................. " + response['fajr'] + " a.m"},
                        {title:"Zohar ............................ " + response['zohar'] + " p.m"},
                        {title:"Asar ............................. " + response['asar'] + " p.m"},
                        {title:"Magrib ........................... " + response['magrib'] + " p.m"},
                        {title:"Isha ............................. " + response['isha'] + " p.m"}
                    ]
                });

                jamatWin.add(tableJamat);
 };

/////////// Radio//////////////////////////////////////////

var playButton = Titanium.UI.createButton({
    title:'Play Radio/Iniciar Radio',
    top:10,
    width:300,
    height:40
});

var stopButton = Titanium.UI.createButton({
    title:'Stop Radio/Parar Radio',
    top:10,
    width:300,
    height:40,
    enabled: false
});

var webViewButton = Titanium.UI.createButton({
	title:'Web View/Ver en Web',
    top:50,
    width:300,
    height:40
});

var audioPlayer = Ti.Media.createAudioPlayer({
    url: 'http://107.170.87.104:8000/stream',
    allowBackground: true
});

playButton.addEventListener('click',function() {
    audioPlayer.start();
    playButton.enabled = false;
    stopButton.enabled = true;
});

stopButton.addEventListener('click', function() {
    audioPlayer.stop();
    playButton.enabled = true;
    stopButton.enabled = false;
});

webViewButton.addEventListener('click', function() {
    var webview = Titanium.UI.createWebView({url:'http://107.170.87.104:8000/stream'});
    var window = Titanium.UI.createWindow();
    window.add(webview);
    window.open({modal:true});
});

audioPlayer.addEventListener('progress',function(e) {
    Ti.API.info('Time Played: ' + Math.round(e.progress) + ' milliseconds');
});

audioPlayer.addEventListener('change',function(e)
{
    Ti.API.info('State: ' + e.description + ' (' + e.state + ')');
});


win.add(playButton);
win.add(stopButton);
win.add(webViewButton);


///////////////Tab Creation////////////////////////////
var tab1 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:'Radio',
    window:win
});

var tab2 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:'Namaz Times',
    window:namazWin
});

var tab3 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:'Jamat Times',
    window:jamatWin
});

tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);
tabGroup.open();
