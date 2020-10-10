extends Control

enum TypesOfPinPoints{
	MeetingPoint,
	Hero
}

signal createdEvent;
signal closedSideBar;

var currentPinOpen = null;
var currentSideBarOpen = null;
var isOpeningSideBar = false;

onready var http_req := get_node("HTTPRequest");

#var mainApi = "https://bjbdi.sse.codesandbox.io/"
var mainApi = "https://api.garderlecap.global/api/v1/map-calendar/";

var headers = ["Content-Type: application/json"];

#UI
onready var UI:= get_node("UI");
onready var spawnedPins:Node2D = UI.get_node("SpawnedPoints");

#SideBars
onready var adminSideBar:= get_node("CanvasLayer/Control/AdminSideBar");
onready var sideBar:= get_node("CanvasLayer/Control/EventSideBar");
onready var heroSideBar := get_node("CanvasLayer/Control/HeroSideBar")
onready var inputSideBar:= get_node("CanvasLayer/Control/CreateEventSideBar");
onready var heroInputBar:= get_node("CanvasLayer/Control/CreateHeroSideBar");


var fetchedData := [];

var currentSelectedEvent = null;
var pointToSpawn;
var isAdmin = true;

var toggleCreateMode = false;
var dataIsFetched = false;


# not to create a pin if over the button of edit mode
var overEditButton = false;
var isInCreateMode = false;

var _currentScreenSize:Vector2;

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	OS.max_window_size = Vector2(1150, 505);
	_getWebsiteLocale();
#	OS.set_window_size(Vector2(1150, 505))
	get_tree().get_root().connect("size_changed", self, "_onScreenResize")
	_currentScreenSize = get_viewport().size; 
	$UI/AddPinPlaceHolder.hide();
	
	FetchEvents();


# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta: float) -> void:
#	pass
var x = 0
var amountToMove = 10;
var prevMousePos:Vector2;
var isDragging = false;
func _input(event:InputEvent):
	if event is InputEventKey:
		return
	if(_currentScreenSize.x <= 1000):
		if(event.is_pressed()):
			prevMousePos = event.position;
		elif(event is InputEventSingleScreenDrag):
			var dir = Vector2(prevMousePos - event.position).x
			var valueToAdd = amountToMove if dir < 0 else -amountToMove;
			var canMove = rect_position.x + valueToAdd <= 0 and rect_position.x + valueToAdd >= -885;
			if(canMove):
				rect_position.x += valueToAdd;

	
	if event is InputEventKey or toggleCreateMode == false: 
		return;
	if(overEditButton): return
	if (event.is_pressed() and event is InputEventMouseButton):
		if(pointToSpawn == null): return;

		var newPinPoint = "";
		if(pointToSpawn == TypesOfPinPoints.MeetingPoint):
			newPinPoint = Resources.pin.instance();
			EnterCreateEvent(newPinPoint,event.position);
		else:
			newPinPoint = Resources.heroPoint.instance();
			EnterCreateHero(newPinPoint, event.position);
		spawnedPins.add_child(newPinPoint);
		newPinPoint.position = event.position;
		$UI/AddPinPlaceHolder.hide();

func EnterEditMode():
	toggleCreateMode = true;

func ExitEditMode():
	toggleCreateMode = false;

func EnterCreateEvent(newPinPoint,eventPosition):
	isInCreateMode = true;
	inputSideBar.toEdit = false;
	inputSideBar.OpenSideBar();
	inputSideBar.PosOfEvent = Vector2(eventPosition);
	inputSideBar.pinPoint = newPinPoint
	ExitEditMode();

func EnterCreateHero(newHeroPoint, HeroPosition):
	isInCreateMode = true;
	heroInputBar.toEdit = false;
	heroInputBar.OpenSideBar();
	heroInputBar.PosOfEvent = Vector2(HeroPosition);
	heroInputBar.heroPoint = newHeroPoint
	ExitEditMode();

