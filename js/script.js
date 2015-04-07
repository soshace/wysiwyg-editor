$(function () {
    var $linkInput = $('<input>', {type: 'text'}),
        $customStyle = $('<div>', {'class': 'editor__custom-style'}),
        $colorInput = $('<div>', {"class": 'colorInput'}),
        $colorInputBg = $('<div>', {"class": 'colorInputBg'});

    tinymce.init({
        plugins: [
            "simple_link", "fontfamily", "fontsize", "simplecontrols", "custom_style", "my_color", "my_color_bg"
        ],
        selector: ".js-editor",
        menubar: false,
        statusbar: false,
        skin: 'recorder',
        linkInput: $linkInput,
        customStyle: $customStyle,
        colorInput: $colorInput,
        colorInputBg: $colorInputBg,
        editorStyles: {
            fontFamily: null,
            fontSize: null,
            bold: false,
            italic: false,
            underline: false,
            backgroundColor: null,
            color: null
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
                    backgroundColor: 'rgba(108, 253, 109, 1)',
                    color: 'rgba(101, 52, 101, 1)'
                }
            },
            {
                title: 'Header3',
                isDefault: true,
                values: {
                    fontFamily: 'Arial',
                    fontSize: '36px',
                    bold: true,
                    color: 'rgba(100, 55, 151, 1)',
                    backgroundColor: 'rgba(108, 253, 109, 0.4)'
                }
            }
        ],
        toolbar: "fontfamily fontsize | bold italic underline",
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
        $toolbar.append($colorInputBg);
        $toolbar.append($linkInput);
        $toolbar.append($customStyle);
    }

    function editorFocusHandler() {
        var $toolbar = $('.mce-toolbar-grp');

        $toolbar.show();
    }
});