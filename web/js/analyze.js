//http://beta.json-generator.com/4kZ1_2Zj-

window.data = [];

$(function () {
    getData();
    $('.analyze__filter-button').bind('click', filterData)

});

function renderTable (data, name) {
    var $table = $('[data-table=' + name +'] tbody');
    $table.html('');
    data = data.sort(function (a,b) {
       return (new Date(a.registered)).getTime() - (new Date (b.registered)).getTime()
    });
    data.forEach(function (t) {
        $table.append($('<tr><td>' + t.index + '</td><td><div class="analyze__isspending m-' + t.isSpending +'"></div></td><td>' + t.sum + '</td><td>' + t.company + '</td><td>' + t.registered + '</td><td>' + t.address + '</td></tr>'))
    })
}

function getData () {
    $.ajax({
        url: './data/transactions.json',
        dataType: 'JSON',
        success: function (result) {
            window.data = result;
            renderTable(data, 'dynamics');
            renderGraph(data);
        }
    });
}

function filterData () {
    var data = [];
    var value = $('.analyze__filter-input').val() ? $('.analyze__filter-input').val().toLowerCase() : '';
    data = window.data.filter(function (t) {
        return t.company.toLowerCase().indexOf(value) > -1 || t.address.toLowerCase().indexOf(value) > -1 || t.registered.toLowerCase().indexOf(value) > -1
    });
    renderTable(data, 'dynamics');
    renderGraph(data);
}

function renderGraph (data) {
    var $graph = $('svg.analyze__svg'),
        options = JSON.parse($('[data-svg="options"]').html()),
        positionsX = JSON.parse($('[data-svg="positionsX"]').html()),
        positionsY = JSON.parse($('[data-svg="positionsY"]').html());

    // очищаем прошлые данные
    $graph.find('.tmp').remove();


    // массив для транзакций по дням
    var sortedTransactions = [];
    for (var i = 0; i < 31; i++) {
        sortedTransactions.push({
            negative: [],
            positive: []
        });
    }
    data.forEach(function (t) {
        var day = new Date(t.registered).getDate() - 1;
        t.isSpending ? sortedTransactions[day].negative.push(t.sum) : sortedTransactions[day].positive.push(t.sum);
    });

    //макс и мин в рамках дня для простановки делений
    var max = 0, min = 0;
    sortedTransactions.forEach(function (day) {
        var nmax = 0, nmin = 0; //сумм отррицательных и положительных в рамках дня
        nmin = day.positive.length ? day.positive.reduce(function (a, b) { return a + b}) : 0;
        nmax = day.negative.length ? day.negative.reduce(function (a, b) { return a + b}) : 0;
        if (max < nmax) {
            max = nmax;
        }
        if (min < nmin) {
            min = nmin;
        }
    });

    //подписи для вертикальных делений
    var labels = [max, max * 3 / 4, max / 2, max / 4, 0, min/4, min/2, min * 3 / 4, min];
    labels.forEach(function (l, i) {
        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        $(newElement).attr({
            x: 0,
            y: positionsY[i],
            transform: "rotate(-45, " + options.o + ", " + positionsY[i] + ") translate(5, -10)",
            style: "font-size: 10;stroke: #5e5e5e;"
        })
            .addClass('tmp')
            .text(Math.ceil(l / 100) * 100).appendTo($graph);
    });

    //рисуем прямоугольники графиков
    sortedTransactions.forEach(function (t, i) {
        var lineY = Math.floor((options.h / 2)),
            posX = Math.floor(positionsX[i]),
            posX1 = posX - 10,
            posX2 = posX + 10,
            beginY = lineY;

        t.negative.forEach(function (p) {
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
            var newY = Math.floor(beginY - (p / max) * (beginY-20)); //max - 100, t - x
            $(newElement).attr({
                points: posX1 + ',' + beginY + ' ' +
                        posX2 + ',' + beginY + ' ' +
                        posX2 + ',' + newY + ' ' +
                        posX1 + ',' + newY
                ,
                style: "fill:green;stroke:purple;;stroke-width:1;"
            })
                .addClass('tmp').appendTo($graph);
            beginY = newY;
        });

        beginY = lineY;

        t.positive.forEach(function (p) {
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
            var newY = Math.floor(beginY + (p / min) * (beginY-20)); //max - 100, t - x
            $(newElement).attr({
                points: posX1 + ',' + beginY + ' ' +
                posX2 + ',' + beginY + ' ' +
                posX2 + ',' + newY + ' ' +
                posX1 + ',' + newY
                ,
                style: "fill:red;stroke:purple;;stroke-width:1;"
            })
                .addClass('tmp').appendTo($graph);
            beginY = newY;
            //<polygon points="100,10 40,198 190,78 10,78 160,198"
        });
    });




}
