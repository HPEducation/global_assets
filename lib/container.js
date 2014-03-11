var containers = new Array();

function container_create(name, top) {
	var container = new Object();
	container.top = top;
	container.name = name;
	container.objects = new Array();
	containers.push(container);
}

function container_locate(name) {
	//--- name: name of the container
	//--- locate the container by name in containers array
	for (var i=0; i<containers.length; i++) {
		if (containers[i].name == name) return containers[i];
	}
	return null;
}

function container_fill(name) {
	//--- name: name of the container
	//--- arguments: list of jQuery objects to be added to the container list
	//--- find the container
	var container = container_locate(name);
	if (container == null) return;
	//--- add objects to it
	var obj = null;
	var jQueryObj = null;
	for (var i=1; i<arguments.length; i++) {
		jQueryObj = arguments[i];
		//--- obtain jQuery height
		obj = new Object();
		obj.object = jQueryObj;
		obj.height = jQueryObj.height();
		//--- add to objects list
		container.objects.push(obj);
		//--- once added, hide the jQuery object from view
		jQueryObj.hide();
	}
}

function container_hide(name) {
	//--- name: name of the container
	//--- hide all objects in a container
	var container = container_locate(name);
	if (container == null) return;
	if (container.objects.length == 0) return;
	var jQueryObj = null;
	for (var i=0; i<container.objects.length; i++) {
		jQueryObj = container.objects[i].object;
		jQueryObj.hide();
	}
}

function container_findObject(container, obj) {
	var jQueryObj = null;
	for (var i=0; i<container.objects.length; i++) {
		jQueryObj = container.objects[i].object;
		if (jQueryObj.get(0) == obj.get(0)) return container.objects[i];
	}
	return null;
}

function container_filter(name) {
	//--- name: name of the container
	//--- arguments: list of jQuery objects to be shown in the container, i.e.
	//--- all other objects to be hidden.
	//--- find the container
	var container = container_locate(name);
	if (container == null) return;
	if (container.objects.length == 0) return;
	//--- hide all objects in this container first
	container_hide(name);
	//--- for each object in the argument, show it, while repositioning it (change top)
	var currentTop = container.top;
	var obj = null;
	var jQueryObj = null;
	for (var i=1; i<arguments.length; i++) {
		jQueryObj = arguments[i];
		//--- find object in container
		obj = container_findObject(container, jQueryObj);
		if (obj == null) continue;
		jQueryObj.show();
		jQueryObj.offset({top: currentTop});
		currentTop += obj.height;
	}
}