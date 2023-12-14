/*
    1. Створюємо в html select#jokesCategories і ul#jokesList.

    2. Робимо запит на https://api.chucknorris.io/jokes/categories.
       З отриманого масиву виводимо кожну категорію у вигляді option в select#jokesCategories.

    3. При виборі нової категорії у select#jokesCategories:
        a. Робимо запит на https://api.chucknorris.io/jokes/random?category={category},
           де {category} – назва вибраної категорії в select#jokesCategories.

        b. Отримавши об'єкт з жартом – рендеримо його в ul#jokesList у вигляді:
            <li>
                <p>Category: <b>НАЗВА КАТЕГОРІЇ</b></p>
                <p>VALUE ЖАРТУ</p>
                <button>Remove joke</button>
            </li>
            a. Після успішного отримання жарту і рендеру його на сторінці, в select#jokesCategories для option
               з назвою обраної категорії змінюємо значення атрибуту disabled=true.
               Тобто, робимо неактивною категорію, яку вже обрали.

            b. При натисканні на кнопку Remove joke:
                i. Видаляємо li з жартом з ul#jokesList
                ii. Змінюємо значення атрибуту disabled на false для option з назвою категорії жарту.
                    Тобто, робимо активною категорію, жарт якої видалили.

    4. Зберігати в localStorage нічого не потрібно.

    5. Зовнішній вигляд завдання – неважливий.
*/

const refs = {
    jokesCategories: document.querySelector('#jokesCategories'),
    jokesList: document.querySelector('#jokesList')
}

// 2
function getFile(categories) {
    return fetch(categories)
        .then(
            function (data) {
                return data.ok ? data.json() : Promise.reject(data.statusText);
            }
        )
}

getFile('https://api.chucknorris.io/jokes/categories')
    .then(
        function (data) {
            data.forEach(function (item) {
                let option = document.createElement('option');
                refs.jokesCategories.append(option);
                option.textContent = item;
                option.value = item;
            });
        }
    )
    .catch(
        function (err) {
            console.log('Error', err);
        }
    )

// 3
refs.jokesCategories.addEventListener('change', function () {
    let linkCategory = refs.jokesCategories.value;

    function getCategory(category) {
        return fetch(category)
            .then(
                function (data) {
                    return data.ok ? data.json() : Promise.reject(data.statusText);
                }
            )
    }
    // 3.a
    getCategory(`https://api.chucknorris.io/jokes/random?category=${linkCategory}`)
        .then(
            function (data) {
                refs.jokesList.style.paddingLeft = '0px';

                // 3.b
                let liElem = document.createElement('li');
                refs.jokesList.append(liElem);
                liElem.style.listStyleType = 'none';

                let pCatElem = document.createElement('p');
                liElem.append(pCatElem);
                pCatElem.textContent = 'Category: ';

                let bElem = document.createElement('b');
                pCatElem.append(bElem);
                bElem.textContent = `${data.categories}`;

                let pValElem = document.createElement('p');
                liElem.append(pValElem);
                pValElem.textContent = `${data.value}`;

                let btnElem = document.createElement('button');
                liElem.append(btnElem);
                btnElem.textContent = 'Remove joke';

                // 3.b.a
                document.querySelector(`option[value="${linkCategory}"]`).disabled = true;

                // 3.b.b
                btnElem.addEventListener('click', function () {
                    // 3.b.b.i
                    liElem.remove();
                    // 3.b.b.ii
                    document.querySelector(`option[value="${linkCategory}"]`).disabled = false;
                });
            }
        )
        .catch(
            function (err) {
                console.log('Error', err);
            }
        )
});