function load(json){
    $("#render").empty()
    $("#additional_fields").empty()
    $(".moveButton").css('display', 'block')

    var Render=new THREE.WebGLRenderer({ antialias: true });
    Render.shadowMapEnabled = true;
    var Scene=new THREE.Scene();
    var Figura;
    var controls;
    var Ancho=window.innerWidth;
    var Alto=window.innerHeight;
    var Angulo = 45;
    var Aspecto=Ancho/Alto;
    var cerca=0.1;
    var lejos=10000;
    var Camera =new THREE.PerspectiveCamera(Angulo,Aspecto,cerca,lejos);
    THREEx.WindowResize(Render, Camera);

    /******************************* inicio *******************/
    function inicio(){
        Render.setSize(Ancho,Alto);
        Render.setClearColor( 0xcccccc );
        $('#render').append(Render.domElement);
        Camera.position.z=0;
        Camera.position.y=0;
        Scene.add(Camera);
        //controls=new THREE.OrbitControls(Camera,Render.domElement);
        controls = new THREE.FirstPersonControls( Camera );
        controls.lookSpeed = 0.1;
        controls.movementSpeed = 100;
        controls.lookVertical = true;
        controls.activeLook=true;
    }

    function animacion(){
        requestAnimationFrame(animacion);
        render_modelo();
        tiempo=0.001;
          distancia=100;
      recorrido=distancia*tiempo;
    }
    ///Свет
    var light = new THREE.DirectionalLight( 0xfcf9e8, 0.5 );
    Scene.add(light);

    var ambiColor = "#cbc9bb";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    Scene.add(ambientLight);

    var manager = new THREE.LoadingManager();
    var loader  = new THREE.ImageLoader( manager );
    var texture =[];

    json.forEach(( item ) => {
        loader.load( 'uploads/'+item.diff_map, ( image ) => {
            texture[item[0]] = new THREE.Texture();
            texture[item[0]].image = image;
            texture[item[0]].needsUpdate = true;
        });
    });

    manager.onProgress = ( item, loaded, total ) => {
        console.log('onProgress');
    };

    var onProgress = ( xhr ) => {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = ( xhr ) => {
        console.log('onError');
    };

   /* for (var i = meshes.length - 1; i >= 0; i--) {
        Scene.scene.remove(meshes[i]);
    }*/

    var meshes = [];

    var objLoader = new THREE.OBJLoader();
    objLoader.load( json[0].url, ( object ) => {

        object.traverse( ( child ) => {
            if ( child instanceof THREE.Mesh ){
                meshes.push(child);
            }
        });

        var mapHeight = [];

        for (var i = meshes.length - 1; i >= 0; i--) {
            json.forEach((item) => {
                if(meshes[i].name == item.name){
                meshes[i].material = new THREE.MeshPhongMaterial({map: texture[item[0]], specular: 0xfceed2, bumpMap: new THREE.TextureLoader().load( 'uploads/'+item.bump_map ), bumpScale: 0.4, shininess: 25});
                }
            });
            Scene.add(meshes[i]);
        }
        var i = 1;
    meshes.forEach((item) =>{
        $('#additional_fields')
            .add('<p>'+item.name+'<p/>')
            .add('<form action="server/textureAdd.php" method="post"  enctype="multipart/form-data" ><div class="file-upload"><label><input type="file" name="diff_map"><span>diff_map</span></label></div><div class="file-upload"><label><input type="file" name="bump_map"><span>bump_map</span></label></div><input type="hidden" name="id_scena" value="'+json[0].id+'"><input type="hidden" name="name" value="'+item.name+'"><a href=# onclick=" TextureLoad(this.parentNode); return false;" class="button31 '+item.name+'" tabindex="0" ></a></form> ')
            //.add('<br />')
            //.add("<div style='display: none;'  class='cssload-loader "+item.name+"'><div class='cssload-inner cssload-one'></div><div class='cssload-inner cssload-two'></div><div class='cssload-inner cssload-three'></div></div> ")
            .appendTo('#additional_fields');
            i++;
    });
    }, onProgress, onError );

    //........Скролл.............
    var fov = Camera.fov, zoom = 1.0,zoom1 = 1.0, inc = 0.02;

    function addOnWheel(elem, handler) {
        if (elem.addEventListener) {
            if ('onwheel' in document) {
            // IE9+, FF17+
                elem.addEventListener("wheel", handler);
            } else if ('onmousewheel' in document) {
            // устаревший вариант события
                elem.addEventListener("mousewheel", handler);
            } else {
            // 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
                elem.addEventListener("MozMousePixelScroll", handler);
            }
        } else { // IE8-
            text.attachEvent("onmousewheel", handler);
        }
    }

    var scale = 1;

    addOnWheel(document.body,(e) => {
        var delta = e.deltaY || e.detail || e.wheelDelta;
        if (delta > 0){
         if((zoom+inc)<=1) {zoom += inc;zoom1 -= 2;}
        } else {
            if ((zoom-inc)>=0.25){zoom -= inc;zoom1 += 2; }
        }
        document.getElementById('rotateButton').innerHTML = (zoom1).toFixed(0);
        e.preventDefault();
    });

    var clock = new THREE.Clock();

    function render_modelo(){
        var delta = clock.getDelta();
        controls.update(delta);
        Camera.fov = fov * zoom;
        Camera.updateProjectionMatrix();
        Render.render(Scene,Camera);
    }
    inicio();
    animacion();
}