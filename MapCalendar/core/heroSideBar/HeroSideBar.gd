extends Control

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
	animPlayer.play("SideBarSlide");

func CloseSideBar():
	animPlayer.play_backwards("SideBarSlide");
	yield(get_tree().create_timer(animPlayer.get_animation("SideBarSlide").length), "timeout");
	isOpen = false;
	hide();

func InputDataToSideBar(data):
	RenderData(data);
	RenderHeroes(data)

func RenderData(data):
	$EventTile.text = data.eventTitle;
	$Location.text = data.location;
	$Date.text = data.date

func RenderHeroes(data):
	var heroes:Array = data.heroes;
	var emptySlot = get_node("HeroesHolder").get_children();
	for i in range(0, heroes.size()):
		var newHero:Control = load("res://SideBar-Client/Hero.tscn").instance();
		$HeroesHolder.add_child(newHero);
		newHero.set_global_position(emptySlot[i].global_transform.origin);
		newHero.InputDataToHero(heroes[i]);
		

func _on_Close_Click() -> void:
	CloseSideBar();
