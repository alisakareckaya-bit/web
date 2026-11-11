const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const WIDTH = 300;
const HEIGHT = 300;
const CENTER = 150;
const SCALE = 110;


function checkForm(el){
    document.getElementById("error_x").innerHTML = "";
    document.getElementById("error_y").innerHTML = "";
    document.getElementById("error_r").innerHTML = "";
    let x = document.getElementsByName("X");
    let choose_x = [];
    for(let i=0; i < x.length; i++){
        if(x[i].checked){
            choose_x.push(x[i].value);
        }
    }
    if(choose_x.length==0){
        document.getElementById("error_x").innerHTML="Не выбрано ни одного значение";
        return false
    }

    let y = el.Y.value.trim();
    
    if (y.length==0){
        document.getElementById("error_y").innerHTML = "Не введено ни одного значения";
        return false
    }else if(isNaN(y)){
        document.getElementById("error_y").innerHTML = "Введено не число";
        return false
    }else if(y<-5 ||y>3){
        document.getElementById("error_y").innerHTML = "Введено число, выходящее из диапозона значений (-5,3)";
        return false
    } else{
        console.log(Number(y));
    }



    let choose_r = document.getElementById('znach').value;

    if (choose_r === ''){
        document.getElementById("error_r").innerHTML = "Не выбрано значение R!";
        return false;
    }
    console.log(Number(choose_r));

    let result;
    const numY = Number(y);
    const numR = Number(choose_r);
    let newPoint = {}
    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
    });

        
    const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });


    let cash = JSON.parse(localStorage.getItem('points_r')) || {};

    for(let i=0; i < choose_x.length;i++){
        let numX = Number(choose_x[i])
        if (numX <= 0 && numX >= -numR && numY >= 0 && numY <= numR / 2) {
            result = true;
        } else if(numX >= 0 && numY >= 0 && (2 * numY + numX) <= numR){
            result=true;
        } else if(numX >= 0 && numY <= 0 && (numX * numX + numY * numY) <= numR * numR){
            result = true;
        } else{
            result=false;
        }
        newPoint = {
            x: choose_x[i],
            y: y,
            r: choose_r,
            result: result,
            timestamp: Date.now()
        };
        
        if(!cash[choose_r]){
            cash[choose_r] = []
        }
        cash[choose_r].push(newPoint);


        
        let now = new Date(newPoint.timestamp);
        let russianDate = dateFormatter.format(now);
        let russianTime = timeFormatter.format(now);



        let tableBody = document.getElementById("table_body");
        tableBody.innerHTML += `<tr>
            <td>${choose_x[i]}</td>
            <td>${y}</td>
            <td>${choose_r}</td>
            <td>${result}</td>
            <td>${russianDate}</td>
            <td>${russianTime}</td>
        </tr>`;

    }
    saveTable(cash)
    drawGraph();
    return false;
}

let r = document.getElementsByName("R");
    for(let i=0; i < r.length; i++){
            r[i].addEventListener('click', function(){
                document.getElementById('dan_r').innerHTML = 'Введено значение R = ' + this.value;
                document.getElementById('znach').value = this.value
                drawGraph();
                document.getElementById('table_body').innerHTML='';
                loadTable();
            });
    }



function saveTable(point){
    let string = JSON.stringify(point);
    localStorage.setItem('points_r', string);
}
function loadTable(){
    let str = localStorage.getItem('points_r');
    if (str!==null){
        let obj = JSON.parse(str);
        let R = document.getElementById("znach").value;
        let tabl = document.getElementById('table_body');
        if (R===""){
            for(let i in obj){
                let mas_all = obj[i];
                for(let j = 0; j<mas_all.length; j++){
                    let point = mas_all[j];
                    let dateObj = new Date(point.timestamp);
                    let viewDate = dateObj.toLocaleDateString('ru-RU');
                    let viewTime = dateObj.toLocaleTimeString('ru-RU');
                    tabl.innerHTML += `<tr>
                        <td>${point.x}</td>
                        <td>${point.y}</td>
                        <td>${point.r}</td>
                        <td>${point.result}</td>
                        <td>${viewDate}</td>
                        <td>${viewTime}</td>
                    </tr>`;
                }
            }
        } else{
            let mas_r = obj[R] || [];
            for(let i=0; i<mas_r.length; i++){
                let point = mas_r[i];
                let dateObj = new Date(point.timestamp);
                let viewDate = dateObj.toLocaleDateString('ru-RU');
                let viewTime = dateObj.toLocaleTimeString('ru-RU');
                tabl.innerHTML += `<tr>
                    <td>${point.x}</td>
                    <td>${point.y}</td>
                    <td>${point.r}</td>
                    <td>${point.result}</td>
                    <td>${viewDate}</td>
                    <td>${viewTime}</td>
                </tr>`;
            }
        }

    } 
}

