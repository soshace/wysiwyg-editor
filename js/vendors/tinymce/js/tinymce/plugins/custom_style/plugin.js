(function () {
    var CustomStyle = function (editor, $wrapper, editorStyles, styleName, styles, isDefault) {
            this.editor = editor;
            this.$wrapper = $wrapper;
            this.$el = null;
            this.styleName = null;
            this.isDefault = false;
            this.styles = $.extend({}, editorStyles);

            this.setDefault(isDefault);
            this.setCurrentStyles(styles);
            this.setStyleName(styleName);
            this.createDomElement();
            this.addListeners();
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
            fontFamily = styles.fontFamily,
            editor = this.editor;

        if (bold !== editor.formatter.match('bold')) {
            return false;
        }

        if (italic !== editor.formatter.match('italic')) {
            return false;
        }

        if (underline !== editor.formatter.match('underline')) {
            return false;
        }

        if (!editor.formatter.match('fontname', {value: fontFamily})) {
            return false;
        }

        if (!editor.formatter.match('fontsize', {value: fontSize})) {
            return false;
        }

        if (!editor.formatter.match('hilitecolor', {value: backgroundColor})) {
            return false;
        }

        return editor.formatter.match('forecolor', {value: color});
    };

    CustomStyle.prototype.setActive = function () {
        this.$el.addClass('active');
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
            styleName = this.styleName,
            $wrapper = this.$wrapper;

        $el = this.$el = $('<li>', {text: styleName});
        this.applyStylesToTitle();
        $wrapper.append($el);
    };

    CustomStyle.prototype.applyStylesToTitle = function () {
        var css = {},
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
                css['font-size'] = value;
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

        this.$el.css(css);
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
        this.styleName = styleName || 'untitled';
    };

    CustomStyle.prototype.addListeners = function () {
        this.$el.on('click', this.styleClickHandler.bind(this));
        this.editor.on('nodeChange', this.nodeChangeHandler.bind(this));
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


    tinymce.PluginManager.add('custom_style', function (editor) {
        var stylesList = [],
            editorStyles = editor.settings.editorStyles,
            defaultStyles = editor.settings.defaultStyles,
            $stylesList = $('<ul>'),
            $optionsWrapper = $('<div>', {text: 'options'}),
            $optionsList = $('<ul>'),
            $saveAsMyDefaultStyles = $('<li>', {text: 'Save as my default styles'}),
            $deleteStyles = $('<li>', {text: 'Delete styles'}),
            eventEditor,
            $wrapper = editor.settings.customStyle;

        editor.on('nodeChange', function (event) {
            if (!event.selectionChange) {
                return;
            }

            eventEditor = event;
        });

        function setDropDownView(defaultStyles) {

            $.each(defaultStyles, function (index, style) {
                var styleName = style.title,
                    isDefault = style.isDefault,
                    styleValues = style.values,
                    newCustomStyle = new CustomStyle(editor, $stylesList, editorStyles, styleName, styleValues, isDefault);

                stylesList.push(newCustomStyle);
            });

            $wrapper.append($stylesList);
            setOptionsView();
        }

        function getSelectionStyleValue(styleName) {
            var parents = eventEditor.parents,
                value = null;

            $.each(parents, function (index, element) {
                var $el = $(element),
                    styleValue = $el.css(styleName);

                if (styleValue) {
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

        function setDeleteStyleView() {
            var isCustomStyles = false;

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
            var styleName = 'untitled',
                newMaxUntitledNumber = 0,
                maxUntitledNumber = 0;

            $.each(stylesList, function (index, style) {
                var currentStyleName = style.styleName;

                if (style.isDefault) {
                    return;
                }

                if (!/untitled(\d+)?/.test(currentStyleName)) {
                    return;
                }

                if (/untitled/.test(currentStyleName)) {
                    newMaxUntitledNumber = 1;
                }

                if (/untitled(\d+)/.test(currentStyleName)) {
                    newMaxUntitledNumber = Number(currentStyleName.match(/untitled(\d+)/)[1]);
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
                newCustomStyle = new CustomStyle(editor, $stylesList, editorStyles, styleName, currentStyles);

            stylesList.push(newCustomStyle);
            setDeleteStyleView();
        }

        function deleteStyles() {
            setDeleteStyleView();
        }


        function setOptionsView() {
            $saveAsMyDefaultStyles.on('click', saveAsMyDefaultHandler);
            $deleteStyles.on('click', deleteStyles);

            $optionsList.append($saveAsMyDefaultStyles).
                append($deleteStyles);

            $optionsWrapper.append($optionsList);
            $wrapper.append($optionsWrapper);
        }

        setDropDownView(defaultStyles);
    });
})();