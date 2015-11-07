
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
		toastr.error('Please fill out every field.', 'Error!');
		current_fs.addClass('shake');
		animating = false;
		return false;
	}
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	changePage(current_fs, true, false, next_fs);
});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	changePage(current_fs, false, previous_fs, false);
	
});

$(".submit").on('click', function(event){
	var validate = true;
	//Prevent default submit workflow
	event.preventDefault();
	//If checkbox is not checked show toastr
	if(!$("#confirm").is(':checked')){
		validate = false;
		$(this).parent().removeClass('shake');
		toastr.error('Please click on the checkbox.', 'Error!');
		$(this).parent().addClass('shake');//shake the fieldset
	}

	if(validate){
		//Get all inputs in array, all inputs should be already validated
		toastr.clear();//Remove all toastrs
		var values =$("#kidneyform").serializeArray();
		$("#ajax-loading").show(); //show ajax loading image
		//Hit the etherium blockchain
		/*var result = api(url, data, function(data){
			//
		});*/
		
		//Show confirmation page
		current_fs = $(this).parent();
		next_fs = $(this).parent().next();
		changePage(current_fs, true, false, next_fs);
	}
});

/**
 * Change page using fieldset (show|hide)
 * @param  object     currentPage  Current Element
 * @param  boolean 	  next         If should show next page false means previous
 * @param  object     previousPage Previous page element
 * @return void
 */
function changePage(currentPage, next, previousPage, nextPage){
	//Next is true change to next page
	if(next){
		nextPage.show();
	}else{
		previousPage.show();
	}

	//hide the current fieldset with style
	currentPage.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = (next) ? 1 - (1 - now) * 0.2 : 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = (next) ? (now * 50)+"%" : ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			
			if(next){
				currentPage.css({'transform': 'scale('+scale+')'});
				nextPage.css({'left': left, 'opacity': opacity});
			}else{
				previousPage.css({'transform': 'scale('+scale+')', 'opacity': opacity});
				currentPage.css({'left': left});
			}
		}, 
		duration: 800, 
		complete: function(){
			currentPage.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
}
