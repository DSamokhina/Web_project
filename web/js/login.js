$('[data-click="login"]').bind('click', function () {
    var login = $('[data-name="login"]').val();
    var password = $('[data-name="password"]').val();

    if (login.toUpperCase() === 'TEST' && password === '111') {
        alert('Здравствуйте, ' + login + "!");
    }
    else{
        alert('Проверьте правильность ввода логина и пароля. Вход не выполнен');
    }
});