(function () {
    var CustomStyle = function (editor, $wrapper, styleName, styles, isDefault) {
        this.editor = editor;
        this.$wrapper = $wrapper;
        this.$el = null;
        this.styleName = null;
        this.isDefault = false;
        this.styles = {
            fontFamily: null,
            fontSize: null,
            bold: false,
            italic: false,
            underline: false,
            backgroundColor: null,
            color: null
        };

        this.setDefault(isDefault);
        this.setCurrentStyles(styles);
        this.setStyleName(styleName);
        this.createDomElement();
        this.addListeners();
    };

    CustomStyle.prototype.setDefault = function (isDefault) {
        this.isDefault = !!isDefault;
    };

    CustomStyle.prototype.isMatchStyles = function (parents) {
        var styles = this.styles;

        if (styles['bold'] && !this.checkFormatter('bold', parents)) {
            return false;
        }

        if (styles['italic'] && !this.checkFormatter('italic', parents)) {
            return false;
        }

        if (styles['underline'] && !this.checkFormatter('underline', parents)) {
            return false;
        }

        if (styles['backGroundColor'] && !this.checkFormatter('hilitecolor', parents, 'backGroundColor')) {
            return false;
        }

        if (styles['color'] && !this.checkFormatter('forecolor', parents, 'color')) {
            return false;
        }

        if (styles['fontSize'] && !this.checkFormatter('fontsize', parents, 'fontSize')) {
            return false;
        }

        return styles['fontFamily'] && this.checkFormatter('fontname', parents, 'fontFamily');
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
        var parents;

        if (!event.selectionChange) {
            return;
        }

        parents = event.parents;

        if (this.isMatchStyles(parents)) {
            this.setActive();
            return;
        }

        this.unsetActive();
    };

    CustomStyle.prototype.checkFormatter = function (formatterName, parents, styleName) {
        var styleValue,
            styles = this.styles,
            editor = this.editor,
            isMatch = false;

        $.each(parents, function (index, element) {
            if (typeof styleName === 'undefined') {
                isMatch = editor.formatter.matchNode(element, formatterName);
            } else {
                styleValue = styles[styleName];
                isMatch = editor.formatter.matchNode(element, formatterName, {value: styleValue});
            }

            if (isMatch) {
                return false;
            }
        });

        return !!isMatch;
    };

    CustomStyle.prototype.styleClickHandler = function () {
        this.applyStylesToEditor();
    };


    tinymce.PluginManager.add('custom_style', function (editor) {
        var defaultStyles = editor.settings.defaultStyles,
            $textField = editor.settings.customStyle;


        function setDropDownView($wrapper, defaultStyles) {
            $.each(defaultStyles, function (index, style) {
                var styleName = style.title,
                    isDefault = style.isDefault,
                    styleValues = style.values;

                new CustomStyle(editor, $wrapper, styleName, styleValues, isDefault);
            });
        }


        setDropDownView($textField, defaultStyles);
    });
})();