extends Control

onready var mainScene := get_tree().get_root().get_node("MainScene");
onready var http_req := get_node("HTTPRequest");

onready var inputToSend = $InputContainer.get_children();

var isOpen = false;
var toEdit = false;

var PosOfEvent:Vector2;

var heroPoint:Node2D;

var dataToSend = {
	"heroName": null,
	"website": null,
	"description": null,
}

onready var url = mainScene.mainApi + "heroes/"

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.

var idToEdit;
func editHero(heroData):
	
	toEdit = true;
	OpenSideBar();
	$AddHeroButton.hide();
	$EditImage.show();
	heroPoint = heroData.pin;
	var index = 0;
	idToEdit = heroData.id
	var dataToDisplay = {
		"heroName": heroData.heroName,
		"website": heroData.website,
		"description": heroData.description,
	}
	
	PosOfEvent = Vector2(heroData.x_pos, heroData.y_pos)
	
	for data in dataToDisplay:
		inputToSend[index].AddInput(dataToDisplay[data]);
		index += 1;
	
	if(heroData.imageSrc):
		loadImage(heroData.imageSrc);
	else:
		$HeroImage/TextureRect.texture = Resources.heroBlankImage;


func OpenSideBar():
	if(toEdit):
		$"CreateHero-Button/Label".text = "Edit Hero";
	else:
		$"CreateHero-Button/Label".text = "Create Hero";
	
	$AddHeroButton.show();
	$HeroImage/TextureRect.texture = Resources.heroBlankImage;
	$EditImage.hide();
	
	var fakeImage = mainScene.AddFakeImage();
	loadImage(fakeImage);
	
	isOpen = true;
	show();
	var tween = Tween.new();
	add_child(tween)
	mainScene.OpenSideBarTween(self,tween);
	yield(get_tree().create_timer(1), "timeout");
	tween.queue_free();


func CloseSideBar():
	var tween = Tween.new();
	add_child(tween)
	mainScene.CloseSideBarTween(self, tween);
	heroPoint.queue_free();
	yield(get_tree().create_timer(1), "timeout");
	mainScene.emit_signal("closedSideBar");
	isOpen = false;
	hide();


func _on_CreateHeroButton_button_down() -> void:
	print("Clicked create hero button");
	var newDataToSend = dataToSend.duplicate();
	var canProcceed = true;
	var index = 0;
	
	print("getting input");
	for inputData in newDataToSend:
		var input = inputToSend[index].GetInput();
		
		if(input == "" or null):
			var isWebsite = inputToSend[index].name == "Website";
			if(isWebsite == false):
				#Display you need to add input to all
				canProcceed = false;
				break;
		
		newDataToSend[inputData] = inputToSend[index].GetInput();
		index += 1;
	print("check if can procceed with saving data")
	if(canProcceed == false):return
	newDataToSend.x_pos = PosOfEvent.x;
	newDataToSend.y_pos = PosOfEvent.y;
	
	print("add the new points");
	
	
	var method;
	
	print("Trying to add method to the api")
	if(toEdit):
		method = HTTPClient.METHOD_PUT;
		newDataToSend.id = idToEdit;
		url = url + newDataToSend.id;
	else:
		method = HTTPClient.METHOD_POST;
		print("Trying to send data with method ", method)
	
	print("Trying to save an image")
	if(imageData):
		newDataToSend.imageSrc = imageData;
	
	print("Trying to send image")
	
	var query = JSON.print(newDataToSend)
	print("saved data to query", query)
	http_req.request(url,mainScene.headers,true,method , query);
	print("called the http request");


func _on_HTTPRequest_request_completed(result: int, response_code: int, headers: PoolStringArray, body: PoolByteArray) -> void:
	print("Trying to save data", response_code)
	if(response_code == 201 || response_code == 202):
		print("data saved")
		CloseSideBar();
		mainScene.FetchEvents();
		mainScene.adminSideBar.OpenSideBar();
		mainScene.isInCreateMode = false;
		mainScene.isInCreateMode = false;
	else:
		print("try again!!")
	heroPoint.queue_free();
	for input in inputToSend:
		input.ClearInput();


func _on_AddHeroImageNode_pressed() -> void:
	var imageData = null;
	
	JavaScript.eval("parent['imageUploader'].dispatchEvent();", true);
	
	_recieveFile();


var imageData;

func _recieveFile():
	var result = JavaScript.eval("parent['imageUploader'].retrieveDataToGodot();", true);
	if(result):
		loadImage(result);
		$AddHeroButton.hide();
	else:
		yield(get_tree().create_timer(0.2),"timeout");
		_recieveFile();

#func _recieveFile():
#	var result = JavaScript.eval("parent['imageUploader'].retrieveDataToGodot();", true);
#	if(result):
#		loadImage(result);
#		$AddImageButton.hide();
#
#	else:
#		yield(get_tree().create_timer(0.2),"timeout");
#		_recieveFile();

func loadImage(imageBase64):
	print("trying to add image to event")
	if(imageBase64 == null): return;
	print("retrieved image!!!")
	var imageTexture = mainScene.loadBase64Image(imageBase64);
	
	imageData = imageBase64;
	
	print("image texture ", imageTexture)
	

	$HeroImage.texture = imageTexture;
	
	$AddHeroButton.hide();
	
	JavaScript.eval("parent['imageUploader'].dispatchClosePopUp();", true);


func _on_CloseButton_button_down() -> void:
	CloseSideBar();


