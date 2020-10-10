extends Control

onready var mainScene := get_tree().get_root().get_node("MainScene");
onready var animPlayer := get_node("AnimationPlayer");
var isOpen = false;


# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.

var heroInfo;


# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta: float) -> void:
#	pass

func InputDataToSideBar(data):
	RenderData(data);

func RenderData(data):
	heroInfo = data
	$"HeroName".text = data.heroName;
	$Description.text = str(data.description);
	_renderImage(heroInfo.imageSrc);
	if(!heroInfo.website):
		$VisitWebsiteButton.hide();
	else:
		$VisitWebsiteButton.show();

func OpenSideBar():
	show();
	isOpen = true;
	mainScene.isOpeningSideBar = true;
	var tween = Tween.new();
	add_child(tween)
	mainScene.OpenSideBarTween(self, tween);
	yield(get_tree().create_timer(1), "timeout");
	mainScene.isOpeningSideBar = false;
	tween.queue_free();

func CloseSideBar():
	var tween = Tween.new();
	add_child(tween)
	mainScene.CloseSideBarTween(self, tween);
	mainScene.isOpeningSideBar = true;
	yield(get_tree().create_timer(1), "timeout");
	isOpen = false;
	mainScene.isOpeningSideBar = false;
	hide();



func _renderImage(imageBase64):
	if(imageBase64 == null):
		$"HeroImage".texture = Resources.heroBlankImage;
		return
	
	var imageTexture =  mainScene.loadBase64Image(imageBase64);
	
	$"HeroImage".texture = imageTexture;


func _on_CloseButton_button_down() -> void:
	mainScene.currentSideBarOpen = null;
	CloseSideBar();


func _on_VisitWebsiteButton_pressed() -> void:
	OS.shell_open("http://" + str(heroInfo.website))
