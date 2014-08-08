SVG To PNG
========
Simple app to convert svg to png.

### [API Doc](http://connyay.github.io/svgtopng/)

### Security note:
SVG(s) & PNG(s) are stored on [Heroku](http://heroku.com/) for processing. Heroku has an [ephemeral filesystem](https://devcenter.heroku.com/articles/dynos#ephemeral-filesystem) which means the file system is destroyed when the server taken down (happens after an hour of non-use). Also, the filesystem is cleaned once daily (in case the dyno is never taken down).

##### This means 2 things:  
1) **Do not use this as a permanent storage!**  
2) Files are not accessible without the returned UUID. If desired, you may manually delete the svg & png by sending a `DELETE` request. (See [API Doc](http://connyay.github.io/svgtopng/#api-svgtopng-DeleteSvgAndPng) for more information)
