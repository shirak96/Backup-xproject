extends Control

onready var mainScene := get_tree().get_root().get_node("MainScene");
onready var animPlayer := get_node("AnimationPlayer");

var isOpen = false;

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	hide();
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta: float) -> void:
#	pass

func OpenSideBar():
	isOpen = true;
	show();
	var tween = Tween.new();
	add_child(tween)
	mainScene.OpenSideBarTween(self, tween);
	
	mainScene.isOpeningSideBar = true;
	yield(get_tree().create_timer(1), "timeout");
	mainScene.isOpeningSideBar = false;
	tween.queue_free();

func CloseSideBar():
	var tween = Tween.new();
	add_child(tween)
	mainScene.CloseSideBarTween(self, tween);
	mainScene.isOpeningSideBar = true;
	yield(get_tree().create_timer(1), "timeout");
	mainScene.isOpeningSideBar = false;
	mainScene.emit_signal("closedSideBar");
	isOpen = false;
	hide();

func _renderImage(base64Image):
	if(base64Image == null):
		$"EventImage".texture = Resources.eventBlankImage;
		return;
	
	var imageTexture =  mainScene.loadBase64Image(base64Image);
	
	
	$"EventImage".texture = imageTexture;

func InputDataToSideBar(data):
	RenderData(data);

func RenderData(data):
	$EventTile.text = data.title;
	$Location.text = data.location;
	$Date.text = data.date;
	$Description.text = data.description;
	_renderImage(data.imageSrc)


func _on_CloseButton_button_down() -> void:
	mainScene.currentSideBarOpen = null;
	CloseSideBar();
