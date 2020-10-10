extends Control
class_name EventCardUI

onready var mainScene := get_tree().get_root().get_node("MainScene");


# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.

var eventData;

# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta: float) -> void:
#	pass


func RenderData(data):
	eventData = data;
	eventData.pin = null;
	$EventName.text = str(data.title);
	$EventDate.text = str(data.date);

func _on_EditButton_button_down() -> void:
	mainScene.adminSideBar.CloseSideBar();
	mainScene.inputSideBar.editHero(eventData);


func _on_DeleteButton_button_down() -> void:
	var http = HTTPRequest.new();
	mainScene.add_child(http)
	var url = mainScene.mainApi + "events/" + eventData.id
	
	http.request(url, mainScene.headers, false, HTTPClient.METHOD_DELETE);
	http.connect("request_completed", self, "_deleteCard");
	self.connect("deleteEvent", self,"_clearAfterClickButtonIsDone", [http]);
	

func _clearAfterClickButtonIsDone(http):
	http.queue_free();

func _deleteCard(result: int, response_code: int, headers: PoolStringArray, body: PoolByteArray) -> void:
	if(response_code == 202):
		self.queue_free();
		mainScene.FetchEvents();
	else:
#		delet card didn't work
		pass
