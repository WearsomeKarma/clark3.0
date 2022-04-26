const urlParams = new URLSearchParams(window.location.search);
const error= urlParams.get("error")
if (error) {
    $('#error_message').text(error);
}

$('form').on('submit', function () {
    $(".is-invalid, .text-danger").removeClass("text-danger is-invalid");
    const errors = [];

    //*password
    let invalid = false;
    if ( $('#password').val().length < 5 ){
        errors.push("Password must be at least 5 characters!");
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
