$(document).ready(function(){
	$('#loginL').on({
		'click': function(){
			$('#landing').hide();
			$('#login_div').show();
		 }
	});

	$('#signupL').on({
		'click': function(){
			$('#landing').hide();
			$('#signup_div').show();
		 }
	});

	//CLEAR FORMS
	$('#loginForm').trigger('reset');
	$('#signupForm').trigger('reset');

	//SWITCH BETWEEN SIGN UP AND LOGIN FORMS
	$('#login_footer').on({
		'click': function(){
			$('#login_div').hide();
			$('#signup_div').show();
		}	
	});

	$('#signup_footer').on({
		'click': function(){
			$('#signup_div').hide();
			$('#login_div').show();
		}	
	});

	$('#username').val('');
	$('#password').val('');
});

$('#loginForm').on('submit', function(e){
	e.preventDefault();
	var username = $('#username').val();
	var password = $('#password').val();
	var message = '';
	var data = "username=" + username + "&password=" + password;
	if(username!=''&&password!=''){
		fetch('/api/account/login', {
			method: 'POST',
	        credentials: 'include',
	        headers: {
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Accept':'application/json'
	        },
	        body: data
		})
		.then((res) => {
			switch (res.status) {
	            case 403: message = 'Username and Password combination'
	                + ' does not match!'; break;
	            case 404: message = 'Username is not registered to'
	             + ' any account!'; break;
	            case 500: message = 'Log-in failed. Please try again.';
	                break;
	            default: message = 'Error logging in!'; break;
	        }
	        if (res.status === 200) {
	            window.location.href="/home";
	        } else {
	            Materialize.toast(message, 4000, 'red');
	            $("#password").val("");
			}
		});
	} else {
		Materialize.toast("Username and Password Required", 3000, 'red lighten-1');
	}
});

$('#signupForm').on('submit', function(e){
	e.preventDefault();
	var firstName = $('#first_name').val();
	var lastName = $('#last_name').val();
	var new_username = $('#new_username').val();
	var new_password = $('#new_password').val();
	var message = '';
	var data = "first_name=" + firstName+"&last_name=" + lastName +"&new_username=" + new_username + "&new_password=" + new_password;
	if(username!=''&&password!=''&&firstName!=''&&lastName!=''){
		fetch('/api/account/signup', {
			method: 'POST',
	        credentials: 'include',
	        headers: {
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Accept':'application/json'
	        },
	        body: data
		})
		.then((res) => {
			switch (res.status) {
	            case 403: message = 'Username already taken'; break;
	            case 500: message = 'Sign up failed. Please try again.'; break;
	            default: message = 'Error signing up!'; break;
	        }
	        if (res.status === 200) {
	        	window.location.href="/home";
	        } else {
	            Materialize.toast(message, 4000, 'red');
	            $("#password").val("");
			}
		});
	} else {
		Materialize.toast("Please fill up all fields", 3000, 'red lighten-1');
	}
});