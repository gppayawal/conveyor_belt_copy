$.get('/api/account/whoami', {
	method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept':'application/json'
    }
})
.then((res) => {
	var username = res.fname + '  ' + res.lname;
	$('#user').text('Hello, '+ username);
});

$('.dropdown-button').dropdown({
  inDuration: 300,
  outDuration: 225,
  constrainWidth: false, // Does not change width of dropdown to that of the activator
  hover: true, // Activate on hover
  gutter: 0, // Spacing from edge
  belowOrigin: true, // Displays dropdown below the button
  alignment: 'left', // Displays dropdown with edge aligned to the left of button
  stopPropagation: false // Stops event propagation
});