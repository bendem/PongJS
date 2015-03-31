<?php

function includeJS($file) {
    $js = file($file);
    foreach ($js as $i => $line) {
        if(preg_match('/^:include\\s+([^;]+);$/', $line, $matches)) {
            $js[$i] = includeJS($matches[1]);
        }
    }
    return implode('', $js);
}

if(!file_put_contents('pong_compiled.js', includeJS('pong.js'))) {
    die();
}

?>
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="pong.css">
        <title>Pong</title>
    </head>
    <body>
        <div class="content-wrapper">
            <canvas id="pong"></canvas>
        </div>
        <script type="text/javascript" src="pong_compiled.js"></script>
    </body>
</html>
