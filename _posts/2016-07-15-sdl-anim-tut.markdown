---
layout: post
title:  "SDL Texture Packer Animation Tutorial"
date:   2016-07-12 12:56:04 +0000
category: Tutorials
---
In this tutorial I will walk you through animating a sprite with a texture packer.<!-- excerpt -->

# [Example source code][source]

Though this is a reasonably simple procedure, there are some prerequisites:  

 - [SDL][libsdl] (if you don't know SDL, but want to, there are plenty of [helpful tutorials here][lazyfoo])
 - The [SDL Image][libsdl-img] library ([Direct download][libsdl-img-direct])
 - [Jsoncpp][jsoncpp] (to [generate the source files][jsoncpp-readme], just run `amalgamate.py` from the repo, the files can then be found in the *dist* folder)
 - A json file that points to the packed texture and defines the subtextures (I'm using [Shoebox][shoebox] to pack the textures, which depends on [Adobe Air][air]. It spits out xml files but there are plenty of [online converters][xml-converter]).

 First off, you'll want to write your *main.cpp* and set up SDL in your application. If you're using Visual Studio like me, you'll need to open up your project properties, go to *VC++ Directories* and add the path to your sdl includes and libraries in the appropriate files (detailed info on that [here][include-help]).

 Next step is to include SDL in your source file, like so:  
{% highlight C++ %}
#include <SDL.h>
#include <SDL_image.h>
{% endhighlight %}

And then write your `main()` and initialize SDL:  
{% highlight C++ %}
if (SDL_Init(SDL_INIT_VIDEO)) < 0) {
  std::cout << "SDL could not initialize! SDL_Error: " << SDL_GetError() << std::endl;
  system("timeout 10"); //wait 10 seconds
  return 1; //exit with an error code
}
{% endhighlight %}  
Build and run your project. Make sure the compiler finds the SDL headers and that the linker finds the libraries. (If you're having problems, LazyFoo' has [in-depth tutorials][lazyfoo] on getting SDL to behave nicely on your machine.)

Moving forward, you'll want to declare an array of (pointers to) `SDL_Rect`s. These are your source rectangles for animation. We're going to load one texture andnuse multiple source rectangles to draw the desired part of it. You could write a sprite class to hold these but for the sake of this tutorial we're just going to do it in `main()`. If you don't know how many frames you'll have at compile time, consider using a vector instead of an array.

As well as the array (or vector) you will also need a pointer to an `SDL_Texture`. This will point to the packed texture, which we'll get in a minute.

Alrighty then, you've got an array of `SDL_Rect` pointers and a pointer to an `SDL_Texture`; Now you need to load up your json file: have no fear, it's simpler than it sounds! (but we will be writing a class for this part)

The class shall be called `TextureAtlas`, and will serve as our texture atlas! It too needs a pointer to a texture. It also needs a map of strings to `SDL_Rect` pointers (this is so that we can request subtextures by their original names). You will need to include SDL and SDL_image in the class, just as we did in main, but we will also need `<fstream>` (for reading the file) and `json/json.h` (for parsing the json, duh!).

With a little foresight, we're also going to declare three methods in addition to the constructor and destructor, they are:  

 - `operator[]`, which takes a string and returns an `SDL_Rect` pointer. (It's also a public and const function)
 - `getTexture()`, which returns a pointer to the texture. (Is also both public and const)
 - `loadTexture()`, which takes a string and a pointer to an `SDL_Renderer`. We'll use this to load our texture and keep that code away from our json parsing code.

 Note that the constructor takes a string (path to the json file) and a pointer to an `SDL_Renderer` (for texture loading). The class does NOT have a default constructor.

 With any look your header file for `TextureAtlas` will look something like this:  
{% highlight C++ %}
#ifndef TEXTURE_ATLAS_H
#define TEXTURE_ATLAS_H

#include <SDL.h>
#include <SDL_image.h>
#include <fstream>
#include "json/json.h"

class TextureAtlas {
public:
	TextureAtlas(const char* jsonPath, SDL_Renderer* renderer);
	~TextureAtlas();

	SDL_Rect* operator[](std::string const &key) const;	//get subtexture by name
	SDL_Texture* getTexture() const;

private:
	std::map<std::string, SDL_Rect*> mSubtextures;
	SDL_Texture* mTexture;
	SDL_Surface* mSurface;

	void loadTexture(const char* path, SDL_Renderer* renderer);
};
#endif
{% endhighlight %}  

 Now it's time to dive into implementing this class. Go ahead and create your cpp file, we'll start with the constructor, which is going to be doing most of the work in the class.

 The first thing we need to do it open our json file (this is where the file stream comes into play):  
{% highlight C++ %}
 std::ifstream fileStream = std::ifstream(jsonPath, std::ifstream::binary);
{% endhighlight %}
 Next, we're going to need to get the root of our json file. Therfore, declare a `Json::Value` object and name it root. This object will correspond to the first curly brace of the file, and it's children will be everything before the closing brace.
{% highlight C++ %}
Json::Value root;
fileStream >> root;	//Read the file
{% endhighlight %}
Notice how we're using the bitshift operator to get the root from the filestream. We can now output this to the console with:
{% highlight C++ %}
//Output the json file to console
std::cout << root.toStyledString() << std::endl;
{% endhighlight %}  

At this point, if you were to build and run your program, you would see your json file printed neatly inside the console (if it is indeed a valid json file and you created an instance of TextureAtlas inside `main()`).

Now it's time to load the texture, so call `loadTexture` and pass `root["TextureAtlas"]["imagePath"].asCString()` and the pointer to the renderer. `TextureAtlas` is a child of root (in the example json file) and `imagePath` is a child of `TextureAtlas`. Jsoncpp uses square brackets to access children, it's that easy.  
However, our `loadTexture` method doesn't take a `Json::Value` as an arguement, it takes a string, so we get the value of `imagePath` as a C string (if you're not using c-style strings in your code, you can use `.asString()` instead). <sup>(Don't worry about the implementation of *loadTexture*, we'll cover that soon.)</sup>

Time to parse our subtextures! Once again, declare a `Json::Value` object; call it subtextures or something else appropriate. Assign it to be like so:  
{% highlight C++ %}
//Find the array of subtextures.
const Json::Value subtextures = root["TextureAtlas"]["SubTexture"];
std::cout << "Loading subtextures..." << std::endl;
{% endhighlight %}
Instead of `imagePath` this time, we're looking for `SubTexture` (which is an array). We're going to need to iterate through the array of subtextures and, for each one, push an `SDL_Rect` (pointer) into our map, using the entries name as the key. The for-loop is similar to any other and can be declared like this: (note the use of `Json::Value::size()`)  
{% highlight C++ %}
for (int index = 0; index < subtextures.size(); ++index)
{
{% endhighlight %}  
Because we're iterating though an array, we can now use the index of the for-loop to access each entry in the json file. Go ahead and declare a string for the name of the entry and and `SDL_Rect` pointer for the bounds.  
{% highlight C++ %}
//get the name of the subtexture
std::string key = subtextures[index]["name"].asString();

//get the source rectangle of the subtexture
SDL_Rect* rect = new SDL_Rect();
rect->x = subtextures[index]["x"].asInt();
rect->y = subtextures[index]["y"].asInt();
rect->w = subtextures[index]["width"].asInt();
rect->h = subtextures[index]["height"].asInt();

printf("Subtexture: Name: %s\tX: %d\tY: %d\tW: %d\tH: %d\n", key.c_str(), rect->x, rect->y, rect->w, rect->h);

//add the name and rectangle to the map
mSubtextures[key] = rect;
{% endhighlight %}
Woah, let's just review those assignments for a sec. We get the current entry with `subtextures[index]` and append `["name"].asString()` to get the name of the current entry from the file and parse it as a string. We then assign the `x`, `y`, `width` and `height` values in the same way, but with `.asInt()` instead of `.asString()`.

**But Alex, the example project's code is different! It has atoi() and .asCString()! What's going on???**  
___Don't panic!___ The program I'm using to pack my textures creates the json file with all values as strings. If you're json file has quotes around the numerical values, you'll have to do the same. What is the same, you ask? atoi() parses a c-style string to an integer, so I'm getting each value as a c-style string and parsing it that way.  
**Why didn't you take the quotes out for the tutorial then??**
So that, if you're using Shoebox or a similar program, you can fix the problem now and not be trawling the internet for solutions. \*drops mic\*

Back to business: at the end of the loop, insert the rectangle into the map with the name as the key. Congratulations, you've parsed a json file.

Moving on: the loadTexture method is straightforward and pretty much the same wherever to find it / write it.
{% highlight C++ %}
void TextureAtlas::loadTexture(const char* path, SDL_Renderer* renderer)
{
	mSurface = IMG_Load(path);

	if (mSurface == nullptr)
	{
		printf("Unable to load image %s! SDL_image Error: %s\n", path, IMG_GetError());
	}
	else
	{
		//Create texture from surface pixels
		mTexture = SDL_CreateTextureFromSurface(renderer, mSurface);
		if (mTexture == nullptr)
		{
			printf("Unable to create texture from %s! SDL Error: %s\n", path, SDL_GetError());
		}
		else
		{
			printf("Loaded image %s successfully.\n", path);
		}


		//Get rid of old loaded surface
		SDL_FreeSurface(mSurface);

	}
}
{% endhighlight %}
You could return the pointer to the texture, instead of setting the member variable. It's just an alternative.

The `operator[]` and `getTexture` methods are even more straightforward, being just getters:  
{% highlight C++ %}
SDL_Rect* TextureAtlas::operator[](std::string const& key) const {
	return mSubtextures.at(key);
}

SDL_Texture* TextureAtlas::getTexture() const {
	return mTexture;
}
{% endhighlight %}

Congratz again, you've just completed the `TextureAtlas` class. With little work, this can be adapted/mutilated to work with SFML(the successor to SDL) or any other media library for that matter. (Heck, with a wrapper class for texture, you can make it agnostic).

It's time to return to `main.cpp` and tie up the loose ends.

Write a for-loop to populate the array of rectangles here with the corresponding ones from the atlas. In my example, my subtextures use the naming scheme (in the json file, and therefore in the atlas): *frameNUMBER.png* ("frame1.png", "frame2.png", ...). My loop looks like this:  
{% highlight C++ %}
for (int i = 0; i < NUM_FRAMES; ++i)
{
	//Populate our frame array. If you're making a sprite class, put this in the contructor and pass in a reference to the atlas.
	frames[i] = texAtlas[prefix + std::to_string(i) + postfix];
}
{% endhighlight %}
If you've rendered textures to the screen with SDL before (which I hope you have, because this tutorial assumes that knowledge), then you know you'll need to define a destination rectangle:  
{% highlight C++ %}
SDL_Rect dest;	//Where the texture will be drawn to on the screen
dest.x = 100;
dest.y = 100;
dest.w = frames[0]->w;
dest.h = frames[0]->h
{% endhighlight %}
All that's left is to write a render loop and draw the current frame to the screen (incrementing the index each time).
{% highlight C++ %}
SDL_SetRenderDrawColor(renderer, 255, 255, 255, 0);	//We'll be clearing the screen to black.
while (true)
{
	//Cycle through frames
	if (++currentFrame == NUM_FRAMES)
	{
		currentFrame = 0;
	}

	//Clear the screen
	SDL_RenderClear(renderer);

	SDL_RenderCopy(renderer, texture, frames[currentFrame], &dest); //Copy the image to the rendering object.

	//Update the screen with rendering operations
	SDL_RenderPresent(renderer);
}
{% endhighlight %}>

<h2><u>Voila. Animation with a texture packer.</u></h2>
<video src="{{ mysite.url }}/assets/posts/SDLAnimTut/example.mp4" controls></video>

If you want to continue from this point, you can take the variables from main and create a Sprite class and/or Animation class.

[source]: {{ mysite.url }}/assets/posts/SDLAnimTut/Source.zip
[libsdl]: https://www.libsdl.org/
[libsdl-img]: https://www.libsdl.org/projects/SDL_image/
[libsdl-img-direct]: https://www.libsdl.org/projects/SDL_image/release/SDL2_image-devel-2.0.0-VC.zip
[lazyfoo]: http://lazyfoo.net/SDL_tutorials/index.php
[jsoncpp]: ttps://github.com/open-source-parsers/jsoncpp
[jsoncpp-readme]: https://github.com/open-source-parsers/jsoncpp/blob/master/README.md
[shoebox]: http://renderhjs.net/shoebox/
[air]: ttps://get.adobe.com/air/
[xml-converter]: ttp://www.utilities-online.info/xmltojson/
[include-help]: http://lazyfoo.net/tutorials/SDL/01_hello_SDL/index.php
