<?php
// Обработка GET параметров и установка сессий
if(isset($_GET['ref'])) {
    $_SESSION['ref'] = $_GET['ref'];
}

if(isset($_GET['promocode'])) {
    $_SESSION['promocode'] = $_GET['promocode'];
    
    $promocode = $this->getPromocode($_SESSION['promocode']);
    $amount = $promocode['amount'];
    $amount_expire = $promocode['date_expire'];
    $status = $promocode['status'];
    
    $this->messageText_whatsapp(79962206698,"сделан переход по промокоду - ".$_GET['promocode']);
}

include __DIR__.'/ajax/pdo.php';

function getCities($pdo)
{
	$query = "SELECT * FROM citys";
	$db = $pdo->prepare($query);
	$db->execute();
	$citys = $db->fetchAll(PDO::FETCH_ASSOC);
	$city_options = '';
	foreach ($citys as $city)
	{
		$city_options .= '<option value="'.$city['id'].'">'.$city['name'].'</option>';
	}
	return $city_options;
}

function getServices($pdo)
{
    $selectServices = '<div id="Services" class="list-group mb-2">';
    
    $sql = "
        SELECT *
        FROM services
        WHERE JSON_CONTAINS(geo, CAST('[1]' AS JSON)) AND status = '1';
    ";
    
    $db = $pdo->prepare($sql);
    $db->execute();
    
    $services = $db->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($services as $key => $service) {
        $class = '';
        if (count($services) === 1) {
            $class = 'service-item-single'; // Для одной услуги
        } elseif ($key === 0) {
            $class = 'service-item-start'; // Первая услуга
        } elseif ($key === count($services) - 1) {
            $class = 'service-item-end'; // Последняя услуга
        } else {
            $class = 'service-item-middle'; // Промежуточные услуги
        }
        
        $selectServices .= '<div class="' . $class . '"><label class="list-group-item text-start label-service border-0"><input class="form-check-input client-service me-1 d-none" type="radio" value="' . $service['id'] . '" name="service"><span class="badge bg-dark me-2">' . $service['price'] . '₽</span> ' . $service['name'] . ' <a class="text-dark" data-bs-toggle="collapse" data-bs-target="#collapse_' . $service['id'] . '" href="#collapse_' . $service['id'] . '" role="button" aria-expanded="false" aria-controls="collapse_' . $service['id'] . '" style="position: absolute;right: 13px;top: 13px;"><i class="bi bi-question-circle"></i></a><div class="accordion-collapse collapse" id="collapse_' . $service['id'] . '" data-bs-parent="#Services"><div class="card card-body card-service border-0">' . $service['description'] . '</div></div></label></div>';
    }
    
    $selectServices .= '</div>';
    
    return $selectServices;
}

function inputPhone()
{
	if(isset($_SESSION['phone']))
	{
		// Нормализуем номер при выводе
		$phone = $_SESSION['phone'];
		if (preg_match('/^7\d{10}$/', $phone)) {
			$phone = '+7' . substr($phone, 1);
		}
		echo '<input type="tel" id="client-phone" name="phone" value="'.$_SESSION['phone'].'" class="form-control  client-input disabled" placeholder="телефон" maxlength="12" aria-label="" aria-describedby="btnGroupAddon" required disabled autocomplete="off">';
	}
	else
	{
		echo '<input type="tel" id="client-phone" name="phone" value="" class="form-control  client-input" placeholder="телефон" maxlength="12" aria-label="" aria-describedby="btnGroupAddon" required autocomplete="off">';
	}
}

function inputName()
{
	if(isset($_SESSION['name']) and $_SESSION['name']!="")
	{
		echo '<input type="text" id="client-firstname" name="firstname" value="'.$_SESSION['name'].'" class="form-control client-input" placeholder="имя" aria-label="" aria-describedby="btnGroupAddon" required disabled autocomplete="off">';
	}
	else
	{
		echo '<input type="text" id="client-firstname" name="firstname" class="form-control client-input" placeholder="имя" aria-label="" aria-describedby="btnGroupAddon" required autocomplete="off">';
	}
}
?>

