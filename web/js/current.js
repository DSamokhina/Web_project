$(function () {

    $('.transactform__switch-button').bind('click', function () {
        $('.transactform__switch-button').toggleClass('m-active')
    });

    $.ajax({
        url: './data/accounts.json',
        dataType: 'JSON',
        success: function (data) {
            var sum = 0;
            data.forEach(function (account) {
                $('.current__table tbody').append($('<tr><td>' + account.id + '</td><td>' + account.name + '</td><td>' + account.ammount + '</td><td>' + account.currency + '</td></tr>'))

                sum += account.ammount;
            });
            $('[data-sum=accounts]').text(sum);

            drawData(data, sum);
        }
    });
});

function drawData (data, sum) {
    //http://www.highcharts.com/demo/pie-legend
   $('.current__diagramm').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Состояние счетов'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Процент',
            colorByPoint: true,
            data: data.map(function (account) {
                return {
                    name:account.name,
                    y: (account.ammount / sum) * 100,
                    sliced: true,
                    selected: true
                }
            })
        }]
    });
}