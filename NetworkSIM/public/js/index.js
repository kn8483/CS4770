$(function(){
	$('#toggle-admin').click(function(){
		$('#AdminForm').toggle();
		$('#RegisterForm').toggle();
	});
});

$(function(){
	$('#toggle-register').click(function(){
		$('#RegisterForm').toggle();
		$('#AdminForm').toggle();
	});
});