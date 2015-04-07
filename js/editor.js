(function () {
    var editor = $('#editor'),
        fonts = ['Serif', 'Arial', 'Courier', 'Courier New', 'Comic Sans MS',
            'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times', 'Times New Roman', 'Verdana'],
        styles = new Styles($('#button-toolbar .styles')),
        lastLink;

    function makeCloseDialog(elem, saveCallback, cancelCallback, dontSaveCallback) {
        elem = $(elem);

        elem.find('.saveBtn').on('click', saveCallback);
        elem.find('.cancelBtn').on('click', cancelCallback);
        elem.find('.dontSaveBtn').on('click', dontSaveCallback);
    }

    function initCloseDialog() {
        var dialogElem = $('.closeDialog'),
            save = function () {
                saveTranscript();
                $('.closeDialog').hide();
                $('.button-toolbar').hide();
            },
            cancel = function () {
                $('.closeDialog').hide();
            },
            dontSave = function () {
                $('#editor').html(localStorage.getItem('editorContent'));
                $('.closeDialog').hide();
                $('.button-toolbar').hide();
            };
        makeCloseDialog(dialogElem, save, cancel, dontSave);
    }

    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function saveBookmark(text, bookmarkId) {
        $.ajax({
            url: '/api/transcript/',
            type: 'PUT',
            data: JSON.stringify({
                text: text,
                id: bookmarkId
            }),
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                "Accept-Language": "ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3, ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4",
                "Content-Type": "application/json; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest, XMLHttpRequest",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            success: function () {
                console.log('success: ' + bookmarkId);
            },
            error: function () {
                console.log('error: ' + bookmarkId);
            }
        });
    }

    function createWrapper(elem) {
        var tagName = elem.tagName,
            attrs = [];
        $($(elem)[0].attributes).each(function () {
            attrs.push(this.nodeName + '=' + this.nodeValue);
        });
        attrs = attrs.join(' ');
        console.log(attrs);
        return $('<' + tagName + ' ' + attrs + '/>')
    }

    function saveTranscript() {
        $('div.transcriptParagraph').each(function () {
            $(this).find('.oneBookmark').each(function () {
                var bookmark = $(this);
                bookmark.parentsUntil('.transcriptParagraph').each(function () {
                    bookmark.children('.bookmarkBody').contents().wrap(createWrapper(this));
                });

                saveBookmark($(this).find('.bookmarkBody').html(), $(this).data('bookmarkid'));
            });
        });

        localStorage.setItem('editorContent', $('#editor').html());
        toast.notify({message: "Transcript was successfully saved."})
    }

    function rgbToHex(rgb) {
        var r = parseInt(rgb[0]).toString(16),
            g = parseInt(rgb[1]).toString(16),
            b = parseInt(rgb[2]).toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;

        return "#" + (r + g + b).toUpperCase();
    }

    function drawColorPalette(cpDiv, bgColor) {
        var
            mainColorTable = $('<table class="main-color-table"/>'),
            lastColorTable = $('<table class="last-color-table"/>'),
            blackColorTable = $('<table class="black-color-table"></table>'),
            propertyName = bgColor ? 'backColor ' : 'foreColor ',
            mainColors,
            lastColors,
            blackColors,
            tr,
            i;

        $.getJSON('/static/js/ext/colors.json', function (data) {
            mainColors = data['mainblock'];
            lastColors = data['sideblock'];
            blackColors = data['blackblock'];

            tr = $('<tr/>');
            mainColors.forEach(function (color, index) {
                tr.append('<td style="background-color: rgb(' + color + ')"><a data-edit="' + propertyName + rgbToHex(color.split(',')) + '"></a></td>');
                if (index % 12 == 11 && index > 0) {
                    mainColorTable.append(tr);
                    tr = $('<tr/>');
                }
            });
            blackColors.forEach(function (color) {
                tr.append('<td style="background-color: rgb(' + color + ')"><a data-edit="' + propertyName + rgbToHex(color.split(',')) + '"></a></td>');
            });
            blackColorTable.append(tr);
            lastColors.forEach(function (color) {
                lastColorTable.append('<tr><td style="background-color: rgb(' + color + ')"><a data-edit="' + propertyName + rgbToHex(color.split(',')) + '"></a></td></tr>');
            });
        });
        cpDiv.append(lastColorTable);
        cpDiv.append(mainColorTable);
        cpDiv.append(blackColorTable);

        cpDiv.append($('<span class="opacity-title">Opacity</span>'));
        cpDiv.append($('<input type="text" value="100"/>'));
        !bgColor && cpDiv.append($('<div id="slider1"></div>'));
        bgColor && cpDiv.append($('<div id="slider2"></div>'));

        initColorPick();
    }

    function refreshProps() {
        var target = window.getSelection().anchorNode.parentNode,
            tgStyles = window.getComputedStyle(target),
            fontFamily = tgStyles.fontFamily.split(', '),
            BreakException = {}
            ;

        $('.font-sizes-group').children('a').html(parseInt(tgStyles.fontSize) + '<b class="caret"></b>');
        try {
            fontFamily.forEach(function (font) {
                font = font.split("'").join('');
                if ($.inArray(font, fonts) >= 0) {
                    $('.fonts-list-group').children('a').html(font + '<b class="caret"></b>');
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e != BreakException) throw e;
        }
        $('.font-color > a span').css('background-color', tgStyles.color);
        $('.background-color > a span').css('background-color', $(target).parents('*[style^="background"]').css('background-color') || tgStyles.backgroundColor);
        $('.add-link-input').val('');
    }

    function initFocus() {
        var toolbar = $('#button-toolbar'),
            closeDialog = $('.closeDialog'),
            transcript = $('.transcript'),
            transcriptButton = $('button.transcriptCorrection'),
            setStorage = true
            ;

        editor.on('focus', function (e) {
            setStorage && localStorage.setItem('editorContent', $('#editor').html());
            setStorage = false;
            transcript.addClass('correction editting');
            transcriptButton.addClass('selected');
            $('body').append(toolbar);
            toolbar.show();
        });
        editor.on('blur', function (e) {
            transcriptButton.removeClass('selected');
        });
        $('.transcript .close-btn').click(function () {
            if (!($('#editor').html() === localStorage.getItem('editorContent'))) {
                closeDialog.show();
            } else {
                toolbar.hide();
                closeDialog.hide();
            }

        });
        $('#cancelButton').click(function () {
            $('#editor').html(localStorage.getItem('editorContent'));
            toolbar.hide();
            closeDialog.hide();
        });
        $('#saveButton').click(function () {
            if (!($('#editor').html() === localStorage.getItem('editorContent'))) {
                saveTranscript();
            }
            $('.closeDialog').hide();
        });
    }

    function initFonts() {
        var fontTarget = $('.fonts-list'),
            currentFont,
            content;

        fonts.forEach(function (fontName) {
            fontTarget.append('<li><a class="font-item" data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>');
        });
        $('.font-item').click(function () {
            currentFont = $(this).css('font-family').split('\'').join('');
            $(this).parents('.fonts-list-group').children('a').html(currentFont + '<b class="caret"></b>');

            $('.fonts-list-group > a span').html(currentFont + '<b class="caret"></b>');
            if (!window.getSelection().toString().length) {
                $.each($('#editor .bookmarkBody'), function () {
                    content = $(this).find('font[face]').html();
                    if (!content) {
                        content = $(this).html();
                    }
                    $(this).html('<font face="' + currentFont + '">' + content + '</font>');

                });
            }
        });
    }

    function initColorPick() {
        $('.color-palette-group.font-color td, .color-palette-group.background-color td').on('click', 'a', function (e) {
            var color = $(this).parent().css('background-color'),
                parents = $(this).parents('.color-palette-group')
                ;
            parents.find('.picked').removeClass('picked');
            parents.find('.currentColor').css('background-color', color);
            parents.find('a span').css('background-color', color);

            $(this).parent().addClass('picked');
        });
    }

    function initEditorExtras() {
        var currentSize,
            selection = window.getSelection(),
            selectedText,
            text,
            start,
            end,
            startText,
            endText,
            startId,
            endId,
            content,
            bookmarkNode,
            bookmarkBody,
            anchorNode,
            focusNode,
            selectedRange = document.createRange(),
            spanRe = /<span style="font-size:\d+px">([\s\w\S\W.]+)<\/span>/
            ;

        initFocus();
        initFonts();

        $('.fontsize-picker').on('click', function () {
            currentSize = $(this).data('fontsize').slice(9);
            anchorNode = window.getSelection().anchorNode;
            focusNode = window.getSelection().focusNode;

            $(this).parents('.font-sizes-group').children('a').html(parseInt(currentSize) + '<b class="caret"></b>');

            if (!selection.toString().length) {
                $.each($('#editor .bookmarkBody'), function () {
                    content = $(this).find('span[style^=font-size]').html();
                    if (!content) {
                        content = $(this).html();
                    }
                    $(this).html('<span style="font-size:' + currentSize + '">' + content + '</span>');

                });
            } else {
                //content = '<span style="font-size:' + currentSize + '">' + selection + '</span>';
                text = $(selection.anchorNode.parentNode).html();

                selectedText = window.getSelection().toString();

                start = window.getSelection().getRangeAt(0).startOffset;
                end = window.getSelection().getRangeAt(0).endOffset;

                startId = $(selection.anchorNode).parents('.oneBookmark').data('bookmarkid');
                endId = $(selection.focusNode).parents('.oneBookmark').data('bookmarkid') || $(selection.focusNode).prev().children(':last-child').data('bookmarkid') + 1;

                for (var i = startId + 1; i <= endId - 1; i++) {
                    bookmarkNode = $('.oneBookmark[data-bookmarkid=' + i + '] .bookmarkBody');
                    bookmarkBody = bookmarkNode.html();
                    if (bookmarkBody.match(spanRe)) {
                        bookmarkBody = bookmarkBody.replace(spanRe, bookmarkBody.match(spanRe)[1]);
                    }
                    content = '<span style="font-size:' + currentSize + '">' + bookmarkBody + '</span>';

                    bookmarkNode.html(content);
                }

                //    Need to change
                if (startId != endId) {
                    bookmarkNode = $('.oneBookmark[data-bookmarkid=' + startId + '] .bookmarkBody');

                    bookmarkBody = bookmarkNode.html();
                    if (bookmarkBody.slice(start).match(spanRe)) {
                        console.log(bookmarkBody.slice(start).match(spanRe));
                        bookmarkBody = bookmarkBody.replace(spanRe, bookmarkBody.match(spanRe)[1]);
                    }

                    startText = $(window.getSelection().anchorNode).text().slice(start);

                    content = bookmarkBody.replace(startText, '<span style="font-size:' + currentSize + '">' + startText);
                    content += '</span>';
                    bookmarkNode.html(content);
                    //------------------------------------
                    bookmarkNode = $('.oneBookmark[data-bookmarkid=' + endId + '] .bookmarkBody');

                    bookmarkBody = bookmarkNode.html();
                    if (bookmarkBody.match(spanRe)) {
                        bookmarkBody = bookmarkBody.replace(spanRe, bookmarkBody.match(spanRe)[1]);
                    }

                    endText = $(window.getSelection().focusNode).text().slice(0, end);

                    content = bookmarkBody.replace(endText, endText + '</span>');
                    content = '<span style="font-size:' + currentSize + '">' + content;
                    bookmarkNode.html(content);

                } else {
                    bookmarkNode = $('.oneBookmark[data-bookmarkid=' + startId + '] .bookmarkBody');

                    bookmarkBody = bookmarkNode.html();
                    if (bookmarkBody.match(spanRe)) {
                        bookmarkBody = bookmarkBody.replace(spanRe, bookmarkBody.match(spanRe)[1]);
                    }

                    startText = $(window.getSelection().anchorNode).parents('.bookmarkBody').text().slice(start, (start > end) ? (start + end) : end);

                    content = bookmarkBody.replace(startText, '<span style="font-size:' + currentSize + '">' + startText + '</span>');
                    bookmarkNode.html(content);
                }
            }
            selectedRange.setStart(window.getSelection().anchorNode, 1);
            selectedRange.setEnd(window.getSelection().focusNode, 1);
            selection.removeAllRanges();
            selection.addRange(selectedRange);

        });
    }

    String.prototype.splice = function (idx, rem, s) {
        return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
    };

    Object.defineProperty(
        Object.prototype,
        'renameProperty',
        {
            writable: false, // Cannot alter this property
            enumerable: false, // Will not show up in a for-in loop.
            configurable: false, // Cannot be deleted via the delete operator
            value: function (oldName, newName) {
                // Check for the old property name to
                // avoid a ReferenceError in strict mode.
                if (this.hasOwnProperty(oldName)) {
                    this[newName] = this[oldName];
                    delete this[oldName];
                }
                return this;
            }
        }
    );

    function extendObject(toObj, fromObj) {
        for (var prop in fromObj) {
            if (!toObj.hasOwnProperty(prop)) {
                toObj[prop] = fromObj[prop]
            }
        }
    }

    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    function Styles(container) {
        var savedStyles = JSON.parse(window.localStorage.getItem('savedStyles'));

        this._defaultStyles = {
            "Normal": '<span style="font-size:14px"><span style="font-weight: none"><span style="font-style: none"></span></span></span>',
            "Title": '<span style="font-size:18px"><span style="font-weight: bold"></span></span>',
            "Subtitle": '<span style="font-size:14px"><span style="font-style: italic"></span></span>',
            "Heading 3": '<span style="font-size:12px"><span style="color: #666666"></span></span>'
        };
        this._styles = {};
        this._container = $(container);

        extendObject(this._styles, this._defaultStyles);
        extendObject(this._styles, savedStyles);
    }

    Styles.prototype.stylize = function (name) {
        var selection,
            start,
            end,
            startText,
            endText,
            startId,
            endId,
            content,
            bookmarkNode,
            bookmarkBody,
            self = this,
            wrapper = $(self._styles[name]),
            selectedRange = document.createRange(),
            wrappedText;

        selection = window.getSelection();

        start = selection.getRangeAt(0).startOffset;
        end = selection.getRangeAt(0).endOffset;

        startId = $(selection.anchorNode).parents('.oneBookmark').data('bookmarkid');
        endId = $(selection.focusNode).parents('.oneBookmark').data('bookmarkid') || $(selection.focusNode).prev().children(':last-child').data('bookmarkid') + 1;

        if (selection.toString().length) {
            for (var i = startId + 1; i <= endId - 1; i++) {
                bookmarkNode = $('.oneBookmark[data-bookmarkid=' + i + '] .bookmarkBody');
                bookmarkNode.html(bookmarkNode.text());
                bookmarkNode.contents().wrapAll(wrapper);
            }
            //    Need to change
            if (startId != endId) {
                bookmarkNode = $('.oneBookmark[data-bookmarkid=' + startId + '] .bookmarkBody');
                bookmarkNode.html(bookmarkNode.text());
                bookmarkBody = bookmarkNode.html();

                startText = $(selection.anchorNode).text().slice(start);

                wrappedText = $('<span>' + startText + '</span>');
                wrappedText.wrapInner(wrapper);

                content = bookmarkBody.replace(startText, wrappedText[0].outerHTML);
                bookmarkNode.html(content);
                //------------------------------------
                bookmarkNode = $('.oneBookmark[data-bookmarkid=' + endId + '] .bookmarkBody');
                bookmarkNode.html(bookmarkNode.text());
                bookmarkBody = bookmarkNode.html();

                endText = $(selection.focusNode).text().slice(0, end);

                wrappedText = $('<span>' + endText + '</span>');
                wrappedText.wrapInner(wrapper);

                content = bookmarkBody.replace(endText, wrappedText[0].outerHTML);
                bookmarkNode.html(content);

            } else {
                bookmarkNode = $('.oneBookmark[data-bookmarkid=' + startId + '] .bookmarkBody');
                bookmarkNode.html(bookmarkNode.text());
                bookmarkBody = bookmarkNode.html();

                startText = $(selection.anchorNode).text().slice(start, end);

                wrappedText = $('<span>' + startText + '</span>');
                wrappedText.wrapInner(wrapper);

                content = bookmarkBody.replace(startText, wrappedText[0].outerHTML);
                bookmarkNode.html(content);
            }
        }
    };

    Styles.prototype.addStyle = function (name) {
        var child = $(window.getSelection().anchorNode),
            parents = child.parentsUntil('.transcriptParagraph').not('.oneBookmark, .bookmarkBody'),
            wrapper = $('<span> </span>'),
            li = $('<li data-name="' + name + '" class="custom style-picker"><span></span><a></a><span class="icon-pencil"></span><span class="icon-trash"></span></li>'),
            self = this
            ;
        parents.each(function () {
            wrapper.contents().wrap($(this).clone().empty());
        });
        //wrapper = $(wrapper[0].outerHTML);
        self._styles[name] = wrapper[0].outerHTML;
        if (wrapper.find(':not(:has(*))').length) {
            li.children('a').append(wrapper.find(':not(:has(*))').append(name));
        } else {
            li.children('a').append(name);
        }

        li.insertBefore(self._container.find('> .dropdown-menu > li:last-child'));

        window.localStorage.setItem('savedStyles', JSON.stringify(self._styles));
        $('#deleteStyles').parent().removeClass('disabled');

        return self._styles;
    };

    Styles.prototype.renameStyle = function (oldName, newName) {
        if (this._styles[oldName]) {
            this._styles.renameProperty(oldName, newName)
        }
        window.localStorage.setItem('savedStyles', JSON.stringify(this._styles));
        this._container.find('li[data-name="' + oldName + '"]').attr('data-name', newName);
    };

    Styles.prototype.removeStyle = function (name) {
        delete this._styles[name];
        this._container.find('li[data-name="' + name + '"]').remove();
        this._container.children('a').html('Normal' + '<b class="caret"></b>');
        console.log(Object.keys(this._styles).length);
        if (Object.keys(this._styles).length <= 4) {
            $('#deleteStyles').parent().addClass('disabled');
        }
        window.localStorage.setItem('savedStyles', JSON.stringify(this._styles));
    };

    Styles.prototype.removeAllStyles = function () {
        this._container.find('.icon-trash').show();
        this._container.find('.icon-pencil').hide();
    };

    Styles.prototype.init = function () {
        var ul = this._container.find('> .dropdown-menu'),
            li,
            styles = this._styles,
            self = this,
            newStyle,
            editing = false,
            savedStyles = JSON.parse(window.localStorage.getItem('savedStyles')),
            currentStyle,
            delDialog = $('.deleteStyleDialog');

        for (var style in styles) {
            li = $('<li class="style-picker" data-name="' + style + '"><span></span><a></a></li>');
            if (!self._defaultStyles[style]) {
                li.addClass('custom');
                li.append($('<span class="icon-pencil"></span><span class="icon-trash"></span>'));
            }
            li.children('a').append(style);
            li.children('a').contents().wrapAll($(styles[style]));
            ul.append(li);
        }

        ul.find('li[data-name="Normal"] > span').addClass('icon-check');
        ul.find(':first').appendTo(ul);
        ul.find('#saveStyles').on('click', function (e) {
            editing = true;
            newStyle = 'untitled';
            if (newStyle) {
                self.addStyle(newStyle);
            }
            $('.custom:last .icon-pencil').addClass('active');
            $('.custom:last').children('a').attr('contenteditable', true).focus();

            event.stopPropagation();
            event.preventDefault();
            return false;
        });
        ul.find('#deleteStyles').on('click', function (e) {
            !$(this).parent().hasClass('disabled') && self.removeAllStyles();
            e.stopPropagation();
            e.preventDefault();
            return false;
        });

        if (Object.keys(this._styles).length <= 4) {
            $('#deleteStyles').parent().addClass('disabled');
        }

        ul.on('click', '.disabled a', function (e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        });

        ul.on('click', '.custom .icon-trash', function (event) {
            currentStyle = this;
            event.stopPropagation();
            delDialog.appendTo($(this).parent());
            delDialog.show();

            delDialog.on('click', '.deleteBtn', function () {
                self.removeStyle($(currentStyle).parent().attr('data-name'));
                $('.deleteStyleDialog').hide();
                if (Object.keys(self._styles).length <= 4) {
                    $('#deleteStyles').parent().addClass('disabled');
                }
                event.preventDefault();
                return false;
            });
            delDialog.on('click', '.cancelBtn', function () {
                $('.deleteStyleDialog').hide();
                event.preventDefault();
                return false;
            });
            event.preventDefault();
            return false;
        });

        ul.on('click', '.custom .icon-pencil', function (event) {
            if ($(this).hasClass('active')) {
                self.renameStyle($(this).parents('.style-picker').attr('data-name'), $(this).prev('a').text());
                $(this).removeClass('active');
                $(this).parent().children('a').attr('contenteditable', false);
                editing = false;
            } else {
                $(this).addClass('active');
                editing = true;
                $(this).parent().children('a').attr('contenteditable', true).focus();
            }
            event.stopPropagation();
            event.preventDefault();
            return false;
        });

        ul.on('click', '.style-picker', function () {
            self._container.children('a').html($(this).attr('data-name') + '<b class="caret"></b>');
            $(this).parent().find('.icon-check').removeClass('icon-check');
            $(this).children('span:first-child').addClass('icon-check');
            self.stylize($(this).attr('data-name'));
        });

        ul.on('click', '.style-picker a', function (e) {
            if (editing) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        });

        ul.on('keypress', '.style-picker a', function (e) {
            if (e.which == 13) {
                self.renameStyle($(this).parent().attr('data-name'), $(this).text());
                $(this).parent().children('.icon-pencil').removeClass('active');
                $(this).attr('contenteditable', false);
                editing = false;
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        });
        $('.styles > a').click(function () {
            self._container.find('.icon-pencil').show();
            self._container.find('.icon-trash').hide();
        });
    };

    initEditorExtras();
    initCloseDialog();
    styles.init();
    drawColorPalette($('.color-palette').eq(0));
    drawColorPalette($('.color-palette').eq(1), true);

    $('.add-link-input').keypress(function (e) {
        if (e.which == 13) {
            if (lastLink) {
                $(lastLink).attr('href', $('.add-link-input').val());
                $('.add-link-input').val('');
                lastLink = null;
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
            setTimeout(function () {
                $('.transcript a').each(function () {
                    $(this).attr('target', '_blank');
                })
            }, 0);
        }
        //e.stopPropagation();
    });

    editor.on('mouseup', function (e) {
        //currentRange = getCurrentRange();
    });

    //
    $('.button-toolbar').on('mouseover', '.dropdown-toggle', function () {
        //currentRange = getCurrentRange();
    });

    editor.on('click', function () {
        refreshProps();
    });

    $(window).on('load', function () {
        initColorPick();
        editor.wysiwyg();

        $('body').append($('#button-toolbar'));

        $('#slider1, #slider2').slider({
            orientation: 'horizontal',
            range: 'max',
            max: 100,
            value: 100,
            change: refreshOpacity
        });
        $('.color-palette input[type="text"]').on('change', function (e) {
            $(this).next().slider("option", "value", $(this).val());
        });
        $('.color-palette input[type="text"]').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();

        })
    });


    function refreshOpacity(e, ui) {
        var indicator = $(ui.handle).parents('.color-palette').children('input');
        indicator.val(ui.value);
        setOpacity(ui.value / 100);

    }

    function setOpacity(value) {
        var anchorNode = window.getSelection().anchorNode,
            focusNode = window.getSelection().focusNode,
            selection = window.getSelection(),
            selectedText,
            text,
            start,
            end,
            startText,
            endText,
            startId,
            endId,
            content,
            bookmarkNode,
            bookmarkBody,
            selectedRange = document.createRange(),
            spanRe = /<span style="opacity:\d+px">([\s\w\S\W.]+)<\/span>/;


        if (selection.toString().length) {
            text = $(selection.anchorNode.parentNode).html();

            start = window.getSelection().getRangeAt(0).startOffset;
            end = window.getSelection().getRangeAt(0).endOffset;

            startId = $(selection.anchorNode).parents('.oneBookmark').data('bookmarkid');
            endId = $(selection.focusNode).parents('.oneBookmark').data('bookmarkid') || $(selection.focusNode).prev().children(':last-child').data('bookmarkid') + 1;

            for (var i = startId + 1; i <= endId - 1; i++) {
                bookmarkNode = $('.oneBookmark[data-bookmarkid=' + i + '] .bookmarkBody');
                bookmarkBody = bookmarkNode.html();
                if (bookmarkBody.match(spanRe)) {
                    bookmarkBody = bookmarkBody.replace(spanRe, bookmarkBody.match(spanRe)[1]);
                }
                content = '<span style="opacity:' + value + '">' + bookmarkBody + '</span>';

                bookmarkNode.html(content);
            }

            //    Need to change
            if (startId != endId) {
                bookmarkNode = $('.oneBookmark[data-bookmarkid=' + startId + '] .bookmarkBody');

                bookmarkBody = bookmarkNode.html();
                if (bookmarkBody.slice(start).match(spanRe)) {
                    console.log(bookmarkBody.slice(start).match(spanRe));
                    bookmarkBody = bookmarkBody.replace(spanRe, bookmarkBody.match(spanRe)[1]);
                }

                startText = $(window.getSelection().anchorNode).text().slice(start);

                content = bookmarkBody.replace(startText, '<span style="opacity:' + value + '">' + startText);
                content += '</span>';
                bookmarkNode.html(content);
                //------------------------------------
                bookmarkNode = $('.oneBookmark[data-bookmarkid=' + endId + '] .bookmarkBody');

                bookmarkBody = bookmarkNode.html();
                if (bookmarkBody.match(spanRe)) {
                    bookmarkBody = bookmarkBody.replace(spanRe, bookmarkBody.match(spanRe)[1]);
                }

                endText = $(window.getSelection().focusNode).text().slice(0, end);

                content = bookmarkBody.replace(endText, endText + '</span>');
                content = '<span style="opacity:' + value + '">' + content;
                bookmarkNode.html(content);

            } else {
                bookmarkNode = $('.oneBookmark[data-bookmarkid=' + startId + '] .bookmarkBody');

                bookmarkBody = bookmarkNode.html();
                if (bookmarkBody.match(spanRe)) {
                    bookmarkBody = bookmarkBody.replace(spanRe, bookmarkBody.match(spanRe)[1]);
                }

                startText = $(window.getSelection().anchorNode).parents('.bookmarkBody').text().slice(start, (start > end) ? (start + end) : end);

                content = bookmarkBody.replace(startText, '<span style="opacity:' + value + '">' + startText + '</span>');
                bookmarkNode.html(content);
            }
        }
        selectedRange.setStart(window.getSelection().anchorNode, 1);
        selectedRange.setEnd(window.getSelection().focusNode, 1);
        selection.removeAllRanges();
        selection.addRange(selectedRange);

    }
}());