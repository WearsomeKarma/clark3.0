const urlParams = new URLSearchParams(window.location.search);
const error= urlParams.get("error")

if (error) {
    $('#error_message').text(error);
}

//show email length error and animate it
$("#email_length_error").hide();
$("#email").on("change", function(){
    if ($(this).val().length < 5) {
        $("#email_length_error").text("email has to be at least 5 characters");
        $("#email_length_error").slideDown(300);
    }
    else {$("#email_length_error").hide();}
})


$('form').on('submit', function () {
    $(".is-invalid, .text-danger").removeClass("text-danger is-invalid");
    const errors = [];

    //*password
    let invalid = false;
    if ( $('#password').val().length < 8 ){
        errors.push("Password must be at least 8 characters!");
        $('#password').addClass("is-invalid text-danger");
        invalid = true;
    }

    //* passwords matching
    if($('#confirm_password').val() !== $('#password').val()){
        errors.push("Make sure the passwords match");
        $('#confirm_password').addClass("is-invalid text-danger");
        $('#password').addClass("is-invalid text-danger");
        invalid = true;
    }

    if (invalid) {
        $('#error_message').text(errors.join("; "))
        return false;}
});
