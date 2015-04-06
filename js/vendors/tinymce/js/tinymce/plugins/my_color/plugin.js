/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */
/*eslint consistent-this:0 */

tinymce.PluginManager.add('my_color', function (editor) {
    var lastPanel, previousPanel, opacitySlider, lastColor='rgba(0,0,0,1)';;
    var $colorInput = editor.settings.colorInput;

    /******font color toolbar***************/
    $colorInput.append($('<span>', {"id": 'colorPicker__bigA', text: 'A'}));
    $colorInput.append($('<span>', {"id": 'colorPicker__FontColor', text: 'Font Color'}));
    var $colorPicker = $('<div>', {"class": 'colorPicker'});
    $colorPicker.append($('<div>', {"class": 'colorPicker__color'}));
    $colorPicker.append($('<a>', {"id": 'colorPicker__buton', 'href': '#', text: 'choose'}));
    $colorInput.append($colorPicker);
    /******font color toolbar***************/

    /******font color panel***************/
    function mapColors() {
        $.getJSON("color.json", function (data) {
            var mainBlock = [], sideBlock = [], blackBlock = [];
            for (var i = 0; i < data.mainblock.length; i++) {
                mainBlock.push({
                    text: 'rgb(' + data.mainblock[i] + ')',
                    color: 'rgba(' + data.mainblock[i] + ',1)'
                });
            }
            for (var i = 0; i < data.sideblock.length; i++) {
                sideBlock.push({
                    text: 'rgb(' + data.sideblock[i] + ')',
                    color: 'rgba(' + data.sideblock[i] + ',1)'
                });
            }
            for (var i = 0; i < data.blackblock.length; i++) {
                blackBlock.push({
                    text: 'rgb(' + data.blackblock[i] + ')',
                    color: 'rgba(' + data.blackblock[i] + ',1)'
                });
            }
            drawAllAndAddListeners(sideBlock, mainBlock, blackBlock)
        });
    }

    function renderColorPicker(sideBlock, mainBlock, blackBlock) {
        var cols = 12, rows = 12;
        var ctrl = this, color, html, last, x, y, i, id = ctrl._id, count = 0;

        function getColorCellHtml(color, title) {
            var isNoColor = color == 'transparent';

            return (
            '<td class="mce-grid-cell' + (isNoColor ? ' mce-colorbtn-trans' : '') + '">' +
            '<div id="' + id + '-' + (count++) + '"' +
            ' data-mce-color="' + (color ? color : '') + '"' +
            ' role="option"' +
            ' tabIndex="-1"' +
            ' style="' + (color ? 'background-color: ' + color : '') + '"' +
            ' title="' + tinymce.translate(title) + '">' +
            (isNoColor ? '&#215;' : '') +
            '</div>' +
            '</td>'
            );
        }

        html = '<h1 class="mce-colorbutton-grid-header">Color Menu</h1>';
        html += '<div class="mce-colorbutton-grid-header-color"></div>';
        html += '<table class="mce-grid mce-grid-border mce-colorbutton-grid-left" role="list" cellspacing="0"><tbody>';

        for (x = 0; x < cols; x++) {
            html += '<tr>';
            if (x > sideBlock.length) {
                html += '<td></td>';
            } else {
                color = sideBlock[x];
                html += getColorCellHtml(color.color, color.text);
            }
            html += '</tr>';
        }

        html += '<table class="mce-grid mce-grid-border mce-colorbutton-grid" role="list" cellspacing="0"><tbody>';

        for (y = 0; y < rows; y++) {
            html += '<tr>';

            for (x = 0; x < cols; x++) {
                i = y * cols + x;

                if (i > mainBlock.length) {
                    html += '<td></td>';
                } else {
                    color = mainBlock[i];
                    html += getColorCellHtml(color.color, color.text);
                }
            }

            html += '</tr>';
        }

        html += '<table class="mce-grid mce-grid-border mce-colorbutton-grid-bottom" role="list" cellspacing="0"><tbody>';

        html += '<tr>';
        for (x = 0; x < cols; x++) {
            if (x > blackBlock.length) {
                html += '<td></td>';
            } else {
                color = blackBlock[x];
                html += getColorCellHtml(color.color, color.text);
            }
        }
        html += '</tr>';

        html += '</tbody></table>';

        html += '<div class="opacitySlider"><span>Opacity</span><input type="text" min="0" max="100" id="opacitySliderText" value="100"><input type="range" min="0" max="1" step="0.01" value="1" id="opacitySlider"></div>';

        return html;
    }

    function renderColorMenuPanel(sideBlock, mainBlock, blackBlock) {
        return '<div id="colorMenuPanel" class="colorMenuPanel" style="display: none">' + renderColorPicker(sideBlock, mainBlock, blackBlock) + '</div>';
    }

    function mceGridCellListener()
    {
        $('.mce-grid-cell').click(function (e) {
            var newColor = e.target.getAttribute('data-mce-color');
            applyFormat('forecolor', newColor);
        });
    }

    function colorMenuPanelListener()
    {
        var divColorMenuPanel = document.getElementById('colorMenuPanel');
        $('body').on('click', '#colorPicker__buton', function () {

            if (divColorMenuPanel.style.display == 'none') {
                divColorMenuPanel.style.display = 'block';

                $('body').on('click', function (e) {
                    if (e.target.id != 'colorPicker__buton' &&  e.target.id != 'opacitySliderText') {
                        divColorMenuPanel.style.display = 'none';
                    }
                });
            }
            else {
                divColorMenuPanel.style.display = 'none';
            }
        });
        editor.on("click", function(){
            if (divColorMenuPanel.style.display == 'block') {
                divColorMenuPanel.style.display = 'none';
            }
        })
    }

    function drawAllAndAddListeners(sideBlock, mainBlock, blackBlock) {
        $colorInput.append(renderColorMenuPanel(sideBlock, mainBlock, blackBlock));
        mceGridCellListener();
        colorMenuPanelListener();
        createListBoxChangeHandler();
        opacitySliderListener();
        opacitySliderTextListener()
    }

    /******font color panel***************/
    function applyFormat(format, value) {
        if(editor.selection.getContent({format: 'text'}).length>0) {
            editor.undoManager.transact(function () {
                editor.focus();
                editor.formatter.apply(format, {value: value});
                editor.nodeChanged();
            });
        }
    }

    function allToRgba(rgb)
    {
        var rgba = rgb;
        if (rgb.indexOf("rgb")>-1) {
            if (rgb.indexOf("rgba") < 0)
                rgba = rgb.replace(')', ',' + "1)").replace('rgb', 'rgba');
        }
        else
        {
            rgba='rgba(0,0,0,1)';
        }
        return rgba;
    }

    function opacitySliderListener()
    {
        $('#opacitySlider').change(function (e) {
            var newColor;
            if (lastColor.indexOf("rgb")>-1) {
                if (lastColor.indexOf("rgba") > -1)
                    newColor = lastColor.replace(/[^,]+(?=\))/, e.target.value);
                else
                    newColor = lastColor.replace(')', ', ' + e.target.value).replace('rgb', 'rgba');
            }
            else
            {
                newColor='rgba(0,0,0,1)';
            }
            applyFormat('forecolor', newColor);
        });
    }

    function opacitySliderTextListener()
    {
        $('#opacitySliderText').change(function (e) {
            if(!e.target.value)
                return -1;
            if(e.target.value)
                if(e.target.value<0 && e.target.value>100)
                    return -2;

            var newColor;
            if (lastColor.indexOf("rgb")>-1) {
                if (lastColor.indexOf("rgba") > -1)
                    newColor = lastColor.replace(/[^,]+(?=\))/, (e.target.value/100));
                else
                    newColor = lastColor.replace(')', ', ' + (e.target.value/100)).replace('rgb', 'rgba');
            }
            else
            {
                newColor='rgba(0,0,0,1)';
            }
            applyFormat('forecolor', newColor);
        });
    }

    function createListBoxChangeHandler() {
        editor.on('nodeChange', function (e) {
            if (!e.selectionChange) {
                return;
            }
            var reachEnd=true;
            var parents = e.parents;
            /*Find and apply choosed text color*/
            $.each(parents, function (index, element) {
                if (typeof element.style !== 'undefined')
                    if (element.style.color) {
                        if(element.style.color.indexOf("rgb")>-1) {
                            lastColor = allToRgba(element.style.color);
                            applyChooseColor(lastColor);
                            reachEnd = false;
                            return false;
                        }
                    }

                })
            if (reachEnd)
                applyChooseColor('rgba(0,0,0,1)');
            });
    }

    function getRgbArray(rgb)
    {
        return rgb.substring(rgb.indexOf('(') + 1, rgb.lastIndexOf(')')).split(/,\s*/);
    }

    function applyChooseColor(value) {
        var $headerColor = $('.mce-colorbutton-grid-header-color'),
            $colorPicker__color = $('.colorPicker__color'),
            $allCells = $('.mce-grid-cell'),
            $opacitySlider = $('#opacitySlider'),
            $opacitySliderText = $('#opacitySliderText'),
            rgbValue, cellRgb;

        $headerColor.css('background-color', value);
        $colorPicker__color.css('background-color', value);
        rgbValue=getRgbArray(value);
        if(rgbValue.length>2)
        {
            $opacitySlider.val(rgbValue[3]);
            $opacitySliderText.val(Math.floor(rgbValue[3]*100));
        }
        for (var i = 0; i < $allCells.length; i++) {
            cellRgb = getRgbArray($allCells[i].getElementsByTagName('div')[0].getAttribute('data-mce-color'));
            if (cellRgb[0] == rgbValue[0] && cellRgb[1] == rgbValue[1] && cellRgb[2] == rgbValue[2]) {
                if(lastPanel && lastPanel!=$allCells[i].getElementsByTagName('div')[0]) {
                    previousPanel = lastPanel;
                }
                lastPanel = $allCells[i].getElementsByTagName('div')[0];
                lastPanel.style['border']='1px solid red';
                if (previousPanel){
                    previousPanel.style['border']='none';
                }
            }
        }
    }

    mapColors();//Initialize all
});
