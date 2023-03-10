
const wrapper = (text, width = false, bottom = false) => {
    return `<div class = "inst" style = \"${(width)?"min-width:100%;": ""}
    ${(bottom)?"margin-bottom:60px;": ""}\"> ${text}</div>`
}

let ball_animation_frame_id = null;
let state = false;

const animBall = () => {
    const ball = document.querySelector("#virtual-chinrest-circle");
    const dx = -2;
    const x = parseInt(ball.style.left);
    ball.style.left = `${x + dx}px`;
    ball_animation_frame_id = requestAnimationFrame(animBall);    
}

const setBall = () => {
    const ball = document.querySelector("#virtual-chinrest-circle");
    if (ball != null){
        const square = document.querySelector("#virtual-chinrest-square");
        const rectX = document.querySelector(".inst").getBoundingClientRect().width - 30;
        const ballX = rectX * 0.85; // define where the ball is
        ball.style.left = `${ballX}px`;
        square.style.left = `${rectX}px`;
    }
}

const cal_c = (e) => {
    if (e.key == " " ||
    e.code == "Space" ||      
    e.keyCode == 32) {
        if (!state) {
            state = true;
             animBall();
        } else  {
            state = false;
            cancelAnimationFrame(ball_animation_frame_id);
            setBall();
        }
    }
}

const aspect_ratio = 85.6/53;
const ResizePhase = () => {
    const display_element = document.querySelector(".inst");
    // Event listeners for mouse-based resize
    let dragging = false;
    let origin_x, origin_y;
    let cx, cy, curr_width, curr_height, to_height, to_width;
    const scale_div = display_element.querySelector("#item");
    if (scale_div != null) {
        function mouseupevent() {
            dragging = false;
        }
        display_element.addEventListener("mouseup", mouseupevent);
        function mousedownevent(e) {
            e.preventDefault();
            dragging = true;
            origin_x = e.pageX;
            origin_y = e.pageY;
            cx = parseInt(scale_div.style.width);
            cy = parseInt(scale_div.style.height);
        }
        display_element
            .querySelector("#jspsych-resize-handle")
            .addEventListener("mousedown", mousedownevent);
        function resizeevent(e) {
            if (dragging) {
                curr_height = scale_div.style.height;
                curr_width = scale_div.style.width;
                let dx = e.pageX - origin_x;
                let dy = e.pageY - origin_y;
                if (Math.abs(dx) >= Math.abs(dy)) {
                    to_width = Math.round(Math.max(20, cx + dx * 2));
                    to_height = Math.round(Math.max(20, cx + dx * 2) / aspect_ratio);
                }
                else {
                    to_height = Math.round(Math.max(20, cy + dy * 2));
                    to_width = Math.round(aspect_ratio * Math.max(20, cy + dy * 2));
                }
                // This limits the maximun size
                if (to_height >= 300 || to_height <= 100) {
                    scale_div.style.height = curr_height + "px";
                    scale_div.style.width = curr_width + "px";
                } else {
                    scale_div.style.height = to_height + "px";
                    scale_div.style.width = to_width + "px";
                }
            }
        }
        display_element.addEventListener("mousemove", resizeevent);
    }
}

const circle_c = (ctx, x, y, r, color) => {
    ctx.lineWidth = 3;
    ctx.strokeStyle = color2hex(color);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
}

const diamond_c = (ctx, x, y, r, color) => {
    ctx.lineWidth = 3;
    ctx.beginPath();
        
    ctx.moveTo(x, y-r);
            
            // top left edge
    ctx.lineTo(x - r,  y);
            
            // bottom left edge
    ctx.lineTo(x, y + r);
            
            // bottom right edge
    ctx.lineTo(x + r, y);
            
            // closing the path automatically creates
            // the top right edge
    ctx.closePath();
     //context.linewidth = line_w;
    ctx.strokeStyle = color2hex(color);
    ctx.stroke();
}

const line = (ctx, x, y, r, color, mode) => {
    ctx.lineWidth = 3;
    let fromx, fromy, tox, toy;
    if (mode == "r"){
        const theta = radians([45,135][random(0, 2)]);
        [fromx, fromy] = [(-r/2 * Math.cos(theta)) + x, (-r/2 * Math.sin(theta)) + y];
        [tox, toy] = [(r/2 * Math.cos(theta)) + x, (r/2 * Math.sin(theta)) + y];
    } else if (mode == "h") {
        [fromx, fromy] = [x-r/2, y];
        [tox, toy] = [x+r/2, y]
    } else {
        [fromx, fromy] = [x, y-r/2];
        [tox, toy] = [x, y+r/2]
    }

    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.strokeStyle = color;
    ctx.stroke();
}


