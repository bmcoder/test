$(document).ready(function(){
	
	$('.lightzoom').lightzoom();
	lazyload();
	
	//BURGER
	$(document).on('change','#burger-checkbox', function(){
		$('.burger-wrapper').toggleClass('burger-wrapper-on burger-wrapper-off');
		$('.burger-header').toggleClass('burger-header-on burger-header-off');
		$('.burger-header-title').toggleClass('burger-header-title-on burger-header-title-off');
		$('.burger-body').toggleClass('burger-body-on burger-body-off');
	});
	
	
	function isTouchDevice() {
	    return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
	}

	if(isTouchDevice()===false) {
	    $('[data-bs-toggle="tooltip"]').tooltip({
	    	// template: '<div class="tooltip gold-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
	    });
	}
	
	// var lastY = 1;
	// document.addEventListener("touchmove", function (event) {
	// 	console.log('Touch move: предотвращение свайпа и перезагузки страницы');
	//     var lastS = document.documentElement.scrollTop;
	//     if(lastS == 0 && (lastY-event.touches[0].clientY)<0 && event.cancelable){
	//         event.preventDefault();
	//         event.stopPropagation();
	//     }
	//     lastY = event.touches[0].clientY;
	// },
	// {passive: false}
	// );
	
	// // Переменная для хранения предыдущего значения скролла
 //   let lastScrollPosition = 0;

 //   // Функция для изменения классов в зависимости от положения скролла
 //   function updateScrollClass(previousScrollPosition) {
 //       const interval = 100; // Интервал в пикселях

 //       // Определяем номер интервала
 //       let currentInterval = Math.floor(previousScrollPosition / interval);

 //       // Если изменился интервал
 //       if (currentInterval !== Math.floor(lastScrollPosition / interval)) {
 //           // Обновляем классы
 //           switch (currentInterval % 2) { // Меняем класс через каждый второй интервал
 //               case 0:
 //                   $('.service-body img').removeClass('rotate-right').addClass('rotate-left');
 //                   break;
 //               case 1:
 //                   $('.service-body img').removeClass('rotate-left').addClass('rotate-right');
 //                   break;
 //           }
 //       }

 //       // Сохраняем текущее значение скролла
 //       lastScrollPosition = previousScrollPosition;
 //   }
	
	// let previousScrollPosition = null;
	// let footer_h = $('.footer').height();
	// let wrapper_h = $(window).height() - footer_h;
	// let content_h = wrapper_h - $('.head').height();
	// let full_h = wrapper_h + footer_h;
	
	// if( $(document).height() <= $(window).height() )
	// {		
	// 	$(".wrapper").css("min-height", wrapper_h - 24);
	// 	$(".container-content").css("min-height", content_h - 24);
	// }
	// else
	// {
	// 	$(".wrapper").css("min-height","");
	// }
	
	// Функция для отслеживания прокрутки
    $(window).on('scroll', function() 
    {
    	// запоминаем положение скроллинга
    	previousScrollPosition = $(this).scrollTop();
    	// console.log('scroll = ' + previousScrollPosition);
    	// Если страница прокручена хотя бы на 1 пиксель вниз
        if ($(this).scrollTop() > 43) 
        {
        	// Показать фиксированный заголовок
            $('.header-lite').addClass('header-fixed');
        } 
        else
        {
        	// Спрятать заголовок
            $('.header-lite').removeClass('header-fixed');
        }
        // Вызываем функцию обновления классов
        // updateScrollClass(previousScrollPosition);
    });

	// ЗАКРЫТЬ ПРОСМОТР ФОТО
	$(document).on('click touchstart','#lz-container', function()
	{
		$('#lz-container').remove();
	});
	
	$('.wrapper').addClass('render');
	
	// счётчик
	setTimeout(function()
	{
		$.ajax({
				type: 'POST',
				url: './receiver.php',
				dataType: 'html',
				data: {action: 'counter'},
				success: function(data)
				{
				
				},
				error:  function()
				{
				
				}
			});
	},4000);
	
});