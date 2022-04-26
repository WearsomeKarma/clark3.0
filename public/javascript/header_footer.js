
apply_footer();

$(document).ready(function() {
    $.getJSON('/get_current_user')
        .done((data) => {
            apply_header(data.user);
        });
});
