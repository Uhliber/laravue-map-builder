<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Map Builder') }}</title>
        <meta name="description" content="A modern drag-and-drop map builder powered by Laravel and Vue.js. Easily create, customize, and manage interactive maps with a fast and intuitive interface.">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">

        <script>
        (function() {
            const theme = localStorage.getItem("theme");

            const systemDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

            if (
                theme === "dark" ||
                (!theme && systemDark)
            ) {
                document.documentElement.classList.add("dark");
            }
        })();
        </script>

        <!-- Scripts -->
        @routes
        @vite(['resources/js/app.ts', "resources/js/Pages/{$page['component']}.vue"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
