var postURL = 'http://jsonplaceholder.typicode.com/posts';
var userURL = 'http://jsonplaceholder.typicode.com/users';
var commentURL = 'http://jsonplaceholder.typicode.com/comments';

//Функця для получения данных отправленного запроса 
function loadFile(method, url, func) {
    //    var args = Array.prototype.slice.call(arguments, 3);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                func(xhr.response);
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.open(method, url, true);
    xhr.send();
    xhr.responseType = 'json';
}


//Главная функция
function myFunction() {
    loadFile("GET", postURL, showPost);
    loadFile("GET", userURL, showUser);
    loadFile("GET", commentURL, showComment);
}



//Отображает все полученные посты
function showPost(jsonObj) {
    var posts = jsonObj;
    for (var i = 0; i < posts.length; i++) {
        addPost(posts[i]);
    }
}

//Генерирует карточку для полученного поста
function addPost(post) {
    //Кнопка "закрыть пост"
    var btnClose = document.createElement('button');
    btnClose.setAttribute('class', 'btn-close btn-close-white btn-sm');
    btnClose.setAttribute('type', 'button');
    btnClose.setAttribute('aria-label', 'Close');
    btnClose.setAttribute('onclick', 'delPost("' + post['id'] + '")');

    //Кнопка для сортировки комментариев
    var a = document.createElement('button');
    a.setAttribute('class', 'btn-sm col-12');
    a.setAttribute('onclick', 'sortComments("' + post['id'] + '")');

    var card = document.createElement('div');
    card.setAttribute("class", "card m-1 mb-4");

    //Заголовок карточки поста
    var header = document.createElement('div');
    header.setAttribute('class', 'card-header bg-dark text-white d-flex justify-content-between');

    //Отображает автора поста
    var head = document.createElement('h6');
    head.setAttribute('class', 'm-0');

    var body = document.createElement('div');
    body.setAttribute('class', 'card-body')

    //Заголовок поста
    var card_title = document.createElement('h4');
    card_title.setAttribute('class', 'card-title');

    //Тело поста
    var card_text = document.createElement('p');
    card_title.setAttribute('class', 'card-text');

    //Кнопка для отображение комментариев
    var btn = document.createElement('button');
    btn.setAttribute('class', 'btn btn-light btn-sm col-12');
    btn.setAttribute('onclick', 'btnShowComment(' + post['id'] + ')');

    var card_footer = document.createElement('div');
    card_footer.setAttribute('class', 'card-footer bg-light p-0 visually-hidden');

    //Узел для хранения списка комментариев
    var ol = document.createElement('ol');
    ol.setAttribute('class', 'list-group list-group-flush ms-2 me-2');

    head.textContent = post['userId'];
    card_title.textContent = post['title'];
    card_text.textContent = post['body'];
    card.setAttribute('id', post['id']);
    btn.textContent = 'show comments';
    a.textContent = "old"

    card.appendChild(header);
    header.appendChild(head);
    header.appendChild(btnClose);
    card.appendChild(body);
    body.appendChild(card_title);
    body.appendChild(card_text);
    card.appendChild(btn);
    card.appendChild(card_footer);
    card_footer.appendChild(a);
    card_footer.appendChild(ol);

    document.getElementById('post').appendChild(card);
}

//Отображение пользователей на экране
function showUser(jsonObj) {
    var user = jsonObj;
    //Заполнение списка пользователей для сортировки
    var listUser = document.getElementById('user');
    listUser.appendChild(document.createElement('option'));
    listUser.firstChild.textContent = "all";
    listUser.children[0].setAttribute('onclick', 'selectUser("all")')

    for (var i = 0; i < user.length; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', user[i]['id']);
        option.textContent = user[i]['name'];
        option.setAttribute('onclick', "selectUser('" + user[i]['name'] + "')");
        listUser.appendChild(option);
    }

    //Для отображения имени автора поста
    var post = document.getElementById("post");

    for (var i = 0; i < post.childElementCount; i++) {
        for (var j = 0; j < user.length; j++) {
            if (post.children[i].children[0].children[0].textContent == user[j]['id']) {
                post.children[i].children[0].children[0].textContent = user[j]['name'];
            }
        }
    }
}

