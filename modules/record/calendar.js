$(document).ready(function() {
    // Функция для получения данных промокода из data-атрибутов
    function getPromoData() {
        const modal = document.getElementById('modal-calendar');
        return {
            expireTime: modal ? parseInt(modal.dataset.promoExpire) : 0,
            amount: modal ? parseInt(modal.dataset.promoAmount) : 0,
            status: modal ? modal.dataset.promoStatus : 'inactive'
        };
    }

    // Функция для обновления таймера промокода
    function updateCountdown() {
        const promoData = getPromoData();
        const currentTime = Math.floor(Date.now() / 1000);
        const expireTime = promoData.expireTime;
        
        let timeRemaining = expireTime - currentTime;

        if (timeRemaining <= 0) {
            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.innerHTML = 'Время вышло!';
            }
            return;
        }

        const days = Math.floor(timeRemaining / (60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
        const seconds = Math.floor(timeRemaining % 60);

        let output = '';
        if (days > 0) {
            output = `${days} дн. `;
        }
        output += `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.innerHTML = output;
        }
    }

    // Функция для отображения промокода
    function showPromocode(promocode) {
        const promoData = getPromoData();
        
        if(promoData.status === "active") {
            $('.calendar-img').append('<div class="promocode d-flex flex-column justify-content-center text-center"><div class="promocode-title blink">ПРОМОКОД</div><div>'+promocode+'</div><div class="promocode-title blink">СКИДКА '+promoData.amount+'Р</div><div id="timer"></div></div>');
            setInterval(updateCountdown, 10);
        }
        else if(promoData.status === "expired") {
            $('.calendar-img').append('<div class="promocode d-flex flex-column justify-content-center text-center"><div class="promocode-title blink">ПРОМОКОД</div><div>'+promocode+'</div><div class="promocode-title blink">НЕ ДЕЙСТВИТЕЛЕН!</div></div>');
        }
    }

    // Функция для получения текущей даты с учетом GET параметров
    function getCurrentDate() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentDate = new Date();
        
        let month = urlParams.get('month');
        let year = urlParams.get('year');
        
        if (month && year) {
            return new Date(parseInt(year), parseInt(month) - 1, 1);
        } else {
            return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        }
    }

    // Функция для обновления услуг с возвратом Promise
    function updateServicesForCity(cityId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: './modules/record/ajax/get_services.php',
                method: 'POST',
                data: { city_id: cityId },
                success: function(response) {
                    $('#Services').replaceWith(response);
                    resolve();
                },
                error: function(xhr, status, error) {
                    console.error('Ошибка при получении услуг:', error);
                    reject(error);
                }
            });
        });
    }

    // Функция для автоматического показа модального окна
    function autoShowCalendar() {
        const urlParams = new URLSearchParams(window.location.search);
        const hasCityId = urlParams.has('city_id');
        const hasPromocode = urlParams.has('promocode');
        const hasMonth = urlParams.has('month');
        const hasYear = urlParams.has('year');
        
        if (hasCityId || hasPromocode || (hasMonth && hasYear)) {
            $('.modal-calendar').modal('show');
            $(document).remove('.modal-backdrop');
            
            selectedCityId = hasCityId ? urlParams.get('city_id') : '1';
            
            if (selectedCityId) {
                // Сначала обновляем услуги для города, потом календарь
                updateServicesForCity(selectedCityId).then(() => {
                    $('#city').val(selectedCityId);
                    $('#city option').removeAttr('checked');
                    $('#city option[value="' + selectedCityId + '"]').attr('checked', 'checked');
                    
                    currentDate = getCurrentDate();
                    
                    if(hasPromocode) {
                        const promocode = urlParams.get('promocode');
                        showPromocode(promocode);
                    }
                    
                    updateCalendar();
                }).catch(error => {
                    console.error('Ошибка при загрузке услуг:', error);
                    // В случае ошибки все равно обновляем календарь
                    updateCalendar();
                });
            }
        }
    }

    // Функция для обновления календаря
    function updateCalendar() {
        let calendarData = generateCalendar(currentDate, selectedCityId);
        getActiveDates(selectedCityId, dates => {
            renderCalendar(currentDate, calendarData, dates);
            $('#tbody').off('click', '.active-day').on('click', '.active-day', handleActiveDayClick);
            $('#time-list').empty();
        });
    }

    // Функция для генерации календаря
    function generateCalendar(date, cityId) {
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0);
        
        let calendar = [];
        let startWeekDay = firstDay.getDay() || 7;

        let week = [];
        for (let i = startWeekDay; i > 1; i--) {
            week.unshift({
                date: prevLastDay.getDate() - (startWeekDay - i),
                month: 'prev'
            });
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            week.push({
                date: i,
                month: 'current'
            });
            
            if (week.length === 7) {
                calendar.push(week);
                week = [];
            }
        }

        let nextMonthDay = 1;
        while (week.length < 7) {
            week.push({
                date: nextMonthDay++,
                month: 'next'
            });
        }

        if (week.length > 0) {
            calendar.push(week);
        }

        return calendar;
    }

    // Функция для получения активных дат из базы данных
    function getActiveDates(cityId, callback) {
        $.ajax({
            url: './modules/record/ajax/get_active_dates.php',
            method: 'POST',
            dataType: 'json',
            data: { id_city: cityId },
            success: function (response) {
                if (response.status === 'success') {
                    callback(response.dates);
                } else {
                    alert('Ошибка при получении активных дат');
                }
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
    }

    // Функция для обработки клика по активным дням
    function handleActiveDayClick(e) {
        let target = $(e.target);

        if (target.hasClass('active-day')) {
            $('.active-day').removeClass('selected-day');
            target.addClass('selected-day');

            let selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(target.text()), 15, 30);
            selectedDate.setDate(parseInt(target.text()));
            $('#record-date').attr({value:selectedDate.toISOString().slice(0, 10)});
            $('#selectedDate').val(selectedDate.toISOString().slice(0, 10));

            getAvailableTimes(selectedDate, selectedCityId);
        }
    }

    // Функция для рендеринга календаря
    function renderCalendar(date, calendarData, activeDates) {
        let tableBody = $('#tbody');
        tableBody.empty();
        calendarData.forEach((week, index) => {
            let row = $('<div class="calendar-tableTr">');

            week.forEach(day => {
                let cell = $('<div class="calendar-tableTd">');

                if (day.month === 'current') {
                    cell.text(day.date);
                    const formattedDate = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + day.date).slice(-2)}`;
                    if (activeDates.includes(formattedDate)) {
                        cell.addClass('active-day');
                    } else {
                        cell.addClass('passive-day');
                    }
                } else {
                    cell.addClass('hidden-day');
                }

                row.append(cell);
            });

            tableBody.append(row);
        });

        $('#current-date').text(date.toLocaleString('default', { month: 'long', year: 'numeric' }));
    }

    // Функция для получения доступного времени для выбранной даты
    function getAvailableTimes(date, cityId) {
        $.ajax({
            url: './modules/record/ajax/get_available_times.php',
            method: 'POST',
            dataType: 'json',
            data: { date: date.toISOString().slice(0, 10), id_city: cityId },
            success: function (response) {
                if (response.status === 'success') {
                    displayAvailableTimes(response.times);
                } else {
                    alert('Ошибка при получении доступного времени');
                }
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
    }

    // Функция для отображения доступного времени
    function displayAvailableTimes(times) {
        let timeList = $('#time-list');
        timeList.empty();

        times.forEach(time => {
            let item = $('<div>').text(time).addClass('active-time btn btn-success calendar-btn-time p-1 m-1');
            timeList.append(item);
        });

        $('#result-block').show();
    }

    // Функция для нормализации номера телефона
    function normalizePhone(phone) {
        let cleaned = phone.replace(/[^\d+]/g, '');
        
        if (cleaned.startsWith('+7')) {
            cleaned = '7' + cleaned.substring(2);
        } else if (cleaned.startsWith('8')) {
            cleaned = '7' + cleaned.substring(1);
        } else if (cleaned.startsWith('9') && cleaned.length === 10) {
            cleaned = '7' + cleaned;
        }
        
        if (cleaned.length === 11 && cleaned.startsWith('7')) {
            return cleaned;
        }
        
        return null;
    }

    // Функция проверки телефона
    function validatePhone(phone) {
        const patterns = [
            '^\\+7\\d{10}$',
            '^7\\d{10}$',
            '^8\\d{10}$',
            '^9\\d{9}$'
        ];
        
        for (let pattern of patterns) {
            if (new RegExp(pattern).test(phone)) {
                return normalizePhone(phone);
            }
        }
        return null;
    }

    // Функция для автоматического форматирования номера при вводе
    function autoFormatPhone(input) {
        let phone = input.val().replace(/[^\d+]/g, '');
        
        if (phone.startsWith('9') && phone.length === 10) {
            input.val('+7' + phone);
        } else if (phone.length === 1 && phone === '8') {
            input.val('+7');
        } else if (phone === '+7' || phone === '') {
            // Ничего не делаем
        } else if (phone.startsWith('7') && phone.length === 11 && !phone.startsWith('+')) {
            input.val('+7' + phone.substring(1));
        }
    }

    // ВАЛИДАЦИЯ ФОРМЫ ЗАПИСИ (ВСЕ ПОЛЯ)
    function fullValid() {
        let validStatus = true;

        let phoneInput = $('#client-phone').val();
        let normalizedPhone = validatePhone(phoneInput);
        
        if (!normalizedPhone) {
            validStatus = false;
            console.log('телефон - BAD');
        } else {
            console.log('телефон - ОК, нормализован: ' + normalizedPhone);
            $('#client-phone').data('normalized', normalizedPhone);
        }

        if($('#client-firstname').val().length==0) {
            validStatus = false;
            console.log('имя - BAD');
        } else {
            console.log('имя - ОК');
        }

        if(!$('#client-confederacy').prop('checked')) {
            validStatus = false;
            console.log('соглашение - BAD');
        } else {
            console.log('соглашение - ОК');
        }

        if(validStatus == true) {
            console.log('Соответствует');
            $('#calendar-btn-get-pin').prop('disabled', false);
        } else {
            console.log('Не соответствует');
            $('#calendar-btn-get-pin').prop('disabled', true);
        }
    }

    // БЛОК ALERT
    function showAlert(alert_elem, text, alert_class) {
        $(alert_elem).html(text).fadeIn();
        $(alert_elem).removeClass().addClass('alert ' + alert_class);

        setTimeout(function() {
            $(alert_elem).fadeOut();
        }, 4000);
    }

    // Объявляем глобальные переменные для управления календарем
    let currentDate = getCurrentDate();
    let selectedCityId = $('#city').val();

    // Вызываем авто-показ при загрузке
    autoShowCalendar();

    // Обработчик для кнопок записи
    $(document).on('click', '.btn-calendar', function() {
        $('.modal-calendar').modal('show');
        $(document).remove('.modal-backdrop');
        
        if (!window.location.search.includes('city_id') && 
            !window.location.search.includes('promocode') &&
            !window.location.search.includes('month')) {
            currentDate = new Date();
            updateCalendar();
        }
    });

    // Обработчик смены месяца
    $('#prev-month').on('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        selectedCityId = $('#city').val();
        updateCalendar();
    });

    $('#next-month').on('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1, 1);
        selectedCityId = $('#city').val();
        updateCalendar();
    });

    // Обработчик выбора города
    $('#city').on('change', function () {
        selectedCityId = $(this).val();
        console.log('city='+selectedCityId);
        
        $('#city option').removeAttr('checked');
        $('#city option:selected').attr('checked', 'checked');
        
        // Сначала обновляем услуги, потом календарь
        updateServicesForCity(selectedCityId).then(() => {
            updateCalendar();
        }).catch(error => {
            console.error('Ошибка при загрузке услуг:', error);
            updateCalendar();
        });
    });

    // Инициализация календаря при обычном открытии (без автооткрытия)
    if (!window.location.search.includes('city_id') && 
        !window.location.search.includes('promocode') &&
        !window.location.search.includes('month')) {
        updateCalendar();
    }

    // ПРОВЕРКА ЗАПОЛНЕНИЯ ФОРМЫ (ВЫБОР УСЛУГИ)
    $(document).on('change','.client-service', function (e) {
        $('#record-service').attr({value:$(this).val()});
        
        $('.label-service, .card-service').css('background','white');
        $(this).parent().css('background','gold');
        $(this).parent().addClass('bs-gold');
        $(this).parent().find('.card-service').css('background','gold');
    });

    // соглашение о данных КЛИЕНТА
    $(document).on('change','#client-confederacy', function(){
        fullValid();
    });

    // ВАЛИДАЦИЯ НОМЕРА ТЕЛЕФОНА
    $(document).on('keyup','#client-phone', function() {
        autoFormatPhone($(this));
        fullValid();
    });

    // Обработчик вставки из буфера обмена
    $(document).on('paste', '#client-phone', function(e) {
        setTimeout(() => {
            autoFormatPhone($(this));
            fullValid();
        }, 10);
    });

    // Обработчик изменения значения (для автозаполнения браузера)
    $(document).on('change', '#client-phone', function() {
        autoFormatPhone($(this));
        fullValid();
    });

    // открываем экран 2
    $(document).on('click','.calendar-btn-calendarshow', function() {
        $('#calendarDisplayTwo').addClass('displayHideAnimation').removeClass('displayShow displayHideAnimation').addClass('displayHide');
        $('#calendarDisplayOne').removeClass('displayHide').addClass('displayShowAnimation').addClass('displayShow');
    });

    // открываем экран 2 при выборе времени
    $(document).on('click','.calendar-btn-time', function() {
        $('#record-time').attr({value:$(this).text()});
        console.log($('#record-time').attr('value'));
        console.log($(this).text());
        $('#calendarDisplayOne').addClass('displayHideAnimation').removeClass('displayShow displayHideAnimation').addClass('displayHide');
        $('#calendarDisplayTwo').removeClass('displayHide').addClass('displayShowAnimation').addClass('displayShow');
    });

    // ОТПРАВКА ДАННЫХ И ПОЛУЧЕНИЕ КОДА ПОДТВЕРЖДЕНИЯ
    $(document).on('click','#calendar-btn-get-pin', function() {
        let phone = $('#client-phone').val();
        let normalizedPhone = $('#client-phone').data('normalized');
        let service = $('#record-service').val();
        
        if (!normalizedPhone) {
            showAlert('#calendar-alert', 'Некорректный номер телефона!', 'alert-danger');
            return;
        }
        
        if(service.length==0) {
            showAlert('#calendar-alert','Не выбрана услуга!','alert-danger');
        } else {
            $.ajax({
                type: 'POST',
                url: '/receiver.php',
                dataType: 'html',
                data: {action: 'pin', phone: normalizedPhone},
                success: function(data) {
                    $('.btn-timer').removeClass('w-100').addClass('w-25');
                    var boxWidth = $("#div-valid-code").width();
                    $("#div-valid-code").width('0px');
                    $("#div-valid-code").animate({"width": "240px", "opacity": "show"}, 1000);
                    let d = JSON.parse(data);
                    showAlert('#calendar-alert',d.message,'alert-success');
                },
                error:  function(xhr, status, error) {
                    showAlert('#calendar-alert','Ошибка при отправке запроса','alert-danger');
                }
            });

            var sec = 30,
            $that = $(this).text(sec).prop('disabled', true),
            timer = setInterval(function() {
                $that.text(--sec);
                if(sec <= 0 ){
                    clearInterval(timer);
                    let repeat = String.fromCharCode(8635);
                    $that.text(repeat).prop('disabled', false);
                }
            }, 1000);
        }
    });

    // отправка pin на проверку
    $(document).on('click', '#calendar-btn-set-pin', function() {
        let pin = $('#calendar-input-pin').val();
        let city = $('#city').val();
        let date = $('#record-date').val();
        let time = $('#record-time').val();
        let service = $('#record-service').val();
        let name = $('#client-firstname').val();
        let promocode = $('#client-promocode').val();
        let normalizedPhone = $('#client-phone').data('normalized');
        
        if (!normalizedPhone) {
            showAlert('#calendar-alert', 'Некорректный номер телефона!', 'alert-danger');
            return;
        }
        
        if (pin.length == 0) {
            showAlert('#calendar-alert', 'Введите PIN код', 'alert-danger');
            return;
        }
        
        let $btn = $(this);
        $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2" role="status"></span> Отправка...');
        
        $.ajax({
            type: 'POST',
            url: './receiver.php',
            dataType: 'html',
            data: {
                action: 'recordpincheck', 
                pin: pin, 
                date: date, 
                time: time + ':00', 
                city: city, 
                service: service, 
                name: name, 
                promocode: promocode,
                phone: normalizedPhone
            },
            success: function(data) {
                let d = JSON.parse(data);
                showAlert('#calendar-alert', d.message, d.class);
                $btn.prop('disabled', true);
                
                if (d.redirect != 'none') {
                    setTimeout(function() {
                        document.location.href = '/' + d.redirect;
                    }, 4000);
                } else {
                    $btn.prop('disabled', false).html('отправить');
                }
            },
            error: function() {
                showAlert('#calendar-alert', 'Произошла ошибка ;(', 'alert-danger');
                $btn.prop('disabled', false).html('отправить');
            }
        });
    });
});