const cross_c = (ctx, x, y, r) => {
    ctx.lineWidth = 3;
    let fromx, fromy, tox, toy;
    for (let i = 0; i < 2; i++) {
        if (i) {
            [fromx, fromy] = [x-r/2, y];
            [tox, toy] = [x+r/2, y]
        } else {
            [fromx, fromy] = [x, y-r/2];
            [tox, toy] = [x, y+r/2]
        }
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.strokeStyle = "#fff";
        ctx.stroke();
    }
}

const exp_c = () => {
    const c = document.getElementById("myCanvas1");
    const urlvar = (jatos_run)? jatos.urlQueryParameters : jsPsych.data.urlVariables();
    const blocks = (Number(urlvar.blocks) == 0) ? 0 : (!isNaN(Number(urlvar.blocks))) ? Number(urlvar.blocks) : 12;
    const [colorHigh, colorLow] = (blocks != 0) ? trialObj["Reward"][1].colors : ["orange", "blue"];

    if (c) {
        if (state) state = false;
        else state = true;
        if (state) {
            let ctx = c.getContext("2d");
            const coordinates = xy_circle(100);
            cross_c(ctx, 200, 150, 30);
            let x, y;
            for(let i = 0; i < 6; i++) {
                [x, y] = coordinates[i];
                [x, y] = [x + 200, y + 150];
                if (i == 2) {
                    diamond_c(ctx, x, y, 30, "gray");
                    line(ctx, x, y, 30, "#fff", "h");
                } else if (i == 5) {
                    circle_c(ctx, x, y, 30, colorHigh);
                    line(ctx, x, y, 30, "#fff", "r");
                } else { 
                    circle_c(ctx, x, y, 30, "gray");
                    line(ctx, x, y, 30, "#fff", "r");
                }
            }
            const c2 = document.getElementById("myCanvas2");
            if (c2) {
                let ctx = c2.getContext("2d");
                cross_c(ctx, 200, 150, 30);
                const coordinates = xy_circle(100);
                let x, y;
                for(let i = 0; i < 6; i++) {
                    [x, y] = coordinates[i];
                    [x, y] = [x + 200, y + 150];
                    if (i == 2) {
                        diamond_c(ctx, x, y, 30, "gray");
                        line(ctx, x, y, 30, "#fff", "v");
                    } else if (i == 5) {
                        circle_c(ctx, x, y, 30, colorLow);
                        line(ctx, x, y, 30, "#fff", "r");
                    } else { 
                        circle_c(ctx, x, y, 30, "gray");
                        line(ctx, x, y, 30, "#fff", "r");
                    }
                }
            }
        }
    }
    if (c) state = true;
    else state = false;
}

const prac_c = () => {
    const c = document.getElementById("myCanvas");
    if (c) {
        if (state) state = false
        else state = true;
        if (state) {
            let ctx = c.getContext("2d");
            cross_c(ctx, 200, 150, 30);
            const coordinates = xy_circle(100);
            let x, y;
            for(let i = 0; i < 6; i++) {
                [x, y] = coordinates[i];
                [x, y] = [x + 200, y + 150];
                if (i == 2) {
                    diamond_c(ctx, x, y, 30, "gray")
                    line(ctx, x, y, 30, "#fff", "h")
                }
                else { 
                    circle_c(ctx, x, y, 30, "gray")
                    line(ctx, x, y, 30, "#fff", "r")
                }
            }
        }
    }
    const [h, v] = [document.getElementById("h"), document.getElementById("v")];
    //if (h == null) counter = 0;
    if (h) {
        if (state) state = false;
        else state = true;
        if (!state) {
            let ctxh = h.getContext("2d");
            let ctxv = v.getContext("2d");
            diamond_c(ctxh, 150, 75, 60, "gray");
            line(ctxh,150, 75, 60, "#fff", "h");
            diamond_c(ctxv, 150, 75, 60, "gray");
            line(ctxv, 150, 75, 60, "#fff", "v");
        }
    }
    if (h == null) state = true;
    else state = false;
}


