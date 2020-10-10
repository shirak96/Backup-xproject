extends Node

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.

var pin = preload("res://gameobjects/PinPoint/Pin.tscn");
var heroPoint = preload("res://gameobjects/PinPoint/HeroPoint.tscn");


var eventCard = preload("res://gameobjects/Cards/EventCard.tscn");
var heroCard = preload("res://gameobjects/Cards/HeroCard.tscn");

var heroBlankImage = preload("res://Assets/circle-texture.png");
var eventBlankImage = preload("res://Assets/EventDefaultImage.png");
