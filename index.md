---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---

{% for post in site.posts %}
<div class="post-list-header">
<h1 style="display:inline-block;"><a href="{{ post.url }}">{{ post.title }}</a></h1>
<span style="float:left;">{{ post.date | date_to_string }}</span><span style="float:right;">TODO: Category</span>​
</div>
<div style="clear:both;"></div>
{{ post.excerpt }}
{% unless forloop.last %}
---
{% endunless %}
{% endfor %}
