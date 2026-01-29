
<div class="modal fade modal-login w-100 p-5" id="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
    	<div class="modal-content" style="min-height: 135px; height: auto;">
	    	<div class="modal-header justify-content-center">
	        	<h1 class="modal-title fs-5" id="exampleModalLabel"><i class="bi bi-person-circle"></i> ЛИЧНЫЙ КАБИНЕТ</h1>
	    	</div>
      
			<div class="modal-body text-center flip-container">
				<div class="flipper">
					<div id="first-div" class="front input-group">
						<div class="input-group-text" id="btnGroupAddon"><i class="bi bi-telephone-fill"></i></div>
						<input id="phone-number" type="text" class="form-control text-center client-phone" value="" placeholder="телефон" aria-label="" aria-describedby="btnGroupAddon" autocomplete="on">
						<button id="btn-client-login" type="button" class="btn btn-warning client-login">войти</button>
					</div>
					<div id="second-div" class="back form-send-pin input-group w-100" style="display: none;">
						<button id="btn-backphone" class="btn btn-outline-secondary"><i class="bi bi-chevron-left"></i></button>
						<input id="client-pin" type="text" class="form-control text-center" placeholder="код" aria-label="Recipient username" aria-describedby="btn-send-pin" autocomplete="off">
						<button id="btn-send-pin" type="button" class="btn btn-success">отправить</button>
					</div>
				</div>
				<div class="box-alert position-relative">
					<div id="login-alert" class="alert position-absolute w-100" role="alert" style="display: none;top: 30px;"></div>
				</div>
			</div>
    	</div>
	</div>
</div>