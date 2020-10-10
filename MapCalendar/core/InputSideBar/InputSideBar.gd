extends Control

onready var mainScene := get_tree().get_root().get_node("MainScene");
onready var http_req := get_node("HTTPRequest");

onready var inputToSend = $InputContainer.get_children();

var isOpen = false;

var pinPoint:Node2D;
var PosOfEvent:Vector2;

var toEdit;

onready var url = mainScene.mainApi + "events/"

var dataToSend = {
	"title": null,
	"location": null,
	"date": null,
	"description": null,
}

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.

var idToEdit;

func editHero(eventData):
	toEdit = true;
	OpenSideBar();
	pinPoint = eventData.pin;
	var index = 0;
	idToEdit = eventData.id
	var dataToDisplay = {
		"title": eventData.title,
		"location": eventData.location,
		"date": eventData.date,
		"description": eventData.description,
	}
	
	PosOfEvent = Vector2(eventData.x_pos, eventData.y_pos)
	
	for data in dataToDisplay:
		inputToSend[index].AddInput(dataToDisplay[data]);
		index += 1;


func OpenSideBar():
	
	if(toEdit):
		$"CreateEvent-Button/Label".text = "Edit Event";
	else:
		$"CreateEvent-Button/Label".text = "Create Event";
	
	$AddImageButton.show();
	
	show();
	var tween = Tween.new();
	add_child(tween)
	mainScene.OpenSideBarTween(self, tween);
	
	yield(get_tree().create_timer(1), "timeout");
	tween.queue_free();
	isOpen = true;

func CloseSideBar():
	mainScene.isInCreateMode = false
	var tween = Tween.new();
	add_child(tween)
	mainScene.CloseSideBarTween(self, tween);
	pinPoint.queue_free();
	yield(get_tree().create_timer(1), "timeout");
	isOpen = false;
	hide();




func _on_CloseButton_button_down() -> void:
	CloseSideBar();


func _on_CreateEventButton_button_down() -> void:
	print("Getting event data");
	var newDataToSend = dataToSend.duplicate();
	var canProcceed = false;
	var index = 0;
	for inputData in newDataToSend:
		var input = inputToSend[index].GetInput();
		
		if(input == "" or null):
			canProcceed = false
			#Display you need to add input to all
			break
		else:
			canProcceed = true
		
		print("Get input ",input );
		
		newDataToSend[inputData] = inputToSend[index].GetInput();
		index += 1;
	if(canProcceed == false):return;
	
	print("check here  1 ==>", newDataToSend)
	
	newDataToSend.x_pos = PosOfEvent.x;
	newDataToSend.y_pos = PosOfEvent.y;
	
	var method;
	
	if(imageData):
		newDataToSend.imageSrc = imageData;
	
	if(toEdit):
		method = HTTPClient.METHOD_PUT;
		newDataToSend.id = idToEdit;
		url = url + newDataToSend.id;
	else:
		method = HTTPClient.METHOD_POST;
		
		print("check here 2 ==>", newDataToSend)
		
	var query = JSON.print(newDataToSend)
	print("created query", query)
	http_req.request(url,mainScene.headers,true,method , query);
	print("sent request")


func _on_addImage_pressed() -> void:
	var imageData = null;
	
	
	JavaScript.eval("console.log(parent)", true);
	var x = JavaScript.eval("parent['imageUploader'].dispatchEvent();", true);
	
	_recieveFile();

func _recieveFile():
	var result = JavaScript.eval("parent['imageUploader'].retrieveDataToGodot();", true);
	if(result):
		loadImage(result);
		$AddImageButton.hide();
		
	else:
		yield(get_tree().create_timer(0.2),"timeout");
		_recieveFile();


var imageData = "";

func loadImage(imageBase64):
	print("trying to add image to event")
	if(imageBase64 == null): return;
	print("retrieved image!!!")
	var imageTexture = mainScene.loadBase64Image(imageBase64);
	
	imageData = imageBase64;
	
	print("image texture ", imageTexture)
	
	$EventImage.texture = imageTexture;
	JavaScript.eval("parent['imageUploader'].dispatchClosePopUp();", true);

func _on_HTTPRequest_request_completed(result: int, response_code: int, headers: PoolStringArray, body: PoolByteArray) -> void:
	print("Response after creating event", result, response_code)
	if(response_code == 201 || response_code == 202):
		CloseSideBar();
		mainScene.FetchEvents();
		mainScene.adminSideBar.OpenSideBar();
		mainScene.isInCreateMode = false;
	else:
		print("try again!!");
	pinPoint.queue_free();
	for input in inputToSend:
		input.ClearInput();


func AddEventDataToInput(eventData):
	$InputContainer/Title.text = eventData
