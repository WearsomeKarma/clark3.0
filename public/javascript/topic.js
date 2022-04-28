const urlParams = new URLSearchParams(window.location.search);
const discussion_id = urlParams.get("discussion_id");

apply_splash();
apply_socials('#splash');

let comments = [];

function update_comments(){
    const comments_list = $('#discussions_list')

    comments.empty();
    $.getJSON("/get_comments", {discussion_id: discussion_id}).done((data) => {
        if (data.message !== "success") {
            alert('database error');
            return;
        }

        for(const comment of data.comments){
            comments.push(comment);

            comment_list.append(get_comments(comment));
        }
    });
}

update_discussions();
