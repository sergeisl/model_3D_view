$(function(){
	$('#add_field').on('click', function(){
		$('input[type=file]:first')
			.clone()
			.val('')  
			.add('<br />')
			.appendTo('#additional_fields');
	});
	$('#my_form').on('submit', function(e){
		e.preventDefault();
		let $that = $(this),
				formData = new FormData($that.get(0)); // создаем новый экземпляр объекта и передаем ему нашу форму
				formData.append('date_upl', new Date()); // добавляем данные, не относящиеся к форме
		$.ajax({
			url: $that.attr('action'),
			type: $that.attr('method'),
			contentType: false, // важно - убираем форматирование данных по умолчанию
			processData: false, // важно - убираем преобразование строк по умолчанию
			data: formData,
			dataType: 'json',
			success: function(data){
				if(data){
					//console.log(json);
					getDataModel(data);
				}
			}
		});
	});
    $('#my_form1').on('submit', function(e){
        e.preventDefault();
        let $that = $(this),
                formData = new FormData($that.get(0)); // создаем новый экземпляр объекта и передаем ему нашу форму
                formData.append('date_upl', new Date()); // добавляем данные, не относящиеся к форме
        $.ajax({
            url: $that.attr('action'),
            type: $that.attr('method'),
            contentType: false, // важно - убираем форматирование данных по умолчанию
            processData: false, // важно - убираем преобразование строк по умолчанию
            data: formData,
            dataType: 'json',
            success: function(data){
                if(data){
                    console.log(json);
                    load(data);
                }
            }
        });
    });
    $.ajax({
        url: "server/list.php",
        type: 'get',
        contentType: false,
        processData: false, 
        dataType: 'json',
        success: function(data){
            if(data){

                data.forEach((item) =>{
                    $('.textureAdd')
                        .prepend('<a href="#" name="'+item.id+'" id="load_scena" onclick="getDataModel(this); return false;">'+item.name_csen+'</a>')
                        .add('<br />')
                        .appendTo('.textureAdd');
                });
            }
        }
    });   
});
//Загрузка модели с текстурами
function getDataModel(e){
    let temp;
    if(typeof(e)!="string"){
        let $that = $(e); 
        temp = $that.attr('name');
    } else {
        temp = e;
    }
    $.ajax({
        url: "server/getDataModel.php",
        type: 'get',
        contentType: false,
        processData: false, 
        data: 'id='+temp,
        dataType: 'json',
        success: function(data){
            if(data){
                load(data);
            }
        }
    });
}
//загрузкак текстур из форм на сервер
function TextureLoad(e){
    let $that = $(e),
        formData = new FormData($that.get(0)); 
        formData.append('date_upl', new Date());
    let  name = $that[0][3].value;
   // $('.'+name).css('display', 'block');
    $('.'+name).focus();
    $.ajax({
        url: $that.attr('action'),
        type: $that.attr('method'),
        contentType: false,
        processData: false,
        data: formData,
        dataType: 'json',
        success: function(data){
            if(data){
                //$('.'+name).removeClass('button3');
                $('.'+name).blur();
                console.log(data);
                //getDataModel(data);
            }
        }
    });
    return false;
}