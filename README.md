# TypeScript Project Template

## What's included

* Gruntfile for TypeScript
* Mocha+chai testing with Testem
* jQuery d.ts
* Default gitignore and attributes

## Usage

Clone this
```
$ git clone https://github.com/yaakaito/typescript-proj.git
```

Delete `.git` :/
```
$ rm -rf .git
```

Install modules
```
$ npm install
$ bower install
```

## Grunt commands

### compile

Compile `src/**/*.ts` and `test/**/*.ts`.

```
$ grunt compile
```

### build

Concat and uglify.

```
$ grunt build
```

### generate

Generate website.

```
$ grunt generate
```

### preview

```
$ grunt preview
```

## Testing

Run with testem.

```
$ testem
```
