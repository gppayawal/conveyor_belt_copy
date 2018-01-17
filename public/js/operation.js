$(document).ready(function(){
  $('#jogging_btn').on('click', jogging);
  $('#disconnect').on('click', disconnect);
  $('#run_btn').on('click', run);
});

function disconnect(){
  $.post('/deselect', function(res){
    if(res.status == 400){
      Materialize.toast(res.message, 3000, 'red lighten-1');  
    } else {
      window.location.href='/home';
    }
  });
}

function jogging(){
	window.location.href= '/jogging';
}

function run(){
	window.location.href= '/continuous_run';
}