//Отображает все комментариии к постам
function showComment(jsonObj) {
    var comment = jsonObj;
    var post = document.getElementById("post");

    for (var i = 0; i < post.childElementCount; i++) {
        for (var j = 0; j < comment.length; j++) {
            if (post.children[i].getAttribute('id') == comment[j]['postId']) {
                addComment(comment[j], post.children[i].children[3].children[1]);
            }
        }
    }
}

//Генерирует карточку для комментария
function addComment(comment, node) {

    var li = document.createElement('li');
    li.setAttribute('class', "list-group-item d-flex justify-content-between align-items-start pt-1 pb-1 ");

    var div = document.createElement('div');
    div.setAttribute('class', "ms-1 me-auto");

    var ph = document.createElement('p');
    ph.setAttribute('class', "text-dark m-0 fs-6 fst-italic fw-bold");

    var hb = document.createElement('h6');
    hb.setAttribute('class', "m-0 ms-4");

    var span = document.createElement('h6');
    span.setAttribute('class', "badge bg-secondary rounded-pill");

    li.setAttribute('id', comment['id'] + '_comment');
    ph.textContent = comment['name'];
    hb.textContent = comment['body'];
    span.textContent = comment['email'];


    li.appendChild(div);
    div.appendChild(ph);
    div.appendChild(hb);
    li.appendChild(span);
    node.appendChild(li);
}

//Функция для сортировки комментариев под постом (По новизне комментариев)
function sortComments(postId) {
    var btn = document.getElementById(postId).children[3].children[0];
    var comments = document.getElementById(postId).getElementsByTagName('ol')[0];


    if (btn.textContent == 'old') {
        btn.textContent = 'new';
        for (var i = 0; i < comments.childElementCount - 1; i++) {
            for (var j = comments.childElementCount - 1; j > i; j--) {
                var id_1 = comments.children[j - 1].getAttribute('id').split('_')[0];
                var id_2 = comments.children[j].getAttribute('id').split('_')[0];

                if (id_2 > id_1) {
                    var tmp_com = comments.children[j];
                    comments.replaceChild(comments.children[j - 1], comments.children[j]);
                    comments.insertBefore(tmp_com, comments.children[j - 1]);

                }

            }
        }
    } else {
        btn.textContent = 'old';
        for (var i = 0; i < comments.childElementCount - 1; i++) {
            for (var j = comments.childElementCount - 1; j > i; j--) {
                var id_1 = comments.children[j - 1].getAttribute('id').split('_')[0];
                var id_2 = comments.children[j].getAttribute('id').split('_')[0];

                if (id_2 < id_1) {
                    var tmp_com = comments.children[j];
                    comments.replaceChild(comments.children[j - 1], comments.children[j]);
                    comments.insertBefore(tmp_com, comments.children[j - 1]);

                }
            }
        }
    }
}

//Фильтрация постов для выбранного пользователя
function selectUser(user) {
    var post = document.getElementById("post");
    for (var i = 0; i < post.childElementCount; i++) {
        var head = post.children[i].children[0];
        post.children[i].removeAttribute('hidden');
        if (user == "all") {
            continue;
        }
        if (head.textContent != user) {
            post.children[i].setAttribute("hidden", 'true');
        }
    }
}




//Обработчик события для кнопки "Show Post" 
document.getElementById('addPosts').onclick = function () {
    document.getElementById('post').textContent = '';
    document.getElementById('user').textContent = '';
    myFunction();
}


//Обработчик события для кнопки "Close Post"
function delPost(postId) {
    var elem = document.getElementById(postId);
    document.getElementById('post').removeChild(elem);
}


//Обработчик события для кнопки "show comments" 
function btnShowComment(data) {
    var btn = document.getElementById(data.toString()).children[2];
    if (btn.textContent == 'show comments') {
        btn.textContent = 'hide comments';
        document.getElementById(data).children[3].setAttribute('class', 'card-footer bg-light p-0')
    } else {
        btn.textContent = 'show comments';
        document.getElementById(data).children[3].setAttribute('class', 'card-footer bg-light p-0 visually-hidden')
    }

}
