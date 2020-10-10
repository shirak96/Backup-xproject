extends VBoxContainer

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass
#	yield(get_tree().create_timer(1),"timeout");
#	_translateTabContainer()

onready var mainScene := get_tree().get_root().get_node("MainScene");

# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta: float) -> void:
#	pass


func RenderEvents(data):
	clearCards();
	for i in range(0,data.size()):
		var newEventCard = _createCard(Resources.eventCard);
		add_child(newEventCard);
		newEventCard.RenderData(data[i]);
		if(mainScene.isAdmin):
			if(newEventCard.eventData.pin != null):
				return;
			
			for pinPoint in mainScene.spawnedPins.get_children():
				if(pinPoint is EventPin):
					if(pinPoint.DataForEvent.id == data[i].id):
						newEventCard.eventData.pin = pinPoint

func RenderHeroes(data):
	clearCards();
	for i in range(0,data.size()):
		var newHeroCard = _createCard(Resources.heroCard);
		add_child(newHeroCard);
		newHeroCard.RenderData(data[i]);
		if(mainScene.isAdmin):
			if(newHeroCard.heroData.pin != null):
				return;
			
			for pinPoint in mainScene.spawnedPins.get_children():
				if(pinPoint is HeroPin):
					if(pinPoint.dataForHero.id == data[i].id):
						newHeroCard.heroData.pin = pinPoint

func _createCard(cardToSpawn:PackedScene) :
	var newCard = cardToSpawn.instance();
	newCard.rect_min_size = Vector2(255, 52);
	return newCard

func clearCards():
	for i in range(0, get_child_count()):
		get_child(i).queue_free();

func _translateTabContainer():
	var parent = get_parent()
	var locale = TranslationServer.get_locale();
	if(parent.name == "Events"):
		parent.name = tr("events");
	else:
		parent.name = tr("heroes");
