## KeymanWeb для русской мнемонической клавиатуры

&nbsp;&nbsp;&nbsp;&nbsp;Это пример страницы для демонстрации русской мнемонической раскладки клавиатуры. Эта веб-страница опубликована на сайте [https://dotland.github.io/keymanweb-demo-ru/](https://dotland.github.io/keymanweb-demo-ru/).

&nbsp;&nbsp;&nbsp;&nbsp;[KeymanWeb](https://keymanweb.com/) — это система методов ввода с открытым исходным кодом для Веб, поддерживающая как настольные компьютеры, так и сенсорные устройства. [KeymanWeb](https://keyman.com/developer/keymanweb/) можно добавить на ваш веб-сайт всего несколькими строками кода. 

Предварительные файлы KeymanWeb:

```js
<script src="https://s.keyman.com/kmw/engine/14.0.293/keymanweb.js"></script>
<script src="https://s.keyman.com/kmw/engine/14.0.293/kmwuitoggle.js"></script>
```

Включите пользовательскую клавиатуру со следующим фрагментом кода:

```js
keyman.addKeyboards({
    id: 'basic_kbdrum',
    name: 'Russian Mnemonic',
    languages: { 
        id: 'ru', 
        name: 'Russian', 
        region: 'Asia' 
    }, 
    filename: 'https://github.com/dotland/mnemonic-kb-ru/releases/latest/download/rum.js'
});
```

Файл клавиатуры .js можно создать с помощью [Keyman Developer](https://keyman.com/developer/).

### Ссылки

<a id="1">&nbsp;&nbsp;1.&nbsp;</a>
[Русская мнемоническая раскладка клавиатуры.](https://github.com/dotland/mnemonic-kb-ru/blob/main/README.md) <br />
