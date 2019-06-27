---
layout: "post"
title: "Android - Highlighting parts of an ImageView"
subtitle: "Includes working source code in Gist form!"
date: "2017-08-10 20:25"
category: Tutorial
featured_image: '/assets/posts/android_bitmap_highlight_example.png'
description: 'Highlighting parts of an image in Java for Android. Includes working source code.'
---
Context: I had just added an interior map to my company's app; It was zoomable, pannable and each point of interest was a clickable region. My next task was to implement a room highlighting feature.<!-- excerpt -->

This is what the finished product looks like:  
![ImageHighlightingExample][final-result-pic]

[I don't care how it's done, just give me the code already!][gist]

First off, we'll want to subclass `BitmapDrawable`; I named my new class "*HighlightableBitmapDrawable*" because I couldn't think of anything better.
{% highlight Java %}
/**
 * Drawable which can highlight a selection area.
 */
public class HighlightableBitmapDrawable extends BitmapDrawable {
    private Rect mSelection;
    private final int mColorRes;

    /**
     * @param drawable The underlying image.
     * @param darkenColor The color to darken the underlying image with.
     */
    public HighlightableBitmapDrawable(@NonNull Resources resources,
                                        @DrawableRes int drawable,
                                        @ColorRes int darkenColor) {
        super(resources, BitmapFactory.decodeResource(resources, drawable));
        mColorRes = darkenColor;
    }
}
{% endhighlight %}

This is a very straightforward solution so let's get to the meat of it.  
1. Override the `void draw(Canvas)` method.
2. If the selection rectangle is not null...
3. ...then clip the canvas to said rectangle.
4. Dump your color of choice onto the canvas.

{% highlight Java %}
if (null != mSelection) {
    // If we have a selection, clip the paintable area to its surroundings.
    canvas.clipRect(mSelection, Region.Op.DIFFERENCE);
    // Surround the area with our color.
    canvas.drawColor(mColorRes);
}
{% endhighlight %}

`Op.DIFFERENCE` means that instead of clipping the canvas to inside our selection rectangle, we instead do the opposite: we clip the canvas to everything *except* the rectangle.

Cool, so our drawable can highlight an area by dimming its surrounding, but how do we set the selection? With setters!
{% highlight Java %}
/**
 * Highlights the given region.
 * @param region The region to highlight. Can be null to clear current selection.
 */
public void selectRegion(@Nullable Rect region) {
    mSelection = region;
}

public void selectRegion(int left, int top, int right, int bottom) {
    selectRegion(new Rect(left, top, right, bottom));
}

public void clearSelection() {
    selectRegion(null);
}
{% endhighlight %}

Now you might be thinking: *Great! This is exactly what I was looking for! Thanks Alex!*, or rather: *I'd prefer to use an overlay on the selected area, or even use both!*

Well it's your lucky day: adding in an overlay component is quite trivial!  
Simply add a `Bitmap` as a class member variable and draw it inside the selection area:
{% highlight Java %}
if (null != mSelection) {
    if (null != mOverlay) {
        // If we have an overlay, paint it on top of the selected area.
        canvas.drawBitmap(mOverlay, null, mSelection, null);
    }
    ...
}
{% endhighlight %}
Add the relevant setters (or just add it to the constructor) and bam! You have an optional overlay that'll be painted on top of the selection area. (If it doesn't show, make sure the code to draw it is *above* the call to `clipRect(..)`)

"*But Alex*", I hear you cry, "*I just wanted to paint a different colour on top, not a whole other image!*"  
We can do that too, but we'll want to use `canvas.save()` and `canvas.restore()` to clear our previously clipped area:
{% highlight Java %}
if (null != mSelection) {
    // Save the canvas with any clipping
    canvas.save();
    // Paint selection surroundings
    canvas.clipRect(mSelection, Region.Op.DIFFERENCE);
    canvas.drawColor(mDarkenColorRes);
    // Discard the clipping area
    canvas.restore();
    // Paint inside selection area
    canvas.drawColor(mHighlightColorRes);
}
{% endhighlight %}

To use this class in your code, simply create and instance so that you can change the selection area and then assign it to your ImageView with `setImageDrawable(yourHighlightableDrawable)`.

That's it! You should now be able to highlight regions of an ImageView with relatively little code and without needing to fiddle with additional views!

Here's my source code for this:
<script src="https://gist.github.com/AlexMeuer/ac2480f9388cfd6888d98c2c1228515c.js"></script>

[photo-view]: https://github.com/chrisbanes/PhotoView
[final-result-pic]: {{ site.url }}{{ page.featured_image }}
[gist]: https://gist.github.com/AlexMeuer/ac2480f9388cfd6888d98c2c1228515c#file-highlightablebitmapdrawable-java
