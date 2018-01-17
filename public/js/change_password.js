$('#changepass_form').on('submit', function(e){
	e.preventDefault();
	var old_pw = $('#old_pw').val();
	var new_pw = $('#new_pw').val();
	var message = '';
	var data = "old_pw=" + old_pw + "&new_pw=" + new_pw;
	if(old_pw !='' && new_pw!=''){
		fetch('/api/account/changepassword', {
			method: 'PUT',
	        credentials: 'include',
	        headers: {
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Accept':'application/json'
	        },
	        body: data
		})
		.then((res) => {
			switch (res.status) {
	            case 403: message = 'Old password does not match'; break;
	            case 500: message = 'Change password failed. Please try again.';break;
	            default: message = 'Change password failed. Please try again. '; break;
	        }
	        if (res.status === 200) {
	            Materialize.toast('Password successfully changed', 4000, 'green');
	        } else {
	            Materialize.toast(message, 4000, 'red');
	            $("#password").val("");
			}
			$('#old_pw').val('');
			$('#new_pw').val('');
			$('input[type=submit').enable();
		});
	} else {
		Materialize.toast("Fill up all fields", 3000, 'red lighten-1');
	}
});