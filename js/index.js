
//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
var hasError = false; //flag to set if form is validated or not

$(".next").click(function(){
	if(animating) return false;
	animating = true;
	hasError = false;
	
	current_fs = $(this).parent();
	inputs = current_fs.find('input').serializeArray();
	next_fs = $(this).parent().next();

	//Check if inputs are not empty
	current_fs.find('input').each(function(index, value){
		//Checking if value is empty
		if($.trim($(value).val()) == ""){
			hasError = true;
			$(value).addClass('border-red'); //add border red to the empty element

			//When the user start typing something remove border red
			$(value).on('keyup', function(event){
				if($.trim($(this).val()) != ""){
					$(this).removeClass('border-red');
				}
			});
		}
	});

	//If form has error shake the form and stop going to next page
	if(hasError){
		toastr.error('Please fill all the information.', 'Error!');
		current_fs.addClass('shake');
		animating = false;
		return false;
	}
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".submit").on('click', function(event){
	var validate = true;
	//Prevent default submit workflow
	event.preventDefault();
	if(!$("#confirm").is(':checked')){
		validate = false;
		toastr.error('Please, click on the checkbox.', 'Error!');
		return false;
	}

	if(validate){
		//Get all inputs in array, all inputs should be already validated
		toastr.clear();//Remove all toastrs
		var values =$("#kidneyform").serializeArray();
		$("#ajax-loading").show(); //show ajax loading image
		//Hit the API
		/*var result = api(url, data, function(data){
			//
		});*/
	}

	//Show any error message
});