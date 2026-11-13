<?php

use App\Support\PostBody;

test('bold, italic, line breaks and paragraphs are converted to html', function () {
    expect(PostBody::toHtml("First **bold** and *italic*\nnext line\n\nSecond paragraph"))
        ->toBe("<p>First <strong>bold</strong> and <em>italic</em><br>\nnext line</p>\n<p>Second paragraph</p>");
});

test('html written in a post is escaped', function () {
    expect(PostBody::toHtml('<script>alert(1)</script> **<b>x</b>**'))
        ->toBe('<p>&lt;script&gt;alert(1)&lt;/script&gt; <strong>&lt;b&gt;x&lt;/b&gt;</strong></p>');
});

test('lone asterisks are left as text', function () {
    expect(PostBody::toHtml('2 * 3 = 6 and ** nothing **'))
        ->toBe('<p>2 * 3 = 6 and ** nothing **</p>');
});

test('windows line endings are treated like normal line breaks', function () {
    expect(PostBody::toHtml("One\r\ntwo\r\n\r\nThree"))
        ->toBe("<p>One<br>\ntwo</p>\n<p>Three</p>");
});

test('the excerpt drops formatting marks and is shortened', function () {
    expect(PostBody::excerpt("**Bold** and *italic*\n\ntext"))->toBe('Bold and italic text')
        ->and(PostBody::excerpt(str_repeat('word ', 100), 20))->toBe('word word word word...');
});