loadTable()

document.getElementById('reset_table').addEventListener('click',function(){
    localStorage.clear();
    document.getElementById('table_body').innerHTML='';
    document.getElementById("dan_r").innerHTML = "";
    document.getElementById("znach").value = "";
    drawGraph();
})

function drawGraph() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    let rVal = Number(document.getElementById('znach').value) || null;
    let rText = '';
    let rHalfText = '';
    let currentScale = SCALE;

    if (rVal !== null && rVal !== 0) {
        rText = rVal;         
        rHalfText = rVal / 2; 
        currentScale = SCALE * (rVal / 5);
    } else {
        rText = "R";         
        rHalfText = "R/2";
        currentScale = SCALE;
    }

    ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
    
    ctx.fillRect(CENTER, CENTER, -currentScale, -currentScale / 2);
    
    ctx.beginPath();
    ctx.moveTo(CENTER, CENTER);
    ctx.lineTo(CENTER + currentScale, CENTER);
    ctx.lineTo(CENTER, CENTER - currentScale / 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(CENTER, CENTER);
    ctx.arc(CENTER, CENTER, currentScale, 0, Math.PI / 2, false);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillStyle = "black";
    
    ctx.beginPath(); ctx.moveTo(10, CENTER); ctx.lineTo(WIDTH - 10, CENTER); ctx.stroke(); 
    ctx.beginPath(); ctx.moveTo(CENTER, HEIGHT - 10); ctx.lineTo(CENTER, 10); ctx.stroke(); 

    ctx.beginPath();
    ctx.moveTo(WIDTH - 10, CENTER);
    ctx.lineTo(WIDTH - 18, CENTER - 5);
    ctx.lineTo(WIDTH - 18, CENTER + 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(CENTER, 10);
    ctx.lineTo(CENTER - 5, 18);
    ctx.lineTo(CENTER + 5, 18);
    ctx.fill();

    ctx.lineWidth = 1;

    ctx.beginPath(); ctx.moveTo(CENTER + currentScale, CENTER - 4); ctx.lineTo(CENTER + currentScale, CENTER + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CENTER + currentScale/2, CENTER - 4); ctx.lineTo(CENTER + currentScale/2, CENTER + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CENTER - currentScale/2, CENTER - 4); ctx.lineTo(CENTER - currentScale/2, CENTER + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CENTER - currentScale, CENTER - 4); ctx.lineTo(CENTER - currentScale, CENTER + 4); ctx.stroke();

    ctx.beginPath(); ctx.moveTo(CENTER - 4, CENTER - currentScale); ctx.lineTo(CENTER + 4, CENTER - currentScale); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CENTER - 4, CENTER - currentScale/2); ctx.lineTo(CENTER + 4, CENTER - currentScale/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CENTER - 4, CENTER + currentScale/2); ctx.lineTo(CENTER + 4, CENTER + currentScale/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CENTER - 4, CENTER + currentScale); ctx.lineTo(CENTER + 4, CENTER + currentScale); ctx.stroke();

    ctx.font = "12px sans-serif";
    ctx.fillText(rText, CENTER + currentScale - 10, CENTER + 15);
    ctx.fillText(rHalfText, CENTER + currentScale/2 - 10, CENTER + 15);
    ctx.fillText("-" + rHalfText, CENTER - currentScale/2 - 15, CENTER + 15);
    ctx.fillText("-" + rText, CENTER - currentScale - 15, CENTER + 15);
    
    ctx.fillText(rText, CENTER + 10, CENTER - currentScale + 5);
    ctx.fillText(rHalfText, CENTER + 10, CENTER - currentScale/2 + 5);
    ctx.fillText("-" + rHalfText, CENTER + 10, CENTER + currentScale/2 + 5);
    ctx.fillText("-" + rText, CENTER + 10, CENTER + currentScale + 5);
    
    ctx.fillText("X", WIDTH - 15, CENTER - 10);
    ctx.fillText("Y", CENTER + 10, 15);

    if (rVal) {
        let str = localStorage.getItem('points_r');
        if (str !== null) {
            let arr = JSON.parse(str);
            let R = document.getElementById("znach").value;
            let mas_r = arr[R] || [];
            for(let i=0; i<mas_r.length; i++){
                let p = mas_r[i];

                let cx = CENTER + (Number(p.x) / Number(rVal)) * currentScale;
                let cy = CENTER - (Number(p.y) / Number(rVal)) * currentScale;

                ctx.beginPath();
                ctx.arc(cx, cy, 5, 0, Math.PI * 2);
                if (p.result === true) {
                    ctx.fillStyle = "green";
                } else {
                    ctx.fillStyle = "red";
                }
                ctx.fill();
                ctx.strokeStyle = "white";
                ctx.stroke();
            }
        }
    }
}

drawGraph();