const welcome = {
    type: jsPsychHtmlButtonResponse,
    stimulus: wrapper(`
    <p style="margin-bottom: 2rem;">??Bienevenida/o al experimento!</p>
    <p>Antes de empezar, es necesario que realices este experimento en una <b>habitaci??n tenuemente iluminada</b>, con el menor n??mero de distracciones posible: <b>apaga el tel??fono (o ponlo en silencio)</b>.</p>
    <p style="margin-bottom: 2rem;"><b>No cierres ni recargues esta p??gina hasta que se te indique que el experimento ha finalizado</b>.</p>
    <p style="margin-bottom: 3rem;">Una vez te asegures de cumplir con lo expresado arriba, pulsa <b>continuar</b> para empezar.</p>`),
    choices: ['continuar'],
};

const check = {
    type: jsPsychBrowserCheck,
    minimum_width: 1000,
    minimum_height: 600,
    window_resize_message: `
    <p>La ventana de tu navegador es demasiado peque??a para completar este experimento. Por favor, maximiza el tama??o de la ventana de tu navegador. Si la ventana de tu navegador ya tiene su tama??o m??ximo, no podr??s acceder al experimento.</p>
    <p>La anchura m??nima de la ventana es de <span id="browser-check-min-width"></span> px.</p>
    <p>La anchura de tu ventana es de <span id="browser-check-actual-width"></span> px.</p>
    <p>La altura m??nima de la ventana es de <span id="browser-check-min-height"></span> px.</p>
    <p>La altura de tu ventana es de <span id="browser-check-actual-height"></span> px.</p>`,
    resize_fail_button_text: `No puedo ajustar la pantalla`,
    inclusion_function: (data) => {
        return data.mobile == false;
      },
      exclusion_message: (data) => {
        if(data.mobile){
          return '<p>Debes hacer el experimento en un ordenador o un port??til.</p> <p>Puedes cerrar esta p??gina cuando quieras.</p>';
        }
        return `<p>No cumples con los requisitos para participar en este experimento.</p> <p>Puedes cerrar esta p??gina cuando quieras.</p>`
    },
};


// Instructions
const instructions_cal = {
    type:jsPsychInstructions,
    pages: [
        wrapper(`<p>Antes de comenzar con el experimento vas a realizar una breve fase de calibraci??n, que va a consistir de en dos peque??as pruebas. 
        Con la calibraci??n vamos a ajustar el tama??o de los est??mulos que te vamos a presentar a la distancia a la que te encuentras de la pantalla. Ahora vamos a explicarte c??mo vamos a reallizar este procedimiento antes de llevarlo a cabo.</p>
        <p>Antes de empezar con la calibraci??n, <b>aseg??rate de adoptar una posici??n que te permita extender las manos al teclado con comodidad</b>. Adem??s, <b>debes intentar centrarte lo m??ximo que
        puedas en la pantalla de tu ordenador</b>. Intenta mantenerte en esa postura durante todo el experimento.</p>`),
        wrapper(`<p>La primera prueba va a consistir en ajustar un objeto presentado por pantalla a una tarjeta con un tama??o estandarizado. Servir??n tarjetas de cr??dito/d??bito, carn?? de conducir, DNI o la tarjeta universitaria. 
        Deber??s utilizar una de dichas tarjetas para hacer que la tarjeta que aparezca por pantalla tenga el mismo tama??o. Para ello, puedes <b>arrastrar la esquina inferior derehca de la tarjeta para cambiar su tama??o</b>.</p>
        <p>Puedes probar a ajustar el tama??o de la tarjeta para pr??cticar antes de proceder con la calibraci??n:</p>
        <div id="item" style="border: none; height: 200px; width: ${aspect_ratio*200}px; background-color: #ddd; position: relative; background-image: url('src/img/dni.jpg'); background-size: 100% auto; background-repeat: no-repeat;">
            <div id="jspsych-resize-handle" style="cursor: nwse-resize; background-color: none; width: 25px; height: 25px; border: 5px solid red; border-left: 0; border-top: 0; position: absolute; bottom: 0; right: 0;">
            </div>
        </div>
        <p>En caso de que no tengas ninguna tarjeta, tambi??n es posible utilizar una regla. Si optas por una regla, deber??s ajustar la tarjeta para que tenga una anchura de 85.6 mil??metros.</p>`),
        wrapper(`<p>En la segunda prueba vamos a estimar d??nde se encuentra tu punto ciego visual, cuya posici??n va a depender de la distancia a la que te encuentres de la pantalla. Por tanto, esta prueba es fundamental para poder ajustar el tama??o de los est??mulos en pantalla.</p>
        <p>Para que puedas familirarizarte con la tarea antes de la calibraci??n, aqu?? te presentamos el procedimiento que vas a tener que llevar a cabo para que puedas practicar.</p>
        <p>Prueba lo siguiente:</p>
        <ol style="max-width:90%;">
        <li>Pon la mano izquierda en la <b>barra espaciadora</b>.</li>
        <li>T??pate el ojo derecho con la mano derecha.</li>
        <li>Atiende al cuadrado negro con el ojo izquierdo. No dejes de mirarlo.</li>
        <li>Cuando pulses la barra espaciadora el <b style = "color:red;">c??rculo rojo</b> comenzar?? a moverse.</li>
        <li>Pulsa la barra espaciadora cuando percibas que el c??rculo desaparece.</li>
        </ol>
        <div id="virtual-chinrest-circle" style="position: absolute;background-color: #f00; width: 30px; height: 30px; border-radius:50px;"></div>
        <div id="virtual-chinrest-square" style="position: absolute;background-color: #000; width:30px; height:30px"></div>
        `, false, true),
        wrapper(`<p>Si quieres repasar las instrucciones, pulsa <b>retroceder</b> para volver a leerlas.</p>
        <p>Si no, pulsa <b>seguir</b> para empezar con la calibraci??n.</p>`, true)
    ],
    allow_keys: false,
    button_label_previous: "Retroceder",
    button_label_next: "Seguir",
    show_clickable_nav: true,
    on_load: () => {
        let state = false;
        // Animate ball instructions
        document.addEventListener("click", setBall);
        document.addEventListener("keydown", cal_c);
        document.addEventListener("click", ResizePhase);
    },
    on_finish: () => {
        document.removeEventListener("click", setBall);
        document.removeEventListener("keydown", cal_c);
        document.removeEventListener("click", ResizePhase);

        state = false;
    }
}


