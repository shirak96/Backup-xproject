extends Control
class_name AdminSideBar

onready var mainScene := get_tree().get_root().get_node("MainScene");
onready var eventsCard := get_node("TabContainer/Events/EventsCardContainer");
onready var heroesCard := get_node("TabContainer/Heroes/HeroCardContainer");
onready var createEventPlaceHolder = mainScene.get_node("UI/AddPinPlaceHolder");


var isOpen = false;
# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	hide();


# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta: float) -> void:
#	pass

func OpenSideBar():
	if(mainScene.currentSideBarOpen and mainScene.currentSideBarOpen != self):
		mainScene.currentSideBarOpen.CloseSideBar();
	mainScene.currentSideBarOpen = self;
	
	isOpen = true;
	show();
	var tween = Tween.new();
	add_child(tween)
	mainScene.OpenSideBarTween(self, tween);
	yield(get_tree().create_timer(1), "timeout");
	tween.queue_free();


func CloseSideBar():
	var tween = Tween.new();
	add_child(tween)
	
	mainScene.CloseSideBarTween(self, tween);
	yield(get_tree().create_timer(1), "timeout");
	isOpen = false;
	hide();


func RenderTabData(data):
	if(data.size() <= 0):return
	eventsCard.RenderEvents(data.events);
	heroesCard.RenderHeroes(data.heroes);



func _on_CloseButton_button_down() -> void:
	isOpen = false;
	CloseSideBar();

#func _on_CreateEventButton_button_down() -> void:


func _on_CreateHeroButton_pressed() -> void:
	CloseSideBar();
	mainScene.EnterEditMode();
	mainScene.pointToSpawn = mainScene.TypesOfPinPoints.Hero;
	createEventPlaceHolder.show();


func _on_CreateEventButton_pressed() -> void:
	CloseSideBar();
	mainScene.EnterEditMode();
	mainScene.pointToSpawn = mainScene.TypesOfPinPoints.MeetingPoint;
	#Show the place holder
	createEventPlaceHolder.show();


