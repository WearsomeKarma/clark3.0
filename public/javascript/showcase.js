
apply_splash();
apply_socials('#splash');

let discussion_posts = [];

function update_discussions(){
    const discussions_list = $('#discussions_list')

    discussion_posts = [];
    $.getJSON("/get_discussions").done((data) => {
        if (data.message !== "success") {
            console.log(data.message);
            //alert('database error: ' + data.message);
            return;
        }

        for(const discussion of data.discussions){
            discussion_posts.push(discussion);

            $.getJSON('/get_user', {user_id: discussion.author_id}, (data) => {
                const author = data.user;

                $.getJSON('/get_content', {content_id: discussion.root_content_id},
                    (data) => {
                        if (data.message !== 'success') {
                            return;
                        }
                        console.log(data.content);

                        discussions_list.append
                        (
                            get_discussion_overview
                            (
                                discussion,
                                author,
                                data.content
                            )
                        );
                    });
            });
        }
    });
}

update_discussions();
