//super cholo get Date function
function getDate(what){
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
 	if(what == 'month'){
 		return month;
 	} else if (what == 'day')
 	{
 		return day;
 	} else {
		return day+"/"+month+"/"+year;
	}
};

//To make the program work you will need to have added the NamazTimes.sqlite file to Resources/myData

Ti.Database.install('/myData/NamazTimes.sqlite', 'NamazTimes');
var db = Ti.Database.open('NamazTimes');
var dayValues = db.execute('select * from NamazTimes where mes=' + getDate('month') + ' and dia='+getDate('day') + ';');

while (dayValues.isValidRow())
{
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

var prayerView = Ti.UI.createView({
	width:'100%',
	height:'50%'
});

var prayers = ['Fajr', 'Zohar', 'Asar', 'Magrib', 'Isha'];
var tableData = [];
for (var i = 0; i < prayers.length; i++){
	var row = Ti.UI.createTableViewRow();
	var prayer = Ti.UI.createLabel({
		left: 10
	});
	var time = Ti.UI.createLabel({
		right: 10
	});
	switch(prayers[i]){
		case('Fajr'):
			prayer.text = prayers[i];
			time.text = fajr + 'AM';
			break;
		case('Zohar'):
			prayer.text = prayers[i];
			time.text = zohar + 'PM';
			break;
		case('Asar'):
			prayer.text = prayers[i];
			time.text = asar + 'PM';
			break;
		case('Magrib'):
			prayer.text = prayers[i];
			time.text = magrib + 'PM';
			break;
		case('Isha'):
			prayer.text = prayers[i];
			time.text = isha + 'PM';
			break;
	}
	row.add(prayer);
	row.add(time);
	tableData.push(row);
}

var table = Ti.UI.createTableView({
	data:tableData
});

var win = Titanium.UI.createWindow({  
    title:'Islam Radio',
    backgroundColor:'#fff',
    layout: 'vertical',
    exitOnClose:true   
});

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

win.add(date);
prayerView.add(table);
win.add(prayerView);
win.add(playButton);
win.add(stopButton);
win.add(webViewButton);

// allowBackground: true on Android allows the 
// player to keep playing when the app is in the 
// background.
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

win.addEventListener('close',function() {
     // audioPlayer.stop();
    // if (Ti.Platform.osname === 'android')
    // { 
        // audioPlayer.release();
    // }
});

win.open();
