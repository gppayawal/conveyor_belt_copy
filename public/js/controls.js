$(document).ready(function(){
  $.get('/controllerStatus', function(data){
    setStatus(data);
  });
});

function sendData(button){
	var startTime = new Date().getTime();
	var data = 'control='+button.id;
  $.post('/send', data, function(res){
    if(res.status == 200){
    	Materialize.toast(res.message, 3000, 'green lighten-1');  
    	var endTime = new Date().getTime();
		  var timeDiff = endTime-startTime;
		  Materialize.toast('Controller received message in ' + timeDiff/1000 + ' seconds.', 4000, 'blue lighten-1'); 
    }
    else
    	Materialize.toast(res.message, 3000, 'red lighten-1');
    setStatus(res);
  });
}

function setStatus(data){
  var str = window.location + "";
  if(str.endsWith('jogging')){
    jogging(data);
  } else {
    continuous(data);
  }
}

function jogging(res){
  $('#distance').val(res.distance);
  $('#value').html('DISTANCE: ' + res.distance + 'm');
  $('#direction').html('DIRECTION: ' + res.direction.toUpperCase());
}

function continuous(res){
  if(res.state == 'stop'){
    $('#direction').html(res.state.toUpperCase());
  }
  else $('#direction').html('RUNNING ' + res.direction.toUpperCase() + ' IN ' + res.speed.toUpperCase() + ' SPEED');
}