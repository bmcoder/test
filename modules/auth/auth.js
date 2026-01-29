// AUTH
$(document).ready(function()
{

	$('#btn-client-login').prop('disabled', true); // Деактивируем кнопку "Войти" по-умолчанию
	
	// БЛОК ALERT
	function showAlert(alert_elem,text,alert_class)
	{
		$(alert_elem).css({'max-height':'0px', 'opacity':'0'}).html('');
		// $(alert_elem).html(text).delay(2000).fadeIn();
		$(alert_elem).removeClass().addClass('alert text-center mt-3 mb-0 position-absolute w-100 ' + alert_class);
		$(alert_elem).delay(1000).html(text).show().animate({'max-height':'100px','opacity':'1'});
		
		// Скрываем сообщение через 5 секунд
		setTimeout(function()
		{
			//$(alert_elem).fadeOut();
			$(alert_elem).animate({'max-height':'0px','opacity':'0'}).hide();
		}, 3000);
	}
	
	// открываем модальное окно формы авторизации
	$(document).on('click touchstart','.btn-login',function()
	{
		$('.modal-login').modal('show');
	});
	

	$('#phone-number').on('keydown keypress keyup touchstart', function(){
		$('.client-login').prop('disabled',false);
		let phone = $(this).val();
		// Регулярное выражение для проверки формата номера телефона
        let phoneRegex = /^(\+7|7|8)(\S|\s|-)?\d{3}(\S|\s|-)?\d{3}(\s|-)?\d{2}(\s|-)?\d{2}$/;
        let phoneIgnore = /^9\d{2}(\S|\s|-)?\d{3}(\s|-)?\d{2}(\s|-)?\d{2}$/;
        
        // коррекция номера
        if(phoneIgnore.test(phone))
        {
        	phone = '7' + phone;
        	$(this).val(phone);
        	$(this).attr('value',phone);
        	// alert(phone);
        } else {
        	
        }
        
		console.log(phoneRegex.test(phone));
        // Проверяем соответствие номеру телефона
        if (phoneRegex.test(phone)) {
            $('#btn-client-login').prop('disabled', false);
        } else {
            $('#btn-client-login').prop('disabled', true);
        }
	});


	
	//авторизация
	$(document).on('click touchstart','.client-login',function()
	{
		setTimeout(function() { // Ждем завершения анимации перед сменой содержимого
		$('#first-div').addClass('rotate-x-180');
		$('#first-div').hide(); // Скрываем первый div
		$('#second-div').show(); // Показываем второй div
		$('#second-div').addClass('rotate-x360');
		}, 600); // Время ожидания совпадает со временем анимации
		
		$(this).prop('disabled',true);
		
		let phone = $('#phone-number').val();
		$.ajax({
			type: 'POST',
			url: './receiver.php',
			dataType: 'html',
			data: {action: 'pin', phone: phone},
			success: function(data)
			{
				let d = JSON.parse(data);
				showAlert('#login-alert',d.message,'alert-success');
			},
			error:  function()
			{
				showAlert('#login-alert',data,'alert-danger');
			}
		});
	});
	
	// отправка pin на проверку
	$(document).on('click touchstart','#btn-send-pin',function()
	{
		let pin = $('#client-pin').val();
		
		if(pin.length==0)
		{
			showAlert('#login-alert','Введите PIN код','alert-danger');
		}
		else
		{
			$.ajax({
				type: 'POST',
				url: '/receiver.php',
				dataType: 'html',
				data: {action: 'clientpincheck', pin: pin},
				success: function(data)
				{
					let d = JSON.parse(data);
					
					if(d.redirect != 'none')
					{
						showAlert('#login-alert',d.message,d.class);
						setTimeout(function() {
							document.location.href='/' + d.redirect;
						}, 0);
					}
					else
					{
						// showAlert('#login-alert','неверный код! ;(','alert-danger');
						$('#client-pin').addClass('shake');
		                setTimeout(() => {
		                        $('#client-pin').removeClass('shake');
		                    }, 500);
		                $('#client-pin').css({ backgroundColor: '#ffcccc' });
		                setTimeout(() => {
		                    $('#client-pin').css({ backgroundColor: '' });
		                }, 2000);
					}
				},
				error:  function()
				{
					showAlert('#login-alert','Произошла ошибка ;(','alert-danger');
				}
			});
		}
	});
	// возврат к вводу телефона
	$(document).on('click touchstart','#btn-backphone',function()
	{
		$('.client-login').prop('disabled',false);
		setTimeout(function() { // Ждем завершения анимации перед сменой содержимого
		$('#second-div').removeClass('rotate-x360');
		$('#second-div').hide(); // Показываем второй div
		$('#first-div').show(); // Скрываем первый div
		$('#first-div').removeClass('rotate-x-180');
		}, 600); // Время ожидания совпадает со временем анимации
		
		$('#client-pin').val('');
	});
	
	//выход
	$(document).on('click touchstart','.btn-logout',function()
	{
		$.ajax({
				type: 'POST',
				url: './receiver.php',
				dataType: 'html',
				data: {action: 'logout'},
				success: function(data)
				{
					document.location.href='/index';
				},
				error:  function()
				{
					showAlert('#login-alert','Произошла ошибка ;(','alert-danger');
				}
			});
	});
});