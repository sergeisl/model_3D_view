/*
 * Контроллер камеры от третьего лица
 * 
 * camera - камера кторую контролирует контроллер
 * x, y, z - точка куда смотрит камера
 * angle - угол наклона камеры по вертикали
 * maxAngle, minAngle - лимиты, ограничивающие угол наклона камеры
 * direction - направление обзора
 * distance - дистанция от камеры до наблаюдаемой точки (x, y, z)
 * 
 * @param {type} camera
 * @returns {CameraController}
 */

function CameraController(camera) {
    this.camera = camera;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.angle = 0.6;
    this.direction = Math.PI;
    this.distance = 5;
    this.updateCamera();
}

/*
 * Обновить состояние камеры
 * Метод должен быть вызван после внесения изменений в параметры 
 * CameraController
 */

CameraController.prototype.updateCamera = function () {
	var dir = this.direction + Math.PI;
    var zA = Math.cos(this.angle);
    var vx = - zA * Math.sin(dir);
    var vy = Math.sin(this.angle);
    var vz = zA * Math.cos(dir);
    this.camera.position.set(vx * this.distance + this.x, vy * this.distance + this.y, vz * this.distance + this.z);
    this.camera.lookAt(new THREE.Vector3(this.x, this.y, this.z));
    this.camera.updateProjectionMatrix();
};