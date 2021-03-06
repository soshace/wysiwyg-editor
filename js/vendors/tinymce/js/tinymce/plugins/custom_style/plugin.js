(function () {
    var CustomStyle = function (editor, $wrapper, editorStyles, styleName, styles, isDefault, isActive, setActiveCallback, $deleteDialog, deleteStyleCallback) {
        this.editor = editor;
        this.$wrapper = $wrapper;
        this.$deleteDialog = $deleteDialog;
        this.$el = null;
        this.$deleteButton = null;
        this.$editButton = null;
        this.$checkedSign = null;
        this.$editInput = null;
        this.$title = null;
        this.setActiveCallback = setActiveCallback;
        this.deleteStyleCallback = deleteStyleCallback;
        this.styleName = null;
        this.isDefault = false;
        this.styles = $.extend({}, editorStyles);
        this.setDefault(isDefault);
        this.setCurrentStyles(styles);
        this.createDomElement();
        this.setStyleName(styleName);
        this.addListeners();
        if (isActive) {
            this.setActive();
        }
    };

    CustomStyle.prototype.setDefault = function (isDefault) {
        this.isDefault = !!isDefault;
    };

    CustomStyle.prototype.isMatchStyles = function () {
        var styles = this.styles,
            bold = styles.bold,
            italic = styles.italic,
            underline = styles.underline,
            fontSize = styles.fontSize,
            color = styles.color,
            backgroundColor = styles.backgroundColor,
            fontFamily = styles.fontFamily;

        if (!this.isMatchValue('bold', bold)) {
            return false;
        }

        if (!this.isMatchValue('italic', italic)) {
            return false;
        }

        if (!this.isMatchValue('underline', underline)) {
            return false;
        }

        if (!this.isMatchValue('fontname', fontFamily)) {
            return false;
        }

        if (!this.isMatchValue('fontsize', fontSize)) {
            return false;
        }

        if (!this.isMatchValue('hilitecolor', backgroundColor)) {
            return false;
        }

        return this.isMatchValue('forecolor', color);
    };

    CustomStyle.prototype.isMatchValue = function (styleName, styleValue) {
        var editor = this.editor,
            simpleStyles = ['bold', 'italic', 'underline'];

        if (simpleStyles.indexOf(styleName) !== -1) {
            return editor.formatter.match(styleName) === styleValue;
        }

        if (styleValue) {
            if (styleName === 'forecolor' || styleName === 'hilitecolor') {
                styleValue = this.convertRgbaToRgb(styleValue);
            }

            return editor.formatter.match(styleName, {value: styleValue});
        }

        return !editor.formatter.match(styleName);
    };

    CustomStyle.prototype.convertRgbaToRgb = function (value) {
        var rgbaValues;


        if (/rgba\(\d+,\s?\d+,\s?\d+,\s?1\)/.test(value)) {
            rgbaValues = value.match(/rgba\((\d+),\s?(\d+),\s?(\d+),\s?1/);
            return 'rgb(' + rgbaValues[1] + ', ' + rgbaValues[2] + ', ' + rgbaValues[3] + ')';
        }

        return value;
    };

    CustomStyle.prototype.setActive = function () {
        this.$el.addClass('active');
        this.setActiveCallback(this.styleName);
    };

    CustomStyle.prototype.unsetActive = function () {
        this.$el.removeClass('active');
    };

    CustomStyle.prototype.setCurrentStyles = function (styles) {
        var thisStyles = this.styles;

        $.each(thisStyles, function (styleName) {
            var newStyle = styles[styleName];

            if (newStyle) {
                thisStyles[styleName] = newStyle;
            }
        });
    };

    CustomStyle.prototype.createDomElement = function () {
        var $el,
            $deleteButton,
            $editButton,
            $editInput,
            $checkedSign,
            $title,
            $wrapper = this.$wrapper;

        $el = this.$el = $('<li>');
        $title = this.$title = $('<span>', {class: 'editor__title'});
        $deleteButton = this.$deleteButton = $('<span>', {class: 'editor__delete-button icon-trash'});
        $editButton = this.$editButton = $('<span>', {class: 'editor__edit-button  icon-pencil'});
        $checkedSign = this.$checkedSign = $('<span>', {class: 'editor__checked-sign icon-check'});
        $editInput = this.$editInput = $('<input>', {class: 'editor__title-input hide'});
        $el.append($title, $deleteButton, $editButton, $checkedSign, $editInput);

        if (!this.isDefault) {
            this.$el.addClass('custom-style');
        }

        this.applyStylesToTitle();
        $wrapper.append($el);
    };

    CustomStyle.prototype.applyStylesToTitle = function () {
        var css = {},
            fontSize,
            styles = this.styles;

        $.each(styles, function (key, value) {
            if (value === null) {
                return;
            }

            if (value === false) {
                return;
            }

            if (key === 'fontFamily') {
                css['font-family'] = value;
                return;
            }

            if (key === 'fontSize') {
                fontSize = css['font-size'] = value;
                return;
            }

            if (key === 'bold') {
                css['font-weight'] = 'bold';
                return;
            }

            if (key === 'italic') {
                css['font-style'] = 'italic';
                return;
            }

            if (key === 'underline') {
                css['text-decoration'] = 'underline';
                return;
            }

            if (key === 'backgroundColor') {
                css['background-color'] = value;
                return;
            }

            if (key === 'color') {
                css['color'] = value;
            }
        });

        this.$title.css(css);
        this.$editInput.css(css);

        if (css['background-color']) {
            this.$el.css({'background': css['background-color']});
            this.$title.css({'background': 'none'});
            this.$editInput.css({'background': 'none'});
        }
    };

    CustomStyle.prototype.applyStylesToEditor = function () {
        var editor = this.editor,
            styles = this.styles;

        $.each(styles, function (key, value) {
            if (value === null) {
                return;
            }

            if (value === false) {
                return;
            }

            if (key === 'fontFamily') {
                editor.formatter.apply('fontname', {value: value});
                return;
            }

            if (key === 'fontSize') {
                editor.formatter.apply('fontsize', {value: value});
                return;
            }

            if (key === 'bold') {
                editor.formatter.apply('bold');
                return;
            }

            if (key === 'italic') {
                editor.formatter.apply('italic');
                return;
            }

            if (key === 'underline') {
                editor.formatter.apply('underline');
                return;
            }

            if (key === 'backgroundColor') {
                editor.formatter.apply('hilitecolor', {value: value});
                return;
            }

            if (key === 'color') {
                editor.formatter.apply('forecolor', {value: value});
            }
        });
    };

    CustomStyle.prototype.setStyleName = function (styleName) {
        this.styleName = styleName || 'Untitled';
        this.$title.html(this.styleName);
        this.$editInput.val(this.styleName);
    };

    CustomStyle.prototype.addListeners = function () {
        this.$deleteButton.on('click' + '.' + this.styleName, this.showDeleteDialog.bind(this));
        this.$editButton.on('click' + '.' + this.styleName, this.editStyleHandler.bind(this));
        this.$editInput.on('blur' + '.' + this.styleName, this.editStyleBlurHandler.bind(this));
        this.$editInput.on('keypress' + '.' + this.styleName, this.editStyleEnterHandler.bind(this));
        this.$el.on('click' + '.' + this.styleName, this.styleClickHandler.bind(this));
    };

    CustomStyle.prototype.removeListeners = function () {
        this.$deleteButton.off('click' + '.' + this.styleName);
        this.$editButton.off('click' + '.' + this.styleName);
        this.$editInput.off('blur' + '.' + this.styleName);
        this.$editInput.off('keypress' + '.' + this.styleName);
        this.$el.off('click' + '.' + this.styleName);
    };

    CustomStyle.prototype.editStyleBlurHandler = function (event) {
        var $target = $(event.target),
            value = $target.val();

        this.saveTitle(value);
    };

    CustomStyle.prototype.editStyleEnterHandler = function (event) {
        var $target,
            value;

        if (event.which === 13) {
            $target = $(event.target);
            value = $target.val();
            this.saveTitle(value);
        }
    };

    CustomStyle.prototype.saveTitle = function (styleTitle) {
        this.$editInput.addClass('hide');
        this.$title.removeClass('hide');
        this.setStyleName(styleTitle);
    };

    CustomStyle.prototype.showDeleteDialog = function () {
        var deleteOffset = this.$deleteButton.offset(),
            wrapperOffset = this.$wrapper.offset(),
            top = deleteOffset.top - wrapperOffset.top,
            left = deleteOffset.left - wrapperOffset.left;

        $('.js-delete-dialog-title', this.$deleteDialog).html(this.styleName);
        this.$deleteDialog.on('click', '.js-close-dialog-cancel', this.hideDeleteDialog.bind(this));
        this.$deleteDialog.on('click', '.js-delete-dialog-delete', this.deleteStyleHandler.bind(this));
        this.$deleteDialog.css({top: top, left: left});
        this.$deleteDialog.removeClass('hide');
    };

    CustomStyle.prototype.hideDeleteDialog = function () {
        var that = this;

        that.$deleteDialog.off('click');
        that.$deleteDialog.addClass('hide');
    };

    CustomStyle.prototype.deleteStyleHandler = function () {
        var that = this,
            deleteStyleCallback = this.deleteStyleCallback;

        setTimeout(function () {
            that.removeListeners();
            that.$el.remove();
            that.hideDeleteDialog();
            deleteStyleCallback(that);
        }, 0);
    };

    CustomStyle.prototype.editStyleHandler = function () {
        this.$editInput.toggleClass('hide');
        this.$title.toggleClass('hide');
        this.$editInput.focus();
    };

    CustomStyle.prototype.nodeChangeHandler = function (event) {
        if (!event.selectionChange) {
            return;
        }

        if (this.isMatchStyles()) {
            this.setActive();
            return;
        }

        this.unsetActive();
    };

    CustomStyle.prototype.styleClickHandler = function () {
        this.applyStylesToEditor();
    };

    CustomStyle.prototype.showDeleteButton = function () {
        if (!this.isDefault) {
            this.$el.toggleClass('showDelete');
        }
    };


    tinymce.PluginManager.add('custom_style', function (editor) {
        var stylesList = [],
            $deleteDialog = editor.settings.deleteDialog,
            editorStyles = editor.settings.editorStyles,
            defaultStyles = editor.settings.defaultStyles,
            $styleListWrapper = $('<div>', {'class': 'js-dropdown-menu dropdown-menu'}),
            $styleListTitle = $('<div>', {'class': 'dropdown-title'}),
            $dropDownContent = $('<div>', {'class': 'dropdown-list hide'}),
            $stylesList = $('<ul>'),
            $optionsWrapper = $('<div>', {text: 'Options', 'class': 'dropdown-menu-options'}),
            $optionsList = $('<ul>'),
            $saveAsMyDefaultStyles = $('<li>', {text: 'Save as my default styles'}),
            $deleteStyles = $('<li>', {text: 'Delete styles', 'class': 'disable'}),
            eventEditor,
            $wrapper = editor.settings.customStyle;

        editor.on('nodeChange', function (event) {
            if (!event.selectionChange) {
                return;
            }

            eventEditor = event;

            $.each(stylesList, function (index, style) {
                style.nodeChangeHandler(event);
            })
        });

        function setTitle(value) {
            $styleListTitle.html(value);
        }

        function setDropDownView(defaultStyles) {

            $.each(defaultStyles, function (index, style) {
                var styleName = style.title,
                    isDefault = style.isDefault,
                    styleValues = style.values,
                    newCustomStyle = new CustomStyle(editor, $stylesList, editorStyles, styleName, styleValues, isDefault, false, setTitle, $deleteDialog, setDeleteStyleView);

                stylesList.push(newCustomStyle);
            });

            $dropDownContent.append($stylesList);
            $dropDownContent.append($deleteDialog);
            setOptionsView();
        }

        function getSelectionStyleValue(styleName) {
            if (typeof eventEditor === 'undefined') {
                return;
            }

            var parents = eventEditor.parents,
                value = null;

            $.each(parents, function (index, element) {
                var $el = $(element),
                    styleValue = $el[0].style[styleName];

                if (styleValue.length) {
                    value = styleValue;
                    return false
                }
            });

            return value;
        }

        function getCurrentStyles() {
            var fontSize = getSelectionStyleValue('font-size'),
                fontFamily = getSelectionStyleValue('font-family'),
                color = getSelectionStyleValue('color'),
                backgroundColor = getSelectionStyleValue('background-color'),
                styles = {};

            if (editor.formatter.match('bold')) {
                styles.bold = true;
            }

            if (editor.formatter.match('italic')) {
                styles.italic = true;
            }

            if (editor.formatter.match('underline')) {
                styles.underline = true;
            }

            if (fontSize) {
                styles.fontSize = fontSize;
            }

            if (fontFamily) {
                styles.fontFamily = fontFamily;
            }

            if (color) {
                styles.color = color;
            }

            if (backgroundColor) {
                styles.backgroundColor = backgroundColor;
            }

            return styles;
        }

        function setDeleteStyleView(deletedStyle) {
            var isCustomStyles = false,
                indexOfDeletedElement;

            if (typeof deletedStyle !== 'undefined') {
                indexOfDeletedElement = stylesList.indexOf(deletedStyle);
                stylesList.splice(indexOfDeletedElement, 1);
                setTitle(stylesList[0].styleName);
            }

            $.each(stylesList, function (index, style) {
                if (!style.isDefault) {
                    isCustomStyles = true;
                    return false;
                }
            });

            if (isCustomStyles) {
                $deleteStyles.addClass('active');
                return;
            }

            $deleteStyles.removeClass('active');
        }

        function getStyleName() {
            var styleName = 'Untitled',
                newMaxUntitledNumber = 0,
                maxUntitledNumber = 0;

            $.each(stylesList, function (index, style) {
                var currentStyleName = style.styleName;

                if (style.isDefault) {
                    return;
                }

                if (!/Untitled(\d+)?/.test(currentStyleName)) {
                    return;
                }

                if (/Untitled/.test(currentStyleName)) {
                    newMaxUntitledNumber = 1;
                }

                if (/Untitled(\d+)/.test(currentStyleName)) {
                    newMaxUntitledNumber = Number(currentStyleName.match(/Untitled(\d+)/)[1]);
                    newMaxUntitledNumber++;
                }

                if (maxUntitledNumber < newMaxUntitledNumber) {
                    maxUntitledNumber = newMaxUntitledNumber;
                }
            });

            if (maxUntitledNumber === 0) {
                return styleName;
            }

            return styleName + maxUntitledNumber;
        }

        function saveAsMyDefaultHandler() {
            var currentStyles = getCurrentStyles(),
                styleName = getStyleName(),
                newCustomStyle = new CustomStyle(editor, $stylesList, editorStyles, styleName, currentStyles, false, true, setTitle, $deleteDialog, setDeleteStyleView);

            stylesList.push(newCustomStyle);
            setDeleteStyleView();
        }

        function deleteStyles() {
            $.each(stylesList, function (index, style) {
                style.showDeleteButton();
            });
            setDeleteStyleView();
        }


        function setOptionsView() {
            $saveAsMyDefaultStyles.on('click', saveAsMyDefaultHandler);
            $deleteStyles.on('click', deleteStyles);

            $optionsList.append($saveAsMyDefaultStyles).
                append($deleteStyles);

            $optionsWrapper.append($optionsList);
            $dropDownContent.append($optionsWrapper);
        }

        $styleListWrapper.append($styleListTitle);
        $styleListWrapper.append($dropDownContent);
        setDropDownView(defaultStyles);
        $wrapper.append($styleListWrapper);
        stylesList[0].setActive();
    });
})();