const full_on = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    message: `<p>Antes de empezar con la calibraci??n, vamos a pasar a modo pantalla completa.</p>
    <p>En caso de que accidentamente salgas del modo pantalla completa, puedes volver activarlo pulsando la tecla <b>F11</b>.</p>
    <p>Pulsa el bot??n <b>pantalla completa</b> para empezar con la calibraci??n.</p>`,
    button_label: "Pantalla completa",
};

const full_off = {
    type: jsPsychFullscreen,
    fullscreen_mode: false,
};

// Virtual chin-rest
const resize = {
    type: jsPsychVirtualChinrest,
    blindspot_reps: 5,
    resize_units: "none",
    post_trial_gap:500,
    viewing_distance_report: "none",
    item_path: 'src/img/dni.jpg',
    adjustment_prompt: `
    <div style="text-align: left;">
    <p>Haz clic y arrastra la esquina inferior derecha de la imagen hasta que tenga el mismo tama??o que una tarjeta de tama??o estandarizado sostenida contra la pantalla.</p>
    <p>Si no tienes acceso a una tarjeta real, puedes utilizar una regla para medir la anchura de la imagen. Debes asegurarte de que la anchura es de 85.6 mm (8.56 cm).</p>
    </div>`,
    adjustment_button_prompt: `Haz clic aqu?? cuando la imagen tenga el tama??o correcto`,
    blindspot_prompt: `<p>Ahora vamos a medir a qu?? distancia te encuentras de la pantalla:</p>
    <div>
    <ol style="max-width:80%; text-align: left;">
    <li>Pon la mano izquierda en la <b>barra espaciadora</b>.</li>
    <li>T??pate el ojo derecho con la mano derecha.</li>
    <li>Atiende al cuadrado negro con el ojo izquierdo. No dejes de mirarlo.</li>
    <li>Cuando pulses la barra espaciadora el <b style = "color:red;">c??rculo rojo</b> comenzar?? a moverse. </li>
    <li>Pulsa la barra espaciadora cuando percibas que el c??rculo desaparece.</li>
    </div>
    </ol>
    <p style = "margin-bottom: 30px;">Pulsa la barra espaciadora para empezar.</p>`,
    blindspot_measurements_prompt: `repeticiones pendientes: `,
    on_finish: (data) => {
        jsPsych.data.addProperties({px2deg: data.px2deg,
        viewing_distance: data.view_dist_mm,});
    }
};

