tinymce.init({
    plugins: [
        "link", "myColor"
    ],
    selector: ".js-editor",
    menubar: false,
    statusbar: false,
    skin: 'recorder',
    fontsize_formats: "9px 10px 11px 12px 13px 14px 15px 16px 17px 18px 19px 20px 21px 22px 23px 24px 25px 26px 27px 28px 29px 30px 31px 32px 33px 34px 35px 36px",
    toolbar: "bold italic underline link fontsizeselect forecolor backcolor fontselect",
    font_formats: 'Serif=serif; Arial=Arial;Courier=Courier;Courier New=Courier New;' +
    'Comic Sans MS=Comic Sans MS;Helvetica=Helvetica;Impact=Impact;Lucida Grande=Lucida Grande;' +
    'Lucida Sans=Lucida Sans;Tahoma=Tahoma;Times=Times;Times New Roman=Times New Roman;Verdana=Verdana',
    setup: tinyMceSetupHandler
});


function tinyMceSetupHandler() {
    console.log(1);
}
