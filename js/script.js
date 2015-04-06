$(function () {
    var $linkInput = $('<input>', {type: 'text'}),
        $customStyle = $('<div>', {'class': 'editor__custom-style'}),
        $colorInput = $('<div>', {"class": 'colorInput'});

    tinymce.init({
        plugins: [
            "simple_link", "fontfamily", "fontsize", "simplecontrols", "custom_style", "my_color"
        ],
        selector: ".js-editor",
        menubar: false,
        statusbar: false,
        skin: 'recorder',
        linkInput: $linkInput,
        customStyle: $customStyle,
        colorInput: $colorInput,
        editorStyles: {
            fontFamily: 'Helvetica',
            fontSize: '14px',
            bold: false,
            italic: false,
            underline: false,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            color: 'rgb(0, 0, 0)'
        },
        defaultStyles: [
            {
                title: 'Header1',
                isDefault: true,
                values: {
                    fontFamily: 'Arial',
                    fontSize: '12px',
                    bold: true,
                    italic: true,
                    backgroundColor: 'rgba(255, 255, 255, 1)'
                }
            },
            {
                title: 'Header2',
                isDefault: true,
                values: {
                    fontFamily: 'Arial',
                    fontSize: '12px',
                    bold: true,
                    italic: true,
                    backgroundColor: 'blue',
                    color: 'red'
                }
            },
            {
                title: 'Header3',
                isDefault: true,
                values: {
                    fontFamily: 'Arial',
                    fontSize: '36px',
                    bold: true,
                    color: 'rgba(255, 233, 233, 0.2)',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)'
                }
            }
        ],
        toolbar: "fontfamily fontsize | bold italic underline | simpleLink",
        setup: tinyMceSetupHandler
    });


    function tinyMceSetupHandler(editor) {
        editor.on('load', setEditorView);
        editor.on('focus', editorFocusHandler);
    }

    function setEditorView() {
        var $toolbar = $('.mce-toolbar-grp'),
            $header = $('<div>', {class: 'mce-toolbar-header'});

        $header.append($('<h1>', {text: 'Word Editor'}));
        $header.append($('<a>', {text: 'X', title: 'Close', href: '#'}));
        $toolbar.prepend($header);
        $toolbar.append($colorInput);
        $toolbar.append($linkInput);
        $toolbar.append($customStyle);
    }

    function editorFocusHandler() {
        var $toolbar = $('.mce-toolbar-grp');

        $toolbar.show();
    }
});