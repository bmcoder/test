$(document).ready(function()
{
    let currentDate = new Date();
    let selectedDate = currentDate.toISOString().slice(0, 10);

    // Функция для получения даты
    function getDate() {
    	    // Convert the UNIX timestamp from seconds to milliseconds
    const date = new Date(selectedDate);

    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Format the date and time
    const formattedDate = `${year}-${month}-01`;

    return formattedDate;
    }

    // Функция для отправки AJAX-запроса
    function loadCalendar(date) {
        $.ajax({
            url: './pages/calendar.php',
            method: 'GET',
            data: { date: date },
            success: function(response) {
                displayCalendar(response);
            }
        });
    }

    // Функция для отображения календаря
    function displayCalendar(data) {
        $('#calendar').empty(); // Очищаем таблицу перед добавлением новых данных

        // Заголовок таблицы
        var thead = $('<thead>');
        var tr = $('<tr>');

        // Проверяем, можем ли перейти к предыдущему месяцу
        const prevDisabled = new Date(selectedDate).getTime() <= currentDate.setDate(1);

        // Кнопка для предыдущего месяца
        tr.append($('<td>')
            .attr('colspan', 1)
            .addClass(`navigation ${prevDisabled ? 'disabled' : ''}`)
            .text('<')
            .on('click', function() {
                if (!prevDisabled) {
                    selectedDate = new Date(selectedDate).setMonth(new Date(selectedDate).getMonth() - 1);
                    loadCalendar(getDate());
                }
            }));

        // Текущий месяц и год
        tr.append($('<td>')
            .attr('colspan', 5)
            .addClass('current')
            .text(`${new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(new Date(selectedDate))} ${new Date(selectedDate).getFullYear()}`));

        // Проверяем, можем ли перейти к следующему месяцу
        const nextDisabled = new Date(selectedDate).getTime() >= currentDate.setFullYear(currentDate.getFullYear(), 11, 31);

        // Кнопка для следующего месяца
        tr.append($('<td>')
            .attr('colspan', 1)
            .addClass(`navigation ${nextDisabled ? 'disabled' : ''}`)
            .text('>')
            .on('click', function() {
                if (!nextDisabled) {
                    selectedDate = new Date(selectedDate).setMonth(new Date(selectedDate).getMonth() + 1);
                    loadCalendar(getDate());
                }
            }));

        thead.append(tr);

        // Дни недели
        var daysRow = $('<tr>');
        ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(function(day) {
            daysRow.append($('<th>').text(day));
        });
        thead.append(daysRow);

        $('#calendar').append(thead);

        // Дни месяца
        var tbody = $('<tbody>');
        data.days.forEach(function(week) {
            var tr = $('<tr>');
            week.forEach(function(day) {
                var td = $('<td>').text(day ? day.number : '');
                if (day && day.weekend) {
                    td.addClass('weekend');
                }
                tr.append(td);
            });
            tbody.append(tr);
        });
        $('#calendar').append(tbody);
    }

    // Инициализация календаря
    loadCalendar(getDate());
});