$(function () {
    var $linkInput = $('.editor__link-input'),
        $customStyle = $('.editor__custom-style'),
        $colorInput = $('.colorInput'),
        $fontFamily = $('.editor__font-family'),
        $fontSize = $('.editor__font-size'),
        $fontBold = $('.editor__font-bold'),
        $fontItalic = $('.editor__font-italic'),
        $fontUnderline = $('.editor__font-underline'),
        $colorInputBg = $('.colorInputBg'),
        $closeDialog = $('.js-close-dialog'),
        $closeDialogCancel = $('.js-close-dialog-cancel'),
        $deleteDialog = $('.js-delete-dialog'),
        $closeToolbar = $('.js-close-toolbar');

    tinymce.init({
        plugins: [
            "simple_link", "fontfamily", "fontsize", "simple_bold", "simple_italic", "simple_underline", "custom_style", "my_color", "my_color_bg"
        ],
        selector: ".js-editor",
        menubar: false,
        statusbar: false,
        skin: 'recorder',
        deleteDialog: $deleteDialog,
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
        defaultStyles: [
            {
                title: 'Normal',
                isDefault: true,
                values: {}
            },
            {
                title: 'Title',
                isDefault: true,
                values: {
                    bold: true,
                    fontSize: '32px'
                }
            },
            {
                title: 'Title',
                isDefault: true,
                values: {
                    bold: true,
                    fontSize: '16px',
                    italic: true
                }
            },
            {
                title: 'Heading1',
                isDefault: true,
                values: {
                    fontSize: '24px',
                    bold: true
                }
            },
            {
                title: 'Heading2',
                isDefault: true,
                values: {
                    fontSize: '18px',
                    bold: true
                }
            },
            {
                title: 'Heading3',
                isDefault: true,
                values: {
                    fontSize: '16px',
                    bold: true
                }
            }
        ],
        toolbar: false,
        setup: tinyMceSetupHandler
    });


    function tinyMceSetupHandler(editor) {
        editor.on('load', function () {
            addListeners();
            setEditorView(editor);
        });
        editor.on('focus', editorFocusHandler);
    }

    function addListeners() {
        $closeToolbar.on('click', closeToolbarHandler);
        $closeDialogCancel.on('click', closeDialogCancelHandler)
    }

    function closeDialogCancelHandler() {
        $closeDialog.addClass('hide');
    }

    function closeToolbarHandler() {
        $closeDialog.toggleClass('hide');
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
            $document.off('click.dropDownClick');
        });
    }
});