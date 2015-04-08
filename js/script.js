$(function () {
    var $linkInput = $('.editor__link-input'),
        $customStyle = $('.editor__custom-style'),
        $colorInput = $('.colorInput'),
        $fontFamily = $('.editor__font-family'),
        $fontSize = $('.editor__font-size'),
        $fontBold = $('.editor__font-bold'),
        $fontItalic = $('.editor__font-italic'),
        $fontUnderline = $('.editor__font-underline'),
        $colorInputBg = $('.colorInputBg');

    tinymce.init({
        plugins: [
            "simple_link", "fontfamily", "fontsize", "simple_bold", "simple_italic", "simple_underline", "custom_style", "my_color", "my_color_bg"
        ],
        selector: ".js-editor",
        menubar: false,
        statusbar: false,
        skin: 'recorder',
        linkInput: $linkInput,
        customStyle: $customStyle,
        colorInput: $colorInput,
        colorInputBg: $colorInputBg,
        fontFamily: $fontFamily,
        fontSize: $fontSize,
        fontBold: $fontBold,
        fontItalic: $fontItalic,
        fontUnderline: $fontUnderline,
        fontFamilyDefault: 'Helvetica',
        fontFormats: [
            'Serif',
            'Arial',
            'Courier',
            'Courier New',
            'Comic Sans MS',
            'Helvetica',
            'Impact',
            'Lucida Grande',
            'Lucida Sans',
            'Tahoma',
            'Times',
            'Times New Roman',
            'Verdana'
        ],
        fontSizeDefault: '14',
        fontSizes: [
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31',
            '32',
            '33',
            '34',
            '35',
            '36'
        ],
        editorStyles: {
            fontFamily: null,
            fontSize: null,
            bold: false,
            italic: false,
            underline: false,
            backgroundColor: null,
            color: null
        },
        defaultStyle: 'Normal',
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
                title: 'Header312341234123412341234123',
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
        toolbar: false,
        setup: tinyMceSetupHandler
    });


    function tinyMceSetupHandler(editor) {
        editor.on('load', function () {
            setEditorView(editor);
        });
        editor.on('focus', editorFocusHandler);
    }

    function setEditorView(editor) {
        setDropDowns(editor);
    }

    function editorFocusHandler() {
        var $toolbar = $('.js-editor-toolbar');

        $toolbar.show();
    }

    function setDropDowns(editor) {
        var $document = $(document),
            $allDropDownLists = $('.dropdown-list');

        $document.on('click', '.dropdown-title', function () {
            var $this = $(this),
                $thisDropDownMenu = $this.parent(),
                $allDropDownLists = $('.dropdown-list'),
                $dropDownList = $('.dropdown-list', $thisDropDownMenu),
                isHide = $dropDownList.hasClass('hide');

            $allDropDownLists.addClass('hide');

            if (isHide) {
                $dropDownList.removeClass('hide');

                $document.on('click.dropDownClick', function (event) {
                    var $target = $(event.target);

                    if ($target.parents('.dropdown-list').length) {
                        return;
                    }

                    $dropDownList.addClass('hide');
                    $document.off('click.dropDownClick');
                });
            } else {
                $dropDownList.addClass('hide');
                $document.off('click.dropDownClick');
            }
        });

        editor.on('click', function () {
            $allDropDownLists.addClass('hide');
        });
    }
});