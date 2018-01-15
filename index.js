var canvas = document.getElementById('canvas-box'),
	ctx = canvas.getContext('2d'),//инициализация canvas - холст дли рисования
	a, //переменная для хранения первого слагаемого 
	b, //переменная для хранения второго слагаемого 
	sum, //переменная для хранения суммы 
	apx, //переменная для хранения первого слагаемого в px
	bpx; //переменная для хранения второго слагаемого в px

function startTest (){ //запуск теста
	var ainput = document.getElementById('a_input'),
		binput = document.getElementById('b_input'),
		suminput = document.getElementById('sum_input'), 
		atask= document.getElementById('task_a'),
		btask= document.getElementById('task_b'),
		Position = 1, //Этап решения: 1 - появляется первая дуга и инпут, 2 - появляется вторая стрелка второй импут,  3- ввод суммы. 
		result = false; //Результат проверки решения
	function NextStage(Position) { //Функция запускающая этапы решения 
		var start,  //Длина первой стрелки
			shift,  //Отсутп от начал 
			element, 
			type, // Этап решения
			answer; //Правильный ответ

		switch(Position){
			case 1:
				start = apx;
				shift = 0;
				element = ainput;
				type = 'a'; //Этап нахождения првого слогаемого
				answer = a;
			break;
			case 2:
				start = bpx;
				shift = apx;
				element = binput;
				type = 'b'; //Этап нахождения второго слогаемого
				answer = b;
			break;
			case 3:
				element = suminput;
				type = 'sum'; //Этап нахождения суммы
				answer = sum;
			break;
			default:return;
				break;
		}
		outputArr(start, shift, element); //Запуск рисования инпута и стрелки
		element.addEventListener('input', function(){		
		verificationState(Position, element, type, answer); //Проверка этапа решения 
		});
	}

	function verificationState(Position, element, type, answer){ //Функция проверки этапа решения
		result = verificationValue(element.value, answer, type); //Проверка введенного ответа	
		
		if (result == true){ 
			element.removeEventListener('input', function(){ 
				verificationState(Position, element, type, answer);
			});
			Position ++; //Увеличеваем номер этапа
			NextStage(Position); //Запускаем следующий этап
		}
	}
	a = Math.floor(Math.random() * (10 - 6)) + 6; //генерируем первое слагаемое
	sum = Math.floor(Math.random() * (15 - 11)) + 11; //генерируем сумму
	b = sum - a; //считаем второе слагаемое
	apx = 39*a; // переводим первое слагаемое в пиксели
	bpx = 39*b; // переводим второе слагаемое в пиксели
	
	atask.textContent = a;// выводим первое слогаемое
	btask.textContent = b;// выводим второе слогаемое
	

	NextStage(Position); //Запускаем первую стадию решения 
}

function outputArr (start, shift, input){ //Отрисовка функции 
	var	marginSide = (start/2-10 ),  //Считаем отступ сверху/снизу от инпута 
		marginBott = 215 - start/3.7; //Считаем отступ сверху/снизу от инпута 

	function drawArr(start, shift){ //Функция отрисовки стрелки 
		ctx.beginPath();
		ctx.strokeStyle = '#cc0073';
		ctx.lineWidth = 1.5;
		ctx.moveTo(shift, 215);
		ctx.quadraticCurveTo(start/2 + shift, 205-start/2, start+shift, 215);
		ctx.lineTo(start+shift-4, 205);
		ctx.moveTo(start+shift, 215);
		ctx.lineTo(start+shift-11, 209);
		ctx.closePath();
		ctx.stroke();
	};
   
	if(input.id == 'sum_input'){  //появляется инпут суммы, исчезает знак вопроса
		document.getElementById('sum-text').classList.toggle('task-list__item_visible');
		input.classList.toggle('task-list__item_visible');
	}
	else { 
		drawArr(start, shift);  //Выводим стрелку 
		drawArr(start, shift);  //Выводим стрелку 
		input.style.margin = marginBott + 'px ' +  marginSide + 'px ' + '-' + marginBott + "px"; //Задаем отсутуп инпута 
		input.classList.add('canvas-box__item_visible'); //Выводим инпут
	}
};

function verificationValue (value, answer, type) { //Проверка ответа 
	var id,  
		element,
		marginSide = answer*36/2,
		marginBott = 200 - answer*39/3.7;
		console.log(value, answer);
	
	function classToggle(element, classId){ //Функция изменения классов 
		var	className;
		className = element.classList[0] + classId; //Получаем класс элемента 
		
		switch(classId){  // В зависимости от идификатора класса преключаем/удаляем нужные 
 		
		case '_visible': //Класс убирает видимость блока 
			console.log(classId);
			element.classList.toggle(className);
			console.log(className, element.className);
			break;
		case '_fixed-error': //Клас исправленной ошибки 
			className = element.classList[0] + '_output-error';
			element.classList.remove(className);
			break;
		default: //Все классы ошибок 
			element.classList.add(className);
			break;
		}
	}
	
	if (value == answer) { //Проверка верности ответа 
		id = type + "_input"; //Получем id элемента 
		element = document.getElementById(id);
		classToggle(element, '_visible'); //Запускаем переключение класа _visible
		
		id = type + "-text";
		element = document.getElementById(id);
		element.textContent = answer;
		if(type != 'sum'){ //Задаем отсуп для вывода правильного ответа 
			element.style.margin = marginBott + 'px ' +  marginSide + 'px ' + '-' + marginBott + "px";

		} 
		
		classToggle(element, '_visible'); 
		if(type != 'sum'){ // выключаем подсветку ошибки 
			id = 'task_'+type;
			element = document.getElementById(id);
			classToggle(element, '_fixed-error');
		}
		return true;
	}
	else {
		
		id = type + '_input';
		console.log(id, typeof(id));
		element = document.getElementById(id);
		classToggle(element, '_input-error'); // Меняем цвет текса инпута в случае ошибки на красный 
		if (type != 'sum') { //Подсветка ошибки
			id = 'task_'+ type;
			element = document.getElementById(id);
			classToggle(element, '_output-error'); 
		}
		return false;
	}
};

startTest();