const instructions_prac = {
    type:jsPsychInstructions,
    pages: [
        wrapper(`<p>Ya has terminado la calibraci??n, ahora vamos a empezar con el experimento.</p>
        <p>Durante la tarea se te presentar??n por pantalla 6 figuras conformando un c??rculo imaginario. En primer lugar, deber??s atender a la <b>figura que es diferente</b> al resto. Esta siempre ser?? un <b>rombo</b>.</p>
        <canvas id="myCanvas" width="400" height="300" style = "border-radius: 3%; background-color: #000"></canvas>
        <p>Lo que puedes ver arriba es un ejemplo de lo que ver??s durante el experimento.</p>`),
        wrapper(`<p>Dentro de cada figura aparecer?? una l??nea. Tu tarea consistir?? en <b>determinar la orientaci??n de la l??nea que se encuentra dentro del rombo</b>.</p>
        <div style = "display: flex; flex-direction: row; justify-content: space-around; margin-top: 30px;">
        <div>
        <canvas id="h" width="300" height="150" style = "border-radius: 3%; background-color: #000"></canvas>
        <p><b>Si la l??nea es horizontal, pulsa C.</b></p>
        </div>
        <div>
        <canvas id="v" width="300" height="150" style = "border-radius: 3%; background-color: #000"></canvas>
        <p><b>Si la l??nea es vertical, pulsa G.</b></p>
        </div>
        </div>
        <p>Es necesario que <b>utilices ambas manos</b> para emitir una respuesta. Para ello, <b>coloca el dedo ??ndice de tu mano izquierda sobre la tecla C</b> y <b>el dedo ??ndice de tu mano derecha sobre la tecla G</b>
        mientras est??s realizando el experimento.</p>`),
        wrapper(`<p>Antes de empezar con el experimento, vas a realizar una breve fase de pr??ctica para que te familiarices con la tarea.</p>
        <p>Si quieres repasar las instrucciones, pulsa <b>retroceder</b>. Si quieres continuar, pulsa <b>seguir</b>.`)
    ],
    allow_keys: false,
    button_label_previous: "Retroceder",
    button_label_next: "Seguir",
    show_clickable_nav: true,
    post_trial_gap: 1000,
    on_load: () => {
        prac_c();
        document.addEventListener("click", prac_c);

    },
    on_finish: () => {
        //Fade to black transition
        document.body.classList.add("black");
        document.body.style.cursor = 'none';
        document.removeEventListener("click", prac_c);
        state = false;
    },
    //post_trial_gap: 2000,
}

