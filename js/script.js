tinymce.init({
    plugins: [
        "link", "textcolor"
    ],
    selector: "#editor",
    menubar: false,
    statusbar: false,
    fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
    toolbar: "bold italic underline link fontsizeselect forecolor backcolor fontselect",
    //font_formats: 'Serif; Arial;Courier;Courier New;Comic Sans MS;Helvetica;Impact;Lucida Grande;Lucida Sans;Tahoma;Times;Times New Roman;Verdana'

});


//function tinyMceSetupHandler() {
//    tinymce.activeEditor.on('focus', function (event) {
//        console.log(event.blurredEditor);
//    });
//}