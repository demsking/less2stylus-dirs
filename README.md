# LESS to Stylus converter

Convert LESS to Stylus by parsing LESS sources and traversing resulting AST.

## Installation

```shell
npm install -g less2stylus-dirs
```

## Command line usage

```shell
less2stylus-dirs sourcedir outputdir
```

## Programmatic usage

```js
var less2stylusDirs = require('less2stylus-dirs');

var src = './less';
var dest = './stylus';

less2stylusDirs(src, dest);
```

## Bootstrap translation

Bootstrap 3.0 can be translated as-is.

## Notes

  * every mixin with no params or all params having default values will have
    corresponding class generated, so

        .some-mixin() {
          ...
        }

    results in

        some-mixin()
          ...

        .some-mixin
          some-mixin()

  * call to a mixin with no params will result in an `@extend` of corresponding
    class, so

        body {
          .some-mixin()
        }

    results in

        body
          @extend .some-mixin

  * `@media` directives which use variables to specify a condition on which
    rules apply will translate into an additional variable declaration which
    holds `@media` condition. This is because of Stylus limitation not to allow
    variables inside `@media` conditions.

        @media screen and (min-width: tablet) {
          ...
        }

    results in

        var213123edf25df1a = "screen and (min-width: " + tablet + ")"
        @media var213123edf25df1a
          ...

  * if there are mixins which named `translate`, `translate3d`, `scale`, `skew`,
    `rotate` then they will be prefixed with `mixin-` in resulted Stylus
    sources. This is to prevent recursive mixin invokations.
