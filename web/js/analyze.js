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
        }
    });
}

function filterData () {
    var data = [];
    var value = $('.analyze__filter-input').val() ? $('.analyze__filter-input').val().toLowerCase() : '';
    data = window.data.filter(function (t) {
        return t.company.toLowerCase().indexOf(value) > -1 || t.address.toLowerCase().indexOf(value) > -1 || t.registered.toLowerCase().indexOf(value) > -1
    });
    console.log(data);
    renderTable(data, 'dynamics');
}