func FetchEvents():
	fetchedData.clear();
	ClearPinsFromMap();
	http_req.request(mainApi);
	print("fetching data");


func _on_HTTPRequest_request_completed(result: int, response_code: int, headers: PoolStringArray, body: PoolByteArray) -> void:

	var json = JSON.parse(body.get_string_from_utf8())
	print(json.result);
	var data = (json.result.data);
	_checkIfAdmin();
	AddEventInMap(data.events);
	AddHeroesInMap(data.heroes)
	if(isAdmin):
		adminSideBar.RenderTabData(data);
	dataIsFetched = true;

func AddEventInMap(data):
	if(data.size() <= 0): return;
	for info in data:
		var newPin = Resources.pin.instance();
		var newPos = Vector2(info.x_pos, info.y_pos);
		spawnedPins.add_child(newPin);
		newPin.DataForEvent = info;
		newPin.SetEventNameOnPin();
		newPin.global_transform.origin = newPos;

func AddHeroesInMap(data):
	if(data.size() <= 0):return
	for info in data:
		var newHeroPin = Resources.heroPoint.instance();
		var newPos = Vector2(info.x_pos, info.y_pos);
		spawnedPins.add_child(newHeroPin);
		newHeroPin.dataForHero = info;
		newHeroPin.RenderHeroPoint();
		newHeroPin.global_transform.origin = newPos;
	

func ClearPinsFromMap():
	if(spawnedPins.get_child_count() <= 0): return;
	
	for i in range(0, spawnedPins.get_child_count()):
		spawnedPins.get_child(i).queue_free();


func _on_ToggleAdminPanel_pressed() -> void:
	if(adminSideBar.isOpen): return;
	adminSideBar.OpenSideBar();


func DeleteEventPointFromMap(pointInMapId):
	for pointInMap in spawnedPins:
		if(pointInMap.dataForHero.id == pointInMap.id):
			pointInMap.self_queue();


var mainToken;

func _checkIfAdmin():
	var token = JavaScript.eval("parent['token'];", true)
	if(token != null):
		isAdmin = true;
	else:
		isAdmin = false;
	
	if(isAdmin):
		adminSideBar.OpenSideBar();
		$UI/ToggleAdminPanel.show();
		mainToken = token
	else:
		$UI/ToggleAdminPanel.hide();
#	print(token)

func _onScreenResize():
	rect_position = Vector2(0,0);
	_currentScreenSize = get_viewport().size; 
	

func loadBase64Image(imageBase64) -> Texture:
	var bufferData = Marshalls.base64_to_raw(imageBase64);
	var image = Image.new();
	
	
	var error;
	
	if(imageBase64.left(11) == "iVBORw0KGgo"):
		error = image.load_png_from_buffer(bufferData);
	else:
		error = image.load_jpg_from_buffer(bufferData);
	
	if(error): printerr("error in load image ",error);
	
	var imageTexture = ImageTexture.new();
	imageTexture.create_from_image(image)
	
	return imageTexture


func _getWebsiteLocale():
	var lang = JavaScript.eval("parent.getLang();", true);
	if(lang == null):
		TranslationServer.set_locale("en");
		return
	TranslationServer.set_locale(lang);

func AddFakeImage():
	var file = File.new();
	file.open("res://image.json", File.READ);
	var json_result = JSON.parse(file.get_as_text()).result;
	print(json_result.base64)
	return json_result.base64;


func OpenSideBarTween(node:Control ,tween: Tween):
	tween.interpolate_property(
		node,
		"rect_position",
		node.rect_position,
		Vector2(-312, 12),
		0.5,
		Tween.TRANS_LINEAR,
		Tween.EASE_IN_OUT
	);
	tween.start();


func CloseSideBarTween(node: Control,tween: Tween):
	tween.interpolate_property(
		node,
		"rect_position",
		node.rect_position,
		Vector2(0, 8),
		0.5,
		Tween.TRANS_LINEAR,
		Tween.EASE_IN_OUT
	);
	tween.start();
