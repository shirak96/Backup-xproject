extends Node2D
class_name HeroPin

onready var mainScene = get_tree().get_root().get_node("MainScene");
onready var heroName:Label = get_node("HeroName");
var PinId = null;

var dataForHero = null;


# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta: float) -> void:
#	pass

func HandleShowHeroSideBar():
	var sideBar = mainScene.heroSideBar;
	RenderHeroPoint();
	sideBar.OpenSideBar();
	mainScene.currentSideBarOpen = sideBar;
	sideBar.InputDataToSideBar(dataForHero);

func RenderHeroPoint():
	heroName.text = str(dataForHero.heroName);

func _on_HeroPinButton_button_down() -> void:
	if(mainScene.toggleCreateMode or mainScene.isInCreateMode): return;
	if(mainScene.isOpeningSideBar): return;
	if(mainScene.currentPinOpen and mainScene.currentPinOpen != self):
		var sideBar = mainScene.heroSideBar;
		mainScene.currentSideBarOpen.CloseSideBar();
		
		mainScene.currentPinOpen = self;
		
		sideBar.OpenSideBar();
		HandleShowHeroSideBar();
	else:
		HandleShowHeroSideBar();
