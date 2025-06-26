#!/usr/bin/env -S just -f

set shell := ["fish", "-c"]
this := just_executable() + " -f " + quote(source_file())

_:
    @{{ this }} --list --unsorted

update_simplecss:
    curl -L 'https://raw.githubusercontent.com/kevquirk/simple.css/refs/heads/main/simple.min.css' | \
        string replace --all 'body>' '#app>' | \
        string replace --all 'body{' '#app{' \
        > dist/simple.min.css

update_vue:
    curl -L 'https://unpkg.com/vue@3.5.17/dist/vue.global.js' > dist/vue.global.js
    curl -L 'https://unpkg.com/vue@3.5.17/dist/vue.global.prod.js' > dist/vue.global.prod.js

fmt:
    {{ this }} --fmt --unstable
