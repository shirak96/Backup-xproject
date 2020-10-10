extends Control
class_name HeroCardUI

onready var mainScene := get_tree().get_root().get_node("MainScene");

var heroData;

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta: float) -> void:
#	pass


func RenderData(data):
	heroData = data;
	heroData.pin = null;
	$HeroName.text = str(data.heroName);

func _on_EditButton_button_down() -> void:
	mainScene.adminSideBar.CloseSideBar();
	mainScene.heroInputBar.editHero(heroData);


func _on_DeleteButton_button_down() -> void:
	var http = HTTPRequest.new();
	mainScene.add_child(http)
	var url = mainScene.mainApi + "heroes/" + heroData.id;

#	var query = JSON.print(objectToSend);
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
		pass
