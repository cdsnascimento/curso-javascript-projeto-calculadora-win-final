class CalcController{

    constructor(){

        this._audio = new Audio('click.mp3');
        
        this._audioOnOff = false;

        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this. _timeEl = document.querySelector("#time");
        this._dateEl = document.querySelector("#date");

        this._currentDate;
        
        this.initilize();

        this.initButtonsEvents(); 
        this.iniKeyBoard();       

    }

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);
        
        input.select();

        document.execCommand("Copy");

        input.remove();

    }

    pasteFromClipboard(){

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

            this.addOperation(parseFloat(text));

        });

    }

    initilize(){

        this.setDisplayDateTime();

        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        let btnOnOff = document.querySelector('#onoff');
        
        btnOnOff.addEventListener('click', e =>{

            this.toggleAudio();

        });

    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;

    }

    playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime = 0;

            this._audio.play();

        }

    }

    iniKeyBoard(){

        document.addEventListener('keyup', e => {

            this.playAudio();

            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
            
                case 'Backspace':
                    this.cancelEntry();
                    break;
                            
                case '+':
                case '-':
                case '*':
                case '/':
                    this.addOperation(e.key);
                    break;               
                case 'ArrowLeft':
                    this.returnKey()
                    break;                
                case '%':
                    this.calcPercent(e.key);
                    break;                           
                case ',':
                case '.':
                    this.addDot();
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(e.key);
                    break;

                case 'c':
                case 'C':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;

            }            

        });

    }

    returnKey(){

        let number = this.getLastOperation();

        number = number.toString();

        this.setLastOperation(number.slice(0,number.length-1));

        this.setLastNumberToDisplay();

    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false); 

        });

    }

    clearAll(){

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();

    }

    cancelEntry(){

        this._operation.pop();
        this.setLastNumberToDisplay();

    }

    getLastOperation(){

        return this._operation[this._operation.length -1];

    }

    isOperator(value){

        return (['+','-','*','/'].indexOf(value) > -1);

    }

    setLastOperation(value){

        this._operation[this._operation.length -1] = value

    }

    pushOperation(value){

        this._operation.push(value);

        if(this._operation.length > 3){

            this.calc();

        }

    }

    getResult(){
        try{

            return eval(this._operation.join(""));

        } catch(e){

            setTimeout(() => {
               
                this.setError();

            }, 1);

            

        }
        

    }

    getOperator(){

        let operator;

        for(let i = 0; i < this._operation.length;i++ ){

            if (this.isOperator(this._operation[i])) {
                
                operator = this._operation[i];
                
                break;
                
            }

        }

        return operator;

    }

    getResultPercent(expression){

        return eval(expression.toString());

    }

    setNegativeNumberToDiplay(){

        let newValue = this.getLastOperation();

        this.setLastOperation(newValue * -1);

        this.setLastNumberToDisplay();

    }

    calcPart(){

        let part = this.getLastOperation();

        part = (1 / part);

        this.setLastOperation(part);

        this.setLastNumberToDisplay();

    }
    
    calcPow(){

        let power = this.getLastOperation();

        power = Math.pow(power,2);

        this.setLastOperation(power);

        this.setLastNumberToDisplay();

    }

    calcSqrt(){

        let root = this.getLastOperation();

        root = Math.sqrt(root);

        this.setLastOperation(root);

        this.setLastNumberToDisplay();

    }

    calcPercent(value){

        let result;
        let members = this._operation.length;
        let valueMain;
        let percent;

        if (members == 1) {
            
            result = this._operation[0]/100;

        } else  {
            if(this.getLastOperation() > 0){

                valueMain = this._operation[0].toString();
                percent = this._operation[2].toString();
    
                if (this.getOperator() == "+"){
    
                    result = this.getResultPercent(valueMain+'*(1+'+percent+'/100)');
    
                } else if (this.getOperator() == "-") {
    
                    result = this.getResultPercent(valueMain+'*(1-'+percent+'/100)');
       
                } else {
    
                    result = this.getResult();
                    result /= 100;
    
                }

            }

        }

        this._operation = [result];
        this.setLastNumberToDisplay();
    }

    calc(){

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator,this._lastNumber];

        }

        if (this._operation.length > 3) {

            last = this._operation.pop();

            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3){
            
            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if (last == '%'){

            result /= 100;

            this._operation = [result];

        }else{

            this._operation = [result];

            if(last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();
    
    }

    getLastItem(isOperator = true){

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0 ; i--) {
            
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }

        }

        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;

    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }

    addOperation(value){

        
        if (isNaN(this.getLastOperation())){

            if (this.isOperator(value)){

                this.setLastOperation(value);

            } else if (isNaN(value)) {

                //outra coisa
                console.log("Outra coisa", value);

            } else {
                
                this.pushOperation(value);

            }

        } else {

            if (this.isOperator(value)){

                this.pushOperation(value);

            } else {

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

            }

        }

        this.setLastNumberToDisplay();
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation){

            this.pushOperation('0.');

        } else {

            this.setLastOperation(lastOperation.toString() + '.');

        }

        this.setLastNumberToDisplay();


    }

    setError(){

        this.displayCalc = "ERROR";

    }

    execBtn(value)    {

        this.playAudio();

        switch (value) {
            case 'C':
                this.clearAll();
                break;
        
            case 'CE':
                this.cancelEntry();
                break;
                        
            case '+':
                this.addOperation(value);
                break;
            case '-':
                this.addOperation(value);
                break;
            case 'X':
                this.addOperation('*');
                break;
            case '÷':
                this.addOperation('/');
                break;               
            case '←':
                
                break;                
            case '%':
                this.calcPercent(value);
                break;                
            case 'x²':
                this.calcPow()
                break;   
            case '√':
                this.calcSqrt();
                break;                               
            case '¹/x':
                this.calcPart();
                break;                
            case '±':
                this.setNegativeNumberToDiplay();
                break;            
            case ',':
                this.addDot();
                break;
            case '=':
                this.calc();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(value);
                break;
            default:
                this.setError();
                break;
        }

    }

    initButtonsEvents(){

        let buttons = document.querySelectorAll('button');

        buttons.forEach(btn => {

            this.addEventListenerAll(btn,'click drag', e=> {

                let textBtn = btn.innerText;
                this.execBtn(textBtn);

            });

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e =>{

                btn.style.cursor = 'pointer';

            });
            
        });

    }

    setDisplayDateTime(){

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }

    get displayTime(){

        return this._timeEl.innerHTML;

    }

    set displayTime(value){

        this._timeEl.innerHTML = value;
        
    }

    get displayDate(){

        return this._dateEl.innerHTML;

    }

    set displayDate(value){

        this._dateEl.innerHTML = value;
        
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        if (value.toString().length > 10){

            this.setError();
            return;

        }
        this._displayCalcEl.innerHTML = value;

    }

    get currentDate(){

        return new Date();

    }

    set currentDate(value){

        _currentDate = value;

    }



}