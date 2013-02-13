// Генерация игрового массива
function createArray(max_width, max_height, min_value, max_value) {
    var arr = [];
    for (var x = 0; x < max_width; x++) {
        arr.push([]);
        for (var y = 0; y < max_height; y++) {
            arr[x].push(Math.floor(min_value + Math.random()*(max_value-min_value+1)));
        }
    }
    return arr;
}

// Отображение игрового поля в табличном виде (может потребоваться для отладки
function renderTable(arr) {
    var html = '<table border="1">';
    for (var y = 0; y < arr.length; y++) {
        html += '<tr>';
        for (var x = 0; x < arr[y].length; x++) {
            html += '<td>' + arr[y][x] + '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

// Отображение игрового поля в красивом виде
function render(gf, colors, brickform, sizeX, sizeY) {
    var divfield = '';
    for (var i=0; i < gf.length; i++) {
        for (var j=0; j < gf[i].length; j++) {
            var remove_class = '';
            if (gf[i][j] < 0) {
                remove_class = ' remove';
            }
            divfield += '<div data-x="'+j+'" data-y="'+i+'" style="left:'+(j*sizeX)+'px;top:'+(i*sizeY)+'px;" class="gamebrick '+brickform+' '+brickform+'-' + colors[Math.abs(gf[i][j])] + remove_class + '"></div>';
        }
    }
    return divfield;
}

// Падение блоков сверху вниз, если в столбце есть пустые (равные нулю) блоки и слева направо, если столбец слева целиком пустой (только нули)
function falling(arr) {
    // Переменная, которая показывает номер самого левого столбца с нулями
    var leftColumn = 0;
    // Перебираем все столбцы слева направо
    for(var x = 0; x < arr.length; x++) {
        // Записываем номер самой нижней строки
        var topRow = arr[0].length - 1;
        // Перебираем все строки снизу вверх
        for(var y = arr[0].length-1; y >= 0; y--) {
            // Если элемент со строкой Y и столбцом X не равен 0, то
            if(arr[y][x] !== 0) {
                // Если строка поиска (topRow) находится ниже (ее индекс больше) строки Y
                if(topRow > y) {
                    // Ставим на строку topRow найденное ненулевое значение
                    arr[topRow][leftColumn] = arr[y][x];
                    // А выше ставим ноль
                    arr[y][x] = 0;
                } else if (leftColumn != x) {
                    arr[y][leftColumn] = arr[y][x];
                    arr[y][x] = 0;
                }
                // Поднимаем строку поиска нулей на одну позицию выше
                topRow--;
            }
        }
        // Если самая нижняя строка столбца leftColumn равна нулю, то мы должны записать следующую строку в него
        if(arr[arr[0].length-1][leftColumn] !== 0) {
            // Иначе переходим к следующему столбцу
            leftColumn++;
        }
    }
    return arr;
}

// удаление с игрового поля блоков одинакового цвета
function deleteFromGF(gf, x,y, col, currcount) {
    y = parseInt(y);
    x = parseInt(x);
    var testX, testY;
    gf[y][x] = -col;
    currcount += 1;
    var yArr, xArr;
    if ((y > 0)&&(y<gf.length)) {
        yArr = [y-1, y, y+1];
    }
    if (y == 0) {
        yArr = [y, y+1];
    }
    if (y == gf.length-1) {
        yArr = [y-1, y];
    }

    if ((x > 0)&&(x<gf[0].length)) {
        xArr = [x-1, x, x+1];
    }
    if (x == 0) {
        xArr = [x, x+1];
    }
    if (x == gf.length-1) {
        xArr = [x-1, x];
    }

    var xx, yy;
    for (testY in yArr) {
        for (testX in xArr) {
            xx = xArr[testX];
            yy = yArr[testY];
            if ((xx === x)||(yy === y)) {
                if (col === gf[yy][xx]) {
                    var arr = deleteFromGF(gf,xx,yy, col, currcount);
                    gf = arr['gf'];
                    currcount += arr['currcount'];
                }
            }

        }
    }
    if (currcount == 1) {
        gf[y][x] = col;
        currcount = 0;
    }
    return {'gf':gf, 'currcount':currcount};
}