const pre_prac = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Estas a punto de empezar la pr??ctica, recuerda:</p>
    <p><b>Si la l??nea en el interior del diamante es horizontal, pulsa C</b>.</p>
    <p><b>Si la l??nea en el interior del diamante es vertical, pulsa G</b>.</p>
    <p>Pulsa la barra espaciadora para empezar la pr??ctica.</p>`,
    choices: [' ']
};


const instructions_exp = {
    type: jsPsychInstructions,
    pages: () => {
        const urlvar = (jatos_run)? jatos.urlQueryParameters : jsPsych.data.urlVariables();
        const blocks = (Number(urlvar.blocks) == 0) ? 0 : (!isNaN(Number(urlvar.blocks))) ? Number(urlvar.blocks) : 12;
        const [colorHigh, colorLow] = (blocks != 0) ? trialObj["Reward"][1].colors : ["orange", "blue"];


        return [
            wrapper(`<p>Has terminado la pr??ctica, ??muy bien!</p>
            <p>En el experimento van a cambiar algunas respecto a lo que has hecho en la pr??ctica.</p>
            <p>En primer lugar, en funci??n de tu desempe??o, en la tarea <b>podr??s ganar o perder una determinada cantidad de puntos</b> en cada ensayo. Si respondes correctamente ganar??s puntos, mientras que si fallas perder??s puntos. 
            Por otro lado, cuanto m??s r??pido respondas, m??s puntos ganar??s (si la respuesta es correcta) o perder??s (si no lo es), mientras que si respondes con mayor lentitud la cantidad de puntos ganados o perdidos ser?? menor. En todo caso, si tardas demasiado en contestar no ganar??s ni perder??s puntos. </p>
            <p>Por tanto, para maximizar la cantidad de puntos que es posible obtener, intenta responder lo m??s r??pido que puedas sin cometer errores.</p>`),
            wrapper(`<p>Otra cosa que va a cambiar en el experimento es que en algunos ensayos uno de <b>los c??rculos que acompa??an al rombo podr??n aparecer en otro color</b>. Los colores en los que puede aparecer el c??rculo son <b>${colors_t(colorHigh)}</b> y <b>${colors_t(colorLow)}</b>.</p>
            <div style = "display: flex; flex-direction: row; justify-content: space-around; margin: 30px auto;">
            <canvas id="myCanvas1" width="400" height="300" style = "border-radius: 3%; background-color: #000"></canvas>
            <canvas id="myCanvas2" width="400" height="300" style = "border-radius: 3%; background-color: #000"></canvas>
            </div>
            <p><b>El color de los c??rculos influir?? en la cantidad de puntos que puedes ganar</b>.</p>
            <p>Si el c??rculo se presenta en color <b>${colors_t(colorHigh)}</b> <b>ganar??s (o perder??s) 10 veces m??s puntos</b> de lo habitual.</p>
            <p>En el caso de que uno de los c??rculos aparezca de color <b>${colors_t(colorLow)}</b> no ganar??s ni perder??s puntos extra.</p>
            <p>Sin embargo, tu tarea sigue siendo la misma: discriminar la orientaci??n de la l??nea en el interior del diamante. Atender a los c??rculos solo perjudicar?? lo bien que hagas la tarea, por lo que <b>trata de ignorar el color de los c??rculos</b>.</p>`),
            wrapper(`<p>La cantidad de puntos que gan??s se traducir?? en la obtenci??n de diferentes medallas, que ir??s desbloqueando conforme avance el experimento:</p>
            <img src="src/img/medals/MedalDisplay.jpg" width="700" height="175">
            <p>Los puntos necesarios para ganar cada medalla est??n calibrados sobre la base de estudios previos, por lo que al final del experimento te informaremos como de bien lo has hecho respecto a otros participantes.</p>`),
            wrapper(`<p>Ahora va a empezar al experimento.</p>
            <p>El experimento va a constar de dos fases, cada una con ${`${blocks.toString()} bloque${(blocks > 1) ? `s` : ``}`} de 24 ensayos.</p>
            <p>Entre bloques podr??s descansar si lo necesitas.</p>
            <p>La duraci??n aproximada del experimento ser?? de 40 minutos.</p>
            <p>Si quieres repasar las instrucciones, pulsa <b>retroceder</b>. Si quieres continuar, pulsa <b>seguir</b>.`, true),
        ]
    },
    allow_keys: false,
    button_label_previous: "Retroceder",
    button_label_next: "Seguir",
    show_clickable_nav: true,
    post_trial_gap: 1000,
    on_load: () => {
        document.addEventListener("click", exp_c);

    },
    on_finish: () => {
        //Fade to black transition
        document.body.classList.add("black");
        document.body.style.cursor = 'none';
        document.removeEventListener("click", exp_c);

    },
    post_trial_gap: 1000,
}


const pre_exp = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Estas a punto de empezar el experimento, recuerda:</p>
    <p><b>Si la l??nea en el interior del diamante es horizontal, pulsa C</b>.</p>
    <p><b>Si la l??nea en el interior del diamante es vertical, pulsa G</b>.</p>
    <p>Pulsa la barra espaciadora para empezar el experimento.</p>`,
    choices: [' ']
};




const questions = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<h3 style="margin-bottom: 40px">Preguntas post-experimento:</h3>`,
    html: `<div id="form">
    <label class="statement">??Con qu?? frecuencia crees te has distraido durante la tarea (p.ej. por una notificaci??n del m??vil o ruido ambiental)?</label>
    <ul class='likert'>
      <li>
        <input type="radio" name="likert" value="1">
        <label>Nunca</label>
      </li>
      <li>
        <input type="radio" name="likert" value="2">
        <label></label>
      </li>
      <li>
        <input type="radio" name="likert" value="3">
        <label></label>
      </li>
      <li>
        <input type="radio" name="likert" value="4">
        <label></label>
      </li>
      <li>
        <input type="radio" name="likert" value="5">
        <label>Con mucha frecuencia</label>
      </li>
    </ul>
    <label class="statement">??Tienes alg??n comentario respecto al experimento? Puedes expresar tu opini??n debajo:</label>
    <textarea id="text" name="opinion" rows="5" cols="80" style = "display: block" placeholder="Creo que el experimento..."></textarea> </br>
    </div>
    <p style="display: block; margin-bottom: 50px">Una vez que hayas respondido a las preguntas, pulsa <b>terminar</b> para salir del experimento.</p>`,
    button_label: "Terminar",
    on_finish: (data) => {
        jsPsych.data.addDataToLastTrial({
            distraction_rating: data.response["likert"],
            opinion_text: data.response["opinion"],
        })
        data.response = "none"
        if (jatos_run) {
            const results = jsPsych.data.get().filter([{trial_type: "psychophysics"}, {trial_type: "survey-html-form"}]).csv();
            jatos.submitResultData(results);
        }
    }
  }