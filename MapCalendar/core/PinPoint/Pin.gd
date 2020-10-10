extends Node2D
class_name EventPin

onready var mainScene = get_tree().get_root().get_node("MainScene");

var PinId = null;
# when pin poin is spawned this car should hold it's data
var DataForEvent = null;

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass


# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta: float) -> void:
##	pass
#


func HandleShowingSideBar():
	var sideBar = mainScene.sideBar;
	mainScene.currentSideBarOpen = sideBar;
	sideBar.OpenSideBar();
	sideBar.InputDataToSideBar(DataForEvent);

func _on_ImageButton_button_down() -> void:
	
	if(mainScene.isOpeningSideBar): return;
	if(mainScene.toggleCreateMode or mainScene.isInCreateMode): return;
	if(mainScene.currentPinOpen == self): return;
	#clicked on pin
	if(mainScene.currentSideBarOpen):
		mainScene.currentSideBarOpen.CloseSideBar();
		
		mainScene.currentPinOpen = self;
		yield(get_tree().create_timer(1), "timeout")
		HandleShowingSideBar();
	else:
		HandleShowingSideBar();


func SetEventNameOnPin():
	$"EventNameLabel".text = str(DataForEvent.title);

func updateEventName(name):
	$"EventNameLabel".text = str(name);
