const gulp = require("gulp");
const twig = require("gulp-twig");
const sync = require("browser-sync");
const autoprefixer = require("gulp-autoprefixer");
const prettyHtml = require("gulp-pretty-html");
const gcmq = require("gulp-group-css-media-queries");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const clean = require("gulp-clean");
const copy = require("gulp-copy");
const del = require("del");
const imageMin = require("gulp-imagemin");
const svgstore = require("gulp-svgstore");
const minify = require("gulp-csso");

// Server
const browserServer = () => {
	sync.init({
		server: {
			baseDir: "./dist",
		},
		notify: false,
	});
};

exports.browserServer = browserServer;

//Watcher
const watch = () => {
	gulp.watch("assets/scss/**/*.scss", gulp.series(scss));
	gulp.watch("assets/**/*.js", gulp.series(js));
	gulp.watch("assets/templates/**/*.twig", gulp.series(template, prettyHTML));
	gulp.watch("assets/img/**/*", gulp.series(template, cleanFolder, copyImages));
	gulp.watch(
		"assets/img/icon-svg/*.svg",
		gulp.series(removeSvgSprite, svgStore)
	);
};

exports.watch = watch;

// Twig template
const template = () => {
	return gulp
		.src("assets/templates/*.twig")
		.pipe(twig())
		.pipe(gulp.dest("dist/"))
		.pipe(sync.stream());
};

exports.template = template;

const templateBuild = () => {
	return gulp
		.src("assets/templates/*.twig")
		.pipe(twig())
		.pipe(gulp.dest("build/"))
		.pipe(sync.stream());
};

exports.templateBuild = templateBuild;

// Styles
const scss = () => {
	return gulp
		.src("assets/scss/main.scss")
		.pipe(sass())
		.pipe(rename("style.css"))
		.pipe(
			autoprefixer(["last 15 version", "> 1%", "firefox 14", "ie 8", "ie 7"], {
				cascade: true,
			})
		)
		.pipe(gcmq())
		.pipe(gulp.dest("dist/css"))
		.pipe(sync.stream());
};

exports.scss = scss;

const scssBuild = () => {
	return gulp
		.src("assets/scss/main.scss")
		.pipe(sass())
		.pipe(rename("style.css"))
		.pipe(
			autoprefixer(["last 15 version", "> 1%", "firefox 14", "ie 8", "ie 7"], {
				cascade: true,
			})
		)
		.pipe(gcmq())
		.pipe(gulp.dest("dist/css"))
		.pipe(sync.stream());
};

exports.scssBuild = scssBuild;

const cssMin = () => {
	return gulp
		.src("dist/css/style.css")
		.pipe(minify())
		.pipe(gulp.dest("build/css"));
};
exports.cssMin = cssMin;

// JS
const js = () => {
	return gulp
		.src("assets/js/**/*.js")
		.pipe(gulp.dest("dist/js/"))
		.pipe(sync.stream());
};

exports.js = js;

// Pretty Html
const prettyHTML = () => {
	return gulp
		.src("./dist/*.html")
		.pipe(
			prettyHtml({
				indent_size: 2,
				indent_char: " ",
				unformatted: ["code", "pre", "em", "strong", "span", "i", "b", "br"],
			})
		)
		.pipe(gulp.dest("./dist"));
};

exports.prettyHTML = prettyHTML;

// Pretty Html
const prettyHTMLBuild = () => {
	return gulp
		.src("./dist/*.html")
		.pipe(
			prettyHtml({
				indent_size: 2,
				indent_char: " ",
				unformatted: ["code", "pre", "em", "strong", "span", "i", "b", "br"],
			})
		)
		.pipe(gulp.dest("./build"));
};

exports.prettyHTMLBuild = prettyHTMLBuild;

// Copy files
const copyFiles = () => {
	return gulp
		.src(
			[
				"assets/fonts/**/*.{woff,woff2}",
				"assets/img/**",
				"assets/js/**",
				"assets/libs/**",
			],
			{
				base: "./assets",
			}
		)
		.pipe(gulp.dest("./dist"));
};

exports.copyFiles = copyFiles;

const copyFilesBuild = () => {
	return gulp
		.src(
			[
				"dist/fonts/**/*.{woff,woff2}",
				"dist/img/**",
				"dist/js/**",
				"dist/libs/**",
			],
			{
				base: "./dist",
			}
		)
		.pipe(gulp.dest("./build"));
};

exports.copyFilesBuild = copyFilesBuild;

// Copy files
const copyImages = () => {
	return gulp
		.src(["assets/img/**"], {
			base: "./assets",
		})

		.pipe(gulp.dest("./dist"))
		.pipe(sync.stream());
};

exports.copyImages = copyImages;
//clean;
const cleanFolder = () => {
	return gulp.src("./build/").pipe(clean({ read: false }));
};

exports.cleanFolder = cleanFolder;

const removeSvgSprite = () => {
	return del("dist/img/icon-svg/sprite/sprite-svg.svg");
};

exports.removeSvgSprite = removeSvgSprite;

// Image min

const imagesMin = () => {
	return gulp
		.src("dist/img/**/*.{png,jpg,gif}")
		.pipe(
			imageMin([
				imageMin.optipng({ optimizationLevel: 3 }),
				imageMin.mozjpeg({ quality: 75, progressive: true }),
			])
		)
		.pipe(gulp.dest("build/img"));
};

exports.imagesMin = imagesMin;

/*______ SVG-sprite ______*/

const svgStore = () => {
	return gulp
		.src("assets/img/icon-svg/*.svg")
		.pipe(
			svgstore({
				inlineSvg: true,
			})
		)
		.pipe(rename("sprite.svg"))
		.pipe(gulp.dest("dist/img/icon-svg/sprite/"));
};

exports.svgStore = svgStore;

exports.build = gulp.series(
	cleanFolder,
	gulp.parallel(
		templateBuild,
		scssBuild,
		cssMin,
		copyFilesBuild,
		prettyHTMLBuild
	),
	imagesMin
);

exports.default = gulp.series(
	gulp.parallel(
		template,
		scss,
		copyFiles,
		removeSvgSprite,
		svgStore,
		prettyHTML
	),
	gulp.parallel(browserServer, watch)
);