<div id="modal-calendar" class="modal modal-calendar" 
     data-promo-expire="<?= $promocode['date_expire'] ?? '0' ?>" 
     data-promo-amount="<?= $promocode['amount'] ?? '0' ?>" 
     data-promo-status="<?= $status ?? 'inactive' ?>">
	<div class="modal-dialog">
		<div class="calendar modal-content">
			<div class="m-0 calendar-img d-flex align-items-center justify-content-center"></div>
			<div class="calendar-wrapper">
				
				<div id="calendarDisplayOne" class="calendar-table calendar-box displayShow">
					<div class="calendar-box-city input-group p-1">
						<div id="selectCity" class="input-group-text">
							<i class="bi bi-geo-alt-fill" style="color: black;"></i>
						</div>
						<select id="city" name="city" class="form-select form-select-md" aria-label="" aria-describedby="selectCity">
							<?php echo getCities($pdo); ?>
						</select>
					</div>		
					<div class="calendar-tableTr calendar-head">
						<div class="col-2 p-2 d-flex justify-content-start calendar-button-arrow arrow-left align-items-center">
							<i id="prev-month" class="bi bi-arrow-left" style="font-size: 32pt;margin-left:10px;"></i>
						</div>
						<div id="current-date" class="col-8 d-flex justify-content-center align-items-center current_date"></div>
						<div class="col-2 d-flex justify-content-end calendar-button-arrow arrow-right align-items-center">
							<i  id="next-month" class="bi bi-arrow-right" style="font-size: 32pt;margin-right:10px;"></i>
						</div>
					</div>
					
					<div class="calendar-tableTr">
						<div class="calendar-box-client d-none p-1"></div>
					</div>
					<div class="calendar-tableTr">
						<div class="calendar-tableTd">Пн</div>
						<div class="calendar-tableTd">Вт</div>
						<div class="calendar-tableTd">Ср</div>
						<div class="calendar-tableTd">Чт</div>
						<div class="calendar-tableTd">Пт</div>
						<div class="calendar-tableTd">Сб</div>
						<div class="calendar-tableTd">Вс</div>
					</div>
					<div id="tbody"></div>
					<div id="time-list" class="d-flex justify-content-center my-3 flex-wrap"></div>
				</div>
				
				<div id="calendarDisplayTwo" class="calendar-box-client displayHide">
					<?php echo getServices($pdo);?>
					<input type="hidden" id="record-date" name="record-date" value="">
					<input type="hidden" id="record-time" name="record-time" value="">
					<input type="hidden" id="record-service" name="record-service" value="">
					<div class="input-group mb-2 pt-3">
						<div class="input-group-text" id="btnGroupAddon">
							<i class="bi bi-person-fill"></i>
						</div>
						<?php echo inputName();?>
					</div>
					<div class="input-group mb-2">
						<div class="input-group-text" id="btnGroupAddon">
							<i class="bi bi-telephone-fill"></i>
						</div>
						<?php echo inputPhone();?>
					</div>
					<div class="shows d-inline-flex gap-2">
						<div id="div-valid-code" class="input-group mb-2 w-75" style="display: none;">
							<input id="calendar-input-pin" type="text" class="form-control" placeholder="код" aria-label="Recipient username" aria-describedby="button-addon2" autocomplete="off">
							<button id="calendar-btn-set-pin" class="btn btn-secondary form-control" type="button" id="button-addon2">отправить</button>
						</div>
						<div class="btn-timer mb-2 w-100">
							<button id="calendar-btn-get-pin" name="code_validation" class="btn btn-success form-control w-100" disabled>получить код</button>
						</div>
					</div>
					<div class="input-group mb-2 gap-2 align-items-center justify-content-center">
						<input type="checkbox" id="client-confederacy" name="confederacy" class="client-input" aria-label="" aria-describedby="btnGroupAddon" required>
						<a href="" class="text-decoration-none"><small class="font-greey" style="font-size: 12pt;">согласие на обработку данных</small></a>
					</div>
					<div class="promo-code input-group mb-2">
						<div class="input-group-text">
							промокод
						</div>
						<input id="client-promocode" type="text" class="form-control" placeholder="промокод" autocomplete="off" value="<?= $_SESSION['promocode'] ?? '' ?>">
					</div> 
					<div id="calendar-alert" class="alert" role="alert"></div>
					<button id="client-button-back" class="calendar-btn-calendarshow btn btn-outline-secondary mt-2 w-100 form-control">другая дата</button>					
				</div>
			</div>
		</div>
	</div>
</div>