const urlParams = new URLSearchParams(window.location.search);
const query_page = Number(urlParams.get("page")) ?? 0;
const query_search_string = urlParams.get("search");

apply_splash();
apply_socials('#splash');

let discussion_posts = [];

function update_discussions(query){
    discussion_posts = [];
    $('#discussions_list').empty();
    fill_discussion_list
    (
        '#discussions_list',
        query
    );
}

query = {};
if (query_page) query.skip = (query_page * 10);
if (query_search_string) query.search_text = query_search_string;
update_discussions(query);

$('#search_button').on('click', () => {
    update_discussions({search_text: $('#search').val()});
});
