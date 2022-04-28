
apply_splash();
apply_socials('#splash');

let discussion_posts = [];

function update_discussions(){
    const discussions_list = $('#discussions_list')

    discussion_post.empty();
    $.getJSON("/get_discssions").done((data) => {
        if (data.message !== "success") {
            alert('database error');
            return;
        }

        for(const discussion_post of data.discussion_posts){
            discussion_post.push(discussion_post);

            discussions_list.append(get_discussion_overview(discussion_post));
        }
    });
}

update_discussions();
